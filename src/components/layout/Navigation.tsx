import { NavLink } from 'react-router-dom';

const links=[
  ['/','Overview'],
  ['/scenario','Build scenario'],
  ['/results','Results'],
  ['/compare','Compare'],
  ['/evidence','Assumptions']
];

export function Navigation(){
  return <nav id="primary-navigation" className="nav" aria-label="Primary">
    <div className="container">
      <ul className="nav-list">
        {links.map(([to,label])=><li key={to}><NavLink to={to} end={to==='/' } className={({isActive})=>isActive?'active':''}>{label}</NavLink></li>)}
      </ul>
    </div>
  </nav>;
}
export {links};
