import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap,
  ArrowRight,
  FileText,
  X,
  Droplet,
  Trash2,
  Disc,
  Flame,
  Lightbulb,
  Search,
} from 'lucide-react';
import QRCode from 'qrcode';
import {
  CivicIssueCategory,
  LanguageCode,
  Report,
  AIAnalysisResult,
} from '../types';
import { translations } from '../data/translations';
import { LUDHIANA_LOCATIONS, SAMPLE_CIVIC_IMAGES } from '../data/initialData';

import { UserSession } from './AuthScreen';

interface ReportSubmissionFormProps {
  currentLang: LanguageCode;
  onReportCreated: (newReport: Report) => void;
  onTrackReport: (id: string) => void;
  currentUser?: UserSession | null;
}

export const ReportSubmissionForm: React.FC<ReportSubmissionFormProps> = ({
  currentLang,
  onReportCreated,
  onTrackReport,
  currentUser,
}) => {
  const t = translations[currentLang];

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<CivicIssueCategory>('waterlogging');
  const [description, setDescription] = useState<string>('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(SAMPLE_CIVIC_IMAGES.waterlogging);
  
  // Location Selection State: search query or selected preset
  const [locationSearchQuery, setLocationSearchQuery] = useState<string>('');
  const [selectedLocationName, setSelectedLocationName] = useState<string>('Sarabha Nagar (Kipper Market & BCM School)');
  const [selectedWard, setSelectedWard] = useState<string>('Ward 58, Zone D');
  const [landmark, setLandmark] = useState<string>('');
  const [manualLat, setManualLat] = useState<string>('30.8923');
  const [manualLng, setManualLng] = useState<string>('75.8214');
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);
  const [gpsStatusMsg, setGpsStatusMsg] = useState<string>('');

  // AI & Submission state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedReport, setSubmittedReport] = useState<Report | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filter Ludhiana Locations based on search query
  const filteredLocations = LUDHIANA_LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(locationSearchQuery.toLowerCase()) ||
    loc.ward.toLowerCase().includes(locationSearchQuery.toLowerCase())
  );

  // Issue Categories List
  const CATEGORIES: { id: CivicIssueCategory; label: string; icon: any; color: string }[] = [
    { id: 'waterlogging', label: t.waterlogging, icon: Droplet, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    { id: 'garbage', label: t.garbage, icon: Trash2, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { id: 'pothole', label: t.pothole, icon: Disc, color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
    { id: 'open_manhole', label: t.openManhole, icon: AlertTriangle, color: 'text-red-400 bg-red-500/10 border-red-500/30' },
    { id: 'sewage', label: t.sewageOverflow, icon: Flame, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { id: 'street_light', label: t.brokenStreetlight, icon: Lightbulb, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
  ];

  // Handle image upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setImagePreviewUrl(base64);
        triggerAIAnalysis(base64, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset sample photo selector
  const handleSelectPresetSample = (category: CivicIssueCategory) => {
    setSelectedCategory(category);
    const sampleUrl = SAMPLE_CIVIC_IMAGES[category] || SAMPLE_CIVIC_IMAGES.waterlogging;
    setImagePreviewUrl(sampleUrl);
    triggerAIAnalysis(sampleUrl, 'image/jpeg');
  };

  // Trigger Gemini AI Server-Side Analysis
  const triggerAIAnalysis = async (imgBase64: string, mimeType: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imgBase64,
          mimeType,
          userText: description,
          selectedCategory,
        }),
      });
      const data = await res.json();
      setAiResult(data);
    } catch (err) {
      console.error('Error getting AI analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Detect Real GPS Location
  const handleDetectGps = () => {
    setIsGpsLoading(true);
    setGpsStatusMsg('Requesting browser GPS location permission...');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setManualLat(lat.toFixed(4));
          setManualLng(lng.toFixed(4));

          // Check if coordinates are in or near Ludhiana region
          if (lat >= 30.7 && lat <= 31.1 && lng >= 75.6 && lng <= 76.1) {
            setSelectedLocationName(`GPS Location Detected (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
            setSelectedWard('Zone D • Live GPS');
            setGpsStatusMsg(`✓ Live GPS Location Locked: ${lat.toFixed(4)}, ${lng.toFixed(4)} (Ludhiana)`);
          } else {
            // Outside Ludhiana, adapt to Ludhiana center
            setSelectedLocationName(`Ludhiana Central GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
            setSelectedWard('Zone A • Central Ludhiana');
            setGpsStatusMsg(`✓ GPS Coordinates Locked: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          }
          setIsGpsLoading(false);
        },
        (error) => {
          console.warn('GPS location permission denied or unavailable:', error);
          // Default to Ludhiana Center (30.8923, 75.8214)
          setManualLat('30.8923');
          setManualLng('75.8214');
          setSelectedLocationName('Ludhiana Municipal Zone (Sarabha Nagar)');
          setSelectedWard('Ward 58, Zone D');
          setGpsStatusMsg('⚠️ GPS permission restricted. Set default Ludhiana Municipal Coordinates (30.8923, 75.8214).');
          setIsGpsLoading(false);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      setGpsStatusMsg('Geolocation is not supported by your browser.');
      setIsGpsLoading(false);
    }
  };

  // Submit Final Report
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const lat = parseFloat(manualLat) || 30.8923;
    const lng = parseFloat(manualLng) || 75.8214;
    const locName = selectedLocationName || 'Ludhiana Municipal Locality';
    const locWard = selectedWard || 'Ludhiana Municipal Zone';

    try {
      const payload = {
        citizenName: currentUser?.name || 'Gurpreet Singh',
        citizenPhone: currentUser?.phone || currentUser?.email || '+91 98765 43210',
        category: selectedCategory,
        title: description ? description.slice(0, 50) : `${selectedCategory.replace('_', ' ')} Hazard`,
        description: description || 'Citizen reported civic issue in Ludhiana.',
        language: currentLang,
        imageUrl: imagePreviewUrl,
        latitude: lat,
        longitude: lng,
        locationName: locName,
        wardNumber: locWard,
        landmark: landmark || 'Ludhiana locality',
        aiAnalysis: aiResult,
      };

      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const newReport: Report = await res.json();
      setSubmittedReport(newReport);
      onReportCreated(newReport);

      // Generate QR Code for report
      try {
        const qrUrl = await QRCode.toDataURL(newReport.id, { margin: 1, width: 200 });
        setQrDataUrl(qrUrl);
      } catch (e) {
        console.error('QR Code error:', e);
      }
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white space-y-2 relative overflow-hidden shadow-xl">
        <div className="flex items-center space-x-2 text-orange-400 font-bold text-xs uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>{t.submissionPortalTitle}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold">{t.reportIssue}</h2>
        <p className="text-slate-300 text-sm">{t.submissionIntro}</p>
      </div>

      {/* Submission Successful Confirmation Box */}
      {submittedReport ? (
        <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl animate-fade-in">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{t.reportLiveVerifiedLabel}</span>
              <h3 className="text-2xl font-black text-white">{t.trackingIdLabel} {submittedReport.id}</h3>
              <p className="text-xs text-slate-400">{t.trackingNote}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Smart Priority Score</span>
              <div className="text-3xl font-black text-amber-400">{submittedReport.priorityScore}/100</div>
              <p className="text-[11px] font-bold text-red-400 uppercase">Severity: {submittedReport.severity.toUpperCase()}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">{t.selectedIncidentSiteLabel}</span>
              <div className="text-sm font-bold text-slate-200 line-clamp-2">{submittedReport.locationName}</div>
              <p className="text-xs text-amber-300 font-medium">{submittedReport.wardNumber}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1 flex flex-col items-center justify-center text-center">
              {qrDataUrl && <img src={qrDataUrl} alt="QR Code" className="w-20 h-20 rounded-lg border border-slate-700 bg-white p-1" />}
              <span className="text-[10px] text-slate-400 mt-1">{t.scanQrNote}</span>
            </div>
          </div>

          {submittedReport.isDuplicate && (
            <div className="bg-amber-950/60 border border-amber-500/40 p-4 rounded-2xl flex items-start space-x-3 text-amber-200 text-xs">
              <Zap className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-300">{t.duplicateClusteredTitle}</strong>
                <p>{t.duplicateClusteredBody.replace('{count}', String(submittedReport.duplicateCount))}</p>
              </div>
            </div>
          )}

          <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
            <div className="font-bold text-orange-400">{t.officialSummaryLabel}</div>
            <p className="text-slate-300 italic">"{submittedReport.aiAnalysis.summaryOfficial}"</p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onTrackReport(submittedReport.id)}
              className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-3.5 rounded-2xl text-sm shadow-lg shadow-orange-500/30 flex items-center space-x-2"
            >
              <span>{t.trackLifecycleButton}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setSubmittedReport(null);
                setDescription('');
                setAiResult(null);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-5 py-3.5 rounded-2xl text-sm border border-slate-700"
            >
              {t.submitAnotherButton}
            </button>
          </div>
        </div>
      ) : (
        /* Main Submission Form */
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 text-white shadow-2xl">
          
          {/* STEP 1: Select Issue Category */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black">1</span>
              <span>{t.selectIssueCategory}</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      handleSelectPresetSample(cat.id);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-orange-500/20 border-orange-500 text-white ring-2 ring-orange-500/50 shadow-lg'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl w-fit border ${cat.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold leading-tight">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Upload Photo */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black">2</span>
                <span>{t.uploadPhoto}</span>
              </label>
              <span className="text-xs text-slate-400">{t.photoVerificationLabel}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Image Preview / Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative h-56 bg-slate-950 border-2 border-dashed border-slate-700 hover:border-orange-500 rounded-2xl overflow-hidden cursor-pointer flex flex-col items-center justify-center group transition-colors"
              >
                {imagePreviewUrl ? (
                  <>
                    <img src={imagePreviewUrl} alt="Complaint preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold text-white bg-slate-950/60 backdrop-blur-xs">
                      <Upload className="w-4 h-4 mr-1.5" /> {t.clickToSelectCapture}
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4 space-y-2">
                    <Camera className="w-8 h-8 text-orange-400 mx-auto" />
                    <p className="text-xs text-slate-300 font-bold">{t.clickToUploadPlaceholder}</p>
                    <p className="text-[11px] text-slate-500">{t.supportsImageHelp}</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </div>

              {/* Sample Photo Options */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.selectSamplePhoto}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleSelectPresetSample('waterlogging')}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left text-slate-300 hover:text-white"
                  >
                    🌊 Waterlogging
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPresetSample('open_manhole')}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left text-slate-300 hover:text-white"
                  >
                    🕳️ Open Sewer Cover
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPresetSample('pothole')}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left text-slate-300 hover:text-white"
                  >
                    ⚠️ Pothole / Road Cave-in
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPresetSample('garbage')}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left text-slate-300 hover:text-white"
                  >
                    🗑️ Garbage Dump
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Selecting a photo sends it to server-side Gemini AI for hazard assessment & priority calculation.
                </p>
              </div>
            </div>
          </div>

          {/* STEP 3: Describe the Problem (Voice Recording Removed as requested) */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black">3</span>
              <span>Describe the Problem</span>
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Provide details about the issue (e.g. 2 feet standing water near gate causing traffic block, uncovered sewer lid, broken road edge...)"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* STEP 4: Search Any Location or Use Real GPS in Ludhiana */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="block text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black">4</span>
                <span>Location Search & Real GPS (Ludhiana)</span>
              </label>

              {/* Real GPS Detection Button */}
              <button
                type="button"
                onClick={handleDetectGps}
                disabled={isGpsLoading}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all self-start sm:self-auto"
              >
                <MapPin className="w-4 h-4" />
                <span>{isGpsLoading ? 'Detecting GPS...' : '📍 Detect My Live GPS Location'}</span>
              </button>
            </div>

            {gpsStatusMsg && (
              <div className="p-3 bg-slate-950 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 font-medium">
                {gpsStatusMsg}
              </div>
            )}

            {/* Selected Location Pill */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-orange-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Selected Incident Site</span>
                <span className="text-sm font-extrabold text-white">{selectedLocationName}</span>
                <span className="text-xs text-amber-400 block font-semibold">{selectedWard}</span>
              </div>
              <div className="text-right font-mono text-xs text-slate-400">
                <div>Lat: {manualLat}</div>
                <div>Lng: {manualLng}</div>
              </div>
            </div>

            {/* Location Search Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Search Any Ludhiana Area / Landmark / Market:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={locationSearchQuery}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLocationSearchQuery(val);
                    setSelectedLocationName(val ? `${val}, Ludhiana` : 'Sarabha Nagar, Ludhiana');
                  }}
                  placeholder="Type location (e.g. Sarabha Nagar, Clock Tower, DMC Hospital, PAU Gate, Mall Road...)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl py-3.5 px-4 pl-11 text-sm text-white focus:outline-none focus:border-orange-500"
                />
                <Search className="w-5 h-5 text-orange-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Search Recommendations List */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                💡 Recommended Ludhiana Locations & Wards (Click to Select):
              </span>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                {filteredLocations.slice(0, 12).map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => {
                      setSelectedLocationName(loc.name);
                      setSelectedWard(loc.ward);
                      setManualLat(loc.lat.toString());
                      setManualLng(loc.lng.toString());
                      setLocationSearchQuery(loc.name);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all text-left ${
                      selectedLocationName === loc.name
                        ? 'bg-orange-500 text-slate-950 border-orange-400 font-bold shadow-md'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    📍 {loc.name} <span className="opacity-70 text-[10px]">({loc.ward.split(',')[0]})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Lat / Lng Co-ordinates fine tuning */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Latitude (GPS Co-ordinates)</label>
                <input
                  type="number"
                  step="any"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  placeholder="e.g. 30.8923"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Longitude (GPS Co-ordinates)</label>
                <input
                  type="number"
                  step="any"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  placeholder="e.g. 75.8214"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Specific Landmark / Gate / Shop Reference</label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Opposite Gate 2, near juice corner"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* AI Live Analysis Box */}
          {isAnalyzing ? (
            <div className="bg-slate-950 p-5 rounded-2xl border border-orange-500/40 flex items-center space-x-3 text-amber-300 text-sm animate-pulse">
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
              <span>Analyzing photo & description with Gemini AI...</span>
            </div>
          ) : aiResult ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span className="font-bold text-white text-sm">Gemini AI Hazard Inspection</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                  aiResult.suggestedSeverity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-orange-500/20 text-orange-400'
                }`}>
                  Severity: {aiResult.suggestedSeverity}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                <div>
                  <strong className="text-slate-400">Detected Issue:</strong>
                  <p className="text-white font-medium">{aiResult.detectedIssue}</p>
                </div>
                <div>
                  <strong className="text-slate-400">Hazards Identified:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {aiResult.hazardsDetected.map((h, i) => (
                      <span key={i} className="bg-slate-900 border border-slate-800 text-amber-300 px-2 py-0.5 rounded-md text-[10px]">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-slate-300">
                <strong className="text-slate-400">Official Summary:</strong>
                <p className="text-slate-200 mt-0.5">{aiResult.summaryOfficial}</p>
              </div>
            </div>
          ) : null}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white font-bold py-4 px-6 rounded-2xl text-base shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.01] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>{t.submitting}</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>Submit Complaint to Ludhiana MC</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
