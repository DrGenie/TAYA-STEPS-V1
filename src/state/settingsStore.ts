import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';
import { prototypeCoefficients, setActiveCoefficients, type CoefficientSet } from '../data/prototypeCoefficients';
const coef=z.object({mean:z.number(),se:z.number().min(0)});
const group=z.object({asc:coef,setting:z.record(z.string(),coef),waitPerWeek:coef,delivery:z.record(z.string(),coef),parentInvolvement:z.record(z.string(),coef),professionalSupport:z.record(z.string(),coef),followUp:z.record(z.string(),coef),costPer10:coef});
export const parameterSetSchema=z.object({version:z.string().min(1),name:z.string().min(1),date:z.string().min(1),source:z.object({title:z.string().min(1),authorsOrOrganisation:z.string().min(1),url:z.string().url()}),youth:group,parent:group});
export type ParameterSetFile=z.infer<typeof parameterSetSchema>;
interface SettingsState {parameterSet:CoefficientSet;parameterMeta:{date:string;source:string};setParameterSet:(p:ParameterSetFile)=>void;restorePrototype:()=>void;tourCompleted:boolean;setTourCompleted:(v:boolean)=>void;}
export const useSettingsStore=create<SettingsState>()(persist((set)=>({
  parameterSet:prototypeCoefficients,parameterMeta:{date:'2026-08-08',source:'TAYA-STEPS prototype'},tourCompleted:false,
  setParameterSet:(p)=>{const next={version:p.version,name:p.name,youth:p.youth as CoefficientSet['youth'],parent:p.parent as CoefficientSet['parent']};setActiveCoefficients(next);set({parameterSet:next,parameterMeta:{date:p.date,source:p.source.title}});},
  restorePrototype:()=>{setActiveCoefficients(prototypeCoefficients);set({parameterSet:prototypeCoefficients,parameterMeta:{date:'2026-08-08',source:'TAYA-STEPS prototype'}});},
  setTourCompleted:(tourCompleted)=>set({tourCompleted})
}),{name:'taya-steps-settings-v1',onRehydrateStorage:()=>state=>{if(state?.parameterSet)setActiveCoefficients(state.parameterSet);}}));
