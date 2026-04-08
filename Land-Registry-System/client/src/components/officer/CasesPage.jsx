import React from 'react';
import SharedNavbar from '../SharedNavbar.jsx';
import Footer from '../Footer.jsx';

const CasesPage = () => {
  return (
    <div className="font-body text-on-surface min-h-screen" style={{backgroundColor: '#0c0e14', backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(116, 117, 125, 0.05) 1px, transparent 0)', backgroundSize: '40px 40px'}}>
      {/* Officer Navbar */}
      <SharedNavbar role="officer" activePage="cases" />

      <main className="pt-12 pb-12 px-8 max-w-[1920px] mx-auto space-y-8">
        {/* Header Section */}
        <header>
          <h1 className="text-4xl font-bold font-headline tracking-tight text-on-surface">
            Land Registry Cases
          </h1>
          <p className="text-on-surface-variant font-body mt-1">
            Review and manage all land registration cases
          </p>
        </header>

        {/* Case Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-label-sm text-outline font-label uppercase tracking-widest mb-1">
                Total Cases
              </p>
              <p className="text-3xl font-headline font-bold">156</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <span className="material-symbols-outlined text-primary">folder</span>
            </div>
          </div>
          <div className="glass-card p-6 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-label-sm text-outline font-label uppercase tracking-widest mb-1">
                Under Review
              </p>
              <p className="text-3xl font-headline font-bold text-secondary">42</p>
            </div>
            <div className="bg-secondary/10 p-3 rounded-lg">
              <span className="material-symbols-outlined text-secondary">pending</span>
            </div>
          </div>
          <div className="glass-card p-6 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-label-sm text-outline font-label uppercase tracking-widest mb-1">
                Approved
              </p>
              <p className="text-3xl font-headline font-bold text-green-500">98</p>
            </div>
            <div className="bg-green-500/10 p-3 rounded-lg">
              <span className="material-symbols-outlined text-green-500">check_circle</span>
            </div>
          </div>
          <div className="glass-card p-6 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-label-sm text-outline font-label uppercase tracking-widest mb-1">
                Rejected
              </p>
              <p className="text-3xl font-headline font-bold text-error">16</p>
            </div>
            <div className="bg-error/10 p-3 rounded-lg">
              <span className="material-symbols-outlined text-error">cancel</span>
            </div>
          </div>
        </div>

        {/* Case Registry Table */}
        <section className="glass-card rounded-xl overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
            <h3 className="font-headline text-xl font-bold">Case Registry</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-surface-container-high rounded-md text-xs font-medium hover:bg-surface-container-highest transition-colors">
                All Cases
              </button>
              <button className="px-3 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                Pending
              </button>
              <button className="px-3 py-1 bg-surface-container-high rounded-md text-xs font-medium hover:bg-surface-container-highest transition-colors">
                Approved
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low text-outline font-label text-xs uppercase tracking-tighter">
                <tr>
                  <th className="px-6 py-4">Case ID</th>
                  <th className="px-6 py-4">Property ID</th>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4">Last Updated</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                <tr className="hover:bg-surface-container-high/50 transition-colors">
                  <td className="px-6 py-4 font-label text-primary-fixed-dim">REG-2024-089</td>
                  <td className="px-6 py-4 font-body">442/A</td>
                  <td className="px-6 py-4 font-label text-xs text-outline">0x8f2...3e12</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-[10px] font-medium">New Registration</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-secondary/10 text-secondary text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest">
                      Under Review
                    </span>
                  </td>
                  <td className="px-6 py-4 font-body text-xs">2024-01-15</td>
                  <td className="px-6 py-4 font-body text-xs">2024-01-18</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-primary-container font-bold text-sm">
                      Review
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high/50 transition-colors">
                  <td className="px-6 py-4 font-label text-primary-fixed-dim">REG-2024-088</td>
                  <td className="px-6 py-4 font-body">109/B</td>
                  <td className="px-6 py-4 font-label text-xs text-outline">0x1d2...bc44</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-tertiary-container/10 text-tertiary-container rounded text-[10px] font-medium">Transfer</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-green-500/10 text-green-500 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest">
                      Approved
                    </span>
                  </td>
                  <td className="px-6 py-4 font-body text-xs">2024-01-14</td>
                  <td className="px-6 py-4 font-body text-xs">2024-01-17</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-primary-container font-bold text-sm">
                      View
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high/50 transition-colors">
                  <td className="px-6 py-4 font-label text-primary-fixed-dim">REG-2024-087</td>
                  <td className="px-6 py-4 font-body">221/4</td>
                  <td className="px-6 py-4 font-label text-xs text-outline">0x7a5...ff23</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-[10px] font-medium">New Registration</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-error/10 text-error text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest">
                      Rejected
                    </span>
                  </td>
                  <td className="px-6 py-4 font-body text-xs">2024-01-13</td>
                  <td className="px-6 py-4 font-body text-xs">2024-01-16</td>
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

        {/* Case Details Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Case Information */}
          <section className="glass-card rounded-xl p-8 space-y-6">
            <div className="flex justify-between items-start">
              <h3 className="font-headline text-2xl font-bold">Case Information</h3>
              <span className="px-3 py-1 bg-secondary/20 text-secondary text-xs rounded-full font-bold">
                REG-2024-089
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                <span className="text-on-surface-variant text-sm">Property Survey Number</span>
                <span className="font-label text-sm text-on-surface font-medium">442/A</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                <span className="text-on-surface-variant text-sm">Applicant Name</span>
                <span className="font-label text-sm text-on-surface font-medium">Rajesh Kumar</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                <span className="text-on-surface-variant text-sm">Wallet Address</span>
                <span className="font-label text-sm text-on-surface font-medium">0x8f2a...3e12</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                <span className="text-on-surface-variant text-sm">Case Type</span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded text-xs font-medium">New Registration</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-on-surface-variant text-sm">Submission Date</span>
                <span className="font-label text-sm text-on-surface font-medium">January 15, 2024</span>
              </div>
            </div>
          </section>

          {/* Right: Review Actions */}
          <section className="glass-card rounded-xl p-8 space-y-6">
            <h3 className="font-headline text-2xl font-bold">Review Actions</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest text-outline font-label">
                  Review Notes
                </label>
                <textarea
                  className="w-full bg-surface-container-low border-outline-variant/20 rounded-xl p-4 text-sm focus:ring-primary focus:border-primary placeholder:text-outline/50"
                  placeholder="Enter detailed review notes..."
                  rows={4}
                ></textarea>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-green-500/10 text-green-500 py-3 rounded-xl font-headline font-bold uppercase tracking-widest hover:bg-green-500/20 transition-all border border-green-500/30">
                  Approve Case
                </button>
                <button className="flex-1 bg-error/10 text-error py-3 rounded-xl font-headline font-bold uppercase tracking-widest hover:bg-error/20 transition-all border border-error/30">
                  Request More Info
                </button>
              </div>
              <button className="w-full bg-surface-container-highest border border-outline-variant/30 text-on-surface font-headline font-bold py-3 rounded-xl hover:bg-error/5 hover:text-error transition-all">
                Reject Case
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CasesPage;
