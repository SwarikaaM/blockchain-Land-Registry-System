import React, { useState, useCallback } from 'react';
import SharedNavbar from '../SharedNavbar.jsx';
import Footer from '../Footer.jsx';
import PageHeader from '../shared/PageHeader.jsx';
import StatCard from '../shared/StatCard.jsx';
import StatusBadge from '../shared/StatusBadge.jsx';
import { IconDocument, IconShield, IconSearch, IconExternalLink, IconBlockchain } from '../icons/Icons.jsx';
import useApi from '../../hooks/useApi.js';
import { landAPI } from '../../services/api.js';

const BG = { backgroundColor: '#0c0e14', backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(116,117,125,0.04) 1px, transparent 0)', backgroundSize: '32px 32px', color: '#e5e4ed' };

const DocumentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const { data: lands, loading } = useApi(useCallback(() => landAPI.list({ role: 'buyer' }), []));
  const landsList = Array.isArray(lands) ? lands : [];

  const allDocs = landsList.flatMap(l =>
    (l.documents ? [l.documents].flat().filter(Boolean) : []).map(d => typeof d === 'string'
      ? { cid: d, surveyNumber: l.location?.surveyNumber || l.surveyNumber, village: l.location?.village || l.village }
      : { ...d, surveyNumber: l.location?.surveyNumber || l.surveyNumber, village: l.location?.village || l.village }
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

  return (
    <div className="font-body min-h-screen flex flex-col" style={BG}>
      <SharedNavbar role="buyer" activePage="/buyer/documents" />
      <main className="flex-grow w-full max-w-7xl mx-auto px-8 py-10">
        <PageHeader title="Documents" subtitle="View land documents stored on IPFS." icon={IconDocument} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard label="Verified" value={loading ? '...' : verifiedCount} icon={IconShield} iconColor="secondary" />
          <StatCard label="Pending Review" value={loading ? '...' : pendingCount} icon={IconDocument} iconColor="tertiary-container" />
          <StatCard label="Total" value={loading ? '...' : allDocs.length} icon={IconDocument} iconColor="primary" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
          <div className="relative w-full md:w-80">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/30" size={14} />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-surface-container-low border-none rounded-lg pl-9 pr-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary/30 placeholder:text-on-surface-variant/30" placeholder="Search by survey number or village..." />
          </div>
          <div className="flex gap-1.5">
            {['all', 'verified', 'pending'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${filter === f ? 'bg-primary/10 text-primary' : 'text-on-surface-variant/40 hover:bg-surface-container-high'}`}>{f}</button>
            ))}
          </div>
        </div>

        <div className="bg-surface-container rounded-xl overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low/50">
                <tr className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50">
                  <th className="px-5 py-3">Survey No.</th><th className="px-5 py-3">Village</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5 text-xs">
                {loading ? <tr><td colSpan={5} className="px-5 py-8 text-center text-on-surface-variant/40">Loading...</td></tr>
                : filtered.length === 0 ? <tr><td colSpan={5} className="px-5 py-8 text-center text-on-surface-variant/40">No documents found</td></tr>
                : filtered.map((d, i) => (
                  <tr key={d._id || i} className="hover:bg-surface-container-high/30 transition-colors">
                    <td className="px-5 py-3 font-medium">{d.surveyNumber}</td>
                    <td className="px-5 py-3 text-on-surface-variant">{d.village}</td>
                    <td className="px-5 py-3"><div className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-secondary" />{d.documentType || d.type || 'Document'}</div></td>
                    <td className="px-5 py-3"><StatusBadge status={d.status || 'pending'} /></td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => d.ipfsCid && window.open(`https://gateway.pinata.cloud/ipfs/${d.ipfsCid}`, '_blank')} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-md text-[10px] font-bold transition-all border border-primary/15">
                        View <IconExternalLink size={10} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: IconShield, color: 'secondary', title: 'IPFS Verified', desc: 'Content-addressed and cryptographically secured on IPFS.' },
            { icon: IconBlockchain, color: 'primary', title: 'Smart Contract Audit', desc: 'Access controlled by DLR v1.0 smart contracts on Polygon.' },
            { icon: IconDocument, color: 'tertiary-container', title: 'Immutable History', desc: 'Every upload creates a permanent record on the blockchain.' },
          ].map(c => (
            <div key={c.title} className="bg-surface-container p-5 rounded-xl flex items-start gap-3">
              <div className={`p-2 bg-${c.color}/10 rounded-lg shrink-0`}><c.icon className={`text-${c.color}`} size={14} /></div>
              <div>
                <h3 className="text-xs font-headline font-bold uppercase tracking-wider mb-0.5">{c.title}</h3>
                <p className="text-[10px] text-on-surface-variant/60 leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DocumentsPage;
