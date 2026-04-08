import React from 'react';
import { Link } from 'react-router-dom';
import { getNavbarConfig } from './navbarConfig.js';

const SharedNavbar = ({ role, activePage }) => {
  const config = getNavbarConfig(role);
  
  return (
    <nav className="bg-[#11131a] flex justify-between items-center w-full px-8 py-4 max-w-full docked full-width top-0 z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>account_balance</span>
            <span className="text-2xl font-bold tracking-tighter text-[#e5e4ed] font-headline">DLR</span>
          </Link>
        </div>
        <div className="hidden md:flex gap-6 items-center">
          {config.links.map((link) => (
            <Link 
              key={link.to}
              to={link.to} 
              className={`font-['Space_Grotesk'] tracking-wide uppercase text-sm font-bold transition-colors ${
                activePage === link.to ? config.activeClass : config.inactiveClass
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default SharedNavbar;
