import React, { useState } from 'react';
import { Shield, Phone, Mail, Lock, ArrowRight, CheckCircle2, Zap, Smartphone, Sparkles } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../data/translations';

export interface UserSession {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'citizen' | 'officer';
}

interface AuthScreenProps {
  currentLang: LanguageCode;
  onLoginSuccess: (user: UserSession) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ currentLang, onLoginSuccess }) => {
  const t = translations[currentLang];

  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  
  // Phone OTP state
  const [phoneNumber, setPhoneNumber] = useState<string>('9876543210');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('4820');
  const [citizenName, setCitizenName] = useState<string>('Gurpreet Singh');

  // Email state
  const [email, setEmail] = useState<string>('citizen.ludhiana@nagarakshak.in');
  const [password, setPassword] = useState<string>('••••••••');

  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
    }, 600);
  };

  // Handle Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setErrorMsg('Please enter the 4-digit verification code.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user: UserSession = {
        id: `USR-LDH-${Math.floor(1000 + Math.random() * 9000)}`,
        name: citizenName.trim() || 'Ludhiana Resident',
        phone: `+91 ${phoneNumber}`,
        email: `${phoneNumber}@nagarakshak.in`,
        role: 'citizen',
      };
      localStorage.setItem('nagar_rakshak_user', JSON.stringify(user));
      onLoginSuccess(user);
    }, 600);
  };

  // Handle Email Login
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user: UserSession = {
        id: `USR-LDH-${Math.floor(1000 + Math.random() * 9000)}`,
        name: citizenName.trim() || email.split('@')[0],
        phone: '+91 98765 43210',
        email: email,
        role: 'citizen',
      };
      localStorage.setItem('nagar_rakshak_user', JSON.stringify(user));
      onLoginSuccess(user);
    }, 600);
  };

  // Quick One-Click Hackathon Login
  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user: UserSession = {
        id: 'USR-LDH-2048',
        name: 'Gurpreet Singh',
        phone: '+91 98765 43210',
        email: 'gurpreet.ldh@nagarakshak.in',
        role: 'citizen',
      };
      localStorage.setItem('nagar_rakshak_user', JSON.stringify(user));
      onLoginSuccess(user);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 p-0.5 mx-auto shadow-xl shadow-orange-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Shield className="w-8 h-8 text-orange-400" />
            </div>
          </div>

          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-orange-400 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
            NagarRakshak
          </h1>
          <p className="text-xs font-semibold text-slate-400">
            Ludhiana Municipal Corporation • Citizen Portal
          </p>
          <div className="inline-flex items-center space-x-1 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-[11px] font-bold text-orange-400 mt-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Sign in to Report Hazards & Track Complaints</span>
          </div>
        </div>

        {/* Method Toggle: Mobile Number vs Email */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('phone');
              setErrorMsg('');
            }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              authMethod === 'phone'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile OTP</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMethod('email');
              setErrorMsg('');
            }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              authMethod === 'email'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email Sign In</span>
          </button>
        </div>

        {/* Form Error Display */}
        {errorMsg && (
          <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-2xl text-red-200 text-xs text-center font-semibold">
            {errorMsg}
          </div>
        )}

        {/* PHONE OTP METHOD */}
        {authMethod === 'phone' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="Enter your name (e.g. Gurpreet Singh)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-sm text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Phone Number</label>
                  <div className="flex space-x-2">
                    <span className="bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-3.5 text-sm font-mono text-slate-300 flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-sm text-white font-mono focus:outline-none focus:border-orange-500"
                      maxLength={10}
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">We will send a 4-digit SMS OTP code for instant verification.</p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <span>Sending OTP...</span>
                  ) : (
                    <>
                      <span>Send OTP Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-1">
                  <p className="text-xs text-slate-400">OTP code sent to <span className="font-mono font-bold text-amber-300">+91 {phoneNumber}</span></p>
                  <p className="text-[11px] text-emerald-400 font-bold">💡 Hackathon Demo OTP Code: 4820</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 text-center">Enter 4-Digit Verification OTP</label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="4820"
                    maxLength={4}
                    className="w-full bg-slate-950 border border-amber-500/60 rounded-2xl p-3.5 text-center text-xl font-mono tracking-widest text-amber-300 focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify & Open App Dashboard</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-xs text-slate-400 hover:text-white underline text-center"
                >
                  Change Mobile Number
                </button>
              </form>
            )}
          </div>
        )}

        {/* EMAIL METHOD */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Citizen Full Name</label>
              <input
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder="Enter your name (e.g. Gurpreet Singh)"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-sm text-white focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@ludhiana.gov.in"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-sm text-white focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-sm text-white focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <span>Logging in...</span>
              ) : (
                <>
                  <span>Sign In & Open App</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Divider & One-Click Hackathon Button */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold py-3 rounded-2xl text-xs border border-slate-700 flex items-center justify-center space-x-2 transition-all shadow-md"
          >
            <Zap className="w-4 h-4 text-amber-400 fill-current" />
            <span>Instant Demo Sign In (1-Click)</span>
          </button>

          <p className="text-[11px] text-slate-500 text-center">
            By signing in, you agree to Ludhiana Municipal Corporation civic terms & privacy rules.
          </p>
        </div>

      </div>
    </div>
  );
};
