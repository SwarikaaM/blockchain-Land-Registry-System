import React from 'react';
import SharedNavbar from '../SharedNavbar.jsx';
import Footer from '../Footer.jsx';

const BuyerPage = () => {
  return (
    <div className="font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col" style={{backgroundColor: '#0c0e14', backgroundImage: 'radial-gradient(#1d1f27 0.5px, transparent 0.5px)', backgroundSize: '24px 24px', color: '#e5e4ed'}}>
      {/* Buyer Navbar */}
      <SharedNavbar role="buyer" activePage="dashboard" />
      
      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-8 py-12">
        {/* Header Section */}
        <header className="mb-12">
          <h1 className="font-headline text-4xl font-bold text-on-surface mb-2 tracking-tight">
            Buyer Dashboard
          </h1>
          <p className="font-body text-on-surface-variant text-lg">
            Explore verified land parcels and manage purchase requests.
          </p>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-xl flex items-center justify-between" style={{background: 'rgba(23, 25, 33, 0.7)', backdropFilter: 'blur(24px)', boxShadow: 'inset 0 1px 1px rgba(177, 161, 255, 0.05)'}}>
            <div>
              <p className="text-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                Owned Lands
              </p>
              <h3 className="text-3xl font-headline font-bold">12</h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>potted_plant</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl flex items-center justify-between" style={{background: 'rgba(23, 25, 33, 0.7)', backdropFilter: 'blur(24px)', boxShadow: 'inset 0 1px 1px rgba(177, 161, 255, 0.05)'}}>
            <div>
              <p className="text-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                Active Transfers
              </p>
              <h3 className="text-3xl font-headline font-bold">04</h3>
            </div>
            <div className="p-3 bg-secondary/10 rounded-lg">
              <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>swap_horiz</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl flex items-center justify-between" style={{background: 'rgba(23, 25, 33, 0.7)', backdropFilter: 'blur(24px)', boxShadow: 'inset 0 1px 1px rgba(177, 161, 255, 0.05)'}}>
            <div>
              <p className="text-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                Escrow Locked
              </p>
              <h3 className="text-3xl font-headline font-bold">4.2M</h3>
            </div>
            <div className="p-3 bg-tertiary-container/10 rounded-lg">
              <span className="material-symbols-outlined text-tertiary-container" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>lock</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl flex items-center justify-between" style={{background: 'rgba(23, 25, 33, 0.7)', backdropFilter: 'blur(24px)', boxShadow: 'inset 0 1px 1px rgba(177, 161, 255, 0.05)'}}>
            <div>
              <p className="text-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                Recent Activity
              </p>
              <h3 className="text-3xl font-headline font-bold">28</h3>
            </div>
            <div className="p-3 bg-outline-variant/20 rounded-lg">
              <span className="material-symbols-outlined text-on-surface-variant" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>history</span>
            </div>
          </div>
        </div>

        {/* Section 1: Full-width Land Explorer Map */}
        <section className="w-full mb-8">
          <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-2xl border border-outline-variant/10">
            <div
              className="absolute inset-0 bg-surface-container-low"
              style={{
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBI0TuKPVb6nMYjWGiuHaqrymHxGp1qlWoWFqjvXCLcM4u-cuF1oYGtPzM1VzZBMkDndi80krcPMJ8G_jqInA-Tgvm1ia34R-cpus0F1bMp5VVTq8CFPx9HbFIpW8aIh-yF_omQ6WRfTY36ZxDPeJ1RozlEZJodOqJSssqp8wlBbw1FHx7IXMde21V7bwfV5q_IkDTzfsDouvrhC9rI_48msWF5c3-ojClh4sX6-A80NQ9ruGh-WIpJj-yQ76Ki9sV4a2TuBLkf3cc')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
            
            {/* Map Overlay Polygons Simulation */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                className="pointer-events-auto cursor-pointer hover:fill-primary/30 transition-all"
                d="M 200 100 L 400 120 L 380 300 L 180 280 Z"
                fill="rgba(124, 92, 255, 0.1)"
                stroke="white"
                strokeWidth="2"
              ></path>
              <path
                className="pointer-events-auto cursor-pointer shadow-lg"
                d="M 500 150 L 700 140 L 720 350 L 520 360 Z"
                fill="rgba(124, 92, 255, 0.4)"
                stroke="#7C5CFF"
                strokeWidth="3"
              ></path>
              <path
                className="pointer-events-auto cursor-pointer hover:fill-primary/30 transition-all"
                d="M 800 200 L 950 220 L 930 400 L 780 380 Z"
                fill="rgba(124, 92, 255, 0.1)"
                stroke="white"
                strokeWidth="2"
              ></path>
            </svg>
            
            <div className="absolute top-6 left-6 flex flex-col gap-3">
              <div className="bg-surface-container/90 backdrop-blur-md px-4 py-2 rounded-lg border border-outline-variant/30 flex items-center gap-4 shadow-xl">
                <span className="text-sm font-label font-semibold">124/A</span>
                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className="text-sm font-label font-semibold">452/B</span>
                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className="text-sm font-label font-semibold text-primary">89/C (Selected)</span>
              </div>
            </div>
            
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              <button className="w-10 h-10 bg-surface-container/90 backdrop-blur-md rounded-lg flex items-center justify-center border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>add</span>
              </button>
              <button className="w-10 h-10 bg-surface-container/90 backdrop-blur-md rounded-lg flex items-center justify-center border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>remove</span>
              </button>
              <button className="w-10 h-10 bg-surface-container/90 backdrop-blur-md rounded-lg flex items-center justify-center border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>my_location</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section 2: Panels */}
        <section className="grid grid-cols-1 md:grid-cols-10 gap-6 mb-8">
          {/* Left: Land Search Filters */}
          <div className="md:col-span-4 glass-panel p-8 rounded-xl flex flex-col gap-6" style={{background: 'rgba(23, 25, 33, 0.7)', backdropFilter: 'blur(24px)', boxShadow: 'inset 0 1px 1px rgba(177, 161, 255, 0.05)'}}>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>filter_list</span>
              <h4 className="font-headline font-bold text-xl uppercase tracking-tight">
                Land Search Filters
              </h4>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-label uppercase text-on-surface-variant font-bold">Village</label>
                <select className="w-full bg-surface-container-high border-none rounded-md text-on-surface focus:ring-1 focus:ring-primary h-12 px-4">
                  <option>North Somerset Valley</option>
                  <option>East High Ridge</option>
                  <option>South Lake District</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-label uppercase text-on-surface-variant font-bold">Survey Number</label>
                <input
                  className="w-full bg-surface-container-high border-none rounded-md text-on-surface focus:ring-1 focus:ring-primary h-12 px-4"
                  placeholder="e.g. 89/C"
                  type="text"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-label uppercase text-on-surface-variant font-bold">Area Range (Acres)</label>
                <div className="pt-4">
                  <input className="w-full accent-primary" type="range" />
                  <div className="flex justify-between text-xs font-label text-on-surface-variant mt-2">
                    <span>1 Acre</span>
                    <span>500 Acres</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-label uppercase text-on-surface-variant font-bold">Verification Status</label>
                <select className="w-full bg-surface-container-high border-none rounded-md text-on-surface focus:ring-1 focus:ring-primary h-12 px-4">
                  <option>All Statuses</option>
                  <option>Verified</option>
                  <option>Pending Registry</option>
                </select>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-headline font-bold h-14 rounded-md mt-4 transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-primary/20">
              APPLY FILTERS
            </button>
          </div>

          {/* Right: Parcel Details */}
          <div className="md:col-span-6 glass-panel p-8 rounded-xl flex flex-col justify-between" style={{background: 'rgba(23, 25, 33, 0.7)', backdropFilter: 'blur(24px)', boxShadow: 'inset 0 1px 1px rgba(177, 161, 255, 0.05)'}}>
            <div>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-headline font-bold mb-1">
                    Parcel 89/C
                  </h2>
                  <p className="text-on-surface-variant">
                    North Somerset Valley District
                  </p>
                </div>
                <div className="px-4 py-1.5 bg-secondary/10 border border-secondary/30 rounded-full flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm" style={{fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>verified</span>
                  <span className="text-xs font-label font-bold text-secondary uppercase tracking-wider">Verified Registry</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-8">
                <div className="space-y-1">
                  <p className="text-xs font-label uppercase text-on-surface-variant">
                    Total Area
                  </p>
                  <p className="text-xl font-headline font-bold">142.50 Acres</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-label uppercase text-on-surface-variant">
                    Encumbrance Status
                  </p>
                  <p className="text-xl font-headline font-bold text-secondary">
                    None / Clear Title
                  </p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-xs font-label uppercase text-on-surface-variant mb-3">
                    Owner(s) & Ownership Shares
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-surface-container-high px-4 py-3 rounded-md border border-outline-variant/10">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-on-surface-variant" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>account_circle</span>
                        <span className="font-label text-sm">0x8a2...3f1d</span>
                      </div>
                      <span className="font-headline font-bold text-primary">60%</span>
                    </div>
                    <div className="flex justify-between items-center bg-surface-container-high px-4 py-3 rounded-md border border-outline-variant/10">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-on-surface-variant" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>account_circle</span>
                        <span className="font-label text-sm">0x4b9...1e88</span>
                      </div>
                      <span className="font-headline font-bold text-primary">40%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 bg-surface-container-high border border-outline-variant text-on-surface font-headline font-bold h-14 rounded-md transition-all hover:bg-surface-container-highest active:scale-95">
                VIEW HISTORY
              </button>
              <button className="flex-[2] bg-gradient-to-br from-primary to-primary-dim text-on-primary font-headline font-bold h-14 rounded-md transition-all hover:opacity-90 active:scale-95 shadow-xl shadow-primary/30">
                INITIATE TRANSFER REQUEST
              </button>
            </div>
          </div>
        </section>

        {/* Section 3: Tables */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left: Owned Lands Table */}
          <div className="glass-panel rounded-xl overflow-hidden flex flex-col h-full" style={{background: 'rgba(23, 25, 33, 0.7)', backdropFilter: 'blur(24px)', boxShadow: 'inset 0 1px 1px rgba(177, 161, 255, 0.05)'}}>
            <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
              <h4 className="font-headline font-bold text-lg">
                Owned Lands Portfolio
              </h4>
              <span className="text-xs font-label bg-surface-container-high px-3 py-1 rounded text-on-surface-variant">12 Total</span>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-surface-container/95 backdrop-blur-sm">
                  <tr className="text-[10px] font-label uppercase text-on-surface-variant tracking-widest border-b border-outline-variant/10">
                    <th className="px-8 py-4">Survey ID</th>
                    <th className="px-4 py-4">Village</th>
                    <th className="px-4 py-4">Share</th>
                    <th className="px-8 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-body divide-y divide-outline-variant/5">
                  <tr className="hover:bg-surface-container-high transition-colors">
                    <td className="px-8 py-4 font-headline font-bold">12/P-9</td>
                    <td className="px-4 py-4 text-on-surface-variant">Somerset</td>
                    <td className="px-4 py-4 font-headline font-medium">100%</td>
                    <td className="px-8 py-4 text-right">
                      <button className="text-primary hover:underline font-bold text-xs uppercase tracking-tighter">
                        View Details
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-high transition-colors">
                    <td className="px-8 py-4 font-headline font-bold">45/R-2</td>
                    <td className="px-4 py-4 text-on-surface-variant">Ridgeview</td>
                    <td className="px-4 py-4 font-headline font-medium">45.2%</td>
                    <td className="px-8 py-4 text-right">
                      <button className="text-primary hover:underline font-bold text-xs uppercase tracking-tighter">
                        View Details
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-high transition-colors">
                    <td className="px-8 py-4 font-headline font-bold">89/C</td>
                    <td className="px-4 py-4 text-on-surface-variant">Somerset</td>
                    <td className="px-4 py-4 font-headline font-medium">10%</td>
                    <td className="px-8 py-4 text-right">
                      <button className="text-primary hover:underline font-bold text-xs uppercase tracking-tighter">
                        View Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Active Transfer Requests */}
          <div className="glass-panel rounded-xl overflow-hidden flex flex-col h-full" style={{background: 'rgba(23, 25, 33, 0.7)', backdropFilter: 'blur(24px)', boxShadow: 'inset 0 1px 1px rgba(177, 161, 255, 0.05)'}}>
            <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
              <h4 className="font-headline font-bold text-lg">
                Active Transfer Requests
              </h4>
              <span className="text-xs font-label bg-surface-container-high px-3 py-1 rounded text-on-surface-variant">04 Pending</span>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-surface-container/95 backdrop-blur-sm">
                  <tr className="text-[10px] font-label uppercase text-on-surface-variant tracking-widest border-b border-outline-variant/10">
                    <th className="px-8 py-4">Seller</th>
                    <th className="px-4 py-4">Price</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-body divide-y divide-outline-variant/5">
                  <tr className="hover:bg-surface-container-high transition-colors">
                    <td className="px-8 py-4 font-label">0x8a2...3f1d</td>
                    <td className="px-4 py-4 font-headline font-bold">1.2M POL</td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded text-[10px] font-bold uppercase">Pending</span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button className="text-error hover:underline font-bold text-xs uppercase tracking-tighter">
                        Cancel
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-high transition-colors">
                    <td className="px-8 py-4 font-label">0x4b9...1e88</td>
                    <td className="px-4 py-4 font-headline font-bold">450K POL</td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-[10px] font-bold uppercase">Accepted</span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button className="text-on-surface-variant opacity-30 cursor-not-allowed font-bold text-xs uppercase tracking-tighter">
                        Cancel
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 4: Bottom Utility Panels */}
        <section className="grid grid-cols-1 md:grid-cols-10 gap-6 pb-8">
          {/* Left: Escrow Status */}
          <div className="md:col-span-6 glass-panel p-8 rounded-xl" style={{background: 'rgba(23, 25, 33, 0.7)', backdropFilter: 'blur(24px)', boxShadow: 'inset 0 1px 1px rgba(177, 161, 255, 0.05)'}}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>security</span>
                <h4 className="font-headline font-bold text-xl uppercase tracking-tight">
                  Active Escrow Status
                </h4>
              </div>
              <div className="text-right">
                <p className="text-xs font-label uppercase text-on-surface-variant">Contract ID</p>
                <p className="text-sm font-label text-primary">ESC_8923_42A</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-surface-container-high p-4 rounded-lg border border-outline-variant/10">
                <p className="text-[10px] font-label uppercase text-on-surface-variant mb-1">
                  Locked Amount
                </p>
                <p className="text-lg font-headline font-bold text-secondary">
                  850,000 POL
                </p>
              </div>
              <div className="bg-surface-container-high p-4 rounded-lg border border-outline-variant/10">
                <p className="text-[10px] font-label uppercase text-on-surface-variant mb-1">
                  State
                </p>
                <p className="text-lg font-headline font-bold text-primary">
                  Funds Locked
                </p>
              </div>
              <div className="bg-surface-container-high p-4 rounded-lg border border-outline-variant/10">
                <p className="text-[10px] font-label uppercase text-on-surface-variant mb-1">
                  Asset ID
                </p>
                <p className="text-lg font-headline font-bold">12/P-9</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-label uppercase font-bold tracking-widest text-on-surface-variant">
                <span>Transfer Progress</span>
                <span className="text-primary">65% Completed</span>
              </div>
              <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{width: '65%'}}></div>
              </div>
              <p className="text-xs font-body text-on-surface-variant italic">
                Awaiting seller's final notarization signature before smart
                contract execution.
              </p>
            </div>
          </div>

          {/* Right: Recent Alerts */}
          <div className="md:col-span-4 glass-panel p-8 rounded-xl flex flex-col" style={{background: 'rgba(23, 25, 33, 0.7)', backdropFilter: 'blur(24px)', boxShadow: 'inset 0 1px 1px rgba(177, 161, 255, 0.05)'}}>
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>notifications_active</span>
              <h4 className="font-headline font-bold text-xl uppercase tracking-tight">
                Recent Alerts
              </h4>
            </div>
            <div className="space-y-4 overflow-auto custom-scrollbar pr-2 max-h-[220px]">
              <div className="flex gap-4 items-start p-3 rounded-lg hover:bg-surface-container-high transition-colors group cursor-pointer border-l-2 border-primary">
                <div className="p-2 bg-primary/10 rounded group-hover:bg-primary/20">
                  <span className="material-symbols-outlined text-primary text-sm" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>check_circle</span>
                </div>
                <div>
                  <p className="text-sm font-body font-bold group-hover:text-primary transition-colors">
                    Transfer Request Accepted
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Seller 0x4b9...1e88 accepted your offer for Parcel 45/R-2.
                  </p>
                  <p className="text-[10px] text-outline mt-1 font-label">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-4 items-start p-3 rounded-lg hover:bg-surface-container-high transition-colors group cursor-pointer">
                <div className="p-2 bg-secondary/10 rounded group-hover:bg-secondary/20">
                  <span className="material-symbols-outlined text-secondary text-sm" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', verticalAlign: 'middle'}}>info</span>
                </div>
                <div>
                  <p className="text-sm font-body font-bold group-hover:text-secondary transition-colors">
                    New Listing in Somerset
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Premium agricultural land now available for purchase.
                  </p>
                  <p className="text-[10px] text-outline mt-1 font-label">5 hours ago</p>
                </div>
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

export default BuyerPage;
