import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { scenarioPresets } from '../data/scenarioPresets';
import type { Scenario } from '../types/scenario';
interface ScenarioState {scenario:Scenario;setScenario:(s:Scenario)=>void;updateScenario:(patch:Partial<Scenario>)=>void;loadPreset:(id:string)=>void;reset:()=>void;}
export const useScenarioStore=create<ScenarioState>()(persist((set)=>({
  scenario:scenarioPresets[0],
  setScenario:(scenario)=>set({scenario:{...scenario,modifiedAt:new Date().toISOString()}}),
  updateScenario:(patch)=>set(state=>({scenario:{...state.scenario,...patch,modifiedAt:new Date().toISOString()}})),
  loadPreset:(id)=>set({scenario:{...(scenarioPresets.find(p=>p.id===id)??scenarioPresets[0]),modifiedAt:new Date().toISOString()}}),
  reset:()=>set({scenario:scenarioPresets[0]})
}),{name:'taya-steps-active-scenario-v1'}));
