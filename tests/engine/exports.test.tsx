import { describe, expect, it } from 'vitest';
import { renderToBuffer } from '@react-pdf/renderer';
import { scenarioPresets } from '../../src/data/scenarioPresets';
import { TayaReportDocument } from '../../src/reports/FullTechnicalReport';
import { workbookToArrayBuffer } from '../../src/reports/excelExport';
import { exportScenarioJson, importScenarioJson } from '../../src/reports/jsonExport';

describe('exports',()=>{const s=scenarioPresets[0];it('scenario JSON round-trips and invalid input is rejected',()=>{const text=exportScenarioJson(s);expect(importScenarioJson(text).name).toBe(s.name);expect(()=>importScenarioJson('{"bad":true}')).toThrow();});it('Excel generation completes',()=>{const buffer=workbookToArrayBuffer(s);expect(buffer.byteLength).toBeGreaterThan(1000);});it('PDF report generation completes',async()=>{const buffer=await renderToBuffer(<TayaReportDocument scenario={s} type="executive"/>);expect(buffer.length).toBeGreaterThan(1000);});});
