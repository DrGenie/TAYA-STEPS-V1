import { Link, useLocation } from 'react-router-dom';
export function Breadcrumbs(){const {pathname}=useLocation();if(pathname==='/')return null;const label=pathname.split('/').filter(Boolean).map(x=>x.replaceAll('-',' ')).join(' / ');return <nav className="breadcrumbs container" aria-label="Breadcrumb"><ol><li><Link to="/">Dashboard</Link></li><li aria-current="page">{label}</li></ol></nav>;}
