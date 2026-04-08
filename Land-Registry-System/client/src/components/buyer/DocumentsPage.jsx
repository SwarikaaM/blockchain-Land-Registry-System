import React from 'react';
import { Link } from 'react-router-dom';
import SharedNavbar from '../SharedNavbar.jsx';
import Footer from '../Footer.jsx';

const DocumentsPage = () => {
  return (
    <div className="font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col" style={{backgroundColor: '#0c0e14', backgroundImage: 'radial-gradient(#1d1f27 0.5px, transparent 0.5px)', backgroundSize: '24px 24px', color: '#e5e4ed'}}>
      {/* Buyer Navbar */}
      <SharedNavbar role="buyer" activePage="documents" />
      
      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-8 py-12">
        {/* Header Section */}
        <header className="mb-12">
          <h1 className="font-headline text-4xl font-bold text-on-surface mb-2 tracking-tight">
            Documents
          </h1>
          <p className="font-body text-on-surface-variant text-lg">
            View land documents stored on IPFS.
          </p>
        </header>
        
        {/* Document Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                Verified
              </p>
              <h3 className="text-3xl font-headline font-bold text-secondary">142</h3>
            </div>
            <div className="p-3 bg-secondary/10 rounded-lg">
              <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>verified_user</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                Pending Review
              </p>
              <h3 className="text-3xl font-headline font-bold text-tertiary-container">14</h3>
            </div>
            <div className="p-3 bg-tertiary-container/10 rounded-lg">
              <span className="material-symbols-outlined text-tertiary-container" style={{fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>pending</span>
            </div>
          </div>
        </div>
        
        {/* Document Bento Grid Layout */}
        <div className="grid grid-cols-1 gap-6">
          {/* Filter & Search Bar Area */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
            <div className="relative w-full md:w-96">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>search</span>
              <input
                className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary/40 placeholder:text-on-surface-variant/40"
                placeholder="Search by Survey Number or Village..."
                type="text"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-surface-container rounded-lg text-sm font-medium border border-outline-variant/10 hover:bg-surface-container-high transition-all">
                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>filter_list</span>
                Filter
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-surface-container rounded-lg text-sm font-medium border border-outline-variant/10 hover:bg-surface-container-high transition-all">
                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>download</span>
                Export All
              </button>
            </div>
          </div>
          
          {/* Documents High-Density Table */}
          <div className="glass-panel rounded-xl overflow-hidden border border-outline-variant/10" style={{background: 'rgba(23, 25, 33, 0.7)', backdropFilter: 'blur(24px)', boxShadow: 'inset 0 1px 1px rgba(177, 161, 255, 0.05)'}}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high/50 border-b border-outline-variant/10">
                    <th className="px-6 py-4 font-headline text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Survey Number
                    </th>
                    <th className="px-6 py-4 font-headline text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Village
                    </th>
                    <th className="px-6 py-4 font-headline text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Document Type
                    </th>
                    <th className="px-6 py-4 font-headline text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Uploaded By
                    </th>
                    <th className="px-6 py-4 font-headline text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {/* Row 1 */}
                  <tr className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-headline font-medium text-on-surface">102/A</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-on-surface-variant">Hinjewadi</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                        <span className="text-on-surface">7/12 Record</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="font-label text-xs text-secondary/80 bg-secondary/10 px-2 py-0.5 rounded">0x8a1...29d1</code>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary-container rounded-md text-xs font-bold transition-all border border-primary/20">
                        View Document
                        <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>open_in_new</span>
                      </button>
                    </td>
                  </tr>
                  {/* Row 2 */}
                  <tr className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-headline font-medium text-on-surface">45/B</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-on-surface-variant">Baner</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                        <span className="text-on-surface">Co-owner NOC</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="font-label text-xs text-secondary/80 bg-secondary/10 px-2 py-0.5 rounded">0x4f2...91a3</code>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary-container rounded-md text-xs font-bold transition-all border border-primary/20">
                        View Document
                        <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>open_in_new</span>
                      </button>
                    </td>
                  </tr>
                  {/* Row 3 */}
                  <tr className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-headline font-medium text-on-surface">118/4</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-on-surface-variant">Hinjewadi</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                        <span className="text-on-surface">Mahabhulekh Snapshot</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="font-label text-xs text-secondary/80 bg-secondary/10 px-2 py-0.5 rounded">0x8a1...29d1</code>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary-container rounded-md text-xs font-bold transition-all border border-primary/20">
                        View Document
                        <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>open_in_new</span>
                      </button>
                    </td>
                  </tr>
                  {/* Row 4 */}
                  <tr className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-headline font-medium text-on-surface">209/C</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-on-surface-variant">Wakad</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        <span className="text-on-surface">Possession Letter</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="font-label text-xs text-secondary/80 bg-secondary/10 px-2 py-0.5 rounded">0x12c...88e4</code>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary-container rounded-md text-xs font-bold transition-all border border-primary/20">
                        View Document
                        <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>open_in_new</span>
                      </button>
                    </td>
                  </tr>
                  {/* Row 5 */}
                  <tr className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-headline font-medium text-on-surface">56/1</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-on-surface-variant">Baner</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                        <span className="text-on-surface">Tax Receipt 2023-24</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="font-label text-xs text-secondary/80 bg-secondary/10 px-2 py-0.5 rounded">0x8a1...29d1</code>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary-container rounded-md text-xs font-bold transition-all border border-primary/20">
                        View Document
                        <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>open_in_new</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Verification Status Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="glass-panel p-6 rounded-xl border border-outline-variant/10 flex items-start gap-4" style={{background: 'rgba(23, 25, 33, 0.7)', backdropFilter: 'blur(24px)', boxShadow: 'inset 0 1px 1px rgba(177, 161, 255, 0.05)'}}>
              <div className="p-3 bg-secondary/10 rounded-lg">
                <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>verified_user</span>
              </div>
              <div>
                <h3 className="font-headline text-sm font-bold text-on-surface uppercase tracking-wider mb-1">
                  IPFS Verified
                </h3>
                <p className="text-xs text-on-surface-variant font-body">
                  All documents are content-addressed and cryptographically
                  secured on IPFS.
                </p>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-xl border border-outline-variant/10 flex items-start gap-4" style={{background: 'rgba(23, 25, 33, 0.7)', backdropFilter: 'blur(24px)', boxShadow: 'inset 0 1px 1px rgba(177, 161, 255, 0.05)'}}>
              <div className="p-3 bg-primary/10 rounded-lg">
                <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>policy</span>
              </div>
              <div>
                <h3 className="font-headline text-sm font-bold text-on-surface uppercase tracking-wider mb-1">
                  Smart Contract Audit
                </h3>
                <p className="text-xs text-on-surface-variant font-body">
                  Registry access is controlled by DLR v1.0 smart contracts on
                  Polygon.
                </p>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-xl border border-outline-variant/10 flex items-start gap-4" style={{background: 'rgba(23, 25, 33, 0.7)', backdropFilter: 'blur(24px)', boxShadow: 'inset 0 1px 1px rgba(177, 161, 255, 0.05)'}}>
              <div className="p-3 bg-tertiary/10 rounded-lg">
                <span className="material-symbols-outlined text-tertiary" style={{fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>history</span>
              </div>
              <div>
                <h3 className="font-headline text-sm font-bold text-on-surface uppercase tracking-wider mb-1">
                  Immutable History
                </h3>
                <p className="text-xs text-on-surface-variant font-body">
                  Every document upload creates a permanent record on the
                  blockchain ledger.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DocumentsPage;
