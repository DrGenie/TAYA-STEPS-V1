import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Scenario } from '../types/scenario';
interface SavedState {scenarios:Scenario[];baselineId:string|null;save:(s:Scenario)=>void;remove:(id:string)=>void;rename:(id:string,name:string)=>void;duplicate:(id:string)=>void;setBaseline:(id:string)=>void;importScenario:(s:Scenario)=>void;}
export const useSavedScenariosStore=create<SavedState>()(persist((set)=>({
  scenarios:[],baselineId:null,
  save:(s)=>set(state=>({scenarios:[...state.scenarios.filter(x=>x.id!==s.id),{...s,id:s.id.startsWith('rapid-')?crypto.randomUUID():s.id,createdAt:s.createdAt||new Date().toISOString(),modifiedAt:new Date().toISOString()}]})),
  remove:(id)=>set(state=>({scenarios:state.scenarios.filter(s=>s.id!==id),baselineId:state.baselineId===id?null:state.baselineId})),
  rename:(id,name)=>set(state=>({scenarios:state.scenarios.map(s=>s.id===id?{...s,name,modifiedAt:new Date().toISOString()}:s)})),
  duplicate:(id)=>set(state=>{const s=state.scenarios.find(x=>x.id===id);return s?{scenarios:[...state.scenarios,{...s,id:crypto.randomUUID(),name:`${s.name} copy`,createdAt:new Date().toISOString(),modifiedAt:new Date().toISOString()}]}:{};}),
  setBaseline:(id)=>set({baselineId:id}),
  importScenario:(s)=>set(state=>({scenarios:[...state.scenarios,{...s,id:crypto.randomUUID(),modifiedAt:new Date().toISOString()}]}))
}),{name:'taya-steps-saved-scenarios-v1',version:1}));
