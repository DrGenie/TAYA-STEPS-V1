import { Link } from 'react-router-dom';
import { useSettingsStore } from '../../state/settingsStore';
import { Navigation } from './Navigation';
import { MobileNav } from './MobileNav';

export function Header(){
  const parameterSet=useSettingsStore(s=>s.parameterSet);
  return <header className="header">
    <div className="container header-row">
      <div className="brand-block">
        <Link className="wordmark" to="/">TAYA-STEPS</Link>
        <span className="descriptor">Youth anxiety support decision tool</span>
      </div>
      <div className="header-meta" aria-label="Prototype information">
        <span className="prototype-badge">Prototype v1.0</span>
        <span>{parameterSet.name}</span>
      </div>
    </div>
    <Navigation/>
    <MobileNav/>
  </header>;
}
