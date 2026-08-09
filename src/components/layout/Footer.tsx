import { Link } from 'react-router-dom';

export function Footer(){
  return <footer className="footer">
    <div className="container footer-grid">
      <div>
        <strong>TAYA-STEPS</strong>
        <p className="small">A research prototype showing how preference evidence could inform early anxiety support planning. It is not an Australian Government service and does not provide clinical advice.</p>
      </div>
      <nav aria-label="Supporting information" className="footer-links">
        <strong>Supporting information</strong>
        <Link to="/methods">Methods</Link>
        <Link to="/reports">Reports and exports</Link>
        <Link to="/optimiser">Advanced optimiser</Link>
        <Link to="/accessibility">Accessibility</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/about">About</Link>
      </nav>
    </div>
  </footer>;
}
