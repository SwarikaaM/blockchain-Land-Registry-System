import React from 'react';
import { Link } from 'react-router-dom';
import SharedNavbar from '../SharedNavbar.jsx';
import Footer from '../Footer.jsx';

const TransfersPage = () => {
  return (
    <div className="font-body text-on-surface min-h-screen" style={{backgroundColor: '#0c0e14', backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(70, 72, 79, 0.05) 1px, transparent 0)', backgroundSize: '40px 40px'}}>
      {/* Buyer Navbar */}
      <SharedNavbar role="buyer" activePage="transfers" />
      
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Header Section */}
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight mb-2">
            Transfers
          </h1>
          <p className="text-on-surface-variant font-body text-lg max-w-2xl">
            Track all land purchase requests and their status across the
            decentralized ledger.
          </p>
        </header>
        
        {/* Main Content Canvas */}
        <div className="glass-panel rounded-xl overflow-hidden shadow-2xl" style={{background: 'rgba(23, 25, 33, 0.6)', backdropFilter: 'blur(24px)'}}>
          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-left">
                  <th className="px-6 py-5 font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Survey Number
                  </th>
                  <th className="px-6 py-5 font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Village
                  </th>
                  <th className="px-6 py-5 font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Seller Wallet
                  </th>
                  <th className="px-6 py-5 font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Offer Price
                  </th>
                  <th className="px-6 py-5 font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Status
                  </th>
                  <th className="px-6 py-5 font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {/* Row 1 */}
                <tr className="hover:bg-surface-container-high/40 transition-colors group">
                  <td className="px-6 py-6 font-label font-medium">102/A</td>
                  <td className="px-6 py-6 font-body text-on-surface">Hinjewadi</td>
                  <td className="px-6 py-6 font-label">
                    <span className="bg-surface-container-highest px-3 py-1 rounded-md text-xs text-secondary-fixed-dim">0x8a1...29d1</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <span className="font-headline font-bold text-on-surface">120 ETH</span>
                      <span className="text-[10px] text-on-surface-variant font-label uppercase">$240k Est.</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-secondary/40 text-secondary bg-secondary/5 uppercase tracking-tighter">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button className="text-xs font-bold font-headline uppercase text-primary hover:text-white transition-colors flex items-center justify-end gap-1 ml-auto group-hover:translate-x-1 duration-200">
                      View Details
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </td>
                </tr>
                {/* Row 2 */}
                <tr className="hover:bg-surface-container-high/40 transition-colors group">
                  <td className="px-6 py-6 font-label font-medium">45/B</td>
                  <td className="px-6 py-6 font-body text-on-surface">Baner</td>
                  <td className="px-6 py-6 font-label">
                    <span className="bg-surface-container-highest px-3 py-1 rounded-md text-xs text-secondary-fixed-dim">0x3f4...992b</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <span className="font-headline font-bold text-on-surface">115 ETH</span>
                      <span className="text-[10px] text-on-surface-variant font-label uppercase">$230k Est.</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/40 text-emerald-400 bg-emerald-500/5 uppercase tracking-tighter">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Accepted
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button className="text-xs font-bold font-headline uppercase text-primary hover:text-white transition-colors flex items-center justify-end gap-1 ml-auto group-hover:translate-x-1 duration-200">
                      View Details
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </td>
                </tr>
                {/* Row 3 */}
                <tr className="hover:bg-surface-container-high/40 transition-colors group">
                  <td className="px-6 py-6 font-label font-medium">221/4</td>
                  <td className="px-6 py-6 font-body text-on-surface">Wagholi</td>
                  <td className="px-6 py-6 font-label">
                    <span className="bg-surface-container-highest px-3 py-1 rounded-md text-xs text-secondary-fixed-dim">0x7c5...f8e2</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <span className="font-headline font-bold text-on-surface">95 ETH</span>
                      <span className="text-[10px] text-on-surface-variant font-label uppercase">$190k Est.</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-error-dim/40 text-error-dim bg-error-dim/5 uppercase tracking-tighter">
                      <span className="w-1.5 h-1.5 rounded-full bg-error-dim"></span>
                      Rejected
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button className="text-xs font-bold font-headline uppercase text-primary hover:text-white transition-colors flex items-center justify-end gap-1 ml-auto group-hover:translate-x-1 duration-200">
                      View Details
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </td>
                </tr>
                {/* Row 4 */}
                <tr className="hover:bg-surface-container-high/40 transition-colors group">
                  <td className="px-6 py-6 font-label font-medium">12/P-9</td>
                  <td className="px-6 py-6 font-body text-on-surface">Somerset</td>
                  <td className="px-6 py-6 font-label">
                    <span className="bg-surface-container-highest px-3 py-1 rounded-md text-xs text-secondary-fixed-dim">0x1a...4b5c</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <span className="font-headline font-bold text-on-surface">210 ETH</span>
                      <span className="text-[10px] text-on-surface-variant font-label uppercase">$420k Est.</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-dim text-white uppercase tracking-tighter shadow-lg shadow-primary-dim/20">
                      <span className="material-symbols-outlined text-[12px] font-bold" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button className="text-xs font-bold font-headline uppercase text-primary hover:text-white transition-colors flex items-center justify-end gap-1 ml-auto group-hover:translate-x-1 duration-200">
                      View Details
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Table Footer */}
          <div className="bg-surface-container-low px-8 py-5 flex items-center justify-between border-t border-outline-variant/10">
            <span className="text-xs font-label text-on-surface-variant">Showing 4 of 4 active transfer requests</span>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-md bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded-md bg-primary-dim text-white text-xs font-bold font-headline">1</button>
              <button className="p-2 rounded-md bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Secondary Information Cards (Asymmetric Bento) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="md:col-span-2 glass-panel p-8 rounded-xl flex items-center justify-between" style={{background: 'rgba(23, 25, 33, 0.6)', backdropFilter: 'blur(24px)'}}>
            <div>
              <h3 className="font-headline font-bold text-xl mb-1">
                Transfer Protocol
              </h3>
              <p className="text-on-surface-variant text-sm font-body">
                All transfers are secured via multi-signature smart contracts on
                the Polygon blockchain.
              </p>
            </div>
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: '"FILL" 1'}}>verified_user</span>
            </div>
          </div>
          <div className="glass-panel p-8 rounded-xl bg-gradient-to-br from-primary-dim/20 to-transparent" style={{background: 'rgba(23, 25, 33, 0.6)', backdropFilter: 'blur(24px)'}}>
            <h3 className="font-headline font-bold text-xl mb-1">Gas Estimation</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="material-symbols-outlined text-secondary text-sm">speed</span>
              <span className="font-label font-bold text-secondary">0.0014 ETH</span>
            </div>
            <p className="text-[10px] text-on-surface-variant font-label uppercase mt-2 tracking-widest">
              Network health: optimal
            </p>
          </div>
        </div>
      </main>
      
      {/* Background Decoration */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary-dim/5 blur-[120px] rounded-full"></div>
      <div className="fixed bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-secondary/5 blur-[120px] rounded-full"></div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TransfersPage;
