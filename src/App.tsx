/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Apple, 
  Tv, 
  Globe, 
  ArrowRight, 
  Copy, 
  Check,
  Loader2
} from 'lucide-react';

type Device = 'android' | 'ios' | 'tv' | 'web';

interface ApiResponse {
  success: boolean;
  token: string;
  api: string;
  message: string;
}

const DEVICES = [
  { id: 'android' as Device, label: 'Android', icon: Smartphone, color: 'text-emerald-400' },
  { id: 'ios' as Device, label: 'iOS', icon: Apple, color: 'text-slate-200' },
  { id: 'tv' as Device, label: 'TV', icon: Tv, color: 'text-purple-400' },
  { id: 'web' as Device, label: 'Web', icon: Globe, color: 'text-blue-400' },
];

export default function App() {
  const [selectedDevice, setSelectedDevice] = useState<Device>('android');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGetToken = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(`/api/generate-token?device=${selectedDevice}`);
      const data = await response.json();
      if (data.success) {
        setResult(data);
      } else {
        alert(data.message || "Failed to generate token");
      }
    } catch (error) {
      console.error("Error fetching token:", error);
      alert("An error occurred while fetching the token.");
    } finally {
      setLoading(false);
    }
  };

  const loginLinks = result ? [
    { label: 'Link Login 1 (Phone)', url: `https://netflix.com/unsupported?nftoken=${result.token}` },
    { label: 'Link Login 2 (PC)', url: `https://netflix.com/account?nftoken=${result.token}` },
    { label: 'Link Login 3 (Default)', url: `https://netflix.com/?nftoken=${result.token}` },
  ] : [];

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white flex items-center justify-center p-4 font-sans selection:bg-blue-500/30">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[440px] bg-[#1f2937] rounded-[2.5rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden"
      >
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none" />

        {/* Header Section */}
        <div className="flex flex-col items-center mb-10 relative z-10">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center mb-6 shadow-[0_10px_30px_-5px_rgba(37,99,235,0.4)]"
          >
            <span className="text-5xl font-black text-white italic tracking-tighter">N</span>
          </motion.div>
          
          <h1 className="text-3xl font-extrabold tracking-tight mb-4 text-white">Netflix Cookies</h1>
        </div>

        {/* Device Grid */}
        <div className="grid grid-cols-4 gap-3 mb-10 relative z-10">
          {DEVICES.map((device) => {
            const Icon = device.icon;
            const isSelected = selectedDevice === device.id;
            return (
              <button
                key={device.id}
                onClick={() => setSelectedDevice(device.id)}
                className={`flex flex-col items-center justify-center aspect-square rounded-2xl transition-all duration-300 border-2 ${
                  isSelected 
                    ? 'bg-blue-500/10 border-blue-500/50 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                    : 'bg-[#111827]/40 border-transparent text-slate-500 hover:bg-[#111827]/60 hover:text-slate-300'
                }`}
              >
                <Icon className={`w-7 h-7 mb-2 ${isSelected ? device.color : 'text-current'}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{device.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Action Button */}
        <button
          onClick={handleGetToken}
          disabled={loading}
          className="w-full h-16 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl flex items-center justify-center gap-4 font-extrabold text-xl transition-all duration-300 shadow-[0_15px_30px_-5px_rgba(79,70,229,0.4)] group relative z-10"
        >
          {loading ? (
            <Loader2 className="w-7 h-7 animate-spin" />
          ) : (
            <>
              Get Token
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
            </>
          )}
        </button>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-10 space-y-5 bg-[#111827]/40 rounded-[2rem] p-6 border border-white/5 relative z-10"
            >
              {loginLinks.map((link, index) => (
                <div key={index} className="space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{link.label}</span>
                    <button
                      onClick={() => copyToClipboard(link.url, index)}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-3 h-3" />
                          COPIED
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          COPY
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-[#0f172a] rounded-xl p-4 font-mono text-[11px] leading-relaxed text-blue-300/90 break-all border border-white/5 shadow-inner">
                    {link.url.split('nftoken=')[0]}nftoken=
                    <span className="text-white font-bold">{link.url.split('nftoken=')[1]}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
