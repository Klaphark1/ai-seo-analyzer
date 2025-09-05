import React, { useState } from 'react';

interface URLInputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const URLInputForm: React.FC<URLInputFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(url);
  };

  return (
    <div className="bg-gray-900/50 p-6 rounded-xl shadow-2xl border border-gray-800 animate-slide-up">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://jouw-website.nl"
          required
          className="w-full px-5 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-brand focus:border-transparent transition-all duration-300"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-yellow-brand text-black font-bold rounded-lg hover:bg-yellow-brand/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyseren...
            </>
          ) : (
            'Analyseer Website'
          )}
        </button>
      </form>
    </div>
  );
};

export default URLInputForm;