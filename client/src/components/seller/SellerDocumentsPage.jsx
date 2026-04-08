import React from 'react';
import SharedNavbar from '../SharedNavbar.jsx';
import Footer from '../Footer.jsx';

const SellerDocumentsPage = () => {
  return (
    <div className="text-on-surface flex flex-col min-h-screen" style={{backgroundColor: '#0c0e14', backgroundImage: 'radial-gradient(#1d1f27 0.5px, transparent 0.5px)', backgroundSize: '24px 24px', color: '#e5e4ed'}}>
      {/* Seller Navbar */}
      <SharedNavbar role="seller" activePage="documents" />

      <main className="flex-grow w-full max-w-7xl mx-auto px-8 py-12">
        {/* Page Header */}
        <header className="mb-12">
          <h1 className="font-headline text-4xl font-bold text-on-surface mb-2 tracking-tight">
            Document Management
          </h1>
          <p className="font-body text-on-surface-variant text-lg">
            Manage and upload land registry documents.
          </p>
        </header>

        {/* Document Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-xl flex items-center justify-between">
            <div className="text-left">
              <p className="text-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                Total Documents
              </p>
              <h3 className="text-3xl font-headline font-bold text-on-surface">156</h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <span className="material-symbols-outlined text-primary">description</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl flex items-center justify-between">
            <div className="text-left">
              <p className="text-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                Verified
              </p>
              <h3 className="text-3xl font-headline font-bold text-secondary">142</h3>
            </div>
            <div className="p-3 bg-secondary/10 rounded-lg">
              <span className="material-symbols-outlined text-secondary">verified</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl flex items-center justify-between">
            <div className="text-left">
              <p className="text-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                Pending Review
              </p>
              <h3 className="text-3xl font-headline font-bold text-tertiary-container">14</h3>
            </div>
            <div className="p-3 bg-tertiary-container/10 rounded-lg">
              <span className="material-symbols-outlined text-tertiary-container">pending</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl flex items-center justify-between">
            <div className="text-left">
              <p className="text-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                Storage Used
              </p>
              <h3 className="text-3xl font-headline font-bold">2.4GB</h3>
            </div>
            <div className="p-3 bg-outline-variant/20 rounded-lg">
              <span className="material-symbols-outlined text-on-surface-variant">storage</span>
            </div>
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="glass-panel rounded-xl p-8">
          <h3 className="font-headline text-2xl font-bold mb-6">Upload New Document</h3>
          <div className="border-2 border-dashed border-outline-variant/30 rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <span className="material-symbols-outlined text-4xl text-primary">cloud_upload</span>
              </div>
              <div>
                <p className="font-headline font-bold text-lg mb-2">Drop files here or click to browse</p>
                <p className="text-on-surface-variant text-sm">Support for PDF, JPG, PNG up to 10MB</p>
              </div>
              <button className="px-6 py-3 bg-primary text-on-primary rounded-lg font-headline font-bold hover:bg-primary-dim transition-colors">
                Select Files
              </button>
            </div>
          </div>
        </div>

        {/* Document List */}
        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
            <h3 className="font-headline text-xl font-bold">Document Library</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-surface-container-high rounded-md text-xs font-medium hover:bg-surface-container-highest transition-colors">
                All
              </button>
              <button className="px-3 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                Verified
              </button>
              <button className="px-3 py-1 bg-surface-container-high rounded-md text-xs font-medium hover:bg-surface-container-highest transition-colors">
                Pending
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-xs font-label uppercase text-on-surface-variant tracking-widest">
                <tr>
                  <th className="px-6 py-4">Document Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Size</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Uploaded</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                <tr className="hover:bg-surface-container-high/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">picture_as_pdf</span>
                      <span className="font-body font-medium">Land Title Deed</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-label text-xs">Title Deed</td>
                  <td className="px-6 py-4 font-body">Survey #442/A</td>
                  <td className="px-6 py-4 font-label text-xs">2.4 MB</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded text-[10px] font-bold uppercase">
                      Verified
                    </span>
                  </td>
                  <td className="px-6 py-4 font-body text-xs">2023-10-24</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline font-bold text-xs uppercase tracking-tighter">
                      View
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">image</span>
                      <span className="font-body font-medium">Property Survey Map</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-label text-xs">Survey Map</td>
                  <td className="px-6 py-4 font-body">Survey #102/A</td>
                  <td className="px-6 py-4 font-label text-xs">1.8 MB</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20 rounded text-[10px] font-bold uppercase">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 font-body text-xs">2023-10-23</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline font-bold text-xs uppercase tracking-tighter">
                      View
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">description</span>
                      <span className="font-body font-medium">Ownership Certificate</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-label text-xs">Certificate</td>
                  <td className="px-6 py-4 font-body">Survey #45/B</td>
                  <td className="px-6 py-4 font-label text-xs">3.2 MB</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded text-[10px] font-bold uppercase">
                      Verified
                    </span>
                  </td>
                  <td className="px-6 py-4 font-body text-xs">2023-10-22</td>
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

export default SellerDocumentsPage;
