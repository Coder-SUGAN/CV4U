import React, { useState } from 'react';
import { User } from '../types';
import { ShieldCheck, Lock, Mail, KeyRound, X, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminLoginSuccess: (adminUser: User) => void;
  triggerToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onAdminLoginSuccess,
  triggerToast
}) => {
  const [email, setEmail] = useState('suganthasuga405@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Check against authorized admin credentials
    const validEmails = ['suganthasuga405@gmail.com', 'suganthansuga405@gmail.com'];
    
    if (validEmails.includes(cleanEmail) && cleanPassword === 'CV4U@suga') {
      const adminUser: User = {
        id: 'admin_suganth',
        fullName: 'Suganth (Administrator)',
        email: cleanEmail,
        password: cleanPassword,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      
      triggerToast('🔐 Admin access granted! Welcome back, Suganth.', 'success');
      onAdminLoginSuccess(adminUser);
      setPassword('');
      setError('');
    } else {
      setError('Invalid admin credentials. Access restricted to administrator.');
      triggerToast('Invalid admin email or password.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-emerald-500/40 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-6 text-white relative border-b border-slate-700">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-full transition cursor-pointer"
          >
            <X size={18} />
          </button>
          
          <div className="flex items-center space-x-2 text-emerald-400 mb-2">
            <ShieldCheck size={26} />
            <span className="font-extrabold tracking-wider text-xs uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Admin Portal
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Administrator Login</h2>
          <p className="text-slate-400 text-xs mt-1">
            Protected area for managing registered users and viewing system login sheets.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAdminAuth} className="p-6 space-y-4">
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-300 p-3 rounded-xl text-xs font-semibold border border-red-200 dark:border-red-800 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 p-3 rounded-xl text-xs font-medium border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2">
            <Lock size={15} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>Admin Credentials Required: <strong>suganthasuga405@gmail.com</strong></span>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Admin Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                placeholder="suganthasuga405@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Admin Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <KeyRound size={16} />
              </span>
              <input
                type="password"
                placeholder="Enter admin password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-black text-emerald-400 border border-emerald-500/40 font-black rounded-xl text-xs transition-all shadow-lg cursor-pointer flex items-center justify-center space-x-2"
          >
            <ShieldCheck size={16} />
            <span>Login to Admin Dashboard</span>
          </button>
        </form>

        {/* Footer info */}
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-3 border-t border-gray-100 dark:border-gray-700 text-center">
          <span className="text-[11px] text-gray-400">CV4U Private System Administration</span>
        </div>

      </div>
    </div>
  );
};
