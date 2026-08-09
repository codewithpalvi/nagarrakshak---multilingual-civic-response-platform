import { LanguageCode } from '../types';

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  heroPitch: string;
  reportIssue: string;
  trackComplaint: string;
  viewCityProblems: string;
  adminDashboard: string;
  reportsSubmitted: string;
  issuesResolved: string;
  criticalHazards: string;
  selectIssueCategory: string;
  waterlogging: string;
  garbage: string;
  pothole: string;
  openManhole: string;
  sewageOverflow: string;
  brokenStreetlight: string;
  uploadPhoto: string;
  addVoiceOrTextNote: string;
  speakInYourLanguage: string;
  selectLocation: string;
  detectMyLocation: string;
  submitReport: string;
  submitting: string;
  analyzingWithAI: string;
  priorityScore: string;
  affectedToo: string;
  peopleAffected: string;
  duplicateClustered: string;
  statusReported: string;
  statusVerified: string;
  statusAssigned: string;
  statusInProgress: string;
  statusResolved: string;
  demoScenarioButton: string;
  beforeAfterView: string;
  ludhianaLocationsTitle: string;
// Additional UI keys added for full coverage
navOverview: string;
navHotspotMap: string;
navHome: string;
navReportShort: string;
navTrackShort: string;
navMapShort: string;
navAdminShort: string;
headerSubtitleSmall: string;
heroBadge: string;
heroHeadline1: string;
heroHeadline2: string;
poweredBy: string;
statsAcrossWards: string;
statsImmediatePriority: string;
statsVerifiedWithPhotos: string;
statsFromReportToDispatch: string;
hackathonBadge: string;
launchDemoButton: string;
hotspotMapLabel: string;
demoSteps1: string;
demoSteps2: string;
demoSteps3: string;
demoSteps4: string;
demoHeading: string;
demoDescription: string;
demoStep1Desc: string;
demoStep2Desc: string;
demoStep3Desc: string;
demoStep4Desc: string;
trackDemoIdLabel: string;
priorityScoreExplanation: string;
severityLabelShort: string;
publicRiskLabelShort: string;
duplicateBoostLabelShort: string;
locationSensitivityLabelShort: string;
locationSensitivityExplainer: string;
severityExplainer: string;
publicRiskExplainer: string;
duplicateBoostExplainer: string;
monitoredHotspotsLabel: string;
// Report form
submissionPortalTitle: string;
clickToSelectCapture: string;
clickToUploadPlaceholder: string;
describeProblemLabel: string;
describeProblemPlaceholder: string;
detectGpsButton: string;
detectingGps: string;
gpsPermissionRestricted: string;
selectedIncidentSiteLabel: string;
searchLocationPlaceholder: string;
recommendedLocationsTitle: string;
latitudeLabel: string;
longitudeLabel: string;
landmarkLabel: string;
analyzingWithAIMsg: string;
aiHazardInspectionTitle: string;
severityTextLabel: string;
detectedIssueTextLabel: string;
hazardsIdentifiedLabel: string;
officialSummaryLabel: string;
submitReportButton: string;
submitAnotherButton: string;
trackLifecycleButton: string;
reportLiveVerifiedLabel: string;
trackingIdLabel: string;
trackingNote: string;
duplicateClusteredTitle: string;
duplicateClusteredBody: string;
scanQrNote: string;
// Auth
signInNote: string;
mobileOtpLabel: string;
emailSignInLabel: string;
sendOtpButton: string;
verifyingOtpText: string;
verifyAndOpenApp: string;
instantDemoSignIn: string;
// Demo / submission helper texts
demoHeading: string;
demoDescription: string;
demoStep1Desc: string;
demoStep2Desc: string;
demoStep3Desc: string;
demoStep4Desc: string;
trackDemoIdLabel: string;
submissionIntro: string;
photoVerificationLabel: string;
selectSamplePhoto: string;
}


export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    appName: 'NagarRakshak',
    appSubtitle: 'Ludhiana Civic Response & Priority System',
    heroPitch: 'Turns scattered citizen complaints into verified, priority-ranked civic action.',
    reportIssue: 'Report an Issue',
    trackComplaint: 'Track Complaint',
    viewCityProblems: 'View Hotspot Map',
    adminDashboard: 'Authority Dashboard',
    reportsSubmitted: 'Reports Submitted',
    issuesResolved: 'Issues Resolved',
    criticalHazards: 'Critical Hazards Active',
    selectIssueCategory: 'Select Issue Category',
    waterlogging: 'Waterlogging / Monsoon Flood',
    garbage: 'Garbage Pile / Waste Spill',
    pothole: 'Severe Pothole / Road Cave-in',
    openManhole: 'Open / Broken Manhole',
    sewageOverflow: 'Sewage Overflow / Drain Blockage',
    brokenStreetlight: 'Broken Streetlight / Dark Hazard',
    uploadPhoto: 'Upload Photo or Capture Image',
    addVoiceOrTextNote: 'Describe the problem or record voice',
    speakInYourLanguage: 'Speak in Punjabi, Hindi, or English',
    selectLocation: 'Select Location in Ludhiana',
    detectMyLocation: 'Use Current GPS Location',
    submitReport: 'Submit Verified Citizen Report',
    submitting: 'Submitting & Analyzing...',
    analyzingWithAI: 'AI is assessing hazard severity & calculating priority score...',
    priorityScore: 'Smart Priority Score',
    affectedToo: "I'm Affected Too (+1 Priority)",
    peopleAffected: 'People Impacted',
    duplicateClustered: 'Duplicate Complaints Grouped',
    statusReported: 'Reported',
    statusVerified: 'Verified by AI',
    statusAssigned: 'Assigned to Team',
    statusInProgress: 'In Progress',
    statusResolved: 'Resolved & Closed',
    demoScenarioButton: '⚡ Launch Live Hackathon Demo Scenario',
    beforeAfterView: 'Before & After Resolution Verification',
    ludhianaLocationsTitle: 'Ludhiana Municipal Zones',
    navOverview: 'Overview',
    navHotspotMap: 'Hotspot Map',
    navHome: 'Home',
    navReportShort: 'Report',
    navTrackShort: 'Track',
    navMapShort: 'Map',
    navAdminShort: 'Admin',
    headerSubtitleSmall: 'Multilingual Civic Priority & Hotspot Platform',
    heroBadge: 'Ludhiana Civic Response Platform • 142 Waterlogging & Hazard Hotspots Monitored',
    heroHeadline1: 'Report a Problem.',
    heroHeadline2: 'Protect Your Neighbourhood.',
    poweredBy: 'Powered by Gemini AI visual hazard assessment and smart municipal dispatch algorithms.',
    statsAcrossWards: 'Across 75 Ludhiana Wards',
    statsImmediatePriority: 'Immediate priority action',
    statsVerifiedWithPhotos: 'Verified with photos',
    statsFromReportToDispatch: 'From report to dispatch',
    hackathonBadge: 'Hackathon Demo Story Scenario',
    launchDemoButton: 'Launch Live Demo Scenario',
    hotspotMapLabel: 'Ludhiana Hotspot Map',
    demoSteps1: '1. Citizen Photo Upload',
    demoSteps2: '2. Duplicate Clustering',
    demoSteps3: '3. Priority Engine Spike',
    demoSteps4: '4. Direct Dispatch & Verification',
    demoHeading: '“11:20 AM: Open Manhole near BCM School”',
    demoDescription: 'Watch how NagarRakshak groups 4 duplicate citizen reports, calculates a Critical Priority Score (98/100), dispatches Rapid Response Team Alpha, and resolves the hazard with before-and-after photo proof.',
    demoStep1Desc: 'Harmandeep submits photo of open manhole in Sarabha Nagar monsoon puddle.',
    demoStep2Desc: '3 nearby citizens report the same hazard. NagarRakshak groups them into Incident #CLUSTER-LDH-MANHOLE.',
    demoStep3Desc: 'Score spikes to 98/100 due to proximity to school gate & multiple report cluster.',
    demoStep4Desc: 'Assigned to Er. Rajesh Kumar. New iron lid installed with before/after site proof.',
    trackDemoIdLabel: 'Track Demo ID: NR-LDH-2048',
    priorityScoreExplanation: 'Priority Score = Severity + Public Risk + Duplicate Boost + Location Sensitivity',
    severityLabelShort: 'Severity (0-35)',
    publicRiskLabelShort: 'Public Risk (0-25)',
    duplicateBoostLabelShort: 'Duplicate Boost (0-25)',
    locationSensitivityLabelShort: 'Location Sensitivity (0-15)',
    severityExplainer: 'Gemini AI analyzes uploaded photos to differentiate between cosmetic road wear and deep open manholes or toxic sewage hazards.',
    publicRiskExplainer: 'Evaluates danger to two-wheelers, children, pedestrian footfall, and potential disease outbreak.',
    duplicateBoostExplainer: 'Clusters duplicate reports within 350 meters; multiple complaints automatically boost priority.',
    locationSensitivityExplainer: 'Cross-references Ludhiana school zones, hospital entrances, and major arterial underpasses for higher sensitivity.',
    monitoredHotspotsLabel: 'Monitored Ludhiana Municipal Hotspots:',
    // Report form
    submissionIntro: 'Report civic hazards across any locality in Ludhiana. Gemini AI will analyze severity, detect risks, group nearby duplicate complaints, and compute your live Smart Priority Score.',
    photoVerificationLabel: 'Photo & visual verification',
    selectSamplePhoto: 'Select sample photo for quick testing:',
    supportsImageHelp: 'Supports JPG, PNG up to 10MB',
    submissionPortalTitle: 'Ludhiana Live Citizen Submission Portal',
    clickToSelectCapture: 'Click to Select / Capture Photo',
    clickToUploadPlaceholder: 'Click to Upload Photo or Capture Camera',
    describeProblemLabel: 'Describe the Problem',
    describeProblemPlaceholder: 'Provide details about the issue (e.g. 2 feet standing water near gate causing traffic block, uncovered sewer lid, broken road edge...)',
    detectGpsButton: '📍 Detect My Live GPS Location',
    detectingGps: 'Detecting GPS...',
    gpsPermissionRestricted: '⚠️ GPS permission restricted. Set default Ludhiana Municipal Coordinates (30.8923, 75.8214).',
    selectedIncidentSiteLabel: 'Selected Incident Site',
    searchLocationPlaceholder: 'Type location (e.g. Sarabha Nagar, Clock Tower, DMC Hospital, PAU Gate, Mall Road...)',
    recommendedLocationsTitle: '💡 Recommended Ludhiana Locations & Wards (Click to Select):',
    latitudeLabel: 'Latitude (GPS Co-ordinates)',
    longitudeLabel: 'Longitude (GPS Co-ordinates)',
    landmarkLabel: 'Specific Landmark / Gate / Shop Reference',
    analyzingWithAIMsg: 'Analyzing photo & description with Gemini AI...',
    aiHazardInspectionTitle: 'Gemini AI Hazard Inspection',
    severityTextLabel: 'Severity:',
    detectedIssueTextLabel: 'Detected Issue:',
    hazardsIdentifiedLabel: 'Hazards Identified:',
    officialSummaryLabel: 'Official Summary:',
    submitReportButton: 'Submit Complaint to Ludhiana MC',
    submitAnotherButton: 'Submit Another Report',
    trackLifecycleButton: 'Track Complaint Lifecycle',
    reportLiveVerifiedLabel: 'Report Live & Verified',
    trackingIdLabel: 'Tracking ID:',
    trackingNote: 'Official Municipal Corporation Ludhiana tracking number',
    duplicateClusteredTitle: 'Duplicate Incident Clustered!',
    duplicateClusteredBody: 'NagarRakshak automatically grouped {count} nearby citizen reports in this area. Priority score boosted to expedite dispatch.',
    scanQrNote: 'Scan QR to track lifecycle',
    // Auth
    signInNote: 'Sign in to Report Hazards & Track Complaints',
    mobileOtpLabel: 'Mobile OTP',
    emailSignInLabel: 'Email Sign In',
    sendOtpButton: 'Send OTP Code',
    verifyingOtpText: 'Verifying...',
    verifyAndOpenApp: 'Verify & Open App Dashboard',
    instantDemoSignIn: 'Instant Demo Sign In (1-Click)',
  },
  pb: {
    appName: 'ਨਗਰ ਰੱਖਿਅਕ',
    appSubtitle: 'ਲੁਧਿਆਣਾ ਨਾਗਰਿਕ ਪ੍ਰਤੀਕਿਰਿਆ ਅਤੇ ਪ੍ਰਾਥਮਿਕਤਾ ਪ੍ਰਣਾਲੀ',
    heroPitch: 'ਨਾਗਰਿਕਾਂ ਦੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਨੂੰ ਪ੍ਰਮਾਣਿਤ ਅਤੇ ਪ੍ਰਾਥਮਿਕਤਾ-ਰੈਂਕ ਵਾਲੀ ਕਾਰਵਾਈ ਵਿੱਚ ਬਦਲਦਾ ਹੈ।',
    reportIssue: 'ਸਮੱਸਿਆ ਦੀ ਰਿਪੋਰਟ ਕਰੋ',
    trackComplaint: 'ਸ਼ਿਕਾਇਤ ਟ੍ਰੈਕ ਕਰੋ',
    viewCityProblems: 'ਸ਼ਹਿਰ ਦਾ ਹੌਟਸਪੌਟ ਮੈਪ',
    adminDashboard: 'ਅਧਿਕਾਰੀ ਡੈਸ਼ਬੋਰਡ',
    reportsSubmitted: 'ਕੁੱਲ ਦਰਜ ਰਿਪੋਰਟਾਂ',
    issuesResolved: 'ਹੱਲ ਕੀਤੀਆਂ ਸਮੱਸਿਆਵਾਂ',
    criticalHazards: 'ਗੰਭੀਰ ਖਤਰੇ ਐਕਟਿਵ',
    selectIssueCategory: 'ਸਮੱਸਿਆ ਦੀ ਕਿਸਮ ਚੁਣੋ',
    waterlogging: 'ਜਲ ਭਰਾਅ / ਪਾਣੀ ਦਾ ਇਕੱਠਾ ਹੋਣਾ',
    garbage: 'ਕੂੜੇ ਦਾ ਢੇਰ / ਗੰਦਗੀ',
    pothole: 'ਸੜਕ ਵਿੱਚ ਵੱਡਾ ਟੋਆ / ਖੱਡਾ',
    openManhole: 'ਖੁੱਲ੍ਹਾ / ਟੁੱਟਿਆ ਮੈਨਹੋਲ (ਸੀਵਰ)',
    sewageOverflow: 'ਸੀਵਰੇਜ ਓਵਰਫਲੋ / ਨਾਲੀ ਬੰਦ',
    brokenStreetlight: 'ਖਰਾਬ ਸਟ੍ਰੀਟ ਲਾਈਟ / ਹਨੇਰਾ',
    uploadPhoto: 'ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ ਜਾਂ ਖਿੱਚੋ',
    addVoiceOrTextNote: 'ਸਮੱਸਿਆ ਦਾ ਵੇਰਵਾ ਦਿਓ ਜਾਂ ਆਵਾਜ਼ ਰਿਕਾਰਡ ਕਰੋ',
    speakInYourLanguage: 'ਪੰਜਾਬੀ, ਹਿੰਦੀ, ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਬੋਲੋ',
    selectLocation: 'ਲੁਧਿਆਣਾ ਵਿੱਚ ਸਥਾਨ ਚੁਣੋ',
    detectMyLocation: 'ਮੌਜੂਦਾ GPS ਸਥਾਨ ਦੀ ਵਰਤੋਂ ਕਰੋ',
    submitReport: 'ਨਾਗਰਿਕ ਰਿਪੋਰਟ ਜਮ੍ਹਾਂ ਕਰੋ',
    submitting: 'ਜਮ੍ਹਾਂ ਅਤੇ ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ...',
    analyzingWithAI: 'AI ਖਤਰੇ ਦੀ ਗੰਭੀਰਤਾ ਅਤੇ ਸਕੋਰ ਦੀ ਜਾਂਚ ਕਰ ਰਿਹਾ ਹੈ...',
    priorityScore: 'ਸਮਾਰਟ ਪ੍ਰਾਥਮਿਕਤਾ ਸਕੋਰ',
    affectedToo: 'ਮੈਂ ਵੀ ਪ੍ਰਭਾਵਿਤ ਹਾਂ (+1 ਪ੍ਰਾਥਮਿਕਤਾ)',
    peopleAffected: 'ਪ੍ਰਭਾਵਿਤ ਲੋਕ',
    duplicateClustered: 'ਮਿਲਦੀਆਂ-ਜੁਲਦੀਆਂ ਰਿਪੋਰਟਾਂ ਦਾ ਸਮੂਹ',
    statusReported: 'ਦਰਜ ਹੋਈ',
    statusVerified: 'AI ਦੁਆਰਾ ਪ੍ਰਮਾਣਿਤ',
    statusAssigned: 'ਟੀਮ ਨੂੰ ਸੌਂਪੀ ਗਈ',
    statusInProgress: 'ਕੰਮ ਜਾਰੀ ਹੈ',
    statusResolved: 'ਸਫਲਤਾਪੂਰਵਕ ਹੱਲ ਹੋਇਆ',
    demoScenarioButton: '⚡ ਲਾਈਵ ਡੈਮੋ ਸਿਨਾਰੀਓ ਸ਼ੁਰੂ ਕਰੋ',
    beforeAfterView: 'ਹੱਲ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਅਤੇ ਬਾਅਦ ਦੀ ਫੋਟੋ',
    ludhianaLocationsTitle: 'ਲੁਧਿਆਣਾ ਨਗਰ ਨਿਗਮ ਜ਼ੋਨ',
  navOverview: 'ਉਤੇਦੜੀ',
  navHotspotMap: 'ਹੌਟਸਪੌਟ ਨਕਸ਼ਾ',
  navHome: 'ਘਰ',
  navReportShort: 'ਰਿਪੋਰਟ',
  navTrackShort: 'ਟ੍ਰੈਕ',
  navMapShort: 'ਮੈਪ',
  navAdminShort: 'ਅਡਮਿਨ',
  headerSubtitleSmall: 'ਬਹੁਭਾਸ਼ੀ ਨਾਗਰਿਕ ਪ੍ਰਾਥਮਿਕਤਾ ਅਤੇ ਹੌਟਸਪੌਟ ਪਲੇਟਫਾਰਮ',
  heroBadge: 'ਲੁਧਿਆਣਾ ਨਾਗਰਿਕ ਪ੍ਰਤੀਕਿਰਿਆ ਪਲੇਟਫਾਰਮ • 142 ਵਾਟਰਲੌਗਿੰਗ ਅਤੇ ਖਤਰਾ ਹੌਟਸਪੌਟ ਮੋਨੀਟਰ ਕੀਤੇ ਗਏ',
  heroHeadline1: 'ਸਮੱਸਿਆ ਦੀ ਰਿਪੋਰਟ ਕਰੋ.',
  heroHeadline2: 'ਆਪਣੇ ਗੁਆਂਢੀਅਨ ਦੀ ਰੱਖਿਆ ਕਰੋ.',
  poweredBy: 'Gemini AI ਵਿਜ਼ੂਅਲ ਖਤਰਾ ਮੁਲਾਂਕਣ ਅਤੇ ਸਮਾਰਟ ਮিউਨਿਸਿਪਲ ਡਿਸਪੈਚ ਅਲਗੋਰਿਦਮ ਦੁਆਰਾ ਚਲਾਇਆ ਗਿਆ।',
  statsAcrossWards: 'ਲੁਧਿਆਣਾ ਦੇ 75 ਵਾਰਡ ਵਿੱਚ',
  statsImmediatePriority: 'ਤੁਰੰਤ ਪ੍ਰਾਥਮਿਕਤਾ ਕਾਰਵਾਈ',
  statsVerifiedWithPhotos: 'ਫੋਟੋ ਨਾਲ ਪ੍ਰਮਾਣਿਤ',
  statsFromReportToDispatch: 'ਰਿਪੋਰਟ ਤੋਂ ਡਿਸਪੈਚ ਤੱਕ',
  hackathonBadge: 'ਹੈਕਾਥੌਨ ਡੈਮੋ ਸਟੋਰੀ ਸਿਨਾਰੀਓ',
  launchDemoButton: 'ਲਾਈਵ ਡੈਮੋ ਸਿਨਾਰੀਓ ਸ਼ੁਰੂ ਕਰੋ',
  hotspotMapLabel: 'ਲੁਧਿਆਣਾ ਹੌਟਸਪੌਟ ਨਕਸ਼ਾ',
  demoSteps1: '1. ਨਾਗਰਿਕ ਫੋਟੋ ਅੱਪਲੋਡ',
  demoSteps2: '2. ਡੁਪਲਿਕੇਟ ਗ੍ਰੂਪਿੰਗ',
  demoSteps3: '3. ਪ੍ਰਾਥਮਿਕਤਾ ਸਕੋਰ ਵਾਧਾ',
  demoSteps4: '4. ਸਿੱਧਾ ਡਿਸਪੈਚ ਅਤੇ ਜाँच',
  priorityScoreExplanation: 'ਪ੍ਰਾਥਮਿਕਤਾ ਸਕੋਰ = ਗੰਭੀਰਤਾ + ਜਨਤਕ ਜੋਖਮ + ਡੁਪਲਿਕੇਟ ਬੂਸਟ + ਸਥਾਨ ਸੰਵੇਦਨਸ਼ੀਲਤਾ',
  severityLabelShort: 'ਗੰਭੀਰਤਾ (0-35)',
  publicRiskLabelShort: 'ਜਨਤਕ ਜੋਖਮ (0-25)',
  duplicateBoostLabelShort: 'ਡੁਪਲਿਕੇਟ ਬੂਸਟ (0-25)',
  locationSensitivityLabelShort: 'ਸਥਾਨ ਸੰਵੇਦਨਸ਼ੀਲਤਾ (0-15)',
  severityExplainer: 'Gemini AI ਅੱਪਲੋਡ ਕੀਤੀਆਂ ਫੋਟੋਆਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਕੇ ਸਧਾਰਣ ਸੜਕ ਖਰਾਬੀ ਅਤੇ ਡੂੰਘੇ ਖੁਲੇ ਮੈਨਹੋਲ ਜਾਂ ਸੈਵੇਜ ਖਤਰੇ ਵਿਚ ਭਿੰਨਤਾ ਕਰਦਾ ਹੈ।',
  publicRiskExplainer: 'ਦੋ-ਪਹੀਆ ਵਾਹਨਾਂ, ਬੱਚਿਆਂ, ਪੈदल ਆਵਾਜਾਈ ਅਤੇ ਸੰਭਾਵਿਤ ਰੋਗ ਫੈਲਾਅ ਦੇ ਖਤਰੇ ਦਾ ਅੰਦਾਜ਼ਾ ਲਾਉਂਦਾ ਹੈ।',
  duplicateBoostExplainer: '350 ਮੀਟਰ ਅੰਦਰ ਡੁਪਲਿਕੇਟ ਰਿਪੋਰਟਾਂ ਨੂੰ ਕਲਸਟਰ ਕਰਦਾ ਹੈ; ਕਈ ਰਿਪੋਰਟਾਂ ਆਟੋਮੈਟਿਕ ਤੌਰ ਤੇ ਪ੍ਰਾਥਮਿਕਤਾ ਨੂੰ ਵਧਾ ਦਿੰਦੀਆਂ ਹਨ।',
  locationSensitivityExplainer: 'ਲੁਧਿਆਣਾ ਸਕੂਲ ਜ਼ੋਨ, ਹਸਪਤਾਲ ਮੁਹਾਂਦਰੇ ਅਤੇ ਮੁੱਖ ਅੰਡਰਪਾਸਾਂ ਨਾਲ ਸੀਸੇ ਕਰਕੇ ਉਚਿਤ ਸੰਵੇਦਨਸ਼ੀਲਤਾ ਨੂੰ ਪ੍ਰਾਪਤ ਕਰਦਾ ਹੈ।',
  monitoredHotspotsLabel: 'ਮਾਨੀਟਰ ਕੀਤੇ ਹੌਟਸਪੌਟ:',
  submissionIntro: 'ਲੁਧਿਆਣਾ ਦੇ ਕਿਸੇ ਵੀ ਇਲਾਕੇ ਵਿੱਚ ਸਿਵਿਕ ਖਤਰਿਆਂ ਦੀ ਰਿਪੋਰਟ ਕਰੋ। Gemini AI ਗੰਭੀਰਤਾ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੇਗਾ, ਜੋਖਮ ਦੀ ਪਛਾਣ करेगा, ਨੇੜਲੇ ਡੁਪਲਿਕੇਟ ਸ਼ਿਕਾਇਤਾਂ ਨੂੰ ਗਰੁੱਪ ਕਰੇਗਾ ਅਤੇ ਤੁਹਾਡੇ ਲਈ ਲਾਈਵ ਸਮਾਰਟ ਪ੍ਰਾਇਓਰਟੀ ਸਕੋਰ ਕੈਲਕੁਲੇਟ ਕਰੇਗਾ।',
  photoVerificationLabel: 'ਫੋਟੋ ਅਤੇ ਵਿਜ਼ੂਅਲ ਤਸਦੀਕ',
  selectSamplePhoto: 'ਜ਼ਲਦੀ ਟੈਸਟ ਲਈ ਨਮੂਨਾ ਫੋਟੋ ਚੁਣੋ:',
  supportsImageHelp: 'JPG, PNG ਨੂੰ 10MB ਤੱਕ ਸਪੋਰਟ ਕਰਦਾ ਹੈ',
  submissionPortalTitle: 'ਲੁਧਿਆਣਾ ਲਾਈਵ ਨਾਗਰਿਕ ਜਮ੍ਹਾਂ ਪੋਰਟਲ',
  clickToSelectCapture: 'ਫੋਟੋ ਚੁਣਨ/ਕੈਪਚਰ ਕਰਨ ਲਈ ਕਲਿਕ ਕਰੋ',
  clickToUploadPlaceholder: 'ਫੋਟੋ ਅੱਪਲੋਡ ਕਰਨ ਲਈ ਕਲਿਕ ਕਰੋ ਜਾਂ ਕੈਪਚਰ ਕਰੋ',
  describeProblemLabel: 'ਸਮੱਸਿਆ ਦਾ ਵੇਰਵਾ ਦਿਓ',
  describeProblemPlaceholder: 'ਸਮੱਸਿਆ ਦੇ ਬਾਰੇ ਵੇਰਵਾ ਦਿਓ (ਉਦਾਹਰਨ: ਗੇਟ ਕੋਲ 2 ਫੁੱਟ ਪਾਣੀ...),',
  detectGpsButton: '📍 ਮੇਰਾ ਲਾਈਵ GPS ਪਤਾ ਲੱਭੋ',
  detectingGps: 'GPS ਲੱਭ ਰਿਹਾ ਹੈ...',
  gpsPermissionRestricted: '⚠️ GPS ਅਨੁਮਤੀ ਸੀਮਿਤ। ਡਿਫਾਲਟ ਕੋਆਰਡੀਨੇਟ ਸੈਟ ਕੀਤਾ ਗਿਆ।',
  selectedIncidentSiteLabel: 'ਚੁਣੀ ਹੋਈ ਘਟਨਾ ਸਾਈਟ',
  searchLocationPlaceholder: 'ਸਥਾਨ ਟਾਈਪ ਕਰੋ (ਉਦਾਹਰਨ: Sarabha Nagar, Clock Tower...)',
  recommendedLocationsTitle: '💡 ਸਿਫਾਰਸ਼ੀਤ ਸਥਾਨ ਤੇ ਵਾਰਡ (ਕਲਿਕ ਕਰਕੇ ਚੁਣੋ):',
  latitudeLabel: 'ਅੱਖਾਂ (Latitude)',
  longitudeLabel: 'ਲੰਬਾਈ (Longitude)',
  landmarkLabel: 'ਖਾਸ ਨਿਸ਼ਾਨ / ਦਰਵਾਜ਼ਾ / ਦુકਾਨ ਦਾ ਸੰਦਰਭ',
  analyzingWithAIMsg: 'ਫੋਟੋ ਅਤੇ ਵੇਰਵਾ ਨੂੰ Gemini AI ਨਾਲ ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...',
  aiHazardInspectionTitle: 'Gemini AI ਖਤਰਾ ਜाँच',
  severityTextLabel: 'ਗੰਭੀਰਤਾ:',
  detectedIssueTextLabel: 'ਪਤਾ ਲੱਗੀ ਸਮੱਸਿਆ:',
  hazardsIdentifiedLabel: 'ਪਛਾਣ ਕੀਤੇ ਖਤਰੇ:',
  officialSummaryLabel: 'ਅਧਿਕਾਰੀ ਸੰਖੇਪ:',
  submitReportButton: 'ਲੁਧਿਆਣਾ MC ਨੂੰ ਰਿਪੋਰਟ ਜਮ੍ਹਾਂ ਕਰੋ',
  submitAnotherButton: 'ਫਿਰ ਤੋਂ ਰਿਪੋਰਟ ਜਮ੍ਹਾਂ ਕਰੋ',
  trackLifecycleButton: 'ਸ਼ਿਕਾਇਤ ਦਾ ਟ੍ਰੈਕ ਕਰੋ',
  reportLiveVerifiedLabel: 'ਰਿਪੋਰਟ ਲਾਈਵ ਅਤੇ ਪ੍ਰਮਾਣਿਤ',
  trackingIdLabel: 'ਟ੍ਰੈਕਿੰਗ ID:',
  trackingNote: 'ਅਧਿਕਾਰਕ ਲੁਧਿਆਣਾ ਕਾਰਪੋਰੇਸ਼ਨ ਟ੍ਰੈਕਿੰਗ ਨੰਬਰ',
  duplicateClusteredTitle: 'ਡੁਪਲਿਕੇਟ ਘਟਨਾ ਸਮੂਹਿਤ!',
  duplicateClusteredBody: 'ਨਗਰਰੱਖਿਅਕ ਨੇ ਇਸ ਖੇਤਰ ਵਿੱਚ {count} ਨੇੜਲੇ ਨਾਗਰਿਕ ਰਿਪੋਰਟਾਂ ਨੂੰ ਆਟੋਮੈਟਿਕ ਰੂਪ ਵਿੱਚ ਗਰੁੱਪ ਕੀਤਾ। ਪ੍ਰਾਥਮਿਕਤਾ ਸਕੋਰ ਤੇਜ਼ ਡਿਸਪੈਚ ਲਈ ਵਧਾਇਆ ਗਿਆ।',
  scanQrNote: 'ਲਾਈਫਸਾਈਕਲ ਦੇਖਣ ਲਈ QR ਸਕੈਨ ਕਰੋ',
  signInNote: 'ਖਤਰੇ ਰਿਪੋਰਟ ਕਰਨ ਅਤੇ ਸ਼ਿਕਾਇਤਾਂ ਟ੍ਰੈਕ ਕਰਨ ਲਈ ਸਾਇਨ-ਇਨ ਕਰੋ',
  mobileOtpLabel: 'ਮੋਬਾਈਲ OTP',
  emailSignInLabel: 'ਈਮੇਲ ਸਾਇਨ ਇਨ',
  sendOtpButton: 'OTP ਕੋਡ ਭੇਜੋ',
  verifyingOtpText: 'ਤਸਦੀਕ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...',
  verifyAndOpenApp: 'ਤਸਦੀਕ ਕਰੋ ਅਤੇ ਐਪ ਖੋਲ੍ਹੋ',
  instantDemoSignIn: 'ਤੁਰੰਤ ਡੈਮੋ ਸਾਇਨ ਇਨ (1-ਕਲਿਕ)',
  demoHeading: '“11:20 AM: BCM ਸਕੂਲ ਦੇ ਨੇੜੇ ਖੁਲ੍ਹਾ ਮੈਨਹੋਲ”',
  demoDescription: 'ਵੇਖੋ ਕਿ ਕਿਸ ਤਰ੍ਹਾਂ NagarRakshak 4 ਡੁਪਲਿਕੇਟ ਨਾਗਰਿਕ ਰਿਪੋਰਟਾਂ ਨੂੰ ਗਰੁੱਪ ਕਰਦਾ ਹੈ, ਇੱਕ ਕਰਿਟੀਕਲ ਪ੍ਰਾਇਓਰਟੀ ਸਕੋਰ ਤਿਆਰ ਕਰਦਾ ਹੈ, ਫੌਰੀ ਟੀਮ ਨੂੰ ਡਿਸਪੈਚ ਕਰਦਾ ਹੈ ਅਤੇ ਪਹਿਲਾਂ-ਬਾਅਦ ਫੋਟੋ ਸਬੂਤ ਨਾਲ ਸਮੱਸਿਆ ਹੱਲ ਕਰਵਾਉਂਦਾ ਹੈ।',
  demoStep1Desc: 'ਹਰਮਨਦੀਪ ਨੇ ਸਰਭਾ ਨਗਰ ਦੇ ਮੋਨਸੂਨ ਪਾਊਡਲ ਵਿੱਚ ਖੁਲੇ ਮੈਨਹੋਲ ਦੀ ਫੋਟੋ ਸਬਮਿਟ ਕੀਤੀ।',
  demoStep2Desc: '3 ਨੇੜਲੇ ਨਾਗਰਿਕ ਇੱਕੋ ਹੀ ਖਤਰੇ ਦੀ ਰਿਪੋਰਟ ਕੀਤੀ। NagarRakshak ਨੇ ਇਨ੍ਹਾਂ ਨੂੰ Incident #CLUSTER-LDH-MANHOLE ਵਿੱਚ ਗਰੁੱਪ ਕੀਤਾ।',
  demoStep3Desc: ' ਸਕੋਰ ਸਕੂਲ ਗੇਟ ਦੀ ਨੇੜਤਾ ਅਤੇ ਬਹੁਤ ਸਾਰੀਆਂ ਰਿਪੋਰਟਾਂ ਦੇ ਕਾਰਨ 98/100 ਹੋ ਗਿਆ।',
  demoStep4Desc: 'Er. Rajesh Kumar ਨੂੰ ਨਿਯੁਕਤ ਕੀਤਾ ਗਿਆ। ਨਵਾਂ ਲੋਹੇ ਦਾ ਢੱਕਣ ਲਾਇਆ ਗਿਆ ਅਤੇ ਪਹਿਲਾਂ/ਬਾਅਦ ਸਾਈਟ ਸਬੂਤ ਅੱਪਲੋਡ ਹੋਏ।',
  trackDemoIdLabel: 'ਡੈਮੋ ਟ੍ਰੈਕ ID: NR-LDH-2048',
  },
  hi: {
    appName: 'नगर रक्षक',
    appSubtitle: 'लुधियाना नागरिक प्रतिक्रिया एवं प्राथमिकता प्रणाली',
    heroPitch: 'नागरिक शिकायतों को सत्यापित और प्राथमिकता-रैंक वाली कार्रवाई में बदलता है।',
    reportIssue: 'समस्या की रिपोर्ट करें',
    trackComplaint: 'शिकायत ट्रैक करें',
    viewCityProblems: 'शहर का हॉटस्पॉट मैप',
    adminDashboard: 'अधिकारी डैशबोर्ड',
    reportsSubmitted: 'कुल दर्ज रिपोर्ट',
    issuesResolved: 'समाधान की गई समस्याएं',
    criticalHazards: 'गंभीर खतरे सक्रिय',
    selectIssueCategory: 'समस्या की श्रेणी चुनें',
    waterlogging: 'जलभराव / मानसून बाढ़',
    garbage: 'कचरे का ढेर / गंदगी',
    pothole: 'सड़क का गड्ढा / खड्डा',
    openManhole: 'खुला / टूटा मैनहोल (सीवर)',
    sewageOverflow: 'सीवरेज ओवरफ्लो / नाली बंद',
    brokenStreetlight: 'खराब स्ट्रीट लाइट / अंधेरा',
    uploadPhoto: 'फोटो अपलोड करें या खींचें',
    addVoiceOrTextNote: 'समस्या का विवरण दें या आवाज रिकॉर्ड करें',
    speakInYourLanguage: 'पंजाबी, हिंदी या अंग्रेजी में बोलें',
    selectLocation: 'लुधियाना में स्थान चुनें',
    detectMyLocation: 'वर्तमान GPS स्थान का उपयोग करें',
    submitReport: 'नागरिक रिपोर्ट जमा करें',
    submitting: 'जमा और विश्लेषण जारी है...',
    analyzingWithAI: 'AI खतरे की गंभीरता और प्राथमिकता स्कोर का आकलन कर रहा है...',
    priorityScore: 'स्मार्ट प्राथमिकता स्कोर',
    affectedToo: 'मैं भी प्रभावित हूँ (+1 प्राथमिकता)',
    peopleAffected: 'प्रभावित नागरिक',
    duplicateClustered: 'एक जैसी शिकायतों का समूह',
    statusReported: 'दर्ज हुआ',
    statusVerified: 'AI द्वारा सत्यापित',
    statusAssigned: 'टीम को सौंपा गया',
    statusInProgress: 'कार्य प्रगति पर है',
    statusResolved: 'सफलतापूर्वक हल हुआ',
    demoScenarioButton: '⚡ लाइव डेमो परिदृश्य शुरू करें',
    beforeAfterView: 'समाधान से पहले और बाद की तस्वीर',
    demoHeading: '“11:20 AM: BCM स्कूल के पास खुला मैनहोल”',
    demoDescription: 'देखें कैसे NagarRakshak 4 डुप्लिकेट नागरिक रिपोर्टों को समूहित करता है, एक क्रिटिकल प्राथमिकता स्कोर (98/100) की गणना करता है, त्वरित प्रतिक्रिया टीम को भेजता है, और पहले/बाद की फोटो के साथ खतरे का निवारण करता है।',
    demoStep1Desc: 'हरमनदीप ने सराभा नगर मानसून के गड्ढे में खुले मैनहोल की फोटो सबमिट की।',
    demoStep2Desc: '3 नज़दीकी नागरिकों ने वही खतरा रिपोर्ट किया। NagarRakshak ने इन्हें Incident #CLUSTER-LDH-MANHOLE में ग्रुप किया।',
    demoStep3Desc: 'स्कोर स्कूल गेट की निकटता और कई रिपोर्ट क्लस्टर के कारण 98/100 तक बढ़ गया।',
    demoStep4Desc: 'Er. Rajesh Kumar को असाइन किया गया। नया लोहे का ढक्कन लगाया गया और पहले/बाद साइट प्रमाण अपलोड किए गए।',
    trackDemoIdLabel: 'ट्रैक डेमो ID: NR-LDH-2048',
    ludhianaLocationsTitle: 'लुधियाना नगर निगम जोन',
  navOverview: 'ओवरव्यू',
  navHotspotMap: 'हॉटस्पॉट मानचित्र',
  navHome: 'होम',
  navReportShort: 'रिपोर्ट',
  navTrackShort: 'ट्रैक',
  navMapShort: 'मैप',
  navAdminShort: 'एडमिन',
  headerSubtitleSmall: 'बहुभाषी सिविक प्राथमिकता और हॉटस्पॉट प्लेटफ़ॉर्म',
  heroBadge: 'लुधियाना सिविक रिस्पॉन्स प्लेटफ़ॉर्म • 142 जलभराव और जोखिम हॉटस्पॉट मॉनीटर किए गए',
  heroHeadline1: 'समस्या की रिपोर्ट करें.',
  heroHeadline2: 'अपने पड़ोस की सुरक्षा करें.',
  poweredBy: 'Gemini AI विज़ुअल जोखिम मूल्यांकन और स्मार्ट नगर निगम डिस्पैच एल्गोरिदम द्वारा संचालित।',
  statsAcrossWards: 'लुधियाना के 75 वार्डों में',
  statsImmediatePriority: 'तुरंत प्राथमिकता कार्रवाई',
  statsVerifiedWithPhotos: 'फोटो के साथ सत्यापित',
  statsFromReportToDispatch: 'रिपोर्ट से डिस्पैच तक',
  hackathonBadge: 'हैकाथॉन डेमो स्टोरी परिदृश्य',
  launchDemoButton: 'लाइव डेमो परिदृश्य लॉन्च करें',
  hotspotMapLabel: 'लुधियाना हॉटस्पॉट मानचित्र',
  demoSteps1: '1. नागरिक फोटो अपलोड',
  demoSteps2: '2. डुप्लिकेट क्लस्टरिंग',
  demoSteps3: '3. प्राथमिकता स्कोर वृद्धि',
  demoSteps4: '4. प्रत्यक्ष डिस्पैच और सत्यापन',
  priorityScoreExplanation: 'प्राथमिकता स्कोर = गंभीरता + सार्वजनिक जोखिम + डुप्लीकेट बूस्ट + स्थान संवेदनशीलता',
  severityLabelShort: 'गंभीरता (0-35)',
  publicRiskLabelShort: 'सार्वजनिक जोखिम (0-25)',
  duplicateBoostLabelShort: 'डुप्लिकेट बूस्ट (0-25)',
  locationSensitivityLabelShort: 'स्थान संवेदनशीलता (0-15)',
  severityExplainer: 'Gemini AI अपलोड की गई तस्वीरों का विश्लेषण करके सतही सड़क क्षति और गहरे खुले मैनहोल या विषैला सीवेज जोखिम के बीच अंतर करता है।',
  publicRiskExplainer: 'दो-पहिया वाहनों, बच्चों, पैदल यात्रियों और संभावित बीमारी प्रकोप के जोखिम का मूल्यांकन करता है।',
  duplicateBoostExplainer: '350 मीटर के भीतर डुप्लिकेट रिपोर्टों को क्लस्टर करता है; कई शिकायतें स्वतः प्राथमिकता बढ़ाती हैं।',
  locationSensitivityExplainer: 'लुधियाना के स्कूल जोन, अस्पताल के बहिर्मुख और प्रमुख अंडरपास के साथ क्रॉस-रेफरेंस कर उच्च संवेदनशीलता देता है।',
  monitoredHotspotsLabel: 'मॉनिटर किए गए हॉटस्पॉट्स:',
  submissionIntro: 'लुधियाना के किसी भी क्षेत्र में नागरिक खतरों की रिपोर्ट करें। Gemini AI गंभीरता का विश्लेषण करेगा, जोखिम पहचान करेगा, निकटवर्ती डुप्लिकेट शिकायतों को समूहित करेगा, और आपका लाइव स्मार्ट प्राथमिकता स्कोर निकालेगा।',
  photoVerificationLabel: 'फ़ोटो और दृश्य सत्यापन',
  selectSamplePhoto: 'त्वरित परीक्षण के लिए सैंपल फ़ोटो चुनें:',
  supportsImageHelp: 'JPG, PNG 10MB तक समर्थित है',
  submissionPortalTitle: 'लुधियाना लाइव सिटीजन सबमिशन पोर्टल',
  clickToSelectCapture: 'फोटो चुनने/कैप्चर करने के लिए क्लिक करें',
  clickToUploadPlaceholder: 'फोटो अपलोड करने या कैप्चर करने के लिए क्लिक करें',
  describeProblemLabel: 'समस्या بیان करें',
  describeProblemPlaceholder: 'समस्या के बारे में विवरण दें (उदा. गेट के पास 2 फीट पानी...)',
  detectGpsButton: '📍 मेरा लाइव GPS पता पहचानें',
  detectingGps: 'GPS पता लगाया जा रहा है...',
  gpsPermissionRestricted: '⚠️ GPS अनुमति सीमित है। डिफ़ॉल्ट लुधियाना निर्देशांक सेट किए गए हैं।',
  selectedIncidentSiteLabel: 'चयनित घटना साइट',
  searchLocationPlaceholder: 'स्थान टाइप करें (उदा. Sarabha Nagar, Clock Tower...)',
  recommendedLocationsTitle: '💡 अनुशंसित लुधियाना स्थान और वार्ड (चुनने के लिए क्लिक करें):',
  latitudeLabel: 'अक्षांश (Latitude)',
  longitudeLabel: 'देशांतर (Longitude)',
  landmarkLabel: 'विशिष्ट लैंडमार्क / गेट / दुकान संदर्भ',
  analyzingWithAIMsg: 'Gemini AI के साथ फोटो और विवरण का विश्लेषण किया जा रहा है...',
  aiHazardInspectionTitle: 'Gemini AI खतरा निरीक्षण',
  severityTextLabel: 'गंभीरता:',
  detectedIssueTextLabel: 'पहचानी गई समस्या:',
  hazardsIdentifiedLabel: 'पहचाने गए खतरे:',
  officialSummaryLabel: 'आधिकारिक सारांश:',
  submitReportButton: 'लुधियाना MC को शिकायत सबमिट करें',
  submitAnotherButton: 'एक और रिपोर्ट सबमिट करें',
  trackLifecycleButton: 'शिकायत जीवनचक्र ट्रैक करें',
  reportLiveVerifiedLabel: 'रिपोर्ट लाइव और सत्यापित',
  trackingIdLabel: 'ट्रैकिंग ID:',
  trackingNote: 'आधिकारिक लुधियाना कार्पोरेशन ट्रैकिंग नंबर',
  duplicateClusteredTitle: 'डुप्लीकेट घटना समूहित!',
  duplicateClusteredBody: 'NagarRakshak ने इस क्षेत्र में {count} पास के नागरिक रिपोर्टों को स्वचालित रूप से समूहित किया। प्राथमिकता स्कोर त्वरित डिस्पैच के लिए बढ़ाया गया।',
  scanQrNote: 'जीवनचक्र को ट्रैक करने के लिए QR स्कैन करें',
  signInNote: 'खतरों की रिपोर्ट करने और शिकायतों को ट्रैक करने के लिए साइन इन करें',
  mobileOtpLabel: 'मोबाइल OTP',
  emailSignInLabel: 'ईमेल साइन इन',
  sendOtpButton: 'OTP कोड भेजें',
  verifyingOtpText: 'सत्यापित किया जा रहा है...',
  verifyAndOpenApp: 'सत्यापित करें और ऐप खोलें',
  instantDemoSignIn: 'तुरंत डेमो साइन-इन (1-क्लिक)',
  },
  };

