import React from 'react';
import { SavedReport } from '../types';
import { TrashIcon } from './icons/Icons';

interface SavedReportsListProps {
  reports: SavedReport[];
  onView: (report: SavedReport) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-400';
  if (score >= 50) return 'text-yellow-brand';
  return 'text-red-400';
};

const getScoreBorderColor = (score: number) => {
  if (score >= 90) return 'border-green-400/50';
  if (score >= 50) return 'border-yellow-brand/50';
  return 'border-red-400/50';
};

const SavedReportsList: React.FC<SavedReportsListProps> = ({ reports, onView, onDelete, onBack }) => {
  // Sort reports by date, newest first
  const sortedReports = [...reports].sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());

  return (
    <div className="animate-fade-in mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold">Opgeslagen Rapporten</h2>
        <button
          onClick={onBack}
          className="text-yellow-brand hover:text-yellow-brand/80 transition-colors font-semibold"
        >
          &larr; Terug naar Analyse
        </button>
      </div>
      {sortedReports.length === 0 ? (
        <div className="text-center py-10 bg-gray-900/70 border border-gray-800 rounded-xl">
          <p className="text-gray-400">U heeft geen opgeslagen rapporten.</p>
          <p className="text-sm text-gray-500 mt-2">Voer een analyse uit en klik op "Rapport Opslaan" om er een toe te voegen.</p>
        </div>
      ) : (
        <div className="bg-gray-900/70 border border-gray-800 rounded-xl shadow-lg overflow-hidden">
          <ul className="divide-y divide-gray-800">
            {sortedReports.map((report) => (
              <li key={report.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-900 transition-colors">
                <div className="flex items-center gap-4 flex-grow w-full sm:w-auto">
                    <div className={`flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full border-2 bg-gray-800 ${getScoreBorderColor(report.overallScore)}`}>
                        <span className={`font-bold text-xl ${getScoreColor(report.overallScore)}`}>{report.overallScore}</span>
                    </div>
                    <div className="flex-grow min-w-0">
                        <p className="font-semibold text-yellow-brand break-words">{report.url}</p>
                        <p className="text-sm text-gray-500">
                          Opgeslagen op: {new Date(report.savedAt).toLocaleString('nl-NL')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onView(report)}
                    className="px-4 py-2 text-sm font-medium text-black bg-yellow-brand rounded-lg hover:bg-yellow-brand/90 transition-colors"
                  >
                    Bekijken
                  </button>
                  <button
                    onClick={() => onDelete(report.id)}
                    aria-label={`Rapport voor ${report.url} verwijderen`}
                    className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SavedReportsList;