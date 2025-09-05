import React, { useState } from 'react';
import { SEOReport, SEOCheck, CheckStatus } from '../types';
import { 
  BasicSeoIcon, 
  AdvancedSeoIcon, 
  ChevronDownIcon, 
  CheckCircleIcon, 
  WarningTriangleIcon, 
  FailCircleIcon 
} from './icons/Icons';

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-400';
  if (score >= 50) return 'text-yellow-brand';
  return 'text-red-400';
};

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => (
    <div className="w-40 h-40 mx-auto">
        <svg className="w-full h-full" viewBox="0 0 36 36">
            {/* Background circle */}
            <path
                className="text-gray-700"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Foreground circle (progress) */}
            <path
                className={`${getScoreColor(score)} transition-all duration-1000`}
                strokeWidth="3"
                strokeDasharray={`${score}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                transform="rotate(-90 18 18)"
            />
            {/* Text content */}
            <text
                x="18"
                y="18"
                textAnchor="middle"
                dominantBaseline="central"
                fill="currentColor"
                fontSize="11"
                className={`font-bold ${getScoreColor(score)}`}
            >
                {score}
                <tspan
                    x="18"
                    dy="6"
                    fill="currentColor"
                    fontSize="4"
                    className="text-gray-400 font-normal"
                >
                    / 100
                </tspan>
            </text>
        </svg>
    </div>
);

const SummaryBar: React.FC<{ summary: SEOReport['summary'] }> = ({ summary }) => (
    <div className="grid grid-cols-3 gap-4 text-center bg-gray-900/70 border border-gray-800 rounded-xl p-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div>
            <div className="flex items-center justify-center gap-2">
                <CheckCircleIcon />
                <span className="text-2xl font-bold text-green-400">{summary.passed}</span>
            </div>
            <p className="text-sm text-gray-400">Geslaagd</p>
        </div>
        <div>
            <div className="flex items-center justify-center gap-2">
                <WarningTriangleIcon isBrandColor={true} />
                <span className="text-2xl font-bold text-yellow-brand">{summary.warnings}</span>
            </div>
            <p className="text-sm text-gray-400">Waarschuwingen</p>
        </div>
        <div>
            <div className="flex items-center justify-center gap-2">
                <FailCircleIcon />
                <span className="text-2xl font-bold text-red-400">{summary.failed}</span>
            </div>
            <p className="text-sm text-gray-400">Mislukt</p>
        </div>
    </div>
);

const statusIcons: Record<CheckStatus, React.ReactNode> = {
    passed: <CheckCircleIcon />,
    warning: <WarningTriangleIcon isBrandColor={true} />,
    failed: <FailCircleIcon />,
};

const SEOCheckItem: React.FC<{ item: SEOCheck }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-800 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-4 px-4 hover:bg-gray-800/50 transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {statusIcons[item.status]}
          <h4 className="font-semibold text-lg text-gray-200">{item.title}</h4>
        </div>
        <ChevronDownIcon isOpen={isOpen} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-gray-400 space-y-3 ml-9 border-l border-gray-700 pl-4 animate-fade-in">
          <div>
            <p className="font-semibold text-gray-300">Wat dit controleert:</p>
            <p className="text-sm">{item.description}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-300">Aanbeveling:</p>
            <p className="text-sm">{item.details}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const ResultSection: React.FC<{ title: string; items: SEOCheck[]; icon: React.ReactNode; delay: string }> = ({ title, items, icon, delay }) => (
  <div className="bg-gray-900/70 border border-gray-800 rounded-xl shadow-lg overflow-hidden animate-slide-up" style={{ animationDelay: delay }}>
    <div className="p-5 bg-gray-900 border-b border-gray-800">
      <h3 className="text-xl font-bold flex items-center gap-3 text-yellow-brand">
        {icon}
        {title}
      </h3>
    </div>
    <div className="divide-y divide-gray-800">
      {items.map((item, index) => (
        <SEOCheckItem key={index} item={item} />
      ))}
    </div>
  </div>
);

interface ResultsDisplayProps {
  report: SEOReport;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ report }) => {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8 items-center bg-gray-900/70 border border-gray-800 rounded-xl p-6 animate-slide-up">
        <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-yellow-brand">Algehele SEO Score</h3>
            <p className="text-gray-400 mt-2">Deze score geeft een momentopname van de SEO-gezondheid van uw site. Pak de waarschuwingen en fouten aan om deze te verbeteren.</p>
        </div>
        <ScoreCircle score={report.overallScore} />
      </div>

      <SummaryBar summary={report.summary} />

      <ResultSection title="Basis SEO" items={report.basicSeo} icon={<BasicSeoIcon />} delay="0.2s" />
      <ResultSection title="Geavanceerde SEO" items={report.advancedSeo} icon={<AdvancedSeoIcon />} delay="0.3s" />
    </div>
  );
};

export default ResultsDisplay;