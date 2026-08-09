import { useEffect, useState, type PropsWithChildren } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { PrototypeStrip } from '../components/layout/PrototypeStrip';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SkipLinks } from '../components/accessibility/SkipLinks';
import { AssistantDrawer } from '../components/assistant/AssistantDrawer';
import { ScreenReaderStatus } from '../components/accessibility/ScreenReaderStatus';
import { useScenarioStore } from '../state/scenarioStore';
import { calculateUptake } from '../engine/uptake';
import { formatPercent } from '../utils/format';
import { scenarioFromShareHash } from '../utils/share';
export function AppShell({children}:PropsWithChildren){const [assistant,setAssistant]=useState(false);const scenario=useScenarioStore(x=>x.scenario),setScenario=useScenarioStore(x=>x.setScenario);const u=calculateUptake(scenario);useEffect(()=>{const sharedValue=new URL(window.location.href).searchParams.get('scenario');if(sharedValue){const shared=scenarioFromShareHash(sharedValue);if(shared)setScenario(shared);}},[setScenario]);return <div className="app"><SkipLinks/><PrototypeStrip/><Header/><Breadcrumbs/><main id="main-content" tabIndex={-1}>{children}</main><Footer/><button className="assistant-button no-print" onClick={()=>setAssistant(true)} aria-label="Open TAYA Policy Assistant">Explain scenario</button><AssistantDrawer open={assistant} onClose={()=>setAssistant(false)}/><ScreenReaderStatus message={`Scenario updated. Family-compatible uptake ${formatPercent(u.family)}.`}/></div>;}
