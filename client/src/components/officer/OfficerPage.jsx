import React from 'react';
import SharedNavbar from '../SharedNavbar.jsx';
import Footer from '../Footer.jsx';

const OfficerPage = () => {
  return (
    <div className="font-body text-on-surface min-h-screen" style={{backgroundColor: '#0c0e14', backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(116, 117, 125, 0.05) 1px, transparent 0)', backgroundSize: '40px 40px'}}>
      {/* Officer Navbar */}
      <SharedNavbar role="officer" activePage="dashboard" />

      <main className="pt-12 pb-12 px-8 max-w-[1920px] mx-auto space-y-8">
        {/* Header Section */}
        <header>
          <h1 className="text-4xl font-bold font-headline tracking-tight text-on-surface">
            Officer Dashboard
          </h1>
          <p className="text-on-surface-variant font-body mt-1">
            Review land transfer cases and verify ownership records
          </p>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-label-sm text-outline font-label uppercase tracking-widest mb-1">
                Pending Cases
              </p>
              <p className="text-3xl font-headline font-bold">24</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <span className="material-symbols-outlined text-primary">pending_actions</span>
            </div>
          </div>
          <div className="glass-card p-6 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-label-sm text-outline font-label uppercase tracking-widest mb-1">
                Approved Today
              </p>
              <p className="text-3xl font-headline font-bold text-secondary">142</p>
            </div>
            <div className="bg-secondary/10 p-3 rounded-lg">
              <span className="material-symbols-outlined text-secondary">verified</span>
            </div>
          </div>
          <div className="glass-card p-6 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-label-sm text-outline font-label uppercase tracking-widest mb-1">
                Rejected Today
              </p>
              <p className="text-3xl font-headline font-bold text-error">08</p>
            </div>
            <div className="bg-error/10 p-3 rounded-lg">
              <span className="material-symbols-outlined text-error">cancel</span>
            </div>
          </div>
        </div>

        {/* Section 1: Case Queue Table */}
        <section className="glass-card rounded-xl overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
            <h3 className="font-headline text-xl font-bold">Active Case Queue</h3>
            <span className="text-xs bg-surface-container-highest px-3 py-1 rounded-full text-outline border border-outline/20">
              Live Sync Enabled
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low text-outline font-label text-xs uppercase tracking-tighter">
                <tr>
                  <th className="px-6 py-4">Case ID</th>
                  <th className="px-6 py-4">Survey Number</th>
                  <th className="px-6 py-4">Village</th>
                  <th className="px-6 py-4">Buyer Wallet</th>
                  <th className="px-6 py-4">Seller Wallet</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                <tr className="hover:bg-surface-container-high/50 transition-colors">
                  <td className="px-6 py-4 font-label text-primary-fixed-dim">#TR-88210</td>
                  <td className="px-6 py-4 font-body">442/A</td>
                  <td className="px-6 py-4 font-body">Mundhwa</td>
                  <td className="px-6 py-4 font-label text-xs text-outline">0x8f2...3e12</td>
                  <td className="px-6 py-4 font-label text-xs text-outline">0x4c1...99a1</td>
                  <td className="px-6 py-4">
                    <span className="bg-secondary/10 text-secondary text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest">
                      In Review
                    </span>
                  </td>
                  <td className="px-6 py-4 font-body text-xs">2023-10-24 14:20</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-primary-container font-bold text-sm">
                      Review
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high/50 transition-colors">
                  <td className="px-6 py-4 font-label text-primary-fixed-dim">#TR-88211</td>
                  <td className="px-6 py-4 font-body">109/B</td>
                  <td className="px-6 py-4 font-body">Hadapsar</td>
                  <td className="px-6 py-4 font-label text-xs text-outline">0x1d2...bc44</td>
                  <td className="px-6 py-4 font-label text-xs text-outline">0x7a5...ff23</td>
                  <td className="px-6 py-4">
                    <span className="bg-error/10 text-error text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest">
                      Flagged
                    </span>
                  </td>
                  <td className="px-6 py-4 font-body text-xs">2023-10-24 15:05</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-primary-container font-bold text-sm">
                      Review
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Details & Verification */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Case Details */}
          <section className="glass-card rounded-xl p-8 space-y-6">
            <div className="flex justify-between items-start">
              <h3 className="font-headline text-2xl font-bold">Case Details</h3>
              <button className="bg-surface-container-high hover:bg-surface-variant text-sm px-4 py-2 rounded-md transition-all font-medium border border-outline/10">
                View Full Land History
              </button>
            </div>
            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <p className="text-outline text-xs uppercase tracking-widest mb-1">Survey Number</p>
                <p className="text-lg font-medium">442/A</p>
              </div>
              <div>
                <p className="text-outline text-xs uppercase tracking-widest mb-1">Village</p>
                <p className="text-lg font-medium">Mundhwa</p>
              </div>
              <div>
                <p className="text-outline text-xs uppercase tracking-widest mb-1">Total Area</p>
                <p className="text-lg font-medium">1240.50 sqm</p>
              </div>
              <div>
                <p className="text-outline text-xs uppercase tracking-widest mb-1">Plot Type</p>
                <p className="text-lg font-medium">Residential / NA</p>
              </div>
              <div className="col-span-2">
                <p className="text-outline text-xs uppercase tracking-widest mb-1">Parties Involved</p>
                <div className="bg-surface-container-low p-3 rounded-lg border border-outline/5 space-y-2 mt-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-outline">Buyer:</span>
                    <span className="font-label text-secondary">0x8f2a...3e12</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-outline">Seller:</span>
                    <span className="font-label text-primary">0x4c1d...99a1</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right: Verification Results */}
          <section className="glass-card rounded-xl p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-headline text-2xl font-bold">Verification Scan</h3>
              <span className="bg-secondary/20 text-secondary text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: '"FILL" 1'}}>verified</span>
                Verified
              </span>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface">Identity: Name Match</span>
                  <span className="font-bold text-secondary">98.4%</span>
                </div>
                <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full" style={{width: '98.4%'}}></div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-surface-container-low p-4 rounded-lg">
                <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
                <div>
                  <p className="text-sm font-bold">Area Consistency Match</p>
                  <p className="text-xs text-outline">Digital survey matches physical records.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-surface-container-low p-4 rounded-lg">
                <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
                <div>
                  <p className="text-sm font-bold">Encumbrance Clear</p>
                  <p className="text-xs text-outline">No pending bank liens or legal disputes found.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-surface-container-low p-4 rounded-lg opacity-60">
                <span className="material-symbols-outlined text-outline">history</span>
                <div>
                  <p className="text-sm font-bold text-outline">Chain of Custody</p>
                  <p className="text-xs text-outline">Verified up to last 4 transfers.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Section 3: Documents & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Documents */}
          <section className="glass-card rounded-xl p-8 space-y-6">
            <h3 className="font-headline text-2xl font-bold">Property Documents</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl border border-outline/5 hover:border-primary/20 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-outline group-hover:text-primary">description</span>
                  <div>
                    <p className="text-sm font-bold">7/12 Extract</p>
                    <p className="text-[10px] text-outline font-label uppercase">SHA-256: d9e8...f2a1</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline hover:text-secondary">open_in_new</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl border border-outline/5 hover:border-primary/20 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-outline group-hover:text-primary">group</span>
                  <div>
                    <p className="text-sm font-bold">Co-owner NOC</p>
                    <p className="text-[10px] text-outline font-label uppercase">SHA-256: b11a...33cc</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline hover:text-secondary">open_in_new</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl border border-outline/5 hover:border-primary/20 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-outline group-hover:text-primary">image</span>
                  <div>
                    <p className="text-sm font-bold">Mahabhulekh Snapshot</p>
                    <p className="text-[10px] text-outline font-label uppercase">SHA-256: 4e9d...77b1</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline hover:text-secondary">open_in_new</span>
              </div>
            </div>
          </section>

          {/* Right: Spatial Map */}
          <section className="glass-card rounded-xl p-0 overflow-hidden min-h-[300px] relative">
            <div className="absolute inset-0 z-0">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAutAEYZzZjk6le-zENP-CzWJeKjS3b5KCPCydatoIaJevIL_FEp7ZfrDlHOevrtSUUNT0PxJtID3zDTJNV2cuJJWA8TUOpOmtSQ0-7LXUkkB4DUQPzqbRfgykd5CLgi30cRxVBWKKzXUdIrmnUgDRc8M4aJqpJ4mqJRfMtQqO5hRb0p3KYCY3JoxcazMwKnVRmdDZTI-XvqQzdBD9fkuw1iJmGUP41egpunHaDpR9ll9PIoDGAhBTaIFGcXMdE5CpKMYZGkhZTpHc"
                alt="Parcel map preview for spatial verification"
              />
              
              {/* Map Overlay Simulating UI elements */}
              <div className="absolute inset-0 bg-secondary/10 border-4 border-secondary/40 m-20 pointer-events-none flex items-center justify-center">
                <div className="bg-secondary/20 p-2 rounded-full border border-secondary">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="absolute top-4 right-4 z-10 bg-surface-container/80 backdrop-blur-md p-3 rounded-lg border border-outline/20">
              <p className="text-[10px] font-label text-outline uppercase tracking-widest mb-1">
                Geospatial Focus
              </p>
              <p className="text-xs font-bold">
                Lat: 18.5362° N<br />Lon: 73.9167° E
              </p>
            </div>
            <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-surface to-transparent z-10">
              <p className="text-xs font-medium text-on-surface">
                Spatial verification: Parcel boundaries align with municipal data.
              </p>
            </div>
          </section>
        </div>

        {/* Section 4: Approval Panel */}
        <section className="glass-card rounded-xl p-8 space-y-6">
          <h3 className="font-headline text-2xl font-bold">Decision Panel</h3>
          <div className="space-y-4">
            <label className="block text-xs uppercase tracking-widest text-outline font-label">
              Officer Justification & Findings
            </label>
            <textarea
              className="w-full bg-surface-container-low border-outline-variant/20 rounded-xl p-4 text-sm focus:ring-primary focus:border-primary placeholder:text-outline/50"
              placeholder="Enter detailed review notes and justification for decision..."
              rows={4}
            ></textarea>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button className="flex-1 primary-gradient py-4 rounded-xl font-headline font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(177,161,255,0.4)] transition-all">
              Approve Transfer
            </button>
            <button className="flex-1 bg-surface-container-highest border border-error/30 text-error-dim py-4 rounded-xl font-headline font-bold uppercase tracking-widest hover:bg-error/5 transition-all">
              Reject Transfer
            </button>
          </div>
        </section>

        {/* Section 5: Multi-Sig Status */}
        <section className="glass-card rounded-xl p-8 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="font-headline text-2xl font-bold">
                Multi-Sig Consensus
              </h3>
              <p className="text-outline text-sm mt-1">1 of 3 signatures completed</p>
            </div>
            <div className="text-right">
              <p className="text-secondary font-headline text-2xl font-bold">33%</p>
              <p className="text-[10px] text-outline uppercase tracking-widest">Progress</p>
            </div>
          </div>
          <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full transition-all duration-1000" style={{width: '33.3%'}}></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface-container-low p-4 rounded-xl border border-secondary/20 flex items-center gap-4">
              <div className="bg-secondary/10 p-2 rounded-full">
                <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: '"FILL" 1'}}>check</span>
              </div>
              <div>
                <p className="text-sm font-bold">Officer 1 (You)</p>
                <p className="text-[10px] text-secondary font-label">Signed Oct 24, 15:40</p>
              </div>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline/10 flex items-center gap-4 opacity-60">
              <div className="bg-outline/10 p-2 rounded-full">
                <span className="material-symbols-outlined text-outline">hourglass_empty</span>
              </div>
              <div>
                <p className="text-sm font-bold">Officer 2</p>
                <p className="text-[10px] text-outline font-label">Pending Approval</p>
              </div>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline/10 flex items-center gap-4 opacity-60">
              <div className="bg-outline/10 p-2 rounded-full">
                <span className="material-symbols-outlined text-outline">hourglass_empty</span>
              </div>
              <div>
                <p className="text-sm font-bold">Officer 3</p>
                <p className="text-[10px] text-outline font-label">Pending Approval</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default OfficerPage;
