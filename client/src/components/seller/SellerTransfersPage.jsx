import React from 'react';
import SharedNavbar from '../SharedNavbar.jsx';
import Footer from '../Footer.jsx';

const SellerTransfersPage = () => {
  return (
    <div className="text-on-surface flex flex-col min-h-screen" style={{backgroundColor: '#0c0e14', backgroundImage: 'radial-gradient(#1d1f27 0.5px, transparent 0.5px)', backgroundSize: '24px 24px', color: '#e5e4ed'}}>
      {/* Seller Navbar */}
      <SharedNavbar role="seller" activePage="transfers" />

      <main className="flex-grow w-full max-w-7xl mx-auto px-8 py-12">
        {/* Page Header */}
        <header className="mb-12">
          <h1 className="font-headline text-4xl font-bold text-on-surface mb-2 tracking-tight">
            Transfer Management
          </h1>
          <p className="font-body text-on-surface-variant text-lg">
            Track and manage all land transfer transactions.
          </p>
        </header>

        {/* Transfer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-xl flex items-center justify-between">
            <div className="text-left">
              <p className="text-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                Active Transfers
              </p>
              <h3 className="text-3xl font-headline font-bold text-on-surface">12</h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <span className="material-symbols-outlined text-primary">swap_horiz</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl flex items-center justify-between">
            <div className="text-left">
              <p className="text-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                Completed
              </p>
              <h3 className="text-3xl font-headline font-bold text-secondary">48</h3>
            </div>
            <div className="p-3 bg-secondary/10 rounded-lg">
              <span className="material-symbols-outlined text-secondary">check_circle</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl flex items-center justify-between">
            <div className="text-left">
              <p className="text-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                In Escrow
              </p>
              <h3 className="text-3xl font-headline font-bold text-tertiary-container">08</h3>
            </div>
            <div className="p-3 bg-tertiary-container/10 rounded-lg">
              <span className="material-symbols-outlined text-tertiary-container">lock</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl flex items-center justify-between">
            <div className="text-left">
              <p className="text-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                Total Value
              </p>
              <h3 className="text-3xl font-headline font-bold">₹12.5M</h3>
            </div>
            <div className="p-3 bg-outline-variant/20 rounded-lg">
              <span className="material-symbols-outlined text-on-surface-variant">currency_exchange</span>
            </div>
          </div>
        </div>

        {/* Transfer Queue */}
        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
            <h3 className="font-headline text-xl font-bold">Active Transfer Queue</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-surface-container-high rounded-md text-xs font-medium hover:bg-surface-container-highest transition-colors">
                All
              </button>
              <button className="px-3 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                Pending
              </button>
              <button className="px-3 py-1 bg-surface-container-high rounded-md text-xs font-medium hover:bg-surface-container-highest transition-colors">
                Completed
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-xs font-label uppercase text-on-surface-variant tracking-widest">
                <tr>
                  <th className="px-6 py-4">Transfer ID</th>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">From</th>
                  <th className="px-6 py-4">To</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                <tr className="hover:bg-surface-container-high/30 transition-colors">
                  <td className="px-6 py-4 font-label text-primary-fixed-dim">#TR-88210</td>
                  <td className="px-6 py-4 font-body">Survey #442/A</td>
                  <td className="px-6 py-4 font-label text-xs text-outline">0x4c1...99a1</td>
                  <td className="px-6 py-4 font-label text-xs text-outline">0x8f2...3e12</td>
                  <td className="px-6 py-4 font-headline font-bold">₹2.5M</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded text-[10px] font-bold uppercase">
                      In Review
                    </span>
                  </td>
                  <td className="px-6 py-4 font-body text-xs">2023-10-24</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline font-bold text-xs uppercase tracking-tighter">
                      View Details
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high/30 transition-colors">
                  <td className="px-6 py-4 font-label text-primary-fixed-dim">#TR-88209</td>
                  <td className="px-6 py-4 font-body">Survey #102/A</td>
                  <td className="px-6 py-4 font-label text-xs text-outline">0x7a5...ff23</td>
                  <td className="px-6 py-4 font-label text-xs text-outline">0x1d2...bc44</td>
                  <td className="px-6 py-4 font-headline font-bold">₹1.8M</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20 rounded text-[10px] font-bold uppercase">
                      Escrow
                    </span>
                  </td>
                  <td className="px-6 py-4 font-body text-xs">2023-10-23</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline font-bold text-xs uppercase tracking-tighter">
                      View Details
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high/30 transition-colors">
                  <td className="px-6 py-4 font-label text-primary-fixed-dim">#TR-88208</td>
                  <td className="px-6 py-4 font-body">Survey #45/B</td>
                  <td className="px-6 py-4 font-label text-xs text-outline">0x3f4...992b</td>
                  <td className="px-6 py-4 font-label text-xs text-outline">0x8a1...29d1</td>
                  <td className="px-6 py-4 font-headline font-bold">₹3.2M</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded text-[10px] font-bold uppercase">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4 font-body text-xs">2023-10-22</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline font-bold text-xs uppercase tracking-tighter">
                      View Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Initiate New Transfer */}
        <div className="glass-panel rounded-xl p-8">
          <h3 className="font-headline text-2xl font-bold mb-6">Initiate New Transfer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-label uppercase text-on-surface-variant font-bold">Property Survey Number</label>
                <input
                  className="w-full bg-surface-container-high border-none rounded-md text-on-surface focus:ring-1 focus:ring-primary h-12 px-4"
                  placeholder="e.g. 442/A"
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-label uppercase text-on-surface-variant font-bold">Buyer Wallet Address</label>
                <input
                  className="w-full bg-surface-container-high border-none rounded-md text-on-surface focus:ring-1 focus:ring-primary h-12 px-4"
                  placeholder="0x..."
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-label uppercase text-on-surface-variant font-bold">Transfer Amount (₹)</label>
                <input
                  className="w-full bg-surface-container-high border-none rounded-md text-on-surface focus:ring-1 focus:ring-primary h-12 px-4"
                  placeholder="0.00"
                  type="number"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-label uppercase text-on-surface-variant font-bold">Transfer Type</label>
                <select className="w-full bg-surface-container-high border-none rounded-md text-on-surface focus:ring-1 focus:ring-primary h-12 px-4">
                  <option>Sale</option>
                  <option>Gift</option>
                  <option>Inheritance</option>
                  <option>Partition</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-label uppercase text-on-surface-variant font-bold">Special Conditions</label>
                <textarea
                  className="w-full bg-surface-container-high border-none rounded-md text-on-surface focus:ring-1 focus:ring-primary p-4"
                  placeholder="Any special terms or conditions..."
                  rows={4}
                ></textarea>
              </div>
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-headline font-bold h-14 rounded-md mt-6 transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-primary/20">
            Initiate Transfer
          </button>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SellerTransfersPage;
