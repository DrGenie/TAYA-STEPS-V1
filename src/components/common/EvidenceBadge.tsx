import type { EvidenceGrade } from '../../types/evidence';
import { Badge } from './Badge';
export function EvidenceBadge({grade}: {grade:EvidenceGrade}){return <Badge className={grade.toLowerCase()}>Grade {grade}</Badge>;}
