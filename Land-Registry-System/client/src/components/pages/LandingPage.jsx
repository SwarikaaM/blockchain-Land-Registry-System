import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Footer.jsx";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary/30 selection:text-primary min-h-screen flex flex-col">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0c0e14]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="flex justify-between items-center h-20 px-8 max-w-full mx-auto relative">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">
              account_balance
            </span>
            <span className="text-2xl font-black text-[#e5e4ed] tracking-tighter font-headline">
              DLR
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-md bg-secondary/10 border border-secondary/20">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="text-secondary font-label text-xs font-bold tracking-wider uppercase">
                Polygon Active
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-surface-container-high rounded-md border border-outline-variant/30">
              <span className="material-symbols-outlined text-on-surface-variant text-sm">
                sensors
              </span>
              <span className="font-label text-sm text-[#e5e4ed]/80 font-medium">
                0x1a...4b5c
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-transparent via-[#1d1f27] to-transparent h-[1px] bottom-0 absolute left-0 right-0"></div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow pt-24 pb-12 px-8 relative overflow-hidden">
        {/* Asymmetric Background Glow */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
          {/* Left Column: Hero & Onboarding */}
          <div className="lg:col-span-7 flex flex-col gap-12">
            <div>
              <h1 className="font-headline text-[36px] font-bold leading-tight tracking-tight text-on-surface mb-4">
                Decentralized Land Registry
              </h1>
              <p className="text-[16px] text-on-surface-variant max-w-xl font-light leading-relaxed">
                Secure blockchain-based registration and transfer of physical
                land assets. Built for institutional reliability and sovereign
                ownership.
              </p>
            </div>

            {/* Primary Action Section */}
            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate("/officer")}
                className="w-fit flex items-center gap-4 bg-gradient-to-r from-primary to-primary-dim px-8 py-4 rounded-md shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span
                  className="material-symbols-outlined text-on-primary-container"
                  style={{ fontVariationSettings: '"FILL" 1' }}
                >
                  account_balance_wallet
                </span>
                <span className="font-headline font-bold text-on-primary-container text-lg uppercase tracking-wider">
                  Connect Wallet
                </span>
              </button>
            </div>

            {/* Role Selection */}
            <section className="flex flex-col gap-6">
              <h2 className="font-headline text-[22px] font-semibold text-on-surface">
                Choose Your Role
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Buyer Card */}
                <Link
                  to="/buyer"
                  className="glass-card p-6 rounded-xl group cursor-pointer transition-all hover:bg-surface-container-high hover:translate-y-[-4px]"
                >
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-6 border border-secondary/20 transition-colors group-hover:bg-secondary/20">
                    <span className="material-symbols-outlined text-secondary text-2xl">
                      location_on
                    </span>
                  </div>
                  <h3 className="font-headline text-xl font-bold text-on-surface mb-2">
                    Buyer
                  </h3>
                  <p className="text-sm text-on-surface-variant font-body leading-relaxed">
                    Browse registered land parcels and initiate secure purchases
                    with escrow-protected transactions.
                  </p>
                </Link>

                {/* Seller Card */}
                <Link
                  to="/seller"
                  className="glass-card p-6 rounded-xl group cursor-pointer transition-all hover:bg-surface-container-high hover:translate-y-[-4px]"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 transition-colors group-hover:bg-primary/20">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      landscape
                    </span>
                  </div>
                  <h3 className="font-headline text-xl font-bold text-on-surface mb-2">
                    Seller
                  </h3>
                  <p className="text-sm text-on-surface-variant font-body leading-relaxed">
                    Register land records, verify immutable ownership history,
                    and manage multi-signature transfers.
                  </p>
                </Link>
              </div>
            </section>
          </div>

          {/* Right Column: System Status Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Network Status Card */}
            <div className="bg-surface-container-low border border-outline-variant/10 p-6 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-on-surface-variant font-label text-xs uppercase tracking-widest font-bold">
                  Network Status
                </span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-tighter">
                  <span className="material-symbols-outlined text-[12px]">
                    verified
                  </span>
                  Verified
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary/5 flex items-center justify-center border border-secondary/10">
                  <span className="material-symbols-outlined text-secondary">
                    grid_view
                  </span>
                </div>
                <div>
                  <p className="text-on-surface font-headline font-medium text-lg">
                    Polygon Network Connected
                  </p>
                  <p className="text-secondary font-label text-xs">
                    Node: dl-reg-rpc-01.polygon.net
                  </p>
                </div>
              </div>
            </div>

            {/* Active Wallet Card */}
            <div className="bg-surface-container border border-outline-variant/10 p-6 rounded-xl relative overflow-hidden">
              <div className="absolute top-3 right-3 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-6xl">account_balance_wallet</span>
              </div>
              <span className="text-on-surface-variant font-label text-xs uppercase tracking-widest font-bold block mb-6">
                Active Wallet
              </span>
              <div className="space-y-4">
                <div>
                  <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest mb-1">
                    Address
                  </p>
                  <p className="text-on-surface font-headline font-bold text-xl tracking-tight">
                    0x1a...4b5c
                  </p>
                </div>
                <div className="pt-4 border-t border-outline-variant/10">
                  <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest mb-1">
                    Balance
                  </p>
                  <p className="text-3xl font-headline font-black text-primary">
                    12.45
                    <span className="ml-1 text-lg font-bold text-on-surface">
                      MATIC
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Summary Card */}
            <div className="bg-surface-container-high border border-outline-variant/20 p-6 rounded-xl shadow-2xl">
              <h3 className="font-headline text-[20px] font-semibold text-on-surface mb-6">
                Profile Summary
              </h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant text-sm">
                    Wallet Identifier
                  </span>
                  <span className="font-label text-sm text-on-surface font-medium">
                    0x1a...4b5c
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant text-sm">
                    Designated Role
                  </span>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                    Seller
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant text-sm">
                    Total Actions
                  </span>
                  <span className="font-headline text-lg text-on-surface font-bold">
                    0
                  </span>
                </div>
              </div>
              <button className="w-full py-3 bg-surface border border-outline-variant/30 hover:border-primary/50 text-on-surface font-headline font-bold text-xs uppercase tracking-widest rounded-md transition-all">
                View Detailed Profile
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
