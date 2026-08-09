import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Filter,
  AlertTriangle,
  Zap,
  TrendingUp,
  Droplet,
  Layers,
  ArrowRight,
  ShieldAlert,
  Search,
  PlusCircle,
} from 'lucide-react';
import { LanguageCode, Report, CivicIssueCategory } from '../types';
import { translations } from '../data/translations';

interface HotspotMapViewProps {
  currentLang: LanguageCode;
  onSelectReport: (reportId: string) => void;
  onNavigateToReport: () => void;
}

export const HotspotMapView: React.FC<HotspotMapViewProps> = ({
  currentLang,
  onSelectReport,
  onNavigateToReport,
}) => {
  const t = translations[currentLang];

  const [reports, setReports] = useState<Report[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchLiveMapReports();
  }, [categoryFilter]);

  const fetchLiveMapReports = async () => {
    setIsLoading(true);
    try {
      let url = '/api/reports';
      if (categoryFilter !== 'all') {
        url += `?category=${categoryFilter}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data: Report[] = await res.json();
        setReports(data);
        if (data.length > 0 && !selectedReportId) {
          setSelectedReportId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching map reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedDemoSample = async () => {
    try {
      const res = await fetch('/api/demo/trigger-hackathon-scenario', { method: 'POST' });
      if (res.ok) {
        fetchLiveMapReports();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      r.id.toLowerCase().includes(query) ||
      r.title.toLowerCase().includes(query) ||
      r.locationName.toLowerCase().includes(query) ||
      r.wardNumber.toLowerCase().includes(query)
    );
  });

  const activeReport = filteredReports.find((r) => r.id === selectedReportId) || filteredReports[0];

  const criticalCount = filteredReports.filter((r) => r.severity === 'critical' && r.status !== 'resolved').length;
  const highCount = filteredReports.filter((r) => r.severity === 'high' && r.status !== 'resolved').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white space-y-3 relative overflow-hidden shadow-xl">
        <div className="flex items-center space-x-2 text-orange-400 font-bold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Real-Time Spatial Hotspot GIS Map</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">Ludhiana Hotspot Map</h2>
            <p className="text-slate-300 text-sm mt-1">
              Live GIS spatial view powered purely by actual citizen-submitted reports across Ludhiana.
            </p>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center space-x-3 text-xs">
            <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl">
              <span className="text-slate-400 block">Total Active Reports</span>
              <span className="text-base font-black text-white">{reports.length}</span>
            </div>
            <div className="bg-red-950/60 border border-red-500/40 px-3 py-2 rounded-xl">
              <span className="text-red-300 block">Critical Hazards</span>
              <span className="text-base font-black text-red-400">{criticalCount}</span>
            </div>
          </div>
        </div>

        {/* Category Filters & Tracking Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 mr-2 flex items-center">
              <Filter className="w-3 h-3 mr-1" /> Category:
            </span>
            {['all', 'waterlogging', 'open_manhole', 'pothole', 'garbage', 'sewage'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  categoryFilter === cat
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {cat === 'all' ? 'All Issues' : cat.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          {/* Location & Tracking ID Search */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search location or ID (NR-LDH-2048)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-full sm:w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Map & Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Simulated GIS Map Canvas */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-3xl p-6 relative min-h-[460px] flex flex-col justify-between overflow-hidden shadow-2xl">
          
          {/* Map Grid Background Styling */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Map Title overlay */}
          <div className="relative z-10 flex items-center justify-between bg-slate-900/90 backdrop-blur-md p-3.5 px-4 rounded-2xl border border-slate-800 text-xs text-white">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span className="font-bold">Ludhiana Municipal GIS Grid (Latitude: 30.8900° N, Longitude: 75.8300° E)</span>
            </div>
            <span className="text-[10px] text-amber-300 font-mono">Live Spatial Data</span>
          </div>

          {/* Interactive Hotspot Pins Layer */}
          <div className="relative z-10 my-8 min-h-[280px] flex items-center justify-center">
            {filteredReports.length === 0 ? (
              <div className="text-center p-8 bg-slate-900/80 border border-slate-800 rounded-3xl max-w-md text-white space-y-3">
                <ShieldAlert className="w-10 h-10 text-orange-400 mx-auto" />
                <h4 className="text-lg font-bold">No Matching Complaints Found</h4>
                <p className="text-xs text-slate-400">
                  No issues matched your search query or filter. Try clearing the filter or reporting a new issue!
                </p>
                <div className="flex justify-center space-x-2 pt-2">
                  <button
                    onClick={onNavigateToReport}
                    className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Report an Issue</span>
                  </button>
                  <button
                    onClick={handleSeedDemoSample}
                    className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold px-4 py-2 rounded-xl text-xs border border-slate-700"
                  >
                    Seed 1 Sample
                  </button>
                </div>
              </div>
            ) : (
              /* Plot pins dynamically based on coordinates */
              <div className="relative w-full h-80 bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden">
                {filteredReports.map((r, index) => {
                  // Normalize coordinates to percentage within Ludhiana bounding box
                  // Ludhiana bounds: Lat 30.85 to 30.94, Lng 75.78 to 75.90
                  const lat = r.latitude || 30.89;
                  const lng = r.longitude || 75.83;

                  const topPercent = Math.max(12, Math.min(85, 100 - ((lat - 30.85) / 0.09) * 100));
                  const leftPercent = Math.max(12, Math.min(85, ((lng - 75.78) / 0.12) * 100));

                  const isSelected = r.id === selectedReportId;
                  const isCritical = r.severity === 'critical';

                  // Color coding according to MC Status:
                  // Red = Reported / Not Seen
                  // Blue = Seen by MC Ludhiana
                  // Orange = Work Started
                  // Green = Resolved
                  let pinBg = 'bg-red-500 border-red-300 text-white';
                  let statusLabel = 'Reported / Not Seen';

                  if (r.status === 'resolved') {
                    pinBg = 'bg-emerald-500 border-emerald-300 text-white';
                    statusLabel = 'Resolved';
                  } else if (r.workStarted) {
                    pinBg = 'bg-amber-500 border-amber-300 text-white';
                    statusLabel = 'Work Started';
                  } else if (r.mcSeen) {
                    pinBg = 'bg-blue-500 border-blue-300 text-white';
                    statusLabel = 'Seen by MC Ludhiana';
                  }

                  return (
                    <button
                      key={r.id}
                      onClick={() => setSelectedReportId(r.id)}
                      style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all group ${
                        isSelected ? 'z-30 scale-125' : 'z-20 hover:scale-110'
                      }`}
                    >
                      <div className="relative">
                        {isCritical && (
                          <span className="absolute -inset-2 rounded-full bg-red-500/40 animate-ping" />
                        )}
                        <div
                          className={`p-2.5 rounded-full shadow-xl border flex items-center justify-center ${pinBg} ${
                            isSelected ? 'ring-4 ring-amber-400/60 scale-110' : ''
                          }`}
                        >
                          <MapPin className="w-4 h-4" />
                        </div>

                        {/* Tooltip on hover */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-slate-950 border border-slate-700 text-white text-[11px] p-2.5 rounded-xl whitespace-nowrap shadow-xl z-40">
                          <p className="font-bold">{r.title}</p>
                          <p className="text-[10px] text-amber-300">ID: {r.id} • Status: {statusLabel}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Map Legend Footer */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 text-xs text-slate-300">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                <span className="text-red-400 font-bold">Reported (Not Seen)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                <span className="text-blue-400 font-bold">Seen by MC</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span className="text-amber-400 font-bold">Work Started</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span className="text-emerald-400 font-bold">Resolved</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-500">Ludhiana Municipal GPS Grid</span>
          </div>

        </div>

        {/* Right Column: Selected Hotspot Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-6 shadow-xl flex flex-col justify-between">
          {activeReport ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Active Incident Focus</span>
                  <h3 className="text-lg font-black text-white">{activeReport.title}</h3>
                </div>
                <span className="font-mono text-sm font-bold text-slate-400">{activeReport.id}</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400">Location & Ward:</span>
                  <p className="text-white font-bold">{activeReport.locationName}</p>
                  <p className="text-amber-300 font-medium">{activeReport.wardNumber}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Priority Score</span>
                    <span className="text-2xl font-black text-amber-400">{activeReport.priorityScore}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Reports Grouped</span>
                    <span className="text-2xl font-black text-white">{activeReport.duplicateCount}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400">AI Official Summary:</span>
                  <p className="text-slate-200 italic">"{activeReport.aiAnalysis.summaryOfficial}"</p>
                </div>
              </div>

              <button
                onClick={() => onSelectReport(activeReport.id)}
                className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/20"
              >
                <span>Track Detailed Complaint Lifecycle</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Select a pin on the map to view detailed incident telemetry.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
