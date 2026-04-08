import React from 'react';
import SharedNavbar from '../SharedNavbar.jsx';
import Footer from '../Footer.jsx';

const OfficerDocumentsPage = () => {
  return (
    <div className="font-body text-on-surface min-h-screen" style={{backgroundColor: '#0c0e14', backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(116, 117, 125, 0.05) 1px, transparent 0)', backgroundSize: '40px 40px'}}>
      {/* Officer Navbar */}
      <SharedNavbar role="officer" activePage="documents" />

      <main className="pt-12 pb-12 px-8 max-w-[1920px] mx-auto space-y-8">
        {/* Header Section */}
        <header>
          <h1 className="text-4xl font-bold font-headline tracking-tight text-on-surface">
            Document Registry
          </h1>
          <p className="text-on-surface-variant font-body mt-1">
            Verify and manage land registry documents
          </p>
        </header>

        {/* Document Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                Total Documents
              </p>
              <h3 className="text-3xl font-headline font-bold">1,247</h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <span className="material-symbols-outlined text-primary">description</span>
            </div>
          </div>
          <div className="glass-card p-6 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                Verified
              </p>
              <h3 className="text-3xl font-headline font-bold text-secondary">1,189</h3>
            </div>
            <div className="p-3 bg-secondary/10 rounded-lg">
              <span className="material-symbols-outlined text-secondary">verified</span>
            </div>
          </div>
          <div className="glass-card p-6 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                Pending Review
              </p>
              <h3 className="text-3xl font-headline font-bold text-tertiary-container">58</h3>
            </div>
            <div className="p-3 bg-tertiary-container/10 rounded-lg">
              <span className="material-symbols-outlined text-tertiary-container">pending</span>
            </div>
          </div>
          <div className="glass-card p-6 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                Flagged
              </p>
              <h3 className="text-3xl font-headline font-bold text-error">0</h3>
            </div>
            <div className="p-3 bg-error/10 rounded-lg">
              <span className="material-symbols-outlined text-error">flag</span>
            </div>
          </div>
        </div>

        {/* Document Review Queue */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
            <h3 className="font-headline text-xl font-bold">Document Review Queue</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-surface-container-high rounded-md text-xs font-medium hover:bg-surface-container-highest transition-colors">
                All
              </button>
              <button className="px-3 py-1 bg-tertiary-container/10 text-tertiary-container rounded-md text-xs font-medium">
                Pending
              </button>
              <button className="px-3 py-1 bg-surface-container-high rounded-md text-xs font-medium hover:bg-surface-container-highest transition-colors">
                Verified
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-xs font-label uppercase text-on-surface-variant tracking-widest">
                <tr>
                  <th className="px-6 py-4">Document ID</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Submitted By</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                <tr className="hover:bg-surface-container-high/30 transition-colors">
                  <td className="px-6 py-4 font-label text-primary-fixed-dim">#DOC-88210</td>
                  <td className="px-6 py-4 font-body">Title Deed</td>
                  <td className="px-6 py-4 font-body">Survey #442/A</td>
                  <td className="px-6 py-4 font-label text-xs text-outline">0x4c1...99a1</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20 rounded text-[10px] font-bold uppercase">
                      Pending Review
                    </span>
                  </td>
                  <td className="px-6 py-4 font-body text-xs">2023-10-24</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline font-bold text-xs uppercase tracking-tighter">
                      Review
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high/30 transition-colors">
                  <td className="px-6 py-4 font-label text-primary-fixed-dim">#DOC-88209</td>
                  <td className="px-6 py-4 font-body">Survey Map</td>
                  <td className="px-6 py-4 font-body">Survey #102/A</td>
                  <td className="px-6 py-4 font-label text-xs text-outline">0x7a5...ff23</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded text-[10px] font-bold uppercase">
                      Verified
                    </span>
                  </td>
                  <td className="px-6 py-4 font-body text-xs">2023-10-23</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline font-bold text-xs uppercase tracking-tighter">
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default OfficerDocumentsPage;
