import React, { useState, useCallback, useRef } from 'react';
import SharedNavbar from '../SharedNavbar.jsx';
import Footer from '../Footer.jsx';
import PageHeader from '../shared/PageHeader.jsx';
import StatCard from '../shared/StatCard.jsx';
import StatusBadge from '../shared/StatusBadge.jsx';
import { IconDocument, IconShield, IconUpload, IconSearch, IconExternalLink } from '../icons/Icons.jsx';
import useApi from '../../hooks/useApi.js';
import { landAPI, ipfsAPI } from '../../services/api.js';

const BG = { backgroundColor: '#0c0e14', backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(116,117,125,0.04) 1px, transparent 0)', backgroundSize: '32px 32px', color: '#e5e4ed' };

const SellerDocumentsPage = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  const { data: lands, loading, refetch } = useApi(useCallback(() => landAPI.list({ role: 'seller' }), []));
  const landsList = Array.isArray(lands) ? lands : [];

  const allDocs = landsList.flatMap(l =>
    (l.documents ? [l.documents].flat().filter(Boolean) : []).map(d => typeof d === 'string'
      ? { cid: d, surveyNumber: l.location?.surveyNumber || l.surveyNumber, village: l.location?.village || l.village, landId: l._id }
      : { ...d, surveyNumber: l.location?.surveyNumber || l.surveyNumber, village: l.location?.village || l.village, landId: l._id }
    )
  );

  const filtered = allDocs.filter(d => {
    if (filter === 'verified' && d.status !== 'verified') return false;
    if (filter === 'pending' && d.status !== 'pending') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (d.surveyNumber || '').toLowerCase().includes(q) || (d.village || '').toLowerCase().includes(q);
    }
    return true;
  });

  const verifiedCount = allDocs.filter(d => d.status === 'verified').length;
  const pendingCount = allDocs.filter(d => d.status === 'pending' || !d.status).length;

  const [selectedLandId, setSelectedLandId] = useState('');

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length || !selectedLandId) return;
    setUploading(true);
    setUploadMsg('');
    try {
      const fd = new FormData();
      Array.from(files).forEach(file => fd.append('documents', file));
      await landAPI.uploadDocuments(selectedLandId, fd);
      setUploadMsg(`${files.length} file(s) attached to land successfully!`);
      refetch();
    } catch { setUploadMsg('Upload failed'); }
    finally { setUploading(false); }
  };

  return (
    <div className="font-body text-on-surface flex flex-col min-h-screen" style={BG}>
      <SharedNavbar role="seller" activePage="/seller/documents" />
      <main className="flex-grow w-full max-w-7xl mx-auto px-8 py-10">
        <PageHeader title="Document Management" subtitle="Manage and upload land registry documents to IPFS." icon={IconDocument} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Documents" value={loading ? '...' : allDocs.length} icon={IconDocument} iconColor="primary" />
          <StatCard label="Verified" value={loading ? '...' : verifiedCount} icon={IconShield} iconColor="secondary" />
          <StatCard label="Pending Review" value={loading ? '...' : pendingCount} icon={IconDocument} iconColor="tertiary-container" />
          <StatCard label="Land Assets" value={loading ? '...' : landsList.length} icon={IconDocument} iconColor="on-surface-variant" />
        </div>

        {/* Upload */}
        <div className="bg-surface-container rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 xl:w-1/4">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><IconUpload className="text-primary" size={16} /></div>
                <h3 className="text-sm font-headline font-bold">Attach Document</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60">Select Land Asset</label>
                  <select value={selectedLandId} onChange={e => setSelectedLandId(e.target.value)} className="w-full bg-surface-container-high border-none rounded-lg text-on-surface text-sm h-10 px-3 focus:ring-1 focus:ring-primary/40">
                    <option value="" disabled>Choose a property...</option>
                    {landsList.map(l => <option key={l._id} value={l._id}>{l.location?.surveyNumber || l.surveyNumber}</option>)}
                  </select>
                </div>
                {uploadMsg && <div className={`p-2.5 rounded-lg text-xs ${uploadMsg.includes('failed') ? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary'}`}>{uploadMsg}</div>}
              </div>
            </div>
            
            <div className="flex-1 border border-dashed border-outline-variant/20 rounded-lg p-10 text-center transition-colors cursor-pointer flex items-center justify-center min-h-[200px]" 
                 style={{ opacity: selectedLandId ? 1 : 0.4 }} 
                 onClick={() => { if (selectedLandId) fileInputRef.current?.click(); else alert('Select a property first'); }}>
              <div className="flex flex-col items-center gap-3">
                {uploading
                  ? <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  : <IconUpload className={`text-${selectedLandId ? 'primary/80' : 'on-surface-variant/30'}`} size={32} />
                }
                <p className="text-xs font-medium">{uploading ? 'Uploading...' : 'Drop files here or click to browse'}</p>
                <p className="text-[10px] text-on-surface-variant/40">PDF, JPG, PNG up to 10MB</p>
              </div>
              <input ref={fileInputRef} type="file" className="hidden" multiple onChange={handleUpload} accept=".pdf,.jpg,.jpeg,.png" />
            </div>
          </div>
        </div>

        {/* Document Table */}
        <div className="bg-surface-container rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-sm font-headline font-bold">Document Library</h3>
            <div className="flex gap-1.5">
              {['all', 'verified', 'pending'].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${filter === f ? 'bg-primary/10 text-primary' : 'text-on-surface-variant/40 hover:bg-surface-container-high'}`}>{f}</button>
              ))}
            </div>
          </div>
          <div className="px-5 py-2.5 border-b border-outline-variant/5">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/30" size={14} />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full md:w-80 bg-surface-container-low border-none rounded-lg pl-9 pr-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary/30 placeholder:text-on-surface-variant/30" placeholder="Search by survey number or village..." />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low/50">
                <tr className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50">
                  <th className="px-5 py-3">Document</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Property</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Date</th><th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5 text-xs">
                {loading ? <tr><td colSpan={6} className="px-5 py-8 text-center text-on-surface-variant/40">Loading...</td></tr>
                : filtered.length === 0 ? <tr><td colSpan={6} className="px-5 py-8 text-center text-on-surface-variant/40">No documents found</td></tr>
                : filtered.map((d, i) => (
                  <tr key={d._id || i} className="hover:bg-surface-container-high/30 transition-colors">
                    <td className="px-5 py-3 flex items-center gap-2"><IconDocument className="text-primary shrink-0" size={14} /><span className="font-medium truncate max-w-[140px]">{d.name || d.fileName || 'Document'}</span></td>
                    <td className="px-5 py-3 text-on-surface-variant">{d.documentType || d.type || '\u2014'}</td>
                    <td className="px-5 py-3">Survey #{d.surveyNumber}</td>
                    <td className="px-5 py-3"><StatusBadge status={d.status || 'pending'} /></td>
                    <td className="px-5 py-3 text-on-surface-variant font-mono">{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '\u2014'}</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => d.ipfsCid && window.open(`https://gateway.pinata.cloud/ipfs/${d.ipfsCid}`, '_blank')} className="inline-flex items-center gap-1 text-primary hover:underline font-medium">
                        View <IconExternalLink size={10} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SellerDocumentsPage;
