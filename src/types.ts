export type CivicIssueCategory =
  | 'waterlogging'
  | 'garbage'
  | 'pothole'
  | 'open_manhole'
  | 'sewage'
  | 'street_light';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export type ReportStatus = 'reported' | 'verified' | 'assigned' | 'in_progress' | 'resolved';

export type LanguageCode = 'en' | 'pb' | 'hi';

export interface AIAnalysisResult {
  detectedIssue: string;
  category: CivicIssueCategory;
  confidence: number; // 0 to 1
  suggestedSeverity: SeverityLevel;
  severityReasoning: string;
  hazardsDetected: string[];
  summaryOfficial: string;
  aiTags: string[];
  publicRiskScore: number; // 1-10
  locationSensitivityScore: number; // 1-10
  estimatedAffectedPopulation: number;
  isFakeOrUnrelated?: boolean;
  fakeWarningReason?: string;
}

export interface ReportTimelineEvent {
  id: string;
  status: ReportStatus;
  comment: string;
  timestamp: string;
  actor: string;
  imageUrl?: string;
}

export interface AssignedTeam {
  department: string;
  officerName: string;
  teamName: string;
  assignedAt: string;
  estimatedResolutionHours: number;
}

export interface Report {
  id: string; // e.g. NR-LDH-2048
  citizenName?: string;
  citizenPhone?: string;
  citizenId?: string;
  category: CivicIssueCategory;
  title: string;
  description: string;
  voiceTranscript?: string;
  language: LanguageCode;
  imageUrl: string;
  resolutionImageUrl?: string;
  latitude: number;
  longitude: number;
  locationName: string;
  wardNumber: string;
  landmark?: string;
  severity: SeverityLevel;
  priorityScore: number;
  publicRiskScore: number;
  locationSensitivityScore: number;
  affectedPopulationEst: number;
  status: ReportStatus;
  
  // Checkpoints for MC response tracking
  mcSeen?: boolean;
  mcSeenAt?: string;
  workStarted?: boolean;
  workStartedAt?: string;
  resolvedAt?: string;

  affectedCount: number; // "I'm affected too" votes
  clusterId?: string;
  isDuplicate?: boolean;
  duplicateCount: number;
  aiAnalysis: AIAnalysisResult;
  createdAt: string;
  updatedAt: string;
  assignedTo?: AssignedTeam;
  timeline: ReportTimelineEvent[];
}

export interface LudhianaLocationOption {
  id: string;
  name: string;
  lat: number;
  lng: number;
  ward: string;
  sensitivityNote: string;
  sensitivityScore: number;
}

export interface HotspotArea {
  id: string;
  name: string;
  lat: number;
  lng: number;
  ward: string;
  activeCount: number;
  criticalCount: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
}

export interface CivicStats {
  totalReports: number;
  criticalIncidents: number;
  inProgress: number;
  resolvedThisWeek: number;
  avgResponseHours: number;
  totalAffectedPeople: number;
}
