export type CheckStatus = 'passed' | 'warning' | 'failed';

export interface SEOCheck {
  title: string;
  description: string;
  status: CheckStatus;
  details: string;
}

export interface SEOSummary {
  passed: number;
  warnings: number;
  failed: number;
}

export interface SEOReport {
  overallScore: number;
  summary: SEOSummary;
  basicSeo: SEOCheck[];
  advancedSeo: SEOCheck[];
}

export interface SavedReport extends SEOReport {
  id: string;
  url: string;
  savedAt: string;
}