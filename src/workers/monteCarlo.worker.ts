/// <reference lib="webworker" />
import { runSimulation } from '../engine/uncertainty';
import type { Scenario } from '../types/scenario';
self.onmessage=(event:MessageEvent<{scenario:Scenario;draws:number;seed:number}>)=>{const {scenario,draws,seed}=event.data;self.postMessage(runSimulation(scenario,draws,seed));};
export {};
