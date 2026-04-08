import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getNavbarConfig } from './navbarConfig.js';
import { IconBlockchain, IconWallet, IconLogout, IconPolygon } from './icons/Icons.jsx';

const SharedNavbar = ({ role, activePage }) => {
  const { isAuthenticated, truncatedWallet, balance, chainId, connectWallet, logout } = useAuth();
  const config = getNavbarConfig(role);
  const isPolygon = chainId === 137 || chainId === 80001 || chainId === 80002;

  return (
    <nav className="bg-[#0a0c12]/95 backdrop-blur-xl flex justify-between items-center w-full px-8 py-3.5 border-b border-[#1d1f27]/80 sticky top-0 z-50">
      {/* Left: Logo + Nav Links */}
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <IconBlockchain className="text-primary" size={16} />
          </div>
          <span className="text-lg font-bold tracking-tight text-[#e5e4ed] font-headline">DLR</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {config.links.map((link) => {
            const isActive = activePage === link.to || (activePage === 'dashboard' && link.to === `/${role}`);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-md text-xs font-bold tracking-wider uppercase transition-all ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-[#e5e4ed]/50 hover:text-[#e5e4ed] hover:bg-[#1d1f27]/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right: Wallet Info */}
      <div className="flex items-center gap-2.5">
        {isAuthenticated ? (
          <>
            {/* Chain badge */}
            <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
              isPolygon
                ? 'bg-secondary/8 border-secondary/15 text-secondary'
                : 'bg-amber-500/8 border-amber-500/15 text-amber-400'
            }`}>
              <IconPolygon size={12} />
              {isPolygon ? 'Polygon' : `Chain ${chainId || '?'}`}
            </div>

            {/* Address + Balance */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#14161e] rounded-md border border-[#1d1f27]">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              <span className="text-xs text-[#e5e4ed]/70 font-mono">{truncatedWallet}</span>
              {balance !== null && (
                <>
                  <div className="w-px h-3 bg-[#1d1f27]" />
                  <span className="text-xs text-primary font-bold font-mono">{balance}</span>
                </>
              )}
            </div>

            <button onClick={logout} className="p-1.5 rounded-md hover:bg-error/10 text-[#e5e4ed]/40 hover:text-error transition-colors" title="Disconnect">
              <IconLogout size={14} />
            </button>
          </>
        ) : (
          <button onClick={connectWallet} className="flex items-center gap-2 px-3.5 py-1.5 bg-primary/15 hover:bg-primary/25 border border-primary/20 rounded-md text-primary text-xs font-bold transition-all">
            <IconWallet size={14} />
            Connect
          </button>
        )}
      </div>
    </nav>
  );
};

export default SharedNavbar;
