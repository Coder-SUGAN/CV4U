
import React, { useState } from 'react';

interface AIAssistButtonProps {
  onClick: () => Promise<void>;
}

export const AIAssistButton: React.FC<AIAssistButtonProps> = ({ onClick }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } catch (error) {
      console.error("AI Assist failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className="absolute bottom-2 right-2 flex items-center space-x-1 px-2 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-gray-600 rounded-md hover:bg-indigo-200 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      )}
      <span>{isLoading ? 'Enhancing...' : 'Enhance with AI'}</span>
    </button>
  );
};
