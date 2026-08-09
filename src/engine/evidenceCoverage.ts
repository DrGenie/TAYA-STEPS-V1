import type { EvidenceRecord, EvidenceGrade } from '../types/evidence';
export function calculateEvidenceCoverage(records:EvidenceRecord[]) {
  const active=records.filter(r=>r.usedInModel); const counts=Object.fromEntries(['A','B','C','D'].map(g=>[g,active.filter(r=>r.sourceGrade===g).length])) as Record<EvidenceGrade,number>;
  const total=active.length||1; return {total:active.length,counts,shares:Object.fromEntries(Object.entries(counts).map(([g,n])=>[g,n/total])) as Record<EvidenceGrade,number>,officialShare:active.filter(r=>r.sourceGrade==='A').length/total,publishedOrOfficialShare:active.filter(r=>r.sourceGrade==='A'||r.sourceGrade==='B').length/total};
}
