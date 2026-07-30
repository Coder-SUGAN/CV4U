import React from 'react';
import { X, Sparkles, Compass, Heart } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-100 dark:border-gray-700 overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-full transition-colors"
        >
          <X size={18} />
        </button>

        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-6">
            <Sparkles size={32} className="animate-spin-slow" />
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            Welcome to CV4U, {userName}! 🎉
          </h2>
          <div className="h-1 w-20 bg-indigo-500 rounded mx-auto mb-6"></div>

          <div className="text-left text-gray-600 dark:text-gray-300 space-y-4 mb-8 text-base">
            <p className="leading-relaxed">
              Thank you so much for choosing <span className="font-bold text-indigo-600 dark:text-indigo-400">CV4U</span> to build your professional curriculum vitae! We are thrilled to welcome you to our growing community.
            </p>
            <p className="leading-relaxed">
              Whether you are taking the next step in your career, changing industries, or launching your professional journey, <strong className="text-gray-800 dark:text-white">CV4U</strong> is designed to support you with state-of-the-art AI-driven suggestions, beautiful designs, and flexible templates.
            </p>
            <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 flex gap-3 text-sm">
              <Compass className="text-indigo-500 shrink-0 mt-0.5" size={18} />
              <div>
                <span className="font-semibold block text-gray-800 dark:text-white mb-0.5">Quick Tip:</span>
                We've automatically updated your Personal Details in the CV form with your account profile (Full Name & Email) to help save your time!
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer w-full"
            >
              Let's Start Building!
            </button>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-t border-gray-100 dark:border-gray-700/50 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            Made with <Heart size={12} className="text-red-500 fill-red-500" /> by CV4U Team
          </span>
          <span>CV4U Premium App</span>
        </div>
      </div>
    </div>
  );
};
