import LZString from 'lz-string';
import { scenarioSchema, type Scenario } from '../types/scenario';
export function scenarioToShareHash(s:Scenario){return LZString.compressToEncodedURIComponent(JSON.stringify(s));}
export function scenarioFromShareHash(hash:string):Scenario|null{try{const raw=LZString.decompressFromEncodedURIComponent(hash);if(!raw)return null;const parsed=scenarioSchema.safeParse(JSON.parse(raw));return parsed.success?parsed.data:null;}catch{return null;}}
