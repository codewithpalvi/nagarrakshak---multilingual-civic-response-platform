import React from 'react';
import {
  ShieldAlert,
  ArrowRight,
  Search,
  MapPin,
  CheckCircle2,
  Users,
  Zap,
  TrendingUp,
  AlertOctagon,
  Clock,
  Sparkles,
  Layers,
  Check,
} from 'lucide-react';
import { LanguageCode, CivicStats } from '../types';
import { translations } from '../data/translations';

interface LandingHeroProps {
  currentLang: LanguageCode;
  setActiveTab: (tab: 'landing' | 'report' | 'track' | 'map' | 'admin') => void;
  onTriggerDemo: () => void;
  stats: CivicStats;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  currentLang,
  setActiveTab,
  onTriggerDemo,
  stats,
}) => {
  const t = translations[currentLang];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-slate-900 border-b border-slate-800 pt-12 pb-16 px-4 sm:px-6 lg:px-8 text-white rounded-3xl mt-4 shadow-2xl">
        {/* Background Decorative Gradients */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-800/90 border border-slate-700 text-amber-300 text-xs sm:text-sm font-semibold shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{t.heroBadge}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {t.heroHeadline1}{' '}
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
              {t.heroHeadline2}
            </span>
          </h1>

          {/* One-Line Pitch */}
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 font-medium leading-relaxed">
            “{t.heroPitch}”
          </p>

          <p className="max-w-2xl mx-auto text-sm text-slate-400">
            {t.poweredBy}
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('report')}
              className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white font-bold px-8 py-4 rounded-2xl text-base shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 transition-all flex items-center space-x-2"
            >
              <ShieldAlert className="w-5 h-5 text-white" />
              <span>{t.reportIssue}</span>
              <ArrowRight className="w-5 h-5 text-amber-200" />
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold px-6 py-4 rounded-2xl text-base transition-all flex items-center space-x-2"
            >
              <Search className="w-5 h-5 text-amber-400" />
              <span>{t.trackComplaint}</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold px-6 py-4 rounded-2xl text-base transition-all flex items-center space-x-2"
            >
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span>{t.navHotspotMap}</span>
            </button>
          </div>

          {/* Impact Stats Row */}
          <div className="pt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{t.reportsSubmitted}</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-2">{stats.totalReports}</div>
              <p className="text-xs text-slate-400 mt-1">{t.statsAcrossWards}</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{t.criticalHazards}</span>
                <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-red-400 mt-2">{stats.criticalIncidents}</div>
              <p className="text-xs text-slate-400 mt-1">{t.statsImmediatePriority}</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{t.issuesResolved}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">{stats.resolvedThisWeek}</div>
              <p className="text-xs text-slate-400 mt-1">{t.statsVerifiedWithPhotos}</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{t.statsFromReportToDispatch}</span>
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-blue-400 mt-2">{stats.avgResponseHours} hrs</div>
              <p className="text-xs text-slate-400 mt-1">{t.statsFromReportToDispatch}</p>
            </div>
          </div>

        </div>
      </section>

      {/* Memorable Live Hackathon Demo Story Scenario Banner */}
      <section className="bg-gradient-to-r from-amber-950/60 via-orange-950/40 to-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
              <Zap className="w-3.5 h-3.5 fill-current text-yellow-300" />
              <span>{t.hackathonBadge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t.demoHeading}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {t.demoDescription.split('NagarRakshak').map((part, idx) => idx === 1 ? <><strong key={idx} className="text-amber-300">NagarRakshak</strong>{part}</> : <span key={idx}>{part}</span>)}
            </p>
          </div>

          <div className="w-full lg:w-auto flex-shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onTriggerDemo}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-sm shadow-xl shadow-amber-500/20 hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4 fill-current text-slate-950" />
              <span>{t.launchDemoButton}</span>
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold px-5 py-3.5 rounded-2xl text-sm border border-slate-700 flex items-center justify-center space-x-2"
            >
              <span>{t.trackDemoIdLabel}</span>
            </button>
          </div>
        </div>

        {/* Demo Steps Visualization */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-slate-300">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <div className="font-bold text-amber-400 flex items-center space-x-1">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[11px] font-bold mr-1">1</span>
              <span>{t.demoSteps1}</span>
            </div>
            <p className="text-slate-400">{t.demoStep1Desc}</p>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <div className="font-bold text-orange-400 flex items-center space-x-1">
              <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-[11px] font-bold mr-1">2</span>
              <span>{t.demoSteps2}</span>
            </div>
            <p className="text-slate-400">{t.demoStep2Desc}</p>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <div className="font-bold text-red-400 flex items-center space-x-1">
              <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-[11px] font-bold mr-1">3</span>
              <span>{t.demoSteps3}</span>
            </div>
            <p className="text-slate-400">{t.demoStep3Desc}</p>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <div className="font-bold text-emerald-400 flex items-center space-x-1">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-bold mr-1">4</span>
              <span>{t.demoSteps4}</span>
            </div>
            <p className="text-slate-400">{t.demoStep4Desc}</p>
          </div>
        </div>
      </section>

      {/* Smart Priority Score Explanation Section */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Our Key Innovation: The <span className="text-orange-400">Smart Priority Score Engine</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Instead of treating all citizen complaints as equal, NagarRakshak ranks incidents based on public risk and hazard severity:
          </p>
        </div>

        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center font-mono text-sm sm:text-lg text-amber-300 font-bold overflow-x-auto shadow-inner">
          <span className="text-orange-400">{t.priorityScore}</span> = <span className="text-red-400">{t.severityLabelShort}</span> + <span className="text-yellow-400">{t.publicRiskLabelShort}</span> + <span className="text-blue-400">{t.duplicateBoostLabelShort}</span> + <span className="text-emerald-400">{t.locationSensitivityLabelShort}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-red-400 font-bold text-sm flex items-center space-x-2">
              <AlertOctagon className="w-4 h-4" />
              <span>{t.severityLabelShort}</span>
            </div>
            <p className="text-xs text-slate-300">{t.severityExplainer}</p>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-yellow-400 font-bold text-sm flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>{t.publicRiskLabelShort}</span>
            </div>
            <p className="text-xs text-slate-300">{t.publicRiskExplainer}</p>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-blue-400 font-bold text-sm flex items-center space-x-2">
              <Layers className="w-4 h-4" />
              <span>{t.duplicateBoostLabelShort}</span>
            </div>
            <p className="text-xs text-slate-300">{t.duplicateBoostExplainer}</p>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-emerald-400 font-bold text-sm flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{t.locationSensitivityLabelShort}</span>
            </div>
            <p className="text-xs text-slate-300">{t.locationSensitivityExplainer}</p>
          </div>
        </div>
      </section>

      {/* Monitored Ludhiana Zones Ticker */}
      <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <span className="font-semibold text-slate-300">📍 Monitored Ludhiana Municipal Hotspots:</span>
        <div className="flex flex-wrap gap-2">
          {['Sarabha Nagar (Zone D)', 'Clock Tower (Zone A)', 'BRS Nagar', 'Transport Nagar', 'Samrala Chowk', 'Haibowal Buddha Nullah', 'Model Town', 'Dholewal Chowk', 'Gill Road ITI'].map((zone, idx) => (
            <span key={idx} className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/60 text-slate-300">
              {zone}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};
