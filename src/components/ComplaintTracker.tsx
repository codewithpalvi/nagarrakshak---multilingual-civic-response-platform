import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Share2,
  Zap,
  ShieldCheck,
  Layers,
  TrendingUp,
  Inbox,
  PlusCircle,
  AlertTriangle,
} from 'lucide-react';
import QRCode from 'qrcode';
import { LanguageCode, Report, ReportStatus } from '../types';
import { translations } from '../data/translations';

interface ComplaintTrackerProps {
  currentLang: LanguageCode;
  initialTrackingId?: string;
  onNavigateToReport?: () => void;
}

function format_date(date_value?: string): string {
  if (!date_value) return 'Date unavailable';
  try {
    const parsedDate = new Date(date_value);
    if (isNaN(parsedDate.getTime())) return String(date_value);
    return parsedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return String(date_value);
  }
}

export const ComplaintTracker: React.FC<ComplaintTrackerProps> = ({
  currentLang,
  initialTrackingId = '',
  onNavigateToReport,
}) => {
  const t = translations[currentLang];

  const [searchId, setSearchId] = useState<string>(initialTrackingId);
  const [report, setReport] = useState<Report | null>(null);
  const [allUserReports, setAllUserReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [hasVotedAffected, setHasVotedAffected] = useState<boolean>(false);
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    fetchAllReports();
  }, []);

  useEffect(() => {
    if (initialTrackingId) {
      setSearchId(initialTrackingId);
      fetchReportDetails(initialTrackingId);
    } else if (allUserReports.length > 0) {
      // Default to latest report submitted by real users
      const latest = allUserReports[0];
      setSearchId(latest.id);
      fetchReportDetails(latest.id);
    }
  }, [initialTrackingId, allUserReports]);

  const fetchAllReports = async () => {
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const data: Report[] = await res.json();
        setAllUserReports(data);
        if (data.length > 0 && !searchId) {
          setSearchId(data[0].id);
          fetchReportDetails(data[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading reports list:', err);
    }
  };

  const fetchReportDetails = async (idToFetch: string) => {
    if (!idToFetch.trim()) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/reports/${idToFetch.trim().toUpperCase()}`);
      if (!res.ok) {
        throw new Error('Complaint ID not found in system.');
      }
      const data: Report = await res.json();
      setReport(data);

      try {
        const qr = await QRCode.toDataURL(data.id, { margin: 1, width: 220 });
        setQrUrl(qr);
      } catch (e) {
        console.error(e);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error searching complaint');
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoteAffected = async () => {
    if (!report || hasVotedAffected) return;
    try {
      const res = await fetch(`/api/reports/${report.id}/affect`, {
        method: 'POST',
      });
      const updated: Report = await res.json();
      setReport(updated);
      setHasVotedAffected(true);
    } catch (err) {
      console.error('Error voting affected:', err);
    }
  };

  const handleSeedDemoSample = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/demo/trigger-hackathon-scenario', { method: 'POST' });
      if (res.ok) {
        await fetchAllReports();
        fetchReportDetails('NR-LDH-2048');
        setSearchId('NR-LDH-2048');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyShare = () => {
    if (report) {
      navigator.clipboard.writeText(`https://ludhiana.nagarakshak.in/track/${report.id}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const STAGES: { key: ReportStatus; label: string; desc: string }[] = [
    { key: 'reported', label: t.statusReported, desc: 'Citizen complaint registered' },
    { key: 'verified', label: t.statusVerified, desc: 'AI assessed severity & priority' },
    { key: 'assigned', label: t.statusAssigned, desc: 'Dispatched to Municipal Wing' },
    { key: 'in_progress', label: t.statusInProgress, desc: 'Response team on site' },
    { key: 'resolved', label: t.statusResolved, desc: 'Verified with site proof' },
  ];

  const getStageIndex = (status: ReportStatus): number => {
    const idx = STAGES.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white space-y-3 relative overflow-hidden shadow-xl">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <Search className="w-4 h-4" />
          <span>Real-Time Public Complaint Tracking</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold">{t.trackComplaint}</h2>
        <p className="text-slate-300 text-sm">
          Track real complaints raised by citizens in real-time. Enter your assigned tracking ID (e.g. <span className="font-mono text-amber-300 font-bold">NR-LDH-2048</span>) or pick from submitted complaints.
        </p>

        {/* Search Input Bar */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Tracking ID (e.g. NR-LDH-2048)"
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl py-3.5 px-4 pl-11 text-sm font-mono text-amber-300 focus:outline-none focus:border-amber-400"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          <button
            onClick={() => fetchReportDetails(searchId)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-amber-500/20"
          >
            Track Status
          </button>
        </div>

        {/* Real User Complaints Quick List */}
        {allUserReports.length > 0 ? (
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span>Submitted Real Complaints ({allUserReports.length}):</span>
            {allUserReports.slice(0, 5).map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setSearchId(r.id);
                  fetchReportDetails(r.id);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono transition-all ${
                  report?.id === r.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
                }`}
              >
                {r.id} ({r.category.replace('_', ' ')})
              </button>
            ))}
          </div>
        ) : (
          <div className="pt-2 flex items-center space-x-3 text-xs text-slate-400">
            <span>No reports in system yet.</span>
            <button
              onClick={handleSeedDemoSample}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-lg border border-slate-700"
            >
              + Seed 1 Sample Complaint for Testing
            </button>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center text-slate-400 space-y-2">
          <Clock className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
          <p className="text-sm font-semibold">Fetching live complaint details from Ludhiana Municipal server...</p>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-950/60 border border-red-500/40 p-6 rounded-3xl text-red-200 text-sm space-y-2">
          <p><strong className="font-bold">Error:</strong> {errorMsg}</p>
          <p className="text-xs text-slate-300">Submit a complaint in the "Report an Issue" section to generate real live tracking data.</p>
        </div>
      )}

      {/* Clean Empty State if 0 reports exist */}
      {!report && !isLoading && !errorMsg && allUserReports.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-white space-y-4 shadow-xl">
          <Inbox className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-xl font-bold">No Complaints Submitted Yet</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            This tracking system uses real-time user data. As citizens submit complaints in Ludhiana, they will appear here with live tracking IDs and timeline logs.
          </p>
          <div className="pt-2 flex items-center justify-center space-x-3">
            {onNavigateToReport && (
              <button
                onClick={onNavigateToReport}
                className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center space-x-2 shadow-lg"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit First Complaint</span>
              </button>
            )}
            <button
              onClick={handleSeedDemoSample}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold px-5 py-3 rounded-xl text-xs border border-slate-700"
            >
              Seed 1 Sample Complaint
            </button>
          </div>
        </div>
      )}

      {/* Main Report Details Display */}
      {report && !isLoading && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-8 shadow-2xl">
          
          {/* Top Info Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center space-x-3">
                <span className="font-mono text-xl font-black text-amber-400">{report.id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  report.status === 'resolved'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : report.severity === 'critical'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                    : 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                }`}>
                  {report.status.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">{report.title}</h3>
              <p className="text-xs text-slate-400 flex items-center space-x-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span>{report.locationName} • {report.wardNumber}</span>
              </p>
            </div>

            {/* Share & Copy Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyShare}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition-all"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{copiedLink ? 'Link Copied!' : 'Share Tracking Link'}</span>
              </button>
            </div>
          </div>

          {/* BASIC INFORMATION METRICS */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Complaint Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Category</span>
                <span className="text-base font-extrabold text-white capitalize">{report.category.replace('_', ' ')}</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Priority Score</span>
                <span className="text-2xl font-black text-amber-400">{report.priorityScore} <span className="text-xs text-slate-500">/ 100</span></span>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Current Status</span>
                <span className="text-sm font-extrabold text-emerald-400">
                  {report.status === 'resolved'
                    ? 'Resolved'
                    : report.workStarted
                    ? 'Work Started'
                    : report.mcSeen
                    ? 'Seen by MC Ludhiana'
                    : 'Reported / Pending'}
                </span>
              </div>
            </div>

            <div className="mt-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div>
                <strong className="text-slate-400">Location:</strong>{' '}
                <span className="text-white font-medium">{report.locationName} ({report.wardNumber})</span>
              </div>
              <div>
                <strong className="text-slate-400">Description:</strong>{' '}
                <span className="text-slate-200">{report.description || 'No description provided.'}</span>
              </div>
              {report.imageUrl && (
                <div className="pt-2">
                  <span className="text-slate-400 block mb-1 font-semibold">Uploaded Complaint Image:</span>
                  <img src={report.imageUrl} alt="Complaint image" className="w-full sm:w-80 h-48 object-cover rounded-xl border border-slate-800" />
                </div>
              )}
            </div>
          </div>

          {/* MC LUDHIANA RESPONSE STATUS CHECKPOINTS */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>MC Ludhiana Response Status</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              {/* Checkpoint 1: Submitted */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/40 space-y-1">
                <div className="font-extrabold text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submitted</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {format_date(report.createdAt)}
                </div>
              </div>

              {/* Checkpoint 2: Seen by MC Ludhiana */}
              <div className={`p-4 rounded-2xl border space-y-1 ${
                report.mcSeen
                  ? 'bg-slate-950 border-blue-500/50 text-blue-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}>
                <div className="font-extrabold flex items-center space-x-1.5">
                  {report.mcSeen ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400">Seen by MC Ludhiana</span>
                    </>
                  ) : (
                    <span>⏳ Not Seen Yet</span>
                  )}
                </div>
                <div className="text-[11px] font-mono">
                  {report.mcSeen ? format_date(report.mcSeenAt) : 'MC Ludhiana has not marked as seen.'}
                </div>
              </div>

              {/* Checkpoint 3: Work Started */}
              <div className={`p-4 rounded-2xl border space-y-1 ${
                report.workStarted
                  ? 'bg-slate-950 border-amber-500/50 text-amber-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}>
                <div className="font-extrabold flex items-center space-x-1.5">
                  {report.workStarted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-400">Work Started</span>
                    </>
                  ) : (
                    <span>⏳ Work Not Started</span>
                  )}
                </div>
                <div className="text-[11px] font-mono">
                  {report.workStarted ? format_date(report.workStartedAt) : 'Field work has not started yet.'}
                </div>
              </div>

              {/* Checkpoint 4: Resolved */}
              <div className={`p-4 rounded-2xl border space-y-1 ${
                report.status === 'resolved'
                  ? 'bg-slate-950 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}>
                <div className="font-extrabold flex items-center space-x-1.5">
                  {report.status === 'resolved' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Resolved</span>
                    </>
                  ) : (
                    <span>⏳ Not Resolved</span>
                  )}
                </div>
                <div className="text-[11px] font-mono">
                  {report.status === 'resolved' ? format_date(report.resolvedAt) : 'Pending resolution'}
                </div>
              </div>
            </div>
          </div>

          {/* OVERALL PROGRESS BAR */}
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider">Overall Resolution Progress</span>
              <span className="font-bold text-amber-400 font-mono">
                {report.status === 'resolved'
                  ? '100%'
                  : report.workStarted
                  ? '66%'
                  : report.mcSeen
                  ? '33%'
                  : '10%'}
              </span>
            </div>

            {/* Progress Bar Track */}
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  report.status === 'resolved'
                    ? 'bg-emerald-500'
                    : report.workStarted
                    ? 'bg-amber-500'
                    : report.mcSeen
                    ? 'bg-blue-500'
                    : 'bg-slate-600'
                }`}
                style={{
                  width:
                    report.status === 'resolved'
                      ? '100%'
                      : report.workStarted
                      ? '66%'
                      : report.mcSeen
                      ? '33%'
                      : '10%',
                }}
              />
            </div>

            {/* Status explanation note */}
            <div className="text-xs p-3 rounded-xl border">
              {report.status === 'resolved' ? (
                <div className="text-emerald-400 bg-emerald-950/40 border-emerald-500/30 p-2.5 rounded-lg font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>This complaint has been resolved by MC Ludhiana.</span>
                </div>
              ) : report.workStarted ? (
                <div className="text-amber-300 bg-amber-950/40 border-amber-500/30 p-2.5 rounded-lg font-semibold flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>MC Ludhiana has started work at this location.</span>
                </div>
              ) : report.mcSeen ? (
                <div className="text-blue-300 bg-blue-950/40 border-blue-500/30 p-2.5 rounded-lg font-semibold flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>MC Ludhiana has seen the complaint. Field work is still pending.</span>
                </div>
              ) : (
                <div className="text-orange-300 bg-orange-950/40 border-orange-500/30 p-2.5 rounded-lg font-semibold flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>The complaint has been submitted but has not yet been marked as seen by MC Ludhiana.</span>
                </div>
              )}
            </div>
          </div>

          {/* STATUS TIMELINE */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Status Timeline</h4>

            {report.timeline && report.timeline.length > 0 ? (
              <div className="space-y-3">
                {report.timeline.map((update) => (
                  <div
                    key={update.id}
                    className="border-l-4 border-blue-500 bg-slate-950 p-4 rounded-xl space-y-1 border-t border-r border-b border-slate-800"
                  >
                    <div className="flex items-center justify-between">
                      <b className="text-sm text-white capitalize">{update.status.replace('_', ' ')}</b>
                      <span className="text-[11px] text-amber-300 font-mono">{format_date(update.timestamp)}</span>
                    </div>
                    <p className="text-xs text-slate-300">{update.comment}</p>
                    <div className="text-[10px] text-slate-500 font-semibold pt-1">
                      Updated by: <span className="text-slate-400">{update.actor || 'MC Ludhiana'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No additional status updates are available yet.</p>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
