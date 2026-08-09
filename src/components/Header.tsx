import React from 'react';
import { Shield, MapPin, AlertTriangle, Search, Activity, Zap, Globe, FileText, UserCheck, LogOut } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../data/translations';
import { UserSession } from './AuthScreen';

interface HeaderProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  activeTab: 'landing' | 'report' | 'track' | 'map' | 'admin';
  setActiveTab: (tab: 'landing' | 'report' | 'track' | 'map' | 'admin') => void;
  onTriggerDemo: () => void;
  criticalCount: number;
  currentUser?: UserSession | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  activeTab,
  setActiveTab,
  onTriggerDemo,
  criticalCount,
  currentUser,
  onLogout,
}) => {
  const t = translations[currentLang];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & City Title */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('landing')}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-orange-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-orange-400 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
                  {t.appName}
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/30 rounded-full">
                  Ludhiana MC
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.headerSubtitleSmall}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                activeTab === 'landing'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {t.navOverview}
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all flex items-center space-x-1.5 ${
                activeTab === 'report'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FileText className="w-4 h-4 text-orange-300" />
              <span>{t.reportIssue}</span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all flex items-center space-x-1.5 ${
                activeTab === 'track'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Search className="w-4 h-4 text-amber-300" />
              <span>{t.trackComplaint}</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all flex items-center space-x-1.5 ${
                activeTab === 'map'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{t.navHotspotMap}</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all flex items-center space-x-1.5 ${
                activeTab === 'admin'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Activity className="w-4 h-4 text-blue-300" />
              <span>{t.adminDashboard}</span>
              {criticalCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-extrabold bg-red-500 text-white rounded-full animate-pulse">
                  {criticalCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Actions: User Profile, Language Selector & Hackathon Demo Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Authenticated User Badge & Logout */}
            {currentUser && (
              <div className="hidden xl:flex items-center space-x-2 bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <p className="font-bold text-white leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono leading-none">{currentUser.phone || currentUser.email}</p>
                </div>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    title="Sign Out"
                    className="ml-1 text-slate-400 hover:text-red-400 p-1 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1">
              <Globe className="w-4 h-4 text-slate-400 ml-1.5 mr-1 hidden sm:block" />
              {(['en', 'pb', 'hi'] as LanguageCode[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all ${
                    currentLang === lang
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'pb' ? 'ਪੰਜਾਬੀ' : 'हिंदी'}
                </button>
              ))}
            </div>

            {/* Sign Out for smaller screens if logged in */}
            {currentUser && onLogout && (
              <button
                onClick={onLogout}
                className="xl:hidden bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 p-2 rounded-xl border border-slate-700 text-xs transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            {/* Hackathon Live Demo Button */}
            <button
              onClick={onTriggerDemo}
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white hover:from-amber-400 hover:to-red-400 font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all flex items-center space-x-1.5 ring-2 ring-amber-400/30 animate-pulse"
              title="Click to run the live hackathon demo scenario story"
            >
              <Zap className="w-4 h-4 fill-current text-yellow-200" />
              <span className="hidden lg:inline">{t.hackathonBadge}</span>
              <span className="lg:hidden">{t.launchDemoButton}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-slate-950/80 border-t border-slate-800 py-2.5 px-2">
        <button
          onClick={() => setActiveTab('landing')}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg ${
            activeTab === 'landing' ? 'bg-orange-500/20 text-orange-400 font-bold' : 'text-slate-400'
          }`}
        >
          {t.navHome}
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg ${
            activeTab === 'report' ? 'bg-orange-500/20 text-orange-400 font-bold' : 'text-slate-400'
          }`}
        >
          {t.navReportShort}
        </button>
        <button
          onClick={() => setActiveTab('track')}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg ${
            activeTab === 'track' ? 'bg-orange-500/20 text-orange-400 font-bold' : 'text-slate-400'
          }`}
        >
          {t.navTrackShort}
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg ${
            activeTab === 'map' ? 'bg-orange-500/20 text-orange-400 font-bold' : 'text-slate-400'
          }`}
        >
          {t.navMapShort}
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg ${
            activeTab === 'admin' ? 'bg-blue-500/20 text-blue-400 font-bold' : 'text-slate-400'
          }`}
        >
          {t.navAdminShort}
        </button>
      </div>
    </header>
  );
};
