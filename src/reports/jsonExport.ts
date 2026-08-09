import { scenarioSchema, type Scenario } from '../types/scenario';
export function exportScenarioJson(s:Scenario){return JSON.stringify({schemaVersion:1,scenario:s},null,2);}
export function importScenarioJson(text:string):Scenario{const raw=JSON.parse(text);const parsed=scenarioSchema.safeParse(raw.scenario??raw);if(!parsed.success)throw new Error('Scenario file does not match the TAYA-STEPS schema.');return parsed.data;}
