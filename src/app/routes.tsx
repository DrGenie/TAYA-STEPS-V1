import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from '../pages/DashboardPage';
import { ScenarioBuilderPage } from '../pages/ScenarioBuilderPage';
import { ResultsPage } from '../pages/ResultsPage';
import { OptimiserPage } from '../pages/OptimiserPage';
import { ComparePage } from '../pages/ComparePage';
import { EvidencePage } from '../pages/EvidencePage';
import { MethodsPage } from '../pages/MethodsPage';
import { ReportsPage } from '../pages/ReportsPage';
import { AccessibilityPage } from '../pages/AccessibilityPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { DisclaimerPage } from '../pages/DisclaimerPage';
import { AboutPage } from '../pages/AboutPage';
export function AppRoutes(){return <Routes><Route path="/" element={<DashboardPage/>}/><Route path="/scenario" element={<ScenarioBuilderPage/>}/><Route path="/results" element={<ResultsPage/>}/><Route path="/optimiser" element={<OptimiserPage/>}/><Route path="/compare" element={<ComparePage/>}/><Route path="/evidence" element={<EvidencePage/>}/><Route path="/methods" element={<MethodsPage/>}/><Route path="/reports" element={<ReportsPage/>}/><Route path="/accessibility" element={<AccessibilityPage/>}/><Route path="/privacy" element={<PrivacyPage/>}/><Route path="/disclaimer" element={<DisclaimerPage/>}/><Route path="/about" element={<AboutPage/>}/><Route path="*" element={<div className="page container"><h1>Page not found</h1><p>The requested TAYA-STEPS page is not available.</p></div>}/></Routes>;}
