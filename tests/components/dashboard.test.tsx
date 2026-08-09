import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { describe, expect, it } from 'vitest';
describe('Dashboard',()=>{it('renders the streamlined prototype summary',()=>{render(<MemoryRouter><DashboardPage/></MemoryRouter>);expect(screen.getByText('Rapid flexible early support')).toBeInTheDocument();expect(screen.getByText('Family-compatible uptake')).toBeInTheDocument();expect(screen.getByText(/Prototype estimates are illustrative/i)).toBeInTheDocument();});});
