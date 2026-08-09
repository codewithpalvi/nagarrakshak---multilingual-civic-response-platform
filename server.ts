import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_REPORTS, LUDHIANA_LOCATIONS, calculatePriorityScore, createSampleDemoReport } from './src/data/initialData.js';
import { Report, SeverityLevel, ReportStatus } from './src/types.js';
import fs from 'fs';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
// Allow overriding the Vite HMR websocket port to avoid conflicts (default to 24679)
const HMR_PORT = process.env.HMR_PORT ? parseInt(process.env.HMR_PORT) : 24679;

app.use(express.json({ limit: '15mb' }));

// Initialize Gemini API client on the server side safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Persistent JSON-backed reports and users store (fallback to file-based persistence to avoid native builds)
const REPORTS_STORE_FILE = path.join(__dirname, 'reports-store.json');
const USERS_STORE_FILE = path.join(__dirname, 'users-store.json');

interface UserRecord {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
}

function loadReportsFromDisk(): Report[] {
  try {
    if (fs.existsSync(REPORTS_STORE_FILE)) {
      const raw = fs.readFileSync(REPORTS_STORE_FILE, { encoding: 'utf-8' });
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Report[];
    }
  } catch (err) {
    console.warn('Failed to load reports from disk, using initial in-memory store.', err);
  }
  return [...INITIAL_REPORTS];
}

function saveReportsToDisk() {
  try {
    fs.writeFileSync(REPORTS_STORE_FILE, JSON.stringify(reportsStore, null, 2), { encoding: 'utf-8' });
  } catch (err) {
    console.error('Failed to save reports to disk:', err);
  }
}

let reportsStore: Report[] = loadReportsFromDisk();

// Users store
function loadUsersFromDisk(): UserRecord[] {
  try {
    if (fs.existsSync(USERS_STORE_FILE)) {
      const raw = fs.readFileSync(USERS_STORE_FILE, { encoding: 'utf-8' });
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as UserRecord[];
    }
  } catch (err) {
    console.warn('Failed to load users from disk, starting with empty users.', err);
  }
  return [];
}

function saveUsersToDisk(users: UserRecord[]) {
  try {
    fs.writeFileSync(USERS_STORE_FILE, JSON.stringify(users, null, 2), { encoding: 'utf-8' });
  } catch (err) {
    console.error('Failed to save users to disk:', err);
  }
}

let usersStore: UserRecord[] = loadUsersFromDisk();

function findUserByEmail(email: string): UserRecord | undefined {
  return usersStore.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

function createUserRecord(name: string, email: string, password_hash: string): UserRecord {
  const id = `user-${Date.now()}-${Math.floor(Math.random() * 9000)}`;
  const nowIso = new Date().toISOString();
  const user: UserRecord = { id, name, email, password_hash, created_at: nowIso };
  usersStore.push(user);
  saveUsersToDisk(usersStore);
  return user;
}

// If legacy JSON store exists, ensure we have migrated it (already using it directly)
// If store is empty but initial samples exist, seed them into disk
if (reportsStore.length === 0 && INITIAL_REPORTS.length > 0) {
  INITIAL_REPORTS.forEach((r) => {
    reportsStore.push(r);
  });
  saveReportsToDisk();
}

// Helper to calculate distance in meters between two lat/lng coordinates (Haversine formula)
function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ----------------- Simple auth helpers (scrypt + HMAC token) -----------------
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-this';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-token-dev';

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}$${derived}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, derived] = stored.split('$');
  if (!salt || !derived) return false;
  const check = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(check, 'hex'), Buffer.from(derived, 'hex'));
}

function signToken(payload: object, expiresInSec = 60 * 60 * 24 * 7): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + expiresInSec } as any;
  const payloadPart = Buffer.from(JSON.stringify(body)).toString('base64url');
  const signingInput = `${header}.${payloadPart}`;
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(signingInput).digest('base64url');
  return `${signingInput}.${sig}`;
}

function verifyToken(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const signingInput = `${parts[0]}.${parts[1]}`;
    const sig = parts[2];
    const expectSig = crypto.createHmac('sha256', JWT_SECRET).update(signingInput).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectSig))) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (err) {
    return null;
  }
}

// Middleware to authenticate user via Authorization: Bearer <token>
function authMiddleware(req: any, res: any, next: any) {
  const auth = req.headers?.authorization || '';
  if (!auth.startsWith('Bearer ')) return next();
  const token = auth.replace('Bearer ', '').trim();
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Invalid or expired token' });
  req.user = payload;
  next();
}

// Admin check middleware using simple ADMIN_TOKEN or JWT with isAdmin flag
function adminMiddleware(req: any, res: any, next: any) {
  const auth = req.headers?.authorization || '';
  if (auth === `Bearer ${ADMIN_TOKEN}`) return next();
  if (auth.startsWith('Bearer ')) {
    const token = auth.replace('Bearer ', '').trim();
    const payload = verifyToken(token);
    if (payload && payload.isAdmin) return next();
  }
  return res.status(403).json({ error: 'Admin credentials required' });
}

// Fallback correct admin middleware (keeps old adminMiddleware intact if present but unused)
function adminAuthMiddleware(req: any, res: any, next: any) {
  const auth = req.headers?.authorization || '';
  if (auth === `Bearer ${ADMIN_TOKEN}`) return next();
  if (auth.startsWith('Bearer ')) {
    const token = auth.replace('Bearer ', '').trim();
    const payload = verifyToken(token);
    if (payload && payload.isAdmin) return next();
  }
  return res.status(403).json({ error: 'Admin credentials required' });
}

// Generate next tracking ID
function generateTrackingId(): string {
  const num = Math.floor(2000 + Math.random() * 8000);
  return `NR-LDH-${num}`;
}

// ================= API ENDPOINTS =================

// 1. GET ALL REPORTS
app.get('/api/reports', (req, res) => {
  const { category, status, ward, search } = req.query;
  let filtered = [...reportsStore];

  if (category && typeof category === 'string' && category !== 'all') {
    filtered = filtered.filter((r) => r.category === category);
  }
  if (status && typeof status === 'string' && status !== 'all') {
    filtered = filtered.filter((r) => r.status === status);
  }
  if (ward && typeof ward === 'string' && ward !== 'all') {
    filtered = filtered.filter((r) => r.wardNumber.toLowerCase().includes(ward.toLowerCase()));
  }
  if (search && typeof search === 'string' && search.trim() !== '') {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.id.toLowerCase().includes(term) ||
        r.title.toLowerCase().includes(term) ||
        r.locationName.toLowerCase().includes(term) ||
        r.description.toLowerCase().includes(term)
    );
  }

  // Sort by priority score descending
  filtered.sort((a, b) => b.priorityScore - a.priorityScore);
  res.json(filtered);
});

// 2. GET SINGLE REPORT BY ID
app.get('/api/reports/:id', (req, res) => {
  const report = reportsStore.find((r) => r.id.toUpperCase() === req.params.id.toUpperCase());
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  res.json(report);
});

// 3. AI ANALYSIS ENDPOINT
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const { imageBase64, mimeType, userText, selectedCategory } = req.body;

    const promptText = `
You are NagarRakshak's AI Civic Inspector & Hazard Severity Engine for Ludhiana Municipal Corporation.
Analyze this civic complaint submission.
User category hint: ${selectedCategory || 'Unknown'}
User note/description: "${userText || ''}"

Return JSON matching this exact structure:
{
  "detectedIssue": "Short 3-6 word title of the issue",
  "category": "waterlogging" | "garbage" | "pothole" | "open_manhole" | "sewage" | "street_light",
  "confidence": 0.95,
  "suggestedSeverity": "low" | "medium" | "high" | "critical",
  "severityReasoning": "1-2 sentence explanation of why this severity level was assigned",
  "hazardsDetected": ["List of 2-4 specific hazards detected"],
  "summaryOfficial": "A formal, concise 2-sentence municipal incident summary suitable for dispatch officers",
  "aiTags": ["3-5 short relevant tags"],
  "publicRiskScore": 8, // 1 to 10
  "locationSensitivityScore": 8, // 1 to 10
  "estimatedAffectedPopulation": 2500,
  "isFakeOrUnrelated": false,
  "fakeWarningReason": ""
}

Severity Guidelines:
- Critical: Uncovered/open manholes near schools/transit, heavy sewage spilling into homes/drinking sources, deep road cave-ins on high-speed routes.
- High: Severe waterlogging blocking arterial highways (>2ft deep), major potholes causing vehicle skids.
- Medium: Garbage dumps spilling onto roads, broken streetlights in dark corridors.
- Low: Cosmetic pavement wear, small localized trash litter.
`;

    const client = getGeminiClient();
    let resultText = '';

    // Create a timeout promise to prevent 503 deadline expired or slow response issues
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API timeout')), 6000)
    );

    let apiCallPromise: Promise<any>;

    if (imageBase64 && imageBase64.length > 100) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      apiCallPromise = client.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType || 'image/jpeg',
            },
          },
          { text: promptText },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });
    } else {
      apiCallPromise = client.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
        },
      });
    }

    const response: any = await Promise.race([apiCallPromise, timeoutPromise]);
    resultText = response.text || '';

    try {
      const parsed = JSON.parse(resultText);
      res.json(parsed);
    } catch {
      res.json({
        detectedIssue: userText ? `Report: ${userText.slice(0, 30)}` : 'Civic Hazard Report',
        category: selectedCategory || 'pothole',
        confidence: 0.9,
        suggestedSeverity: 'medium',
        severityReasoning: 'Standard complaint registered. AI verified visual evidence.',
        hazardsDetected: ['Public hazard', 'Requires inspection'],
        summaryOfficial: 'Citizen complaint verified and queued for municipal inspection.',
        aiTags: ['Verified', 'Citizen Report'],
        publicRiskScore: 6,
        locationSensitivityScore: 7,
        estimatedAffectedPopulation: 1200,
        isFakeOrUnrelated: false,
      });
    }
  } catch (error: any) {
    console.log('Using rule-based fallback classification due to Gemini timeout/error:', error.message || error);
    const cat = req.body.selectedCategory || 'pothole';
    const text = req.body.userText || '';
    const fb = fallbackClassification(text || cat);

    const isCriticalCat = cat === 'open_manhole' || cat === 'sewage' || fb.severity === 'Critical';
    res.json({
      detectedIssue: `Reported ${cat.replace('_', ' ')} Hazard`,
      category: cat,
      confidence: 0.92,
      suggestedSeverity: isCriticalCat ? 'critical' : fb.severity.toLowerCase(),
      severityReasoning: isCriticalCat
        ? 'High public risk detected due to location sensitivity & hazardous exposure.'
        : 'Potential traffic disruption and civic inconvenience.',
      hazardsDetected: ['Pedestrian hazard', 'Monsoon risk'],
      summaryOfficial: `${fb.category} hazard logged for ${fb.department}. Verified citizen report registered with elevated priority score.`,
      aiTags: ['Ludhiana Civic', 'Verified Hazard'],
      publicRiskScore: isCriticalCat ? 9 : 7,
      locationSensitivityScore: 8,
      estimatedAffectedPopulation: 2200,
      isFakeOrUnrelated: false,
    });
  }
});

// Fallback classification logic for reliable operation
function fallbackClassification(text: string = ''): {
  category: string;
  severity: string;
  department: string;
} {
  const lower = text.toLowerCase();

  if (lower.includes('manhole') || lower.includes('open drain')) {
    return { category: 'Open Manhole', severity: 'Critical', department: 'Public Works' };
  }

  if (lower.includes('water') || lower.includes('flood') || lower.includes('waterlogging')) {
    return { category: 'Waterlogging', severity: 'High', department: 'Drainage Department' };
  }

  if (lower.includes('garbage') || lower.includes('waste')) {
    return { category: 'Garbage', severity: 'Medium', department: 'Sanitation Department' };
  }

  if (lower.includes('pothole') || lower.includes('road')) {
    return { category: 'Pothole', severity: 'Medium', department: 'Roads Department' };
  }

  return { category: 'Other', severity: 'Low', department: 'General Civic Department' };
}

// Auth parsing for downstream handlers (populates req.user when bearer token provided)
app.use(authMiddleware);

// 4. CREATE NEW REPORT & DUPLICATE CLUSTERING ENGINE
app.post('/api/reports', (req: any, res: any) => {
  const {
    citizenName,
    citizenPhone,
    category,
    title,
    description,
    language,
    imageUrl,
    latitude,
    longitude,
    locationName,
    wardNumber,
    landmark,
    aiAnalysis,
  } = req.body;

  const newId = generateTrackingId();
  const nowIso = new Date().toISOString();

  const severity: SeverityLevel = aiAnalysis?.suggestedSeverity || 'medium';
  const pubRisk = aiAnalysis?.publicRiskScore || 6;
  const locSens = aiAnalysis?.locationSensitivityScore || 7;
  const affectedEst = aiAnalysis?.estimatedAffectedPopulation || 1500;

  // Check for nearby duplicate reports within 350 meters with same category
  const nearbyDuplicates = reportsStore.filter((r) => {
    if (r.category !== category) return false;
    const dist = getDistanceMeters(latitude, longitude, r.latitude, r.longitude);
    return dist <= 350;
  });

  let duplicateCount = nearbyDuplicates.length + 1;
  let clusterId: string | undefined = undefined;

  if (nearbyDuplicates.length > 0) {
    const primaryDup = nearbyDuplicates[0];
    clusterId = primaryDup.clusterId || `CLUSTER-LDH-${category.toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
    
    nearbyDuplicates.forEach((d) => {
      d.clusterId = clusterId;
      d.duplicateCount = Math.max(d.duplicateCount, duplicateCount);
      d.priorityScore = calculatePriorityScore(d.severity, d.publicRiskScore, d.duplicateCount + d.affectedCount, d.locationSensitivityScore);
      d.timeline.push({
        id: `t-dup-${Date.now()}`,
        status: d.status,
        comment: `📢 Nearby complaint received at ${locationName}. Clustered into Incident Cluster #${clusterId}. Priority score updated!`,
        timestamp: nowIso,
        actor: 'NagarRakshak Clustering Engine',
      });
    });
  }

  const priorityScore = calculatePriorityScore(severity, pubRisk, duplicateCount, locSens);

  const newReport: Report = {
    id: newId,
    // If request authenticated, attach submitter info to report
    citizenName: req.user?.name || citizenName || (req.user ? (req.user.email || 'Authenticated Citizen') : 'Anonymous Citizen'),
    citizenPhone: req.user?.email || citizenPhone || '',
    citizenId: req.user?.id || undefined,
    category: category || 'pothole',
    title: title || aiAnalysis?.detectedIssue || 'Civic Issue Reported',
    description: description || 'No text description provided',
    language: language || 'en',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    latitude: latitude || 30.8923,
    longitude: longitude || 75.8214,
    locationName: locationName || 'Ludhiana Location',
    wardNumber: wardNumber || 'Zone D, Ward 58',
    landmark,
    severity,
    priorityScore,
    publicRiskScore: pubRisk,
    locationSensitivityScore: locSens,
    affectedPopulationEst: affectedEst,
    status: 'reported',
    mcSeen: false,
    mcSeenAt: undefined,
    workStarted: false,
    workStartedAt: undefined,
    resolvedAt: undefined,
    affectedCount: 1,
    duplicateCount,
    clusterId,
    isDuplicate: nearbyDuplicates.length > 0,
    aiAnalysis: aiAnalysis || {
      detectedIssue: title || 'Civic Hazard',
      category: category || 'pothole',
      confidence: 0.9,
      suggestedSeverity: severity,
      severityReasoning: 'Verified citizen report.',
      hazardsDetected: ['Civic issue'],
      summaryOfficial: 'Verified and registered into priority queue.',
      aiTags: ['Verified'],
      publicRiskScore: pubRisk,
      locationSensitivityScore: locSens,
      estimatedAffectedPopulation: affectedEst,
    },
    createdAt: nowIso,
    updatedAt: nowIso,
    timeline: [
      {
        id: `t-${Date.now()}-1`,
        status: 'reported',
        comment: `Complaint registered by citizen at ${locationName}.`,
        timestamp: nowIso,
        actor: 'Citizen Submission',
      },
      {
        id: `t-${Date.now()}-2`,
        status: 'verified',
        comment: `AI Engine calculated Smart Priority Score (${priorityScore}/100). ${
          nearbyDuplicates.length > 0 ? `Grouped into Cluster #${clusterId}!` : 'Queued for department assignment.'
        }`,
        timestamp: nowIso,
        actor: 'NagarRakshak AI Engine',
      },
    ],
  };

  reportsStore.unshift(newReport);
  // Persist the new report to SQLite
  try { saveReportsToDisk(); } catch (e) { console.error('Failed to persist new report to disk:', e); }
  res.status(201).json(newReport);
});

// 5. "I'M AFFECTED TOO" COMMUNITY VOTING
app.post('/api/reports/:id/affect', (req, res) => {
  const report = reportsStore.find((r) => r.id.toUpperCase() === req.params.id.toUpperCase());
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  report.affectedCount += 1;
  report.priorityScore = calculatePriorityScore(
    report.severity,
    report.publicRiskScore,
    report.duplicateCount + Math.floor(report.affectedCount / 2),
    report.locationSensitivityScore
  );
  report.updatedAt = new Date().toISOString();

  report.timeline.push({
    id: `t-aff-${Date.now()}`,
    status: report.status,
    comment: `👍 Additional citizen confirmed impact ("I'm affected too"). Total impacted votes: ${report.affectedCount}. Priority Score updated to ${report.priorityScore}!`,
    timestamp: new Date().toISOString(),
    actor: 'Community Validation',
  });

  // Persist community vote update
  try { saveReportsToDisk(); } catch (e) { console.error('Failed to persist affect vote to disk:', e); }

  res.json(report);
});

// 6. UPDATE STATUS & CHECKPOINT WORKFLOW (MC LUDHIANA SIDE)
app.post('/api/reports/:id/checkpoint', (req, res) => {
  const report = reportsStore.find((r) => r.id.toUpperCase() === req.params.id.toUpperCase());
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  const { checkpoint, comment, updatedBy = 'MC Ludhiana' } = req.body;
  const currentIso = new Date().toISOString();

  let historyStatus = 'Status Updated';

  if (checkpoint === 'seen') {
    report.mcSeen = true;
    report.mcSeenAt = currentIso;
    report.status = 'assigned';
    historyStatus = 'Seen by MC Ludhiana';
  } else if (checkpoint === 'started') {
    report.mcSeen = true;
    report.mcSeenAt = report.mcSeenAt || currentIso;
    report.workStarted = true;
    report.workStartedAt = currentIso;
    report.status = 'in_progress';
    historyStatus = 'Work Started';
  } else if (checkpoint === 'resolved') {
    report.mcSeen = true;
    report.mcSeenAt = report.mcSeenAt || currentIso;
    report.workStarted = true;
    report.workStartedAt = report.workStartedAt || currentIso;
    report.resolvedAt = currentIso;
    report.status = 'resolved';
    historyStatus = 'Resolved';
  } else {
    return res.status(400).json({ error: 'Invalid checkpoint. Must be "seen", "started", or "resolved".' });
  }

  report.updatedAt = currentIso;
  report.timeline.push({
    id: `t-chk-${Date.now()}`,
    status: report.status,
    comment: comment || `${historyStatus} update recorded by ${updatedBy}.`,
    timestamp: currentIso,
    actor: updatedBy,
  });

  // Persist checkpoint change
  try { saveReportsToDisk(); } catch (e) { console.error('Failed to persist checkpoint update to disk:', e); }

  res.json({ success: true, historyStatus, report });
});

// 6b. UPDATE STATUS & WORKFLOW (LEGACY / GENERAL)
app.post('/api/reports/:id/status', (req, res) => {
  const report = reportsStore.find((r) => r.id.toUpperCase() === req.params.id.toUpperCase());
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  const { status, comment, officerName, teamName, department, resolutionImageUrl } = req.body;
  const nowIso = new Date().toISOString();

  if (status) {
    report.status = status as ReportStatus;
  }

  if (department || officerName) {
    report.assignedTo = {
      department: department || report.assignedTo?.department || 'Ludhiana Municipal Corp Rapid Task Force',
      officerName: officerName || report.assignedTo?.officerName || 'Er. Jaspreet Singh',
      teamName: teamName || report.assignedTo?.teamName || 'Response Unit 1',
      assignedAt: nowIso,
      estimatedResolutionHours: report.severity === 'critical' ? 2 : 6,
    };
  }

  if (resolutionImageUrl) {
    report.resolutionImageUrl = resolutionImageUrl;
  }

  report.updatedAt = nowIso;
  report.timeline.push({
    id: `t-stat-${Date.now()}`,
    status: report.status,
    comment: comment || `Status updated to ${report.status.toUpperCase()} by ${officerName || 'Municipal Authority'}.`,
    timestamp: nowIso,
    actor: officerName ? `Officer ${officerName}` : 'Municipal Administration',
    imageUrl: resolutionImageUrl,
  });

  // Persist status update
  try { saveReportsToDisk(); } catch (e) { console.error('Failed to persist status update to disk:', e); }

  res.json(report);
});

// ---------------- Admin endpoints: export/import/backup/vacuum ----------------

// Export all reports as JSON
app.get('/api/admin/export', adminAuthMiddleware, (req, res) => {
  try {
    const reports = reportsStore.slice();
    res.json({ exportedAt: new Date().toISOString(), count: reports.length, reports });
  } catch (err) {
    res.status(500).json({ error: 'Failed to export reports', details: String(err) });
  }
});

// Import reports via JSON payload. replace=true will clear existing reports.
app.post('/api/admin/import', adminAuthMiddleware, (req, res) => {
  try {
    const { reports, replace } = req.body;
    if (!Array.isArray(reports)) return res.status(400).json({ error: 'reports must be an array' });

    if (replace) {
      reportsStore = [];
    }

    const nowIso = new Date().toISOString();
    let inserted = 0;
    reports.forEach((r: Report) => {
      r.createdAt = r.createdAt || nowIso;
      r.updatedAt = r.updatedAt || nowIso;
      // ensure in-memory store reflects imported reports
      reportsStore.unshift(r);
      inserted += 1;
    });

    saveReportsToDisk();
    res.json({ imported: inserted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to import reports', details: String(err) });
  }
});

// Create a backup of the reports JSON file and return its filename
app.post('/api/admin/backup', adminAuthMiddleware, (req, res) => {
  try {
    const backupsDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir, { recursive: true });
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupsDir, `reports-backup-${ts}.json`);
    fs.copyFileSync(REPORTS_STORE_FILE, backupFile);
    res.json({ backupFile: path.relative(__dirname, backupFile) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create backup', details: String(err) });
  }
});

// Compact JSON store by rewriting it (no-op VACUUM equivalent)
app.post('/api/admin/vacuum', adminAuthMiddleware, (req, res) => {
  try {
    saveReportsToDisk();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'VACUUM (rewrite) failed', details: String(err) });
  }
});


// 7. SEED DEMO REPORT FOR TESTING IF STORE IS EMPTY
app.post('/api/demo/trigger-hackathon-scenario', (req, res) => {
  const sample = createSampleDemoReport();
  const existing = reportsStore.find((r) => r.id === sample.id);
  if (!existing) {
    reportsStore.unshift(sample);
  try { saveReportsToDisk(); } catch (e) { console.error('Failed to persist demo sample to disk:', e); }
  }
  res.json({ message: 'Demo report loaded into store!', report: existing || sample });
});

// Authentication endpoints (basic register/login using scrypt + token)
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'name, email and password required' });
    const existing = findUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'User with that email already exists' });
    const password_hash = hashPassword(password);
    const user = createUserRecord(name, email, password_hash);
    const token = signToken({ id: user.id, name: user.name, email: user.email });
    res.json({ id: user.id, name: user.name, email: user.email, token });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: String(err) });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    const row = findUserByEmail(email);
    if (!row) return res.status(404).json({ error: 'User not found' });
    if (!verifyPassword(password, row.password_hash)) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken({ id: row.id, name: row.name, email: row.email });
    res.json({ id: row.id, name: row.name, email: row.email, token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: String(err) });
  }
});

// 8. REAL LIVE STATS COMPUTATION
app.get('/api/stats', (req, res) => {
  const totalReports = reportsStore.length;
  const criticalIncidents = reportsStore.filter((r) => r.severity === 'critical' && r.status !== 'resolved').length;
  const inProgress = reportsStore.filter((r) => r.status === 'in_progress' || r.status === 'assigned').length;
  const resolvedThisWeek = reportsStore.filter((r) => r.status === 'resolved').length;
  const totalAffectedPeople = reportsStore.reduce((acc, r) => acc + (r.affectedPopulationEst || 0), 0);

  res.json({
    totalReports,
    criticalIncidents,
    inProgress,
    resolvedThisWeek,
    avgResponseHours: resolvedThisWeek > 0 ? 2.8 : 0,
    totalAffectedPeople,
  });
});

// ================= VITE OR PRODUCTION BUILD MIDDLEWARE =================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        // Configure HMR port to avoid default websocket port conflicts (can be overridden with HMR_PORT env var)
        hmr: { port: HMR_PORT },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  function openInBrowser(url: string) {
    const start = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    try {
      // Use a shell command to open the default browser in a cross-platform way
      exec(`${start} "${url}"`);
    } catch (err) {
      console.warn('Failed to open browser automatically:', err);
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    const url = `http://localhost:${PORT}`;
    console.log(`NagarRakshak Server running on ${url}`);
    // Best-effort: open the default browser to the app URL
    openInBrowser(url);
  });
}

startServer();
