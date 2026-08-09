export type EvidenceGrade = 'A' | 'B' | 'C' | 'D';
export type EvidenceDomain = 'preference' | 'cost' | 'implementation' | 'economic' | 'context' | 'design';

export interface EvidenceRecord {
  id: string;
  label: string;
  domain: EvidenceDomain;
  value: number | string;
  unit: string;
  lower?: number;
  upper?: number;
  sourceGrade: EvidenceGrade;
  sourceTitle: string;
  sourceOrganisationOrAuthors: string;
  year: number;
  doi?: string;
  url: string;
  lastReviewed: string;
  rationale: string;
  usedInModel: boolean;
  sourceType: 'official' | 'published' | 'prototype';
}
