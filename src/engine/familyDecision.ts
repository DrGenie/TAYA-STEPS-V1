import { logistic } from './utility';
import type { FamilyMode } from '../types/scenario';
export function familyUptake(mode:FamilyMode,youthUtility:number,parentUtility:number,youthUptake:number,parentUptake:number):number {
  switch(mode){
    case 'youth': return youthUptake;
    case 'parent': return parentUptake;
    case 'balanced': return logistic(0.5*youthUtility+0.5*parentUtility);
    case 'youth-centred': return logistic(0.7*youthUtility+0.3*parentUtility);
    case 'parent-constrained': return Math.min(youthUptake,parentUptake);
    default: throw new Error(`Unsupported family decision mode: ${String(mode)}`);
  }
}
