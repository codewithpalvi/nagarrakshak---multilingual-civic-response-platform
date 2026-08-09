import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { ReportSubmissionForm } from './components/ReportSubmissionForm';
import { ComplaintTracker } from './components/ComplaintTracker';
import { HotspotMapView } from './components/HotspotMapView';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthScreen, UserSession } from './components/AuthScreen';
import { LanguageCode, Report, ReportStatus, CivicStats } from './types';
import { INITIAL_REPORTS } from './data/initialData';

export default function App() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [activeTab, setActiveTab] = useState<'landing' | 'report' | 'track' | 'map' | 'admin'>('landing');
  const [selectedTrackingId, setSelectedTrackingId] = useState<string>('');

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('nagar_rakshak_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Reports and Stats State
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [stats, setStats] = useState<CivicStats>({
    totalReports: 0,
    criticalIncidents: 0,
    inProgress: 0,
    resolvedThisWeek: 0,
    avgResponseHours: 0,
    totalAffectedPeople: 0,
  });

  // Fetch live data from server on load
  useEffect(() => {
    fetchReports();
    fetchStats();
  }, []);

  const handleLoginSuccess = (user: UserSession) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('nagar_rakshak_user');
    setCurrentUser(null);
  };

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (err) {
      console.error('Error fetching reports from server:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching stats from server:', err);
    }
  };

  // Handle New Report Created
  const handleReportCreated = (newReport: Report) => {
    setReports((prev) => [newReport, ...prev]);
    setSelectedTrackingId(newReport.id);
    fetchStats();
  };

  // Handle Select Report to Track
  const handleSelectReportToTrack = (id: string) => {
    setSelectedTrackingId(id);
    setActiveTab('track');
  };

  // Handle Admin Status Update
  const handleUpdateStatus = async (
    id: string,
    status: ReportStatus,
    comment: string,
    officerName?: string,
    teamName?: string,
    resolutionImageUrl?: string
  ) => {
    try {
      const res = await fetch(`/api/reports/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          comment,
          officerName,
          teamName,
          resolutionImageUrl,
        }),
      });

      if (res.ok) {
        await fetchReports();
        await fetchStats();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Trigger Memorable Live Hackathon Demo Scenario
  const handleTriggerDemoScenario = async () => {
    try {
      const res = await fetch('/api/demo/trigger-hackathon-scenario', {
        method: 'POST',
      });
      if (res.ok) {
        await fetchReports();
        await fetchStats();
        setSelectedTrackingId('NR-LDH-2048');
        setActiveTab('track');
      }
    } catch (err) {
      console.error('Error triggering demo scenario:', err);
      setSelectedTrackingId('NR-LDH-2048');
      setActiveTab('track');
    }
  };

  const criticalCount = reports.filter((r) => r.severity === 'critical' && r.status !== 'resolved').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-orange-500 selection:text-white">
      {/* Top Fixed Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onTriggerDemo={handleTriggerDemoScenario}
        criticalCount={criticalCount}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'landing' && (
          <LandingHero
            currentLang={currentLang}
            setActiveTab={setActiveTab}
            onTriggerDemo={handleTriggerDemoScenario}
            stats={stats}
          />
        )}

        {activeTab === 'report' && (
          <ReportSubmissionForm
            currentLang={currentLang}
            onReportCreated={handleReportCreated}
            onTrackReport={handleSelectReportToTrack}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'track' && (
          <ComplaintTracker
            currentLang={currentLang}
            initialTrackingId={selectedTrackingId}
            onNavigateToReport={() => setActiveTab('report')}
          />
        )}

        {activeTab === 'map' && (
          <HotspotMapView
            currentLang={currentLang}
            onSelectReport={handleSelectReportToTrack}
            onNavigateToReport={() => setActiveTab('report')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            reports={reports}
            stats={stats}
            onUpdateStatus={handleUpdateStatus}
            onSelectReport={handleSelectReportToTrack}
            onNavigateToReport={() => setActiveTab('report')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-slate-900 border-t border-slate-800 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-300">
            NagarRakshak • Multilingual Civic Priority Engine for Ludhiana Municipal Corporation
          </p>
          <p className="text-slate-500">
            Monitored Hotspots: Sarabha Nagar • Clock Tower • BRS Nagar • Transport Nagar • Samrala Chowk • Haibowal Buddha Nullah • Model Town
          </p>
        </div>
      </footer>
    </div>
  );
}
