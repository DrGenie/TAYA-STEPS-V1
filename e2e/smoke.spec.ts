import { test, expect } from '@playwright/test';
import axe from 'axe-core';
const routes=['/','/#/scenario','/#/results','/#/optimiser','/#/compare','/#/evidence','/#/reports','/#/methods','/#/accessibility','/#/privacy','/#/disclaimer','/#/about'];
for(const route of routes){test(`${route} loads without horizontal page overflow`,async({page})=>{await page.goto(route);await expect(page.locator('main')).toBeVisible();const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+2);expect(overflow).toBe(false);});}
test('dashboard passes automated axe scan',async({page})=>{await page.goto('/');await page.addScriptTag({content:axe.source});const results=await page.evaluate(async()=>await (window as any).axe.run());expect(results.violations).toEqual([]);});
test('scenario update changes live output',async({page})=>{await page.goto('/#/scenario');const input=page.getByLabel('How quickly could support start?');await input.fill('6');await page.goto('/#/results');await expect(page.getByText('Decision summary',{exact:true})).toBeVisible();});
