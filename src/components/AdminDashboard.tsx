import React, { useState } from 'react';
import {
  Activity,
  AlertOctagon,
  Users,
  CheckCircle2,
  Clock,
  Layers,
  Filter,
  UserCheck,
  TrendingUp,
  BarChart2,
  ShieldAlert,
  ArrowUpRight,
  Upload,
  Zap,
  Inbox,
  PlusCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Report, ReportStatus, CivicStats } from '../types';
import { SAMPLE_CIVIC_IMAGES } from '../data/initialData';

interface AdminDashboardProps {
  reports: Report[];
  stats: CivicStats;
  onUpdateStatus: (
    id: string,
    status: ReportStatus,
    comment: string,
    officerName?: string,
    teamName?: string,
    resolutionImageUrl?: string
  ) => void;
  onSelectReport: (id: string) => void;
  onNavigateToReport: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  reports,
  stats,
  onUpdateStatus,
  onSelectReport,
  onNavigateToReport,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  const [selectedTab, setSelectedTab] = useState<'queue' | 'clusters' | 'analytics'>('queue');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal State for Status Update / Officer Assignment
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [newStatus, setNewStatus] = useState<ReportStatus>('assigned');
  const [officerName, setOfficerName] = useState<string>('Er. Rajesh Kumar');
  const [teamName, setTeamName] = useState<string>('Rapid Response Team Alpha');
  const [commentText, setCommentText] = useState<string>('Dispatched team to site for immediate resolution.');
  const [resolutionPhoto, setResolutionPhoto] = useState<string>(SAMPLE_CIVIC_IMAGES.resolution_sample);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === 'admin123' || passwordInput.trim() === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid Admin Password. (Demo Password: admin123)');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Municipal Officer Command Portal</h2>
          <p className="text-xs text-slate-400">
            Restricted access for Ludhiana Municipal Corporation command staff and department dispatch officers.
          </p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Enter Admin Password</label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter password (e.g. admin123)"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
            {authError && <p className="text-red-400 text-xs mt-1.5 font-semibold">{authError}</p>}
            <p className="text-[11px] text-slate-500 mt-2">
              💡 Demo credentials for hackathon: Password is <strong className="text-amber-300">admin123</strong>
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-2xl text-sm shadow-lg shadow-blue-600/20 transition-all"
          >
            Authenticate & Access Command Center
          </button>
        </form>
      </div>
    );
  }

  // Filtered reports sorted by Priority Score (100 to 0)
  const filteredReports = reports
    .filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
      return true;
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);

  // Category counts for Recharts Pie/Bar Chart based on live reports
  const categoryChartData = [
    { name: 'Waterlogging', count: reports.filter((r) => r.category === 'waterlogging').length },
    { name: 'Open Manhole', count: reports.filter((r) => r.category === 'open_manhole').length },
    { name: 'Pothole', count: reports.filter((r) => r.category === 'pothole').length },
    { name: 'Garbage Dump', count: reports.filter((r) => r.category === 'garbage').length },
    { name: 'Sewage Overflow', count: reports.filter((r) => r.category === 'sewage').length },
  ];

  const handleSeedDemoSample = async () => {
    try {
      await fetch('/api/demo/trigger-hackathon-scenario', { method: 'POST' });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReport) {
      onUpdateStatus(
        editingReport.id,
        newStatus,
        commentText,
        officerName,
        teamName,
        newStatus === 'resolved' ? resolutionPhoto : undefined
      );
      setEditingReport(null);
    }
  };

  const handleCheckpointAction = async (reportId: string, checkpoint: 'seen' | 'started' | 'resolved') => {
    try {
      let defaultComment = 'Status updated by MC Ludhiana.';
      if (checkpoint === 'seen') defaultComment = 'Marked as Seen by MC Ludhiana Control Room.';
      if (checkpoint === 'started') defaultComment = 'Work Started: Municipal repair crew deployed to site.';
      if (checkpoint === 'resolved') defaultComment = 'Complaint Resolved: Work completed successfully.';

      const res = await fetch(`/api/reports/${reportId}/checkpoint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkpoint,
          comment: commentText || defaultComment,
          updatedBy: officerName || 'MC Ludhiana Officer',
        }),
      });
      if (res.ok) {
        // Trigger status update callback to refresh parent state
        onUpdateStatus(
          reportId,
          checkpoint === 'resolved' ? 'resolved' : checkpoint === 'started' ? 'in_progress' : 'assigned',
          commentText || defaultComment,
          officerName,
          teamName
        );
        setEditingReport(null);
      }
    } catch (err) {
      console.error('Failed to post checkpoint update:', err);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Dashboard Top Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white space-y-4 relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              <span>Ludhiana Municipal Corp Control Room</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">Authority Command Dashboard</h2>
            <p className="text-slate-300 text-sm">
              Live municipal command portal. Real citizen complaints submitted across Ludhiana appear here prioritized automatically.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedTab('queue')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
                selectedTab === 'queue' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Priority Queue ({reports.length})
            </button>
            <button
              onClick={() => setSelectedTab('clusters')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
                selectedTab === 'clusters' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Duplicate Clusters
            </button>
            <button
              onClick={() => setSelectedTab('analytics')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
                selectedTab === 'analytics' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Analytics & Impact
            </button>
          </div>
        </div>

        {/* KPI Summary Row - Real Live Data */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Live User Complaints</span>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">{stats.totalReports}</div>
            <span className="text-[10px] text-slate-500">Live count in system</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Critical Hazards Active</span>
            <div className="text-2xl sm:text-3xl font-black text-red-400 mt-1 flex items-center space-x-2">
              <span>{stats.criticalIncidents}</span>
              {stats.criticalIncidents > 0 && <AlertOctagon className="w-5 h-5 text-red-400 animate-pulse" />}
            </div>
            <span className="text-[10px] text-red-400/80 font-semibold">Requires &lt;2hr response</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Issues Resolved</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{stats.resolvedThisWeek}</div>
            <span className="text-[10px] text-emerald-400/80">With verified site proof</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Avg Response Time</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">{stats.avgResponseHours > 0 ? `${stats.avgResponseHours} hrs` : 'N/A'}</div>
            <span className="text-[10px] text-slate-500">Calculated from closed tasks</span>
          </div>
        </div>
      </div>

      {/* VIEW TAB 1: PRIORITY QUEUE TABLE */}
      {selectedTab === 'queue' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-6 shadow-2xl">
          
          {/* Table Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-extrabold text-lg">Smart Priority Dispatch Queue</h3>
              <p className="text-xs text-slate-400">Complaints submitted by citizens appear here in real-time ranked by priority score.</p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold"
              >
                <option value="all">All Categories</option>
                <option value="open_manhole">Open Manhole</option>
                <option value="waterlogging">Waterlogging</option>
                <option value="pothole">Potholes</option>
                <option value="garbage">Garbage Dumps</option>
                <option value="sewage">Sewage Overflow</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold"
              >
                <option value="all">All Statuses</option>
                <option value="reported">Reported</option>
                <option value="verified">Verified</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Table or Clean Empty State */}
          {filteredReports.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <Inbox className="w-12 h-12 text-slate-500 mx-auto" />
              <h4 className="text-lg font-bold text-white">No Citizen Complaints in Queue</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                As users report issues in Ludhiana, they will appear here live with priority scores, duplicate clustering, and team dispatch controls.
              </p>
              <div className="flex justify-center space-x-3 pt-2">
                <button
                  onClick={onNavigateToReport}
                  className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Report an Issue</span>
                </button>
                <button
                  onClick={handleSeedDemoSample}
                  className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold px-5 py-2.5 rounded-xl text-xs border border-slate-700"
                >
                  Seed 1 Sample Complaint
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Tracking ID & Title</th>
                    <th className="p-3">Location & Ward</th>
                    <th className="p-3">Grouped</th>
                    <th className="p-3">Affected Est.</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Dispatch Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 font-mono">
                        <div className={`w-12 py-1 text-center rounded-xl font-black text-sm ${
                          report.priorityScore >= 90
                            ? 'bg-red-500 text-white shadow-md shadow-red-500/20 animate-pulse'
                            : report.priorityScore >= 75
                            ? 'bg-orange-500 text-white'
                            : 'bg-yellow-500 text-slate-950'
                        }`}>
                          {report.priorityScore}
                        </div>
                      </td>

                      <td className="p-3 space-y-0.5">
                        <div className="font-mono font-bold text-amber-400 flex items-center space-x-1.5">
                          <button onClick={() => onSelectReport(report.id)} className="hover:underline">
                            {report.id}
                          </button>
                          {report.severity === 'critical' && <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 rounded">CRITICAL</span>}
                        </div>
                        <div className="font-semibold text-white line-clamp-1">{report.title}</div>
                      </td>

                      <td className="p-3">
                        <div className="font-medium text-slate-200 line-clamp-1">{report.locationName}</div>
                        <div className="text-[10px] text-slate-400">{report.wardNumber}</div>
                      </td>

                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-amber-300 font-bold">
                          {report.duplicateCount} Reports
                        </span>
                      </td>

                      <td className="p-3 font-semibold text-white">
                        ~{report.affectedPopulationEst}
                      </td>

                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          report.status === 'resolved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : report.status === 'in_progress'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                        }`}>
                          {report.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setEditingReport(report);
                            setNewStatus(report.status);
                          }}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-all shadow-md shadow-blue-600/20"
                        >
                          Update / Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW TAB 2: DUPLICATE CLUSTERS VIEW */}
      {selectedTab === 'clusters' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="font-extrabold text-lg">Grouped Incident Clusters</h3>
            <p className="text-xs text-slate-400">NagarRakshak automatically groups duplicate citizen complaints within 350 meters.</p>
          </div>

          {reports.filter((r) => r.isDuplicate || r.clusterId).length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No duplicate clusters detected yet. When multiple citizens report issues near the same location, they will automatically be grouped here.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.filter((r) => r.isDuplicate || r.clusterId).map((clustered) => (
                <div key={clustered.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                      Cluster ID: #{clustered.clusterId || 'CLUSTER-LDH-01'}
                    </span>
                    <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-lg">
                      {clustered.duplicateCount} Reports Merged
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm">{clustered.title}</h4>
                  <p className="text-xs text-slate-400">{clustered.locationName} ({clustered.wardNumber})</p>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-400">Elevated Priority: <strong className="text-amber-300">{clustered.priorityScore}/100</strong></span>
                    <button
                      onClick={() => onSelectReport(clustered.id)}
                      className="text-blue-400 hover:text-blue-300 font-bold flex items-center space-x-1"
                    >
                      <span>Inspect Cluster Lifecycle</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW TAB 3: ANALYTICS & IMPACT CHARTS */}
      {selectedTab === 'analytics' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-8 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="font-extrabold text-lg">Live Analytics</h3>
            <p className="text-xs text-slate-400">Distribution of civic complaints reported by citizens in Ludhiana.</p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Live User Complaints by Category</h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px' }} />
                  <Bar dataKey="count" fill="#f97316" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* STATUS UPDATE & OFFICER DISPATCH MODAL */}
      {editingReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white space-y-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-amber-400">Update Incident #{editingReport.id}</span>
                <h3 className="font-bold text-white text-base">{editingReport.title}</h3>
              </div>
              <button onClick={() => setEditingReport(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="verified">Verified</option>
                  <option value="assigned">Assigned to Wing</option>
                  <option value="in_progress">In Progress (Team on site)</option>
                  <option value="resolved">Resolved & Closed (With Site Proof)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Officer In-Charge</label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Response Unit Team Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Official Dispatch Log Note</label>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              {newStatus === 'resolved' && (
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Resolution Site Inspection Photo Proof</label>
                  <input
                    type="text"
                    value={resolutionPhoto}
                    onChange={(e) => setResolutionPhoto(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs font-mono"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">URL of site photograph confirming resolution</p>
                </div>
              )}

              {/* Quick MC Ludhiana Checkpoint Actions */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase block">1-Click MC Ludhiana Checkpoint Updates</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCheckpointAction(editingReport.id, 'seen')}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-2 rounded-xl text-[11px] shadow-md transition-all"
                  >
                    1. Mark as Seen
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCheckpointAction(editingReport.id, 'started')}
                    className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-2 rounded-xl text-[11px] shadow-md transition-all"
                  >
                    2. Mark Work Started
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCheckpointAction(editingReport.id, 'resolved')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-2 rounded-xl text-[11px] shadow-md transition-all"
                  >
                    3. Mark Resolved
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingReport(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/20"
                >
                  Save Dispatch & Notify Citizen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
