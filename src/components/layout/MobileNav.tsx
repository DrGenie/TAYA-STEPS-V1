import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { links } from './Navigation';
export function MobileNav(){const [open,setOpen]=useState(false);return <div className="mobile-menu container"><button className="button" aria-expanded={open} aria-controls="mobile-nav" onClick={()=>setOpen(v=>!v)}>Menu</button>{open&&<nav id="mobile-nav" aria-label="Mobile primary"><ul style={{listStyle:'none',padding:0}}>{links.map(([to,label])=><li key={to}><NavLink to={to} onClick={()=>setOpen(false)} style={{display:'block',padding:'12px 0'}}>{label}</NavLink></li>)}</ul></nav>}</div>;}
