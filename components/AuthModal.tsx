import React, { useState } from 'react';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, X, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User, isNewUser: boolean) => void;
  registeredUsers: User[];
  requiredForDownload?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onAuthSuccess, 
  registeredUsers,
  requiredForDownload = false
}) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (isSignUp && !fullName)) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isSignUp) {
      // Check if email already registered
      const exists = registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        setError('This email is already registered. Please sign in instead.');
        return;
      }

      const newUser: User = {
        id: crypto.randomUUID(),
        fullName,
        email,
        password, // Save login details for verification/excel download
        createdAt: new Date().toLocaleString()
      };
      
      onAuthSuccess(newUser, true);
    } else {
      // Sign In
      let user = registeredUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      // Fallback for primary admin account
      const adminEmails = ['suganthasuga405@gmail.com', 'suganthansuga405@gmail.com'];
      if (!user && adminEmails.includes(email.toLowerCase()) && password === 'CV4U@suga') {
        user = {
          id: 'admin_suganth',
          fullName: 'Suganth (Administrator)',
          email: email.toLowerCase(),
          password: 'CV4U@suga',
          createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
      }

      if (!user) {
        setError('Invalid email or password. Please try again.');
        return;
      }

      onAuthSuccess(user, false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 dark:border-gray-700 overflow-hidden relative">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-8 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
          
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="text-indigo-200 animate-pulse" size={24} />
            <span className="font-semibold tracking-wider text-xs uppercase text-indigo-200">Welcome to CV4U</span>
          </div>
          <h2 className="text-2xl font-bold">
            {isSignUp ? 'Create your Account' : 'Sign in to CV4U'}
          </h2>
          <p className="text-white/80 text-sm mt-1">
            {isSignUp 
              ? 'Build a highly polished resume with powerful AI in minutes.' 
              : 'Access your account and continue writing your CV.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {requiredForDownload && (
            <div className="bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 p-3.5 rounded-xl text-xs font-semibold border border-amber-200 dark:border-amber-800/60 flex items-center gap-2 shadow-sm">
              <Lock size={18} className="shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Login or Sign Up required to download your resume. Quick & easy registration!</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-xs font-medium border border-red-100 dark:border-red-900/50">
              {error}
            </div>
          )}

          {isSignUp && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <UserIcon size={16} />
                </span>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-600/10 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isSignUp ? 'Register & Enter' : 'Sign In'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {isSignUp 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
