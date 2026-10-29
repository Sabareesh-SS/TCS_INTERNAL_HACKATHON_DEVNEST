export interface KnowledgeArticle {
  id: string;
  deviceType: string;
  manufacturer: string;
  model: string;
  title: string;
  symptomPattern: string;
  verifiedResolution: string;
  manualCitation: string;
  ragStatus: 'indexed' | 'updating' | 'verified';
  chunkCount: number;
  lastVerifiedBy: string;
  lastUpdatedAt: string;
}
