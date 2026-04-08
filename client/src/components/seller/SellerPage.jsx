import React from 'react';
import SharedNavbar from '../SharedNavbar.jsx';
import Footer from '../Footer.jsx';

const SellerPage = () => {
  return (
    <div className="text-on-surface flex flex-col min-h-screen" style={{backgroundColor: '#0c0e14', backgroundImage: 'radial-gradient(#1d1f27 0.5px, transparent 0.5px)', backgroundSize: '24px 24px', color: '#e5e4ed'}}>
      {/* Seller Navbar */}
      <SharedNavbar role="seller" activePage="dashboard" />

      <main className="relative z-10 p-8 max-w-[1600px] mx-auto space-y-8">
        {/* Page Header */}
        <header>
          <h1 className="text-4xl font-bold font-headline tracking-tight text-on-surface">
            Seller Dashboard
          </h1>
          <p className="text-on-surface-variant font-body mt-1">
            Manage registered land assets and ownership transfers.
          </p>
        </header>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface-container p-6 rounded-xl border-l-4 border-primary">
            <p className="text-xs font-inter uppercase tracking-widest text-on-surface-variant mb-2">
              Total Lands Registered
            </p>
            <h3 className="text-3xl font-headline font-bold">12</h3>
          </div>
          <div className="bg-surface-container p-6 rounded-xl border-l-4 border-secondary">
            <p className="text-xs font-inter uppercase tracking-widest text-on-surface-variant mb-2">
              Pending Transfers
            </p>
            <h3 className="text-3xl font-headline font-bold text-secondary">03</h3>
          </div>
          <div className="bg-surface-container p-6 rounded-xl border-l-4 border-green-500/50">
            <p className="text-xs font-inter uppercase tracking-widest text-on-surface-variant mb-2">
              Verification Passed
            </p>
            <h3 className="text-3xl font-headline font-bold">08</h3>
          </div>
          <div className="bg-surface-container p-6 rounded-xl border-l-4 border-error">
            <p className="text-xs font-inter uppercase tracking-widest text-on-surface-variant mb-2">
              Officer Reviews Required
            </p>
            <h3 className="text-3xl font-headline font-bold text-error">01</h3>
          </div>
        </div>

        {/* Section 1: Map + Alerts */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Land Boundary Mapping */}
          <div className="lg:w-[70%] bg-surface-container rounded-xl overflow-hidden flex flex-col h-[600px]">
            <div className="p-6 flex justify-between items-center bg-surface-container-high/50 backdrop-blur-md">
              <div>
                <h2 className="text-xl font-headline font-semibold">
                  Land Boundary Mapping
                </h2>
                <p className="text-sm text-on-surface-variant">
                  Spatial validation against government records
                </p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-md hover:bg-surface-container-highest text-on-surface-variant hover:text-primary transition-all flex items-center gap-2 text-sm font-medium">
                  <span className="material-symbols-outlined text-lg">edit_square</span>
                  Edit Boundary
                </button>
                <button className="p-2 rounded-md hover:bg-surface-container-highest text-on-surface-variant hover:text-error transition-all flex items-center gap-2 text-sm font-medium">
                  <span className="material-symbols-outlined text-lg">restart_alt</span>
                  Reset Polygon
                </button>
              </div>
            </div>
            <div className="flex-grow relative group">
              <img
                alt="Satellite Imagery"
                className="w-full h-full object-cover grayscale-[20%] contrast-[110%]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCu8BY9P2jRkc8X4h1Kcl6zqAD_d0Cj_pq9qsy0w1ZGktp8Q2A7AEnudOdhJYwo3JdTLSiQG55Vu3ePQ5Dra_oMqsfDTox341XFpWabAkFwxzE82yMxmDjFB6Qz0TPppK4u0zE4vZNSgcy5a_4Z9U_dFQuoJwfzKbMAMZ5nxWUBiSiTtS11EK83qSdGdlSLLMuJ7pA61fc1L4LcZBppwfhuKq-4pZH1n11Ge--IKPb6lDzYPaXg-KnQZMdE7laYXTGrz9xnnJr87oA"
              />
              
              {/* Blue Polygon Overlay Simulation */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg
                  className="w-[80%] h-[70%] drop-shadow-[0_0_15px_rgba(31,192,254,0.4)]"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 100"
                >
                  <polygon
                    fill="rgba(31,192,254,0.1)"
                    points="20,30 80,25 85,75 15,80"
                    stroke="#1fc0fe"
                    strokeDasharray="2,2"
                    strokeWidth="0.5"
                  ></polygon>
                  {/* Corner Handles */}
                  <circle className="pointer-events-auto cursor-nwse-resize" cx="20" cy="30" fill="#fff" r="1"></circle>
                  <circle className="pointer-events-auto cursor-nesw-resize" cx="80" cy="25" fill="#fff" r="1"></circle>
                  <circle className="pointer-events-auto cursor-nwse-resize" cx="85" cy="75" fill="#fff" r="1"></circle>
                  <circle className="pointer-events-auto cursor-nesw-resize" cx="15" cy="80" fill="#fff" r="1"></circle>
                </svg>
              </div>
              
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-surface-container-highest/80 backdrop-blur-xl rounded-lg border border-outline-variant/20">
                <p className="text-sm text-on-surface font-body">
                  Draw land boundary polygon for spatial validation against
                  government land records. Ensure points align with physical
                  landmarks.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Recent Alerts */}
          <div className="lg:w-[30%] bg-surface-container rounded-xl flex flex-col">
            <div className="p-6 border-b border-outline-variant/10">
              <h2 className="text-xl font-headline font-semibold">Recent Alerts</h2>
            </div>
            <div className="p-6 space-y-6 flex-grow overflow-y-auto">
              <div className="flex gap-4 items-start group">
                <div className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center text-green-500">
                  <span className="material-symbols-outlined">cloud_done</span>
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-on-surface">
                    Blockchain Synced
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Asset ID #4492 finalized on-chain.
                  </p>
                  <span className="text-[10px] uppercase font-inter tracking-tighter opacity-50">2 mins ago</span>
                </div>
              </div>
              <div className="flex gap-4 items-start group">
                <div className="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">draw</span>
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-on-surface">
                    Signature Received
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Co-owner Ramesh P. signed NOC.
                  </p>
                  <span className="text-[10px] uppercase font-inter tracking-tighter opacity-50">1 hour ago</span>
                </div>
              </div>
              <div className="flex gap-4 items-start group">
                <div className="w-8 h-8 rounded bg-error/10 flex items-center justify-center text-error">
                  <span className="material-symbols-outlined">warning</span>
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-on-surface">
                    Verification Warning
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Area mismatch detected in Survey #82.
                  </p>
                  <span className="text-[10px] uppercase font-inter tracking-tighter opacity-50">5 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Registration + Verification */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Registration Form */}
          <div className="lg:w-[70%] bg-surface-container rounded-xl p-8">
            <h2 className="text-2xl font-headline font-bold mb-8">
              Register New Land Asset
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-inter uppercase tracking-widest text-on-surface-variant">District</label>
                  <select className="w-full bg-surface-container-high border-none rounded-lg text-on-surface focus:ring-2 focus:ring-primary h-12">
                    <option>Pune</option>
                    <option>Satara</option>
                    <option>Mumbai Sub</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-inter uppercase tracking-widest text-on-surface-variant">Taluka</label>
                  <select className="w-full bg-surface-container-high border-none rounded-lg text-on-surface focus:ring-2 focus:ring-primary h-12">
                    <option>Haveli</option>
                    <option>Mulshi</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-inter uppercase tracking-widest text-on-surface-variant">Village</label>
                  <input
                    className="w-full bg-surface-container-high border-none rounded-lg text-on-surface focus:ring-2 focus:ring-primary h-12"
                    placeholder="e.g. Hinjewadi"
                    type="text"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-inter uppercase tracking-widest text-on-surface-variant">Survey Number</label>
                  <input
                    className="w-full bg-surface-container-high border-none rounded-lg text-on-surface focus:ring-2 focus:ring-primary h-12"
                    placeholder="102/A"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-inter uppercase tracking-widest text-on-surface-variant">Gat Number</label>
                  <input
                    className="w-full bg-surface-container-high border-none rounded-lg text-on-surface focus:ring-2 focus:ring-primary h-12"
                    placeholder="442"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-inter uppercase tracking-widest text-on-surface-variant">Land Area (Hectares)</label>
                  <input
                    className="w-full bg-surface-container-high border-none rounded-lg text-on-surface focus:ring-2 focus:ring-primary h-12"
                    placeholder="2.45"
                    type="number"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-inter uppercase tracking-widest text-on-surface-variant">Encumbrances</label>
                  <textarea
                    className="w-full bg-surface-container-high border-none rounded-lg text-on-surface focus:ring-2 focus:ring-primary"
                    placeholder="List any existing loans or legal disputes..."
                    rows={3}
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-inter uppercase tracking-widest text-on-surface-variant">Boundary Description</label>
                  <textarea
                    className="w-full bg-surface-container-high border-none rounded-lg text-on-surface focus:ring-2 focus:ring-primary"
                    placeholder="Physical markers, adjacent plots..."
                    rows={3}
                  ></textarea>
                </div>
              </div>
              <button className="w-full h-14 bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">database</span>
                Register Land on Blockchain
              </button>
            </form>
          </div>

          {/* Right: Mahabhulekh Verification */}
          <div className="lg:w-[30%] bg-surface-container rounded-xl p-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-headline font-semibold">Verification</h2>
              <span className="px-3 py-1 rounded-full text-[10px] font-inter font-bold tracking-widest uppercase bg-green-500/20 text-green-400">Verified</span>
            </div>
            <div className="space-y-6 flex-grow">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-inter uppercase text-on-surface-variant">
                  <span>Name Match Score</span>
                  <span>98%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-[98%]"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-inter uppercase text-on-surface-variant">
                  <span>Area Consistency</span>
                  <span>100%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-full"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-inter uppercase text-on-surface-variant">
                  <span>Encumbrance Detection</span>
                  <span>None Found</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-full"></div>
                </div>
              </div>
            </div>
            <button className="mt-8 w-full py-4 border border-outline-variant/20 rounded-lg text-on-surface hover:bg-surface-container-high transition-all flex items-center justify-center gap-2 font-medium">
              <span className="material-symbols-outlined">upload_file</span>
              Upload 7/12 Document
            </button>
          </div>
        </div>

        {/* Section 3: Co-Owner Management */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-[70%] bg-surface-container rounded-xl p-8">
            <h2 className="text-2xl font-headline font-bold mb-8">
              Co-Owner Builder
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-xs font-inter uppercase tracking-widest text-on-surface-variant">Full Name</label>
                <input
                  className="w-full bg-surface-container-high border-none rounded-lg text-on-surface focus:ring-2 focus:ring-primary h-12"
                  placeholder="John Doe"
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-inter uppercase tracking-widest text-on-surface-variant">Share (%)</label>
                <input
                  className="w-full bg-surface-container-high border-none rounded-lg text-on-surface focus:ring-2 focus:ring-primary h-12"
                  placeholder="25"
                  type="number"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-inter uppercase tracking-widest text-on-surface-variant">Wallet Address</label>
                <input
                  className="w-full bg-surface-container-high border-none rounded-lg text-on-surface focus:ring-2 focus:ring-primary h-12"
                  placeholder="0x..."
                  type="text"
                />
              </div>
            </div>
            <div className="mt-6 flex flex-col md:flex-row gap-4 items-center">
              <label className="flex-grow w-full cursor-pointer group">
                <div className="w-full h-12 border border-dashed border-outline-variant/40 rounded-lg flex items-center justify-center gap-3 text-on-surface-variant group-hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined">attachment</span>
                  <span className="text-sm">Upload Signed NOC (PDF)</span>
                </div>
                <input className="hidden" type="file" />
              </label>
              <button className="w-full md:w-auto h-12 px-8 bg-surface-container-high text-primary font-bold rounded-lg border border-primary/20 hover:bg-primary/10 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">group_add</span>
                Add Co-Owner
              </button>
            </div>
          </div>
          <div className="lg:w-[30%] bg-surface-container rounded-xl p-8">
            <h2 className="text-xl font-headline font-semibold mb-6">
              Consent Tracker
            </h2>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-surface-container-high rounded-lg">
                <span className="text-sm text-on-surface-variant">Total Co-Owners</span>
                <span className="text-xl font-bold">04</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-surface-container-high rounded-lg">
                <span className="text-sm text-on-surface-variant">Signed NOCs</span>
                <span className="text-xl font-bold text-secondary">03</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-inter uppercase tracking-widest text-on-surface-variant">
                  <span>Multi-sig Progress</span>
                  <span>75%</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full">
                  <div className="h-full bg-gradient-to-r from-secondary to-blue-500 w-3/4 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Land Data + Buyer Offers */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-[70%] bg-surface-container rounded-xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-headline font-bold">
                Registered Land Assets
              </h2>
            </div>
            <table className="w-full text-left font-body">
              <thead className="bg-surface-container-high/50 text-xs font-inter uppercase tracking-widest text-on-surface-variant">
                <tr>
                  <th className="px-6 py-4">Survey Number</th>
                  <th className="px-6 py-4">Village</th>
                  <th className="px-6 py-4">Area</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                <tr className="hover:bg-surface-container-high/30 transition-colors">
                  <td className="px-6 py-4 font-mono">102/A</td>
                  <td className="px-6 py-4">Hinjewadi</td>
                  <td className="px-6 py-4">1.2 HA</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">Verified</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline font-medium text-sm">View Deed</button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high/30 transition-colors">
                  <td className="px-6 py-4 font-mono">221/4</td>
                  <td className="px-6 py-4">Wagholi</td>
                  <td className="px-6 py-4">0.8 HA</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-error/10 text-error border border-error/20">Flagged</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-error hover:underline font-medium text-sm">Review Issue</button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high/30 transition-colors">
                  <td className="px-6 py-4 font-mono">45/B</td>
                  <td className="px-6 py-4">Baner</td>
                  <td className="px-6 py-4">2.5 HA</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">Officer Review</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline font-medium text-sm">Track Progress</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="lg:w-[30%] bg-surface-container rounded-xl flex flex-col">
            <div className="p-6 border-b border-outline-variant/10">
              <h2 className="text-xl font-headline font-semibold">Active Offers</h2>
            </div>
            <div className="p-6 space-y-4 flex-grow">
              <div className="p-4 bg-surface-container-high rounded-xl border border-outline-variant/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-secondary">0x8a1...29d1</span>
                  <span className="text-lg font-bold">120 ETH</span>
                </div>
                <p className="text-[10px] text-on-surface-variant">
                  Plot #102/A | Expires in 2d
                </p>
                <div className="flex gap-2">
                  <button className="flex-grow py-2 bg-primary text-on-primary text-xs font-bold rounded-lg hover:brightness-110">Accept</button>
                  <button className="flex-grow py-2 bg-surface-container-highest text-on-surface text-xs font-bold rounded-lg hover:bg-error/10 hover:text-error transition-colors">Reject</button>
                </div>
              </div>
              <div className="p-4 bg-surface-container-high rounded-xl border border-outline-variant/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-secondary">0x3f4...992b</span>
                  <span className="text-lg font-bold">115 ETH</span>
                </div>
                <p className="text-[10px] text-on-surface-variant">
                  Plot #102/A | Expires in 5d
                </p>
                <div className="flex gap-2">
                  <button className="flex-grow py-2 bg-primary text-on-primary text-xs font-bold rounded-lg hover:brightness-110">Accept</button>
                  <button className="flex-grow py-2 bg-surface-container-highest text-on-surface text-xs font-bold rounded-lg hover:bg-error/10 hover:text-error transition-colors">Reject</button>
                </div>
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

export default SellerPage;
