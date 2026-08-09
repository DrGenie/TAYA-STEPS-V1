import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import axe from 'axe-core';
import { MemoryRouter } from 'react-router-dom';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { ScenarioBuilderPage } from '../../src/pages/ScenarioBuilderPage';
import { MethodsPage } from '../../src/pages/MethodsPage';
import { PrivacyPage } from '../../src/pages/PrivacyPage';
afterEach(cleanup);
async function check(node:React.ReactElement){const {container}=render(<MemoryRouter>{node}</MemoryRouter>);const result=await axe.run(container,{rules:{'color-contrast':{enabled:false}}});expect(result.violations.map(v=>v.id)).toEqual([]);}
describe('primary page accessibility',()=>{it('dashboard has no automated structural violations',()=>check(<DashboardPage/>));it('scenario builder has no automated structural violations',()=>check(<ScenarioBuilderPage/>));it('methods has no automated structural violations',()=>check(<MethodsPage/>));it('privacy has no automated structural violations',()=>check(<PrivacyPage/>));});
