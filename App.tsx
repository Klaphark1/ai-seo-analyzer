import React, { useState, useEffect } from 'react';
import URLInputForm from './components/URLInputForm';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import SavedReportsList from './components/SavedReportsList';
import { SEOReport, SavedReport } from './types';
import { analyzeWebsiteSeo } from './services/geminiService';
import { BrandIcon, CtaIcon, SaveIcon, ArchiveIcon, BackIcon } from './components/icons/Icons';

const LOCAL_STORAGE_KEY = 'ai-seo-analyzer-reports';

const App: React.FC = () => {
  // App state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [seoReport, setSeoReport] = useState<SEOReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzedUrl, setAnalyzedUrl] = useState<string>('');

  // New state for saved reports feature
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [isCurrentReportSaved, setIsCurrentReportSaved] = useState<boolean>(false);
  const [view, setView] = useState<'analyzer' | 'savedList'>('analyzer');
  const [viewingSavedReport, setViewingSavedReport] = useState<boolean>(false);

  // Load saved reports from localStorage on initial render
  useEffect(() => {
    try {
      const storedReports = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedReports) {
        setSavedReports(JSON.parse(storedReports));
      }
    } catch (e) {
      console.error("Failed to load reports from localStorage", e);
    }
  }, []);

  const handleAnalyze = async (url: string) => {
    if (!url) {
      setError('Voer een geldige website-URL in.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSeoReport(null);
    setAnalyzedUrl(url);
    setIsCurrentReportSaved(false);
    setViewingSavedReport(false);

    try {
      const report = await analyzeWebsiteSeo(url);
      setSeoReport(report);
    } catch (err) {
      console.error(err);
      setError('Kon de website niet analyseren. De AI is mogelijk bezet of er is een fout opgetreden. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveReport = () => {
    if (!seoReport || !analyzedUrl) return;

    const newSavedReport: SavedReport = {
      id: `${new Date().toISOString()}-${analyzedUrl}`,
      url: analyzedUrl,
      savedAt: new Date().toISOString(),
      ...seoReport,
    };

    try {
      const updatedReports = [...savedReports, newSavedReport];
      setSavedReports(updatedReports);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedReports));
      setIsCurrentReportSaved(true);
    } catch (e) {
      console.error("Failed to save report to localStorage", e);
      setError("Kon het rapport niet opslaan. Opslag is mogelijk vol.");
    }
  };
  
  const handleDeleteReport = (id: string) => {
    const updatedReports = savedReports.filter(report => report.id !== id);
    try {
        setSavedReports(updatedReports);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedReports));
    } catch (e) {
        console.error("Failed to delete report from localStorage", e);
        setError("Kon het rapport niet verwijderen.");
    }
  };

  const handleViewSavedReport = (report: SavedReport) => {
    setSeoReport({
      overallScore: report.overallScore,
      summary: report.summary,
      basicSeo: report.basicSeo,
      advancedSeo: report.advancedSeo,
    });
    setAnalyzedUrl(report.url);
    setIsCurrentReportSaved(true);
    setViewingSavedReport(true);
    setView('analyzer');
  };
  
  const renderAnalyzerView = () => (
    <>
      <URLInputForm onSubmit={handleAnalyze} isLoading={isLoading} />

      <div className="text-center mt-6">
          <button
            onClick={() => setView('savedList')}
            className="inline-flex items-center gap-2 text-yellow-brand hover:text-yellow-brand/80 transition-colors font-semibold"
            aria-label="Bekijk opgeslagen SEO rapporten"
          >
            <ArchiveIcon />
            Bekijk Opgeslagen Rapporten ({savedReports.length})
          </button>
      </div>

      {error && (
        <div className="mt-8 text-center bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg animate-fade-in">
          <p>{error}</p>
        </div>
      )}

      {isLoading && <LoadingSpinner />}
      
      {seoReport && (
        <div className="mt-10 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
             <h2 className="text-2xl sm:text-3xl font-bold text-left">
                SEO Analyse voor <span className="text-yellow-brand break-all">{analyzedUrl}</span>
              </h2>
              {viewingSavedReport && (
                 <button
                    onClick={() => setView('savedList')}
                    className="inline-flex items-center gap-2 text-yellow-brand hover:text-yellow-brand/80 transition-colors self-start sm:self-center"
                    >
                    <BackIcon /> Terug naar Lijst
                 </button>
              )}
          </div>
          
          <ResultsDisplay report={seoReport} />

          <div className="mt-12 text-center flex flex-col sm:flex-row justify-center items-center gap-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <button
                onClick={handleSaveReport}
                disabled={isCurrentReportSaved}
                className="inline-flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
              <SaveIcon />
              {isCurrentReportSaved ? 'Rapport Opgeslagen!' : 'Rapport Opslaan'}
            </button>
            <a
              href="https://studioorjo.nl/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-yellow-brand hover:bg-yellow-brand/90 text-black font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <CtaIcon />
              Neem contact op voor verbeteringen
            </a>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        
        <header className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-2">
            <BrandIcon />
            <h1 className="text-4xl sm:text-5xl font-bold text-yellow-brand">
              AI SEO Analyse
            </h1>
          </div>
          <p className="text-lg text-gray-400">
            Krijg direct AI-gedreven SEO-aanbevelingen voor uw WordPress-site.
          </p>
        </header>

        <main>
          {view === 'analyzer' ? renderAnalyzerView() : (
            <SavedReportsList 
                reports={savedReports}
                onView={handleViewSavedReport}
                onDelete={handleDeleteReport}
                onBack={() => {
                  setView('analyzer');
                  setSeoReport(null);
                  setViewingSavedReport(false);
                }}
            />
          )}
        </main>

      </div>
    </div>
  );
};

export default App;