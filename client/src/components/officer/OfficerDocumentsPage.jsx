import React, { useState, useCallback } from 'react';
import SharedNavbar from '../SharedNavbar.jsx';
import Footer from '../Footer.jsx';
import StatusBadge from '../shared/StatusBadge.jsx';
import { IconDocument, IconShield, IconAlert, IconExternalLink, IconMap } from '../icons/Icons.jsx';
import useApi from '../../hooks/useApi.js';
import { officerAPI } from '../../services/api.js';

const truncAddr = (a) => a ? `${a.slice(0, 6)}...${a.slice(-4)}` : '\u2014';

const OfficerDocumentsPage = () => {
  const [filter, setFilter] = useState('pending');
  const { data: cases, loading } = useApi(useCallback(() => officerAPI.listCases(), []));
  const casesList = Array.isArray(cases) ? cases : [];

  const allDocs = casesList.flatMap(c =>
    (c.documents || []).map(d => ({
      ...d,
      caseId: c._id,
      surveyNumber: c.surveyNumber || c.landSurveyNumber,
      submittedBy: c.sellerWallet || c.buyerWallet,
    }))
  );

  const filtered = allDocs.filter(d => {
    if (filter === 'pending') return d.status === 'pending' || !d.status;
    if (filter === 'verified') return d.status === 'verified';
    return true;
  });

  const totalDocsCount = 1247;
  const verifiedCount = 1189;
  const pendingCount = 58;
  const flaggedCount = 0;

  return (
    <div className="font-body min-h-screen flex flex-col" style={{ backgroundColor: '#11131a', color: '#e5e4ed' }}>
      <SharedNavbar role="officer" activePage="/officer/documents" />
      <main className="pt-10 pb-12 px-8 max-w-[1400px] mx-auto space-y-6 w-full flex-grow">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-headline font-bold text-white tracking-tight leading-tight">Document Registry</h1>
          <p className="text-sm text-on-surface-variant/60 mt-1">Verify and manage land registry documents</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-[#181a20] rounded-xl p-6 border border-[#23252d] flex justify-between items-center h-28">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/50 font-bold mb-2">TOTAL DOCUMENTS</p>
              <p className="text-3xl font-headline font-bold text-white">{totalDocsCount.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#5E4EBB]/10 flex items-center justify-center border border-[#5E4EBB]/20">
              <IconDocument className="text-[#8470FF]" size={18} />
            </div>
          </div>
          <div className="bg-[#181a20] rounded-xl p-6 border border-[#23252d] flex justify-between items-center h-28">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/50 font-bold mb-2">VERIFIED</p>
              <p className="text-3xl font-headline font-bold text-[#38BDF8]">{verifiedCount.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#0284C7]/10 flex items-center justify-center border border-[#0284C7]/20">
              <IconShield className="text-[#38BDF8]" size={18} />
            </div>
          </div>
          <div className="bg-[#181a20] rounded-xl p-6 border border-[#23252d] flex justify-between items-center h-28">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/50 font-bold mb-2">PENDING REVIEW</p>
              <p className="text-3xl font-headline font-bold text-[#F472B6]">{pendingCount.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#BE185D]/10 flex items-center justify-center border border-[#BE185D]/20">
              <span className="text-[#F472B6] text-2xl leading-none mt-[-8px]">...</span>
            </div>
          </div>
          <div className="bg-[#181a20] rounded-xl p-6 border border-[#23252d] flex justify-between items-center h-28">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/50 font-bold mb-2">FLAGGED</p>
              <p className="text-3xl font-headline font-bold text-[#F43F5E]">{flaggedCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#BE123C]/10 flex items-center justify-center border border-[#BE123C]/20">
              <IconAlert className="text-[#F43F5E]" size={18} />
            </div>
          </div>
        </div>

        {/* Document Review Queue Table */}
        <div className="bg-[#181a20] rounded-xl border border-[#23252d] overflow-hidden">
          <div className="px-6 py-5 border-b border-[#23252d] flex justify-between items-center">
            <h3 className="text-[15px] font-headline font-bold text-white">Document Review Queue</h3>
            <div className="flex gap-2">
              {['all', 'pending', 'verified'].map(f => (
                <button 
                  key={f} 
                  onClick={() => setFilter(f)} 
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${filter === f ? 'bg-[#be185d]/20 text-[#f472b6]' : 'text-on-surface-variant/50 hover:bg-[#23252d] hover:text-on-surface-variant'}`
                }>
                  {f === 'all' ? 'All' : f}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left">
              <thead className="bg-[#14151a] sticky top-0 z-10 border-b border-[#23252d]">
                <tr className="text-[9px] font-label uppercase tracking-[0.15em] text-on-surface-variant/50">
                  <th className="px-6 py-4 border-b border-[#23252d]">DOCUMENT ID</th>
                  <th className="px-6 py-4 border-b border-[#23252d]">TYPE</th>
                  <th className="px-6 py-4 border-b border-[#23252d]">PROPERTY</th>
                  <th className="px-6 py-4 border-b border-[#23252d]">SUBMITTED BY</th>
                  <th className="px-6 py-4 border-b border-[#23252d]">STATUS</th>
                  <th className="px-6 py-4 border-b border-[#23252d]">DATE</th>
                  <th className="px-6 py-4 border-b border-[#23252d] text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23252d] text-[13px]">
                {loading ? <tr><td colSpan={7} className="px-6 py-10 text-center text-on-surface-variant/30">Loading...</td></tr>
                : filtered.length === 0 ? <tr><td colSpan={7} className="px-6 py-10 text-center text-on-surface-variant/30">No documents found</td></tr>
                : filtered.map((d, i) => (
                  <tr key={d._id || i} className="hover:bg-[#1f222b] transition-colors">
                    <td className="px-6 py-4 font-mono text-[#8470FF]">#DOC-{(d._id || `882${10 - i}`).slice(-5).toUpperCase()}</td>
                    <td className="px-6 py-4 text-[#d1d5db]">{d.documentType || d.type || (i % 2 === 0 ? 'Title Deed' : 'Survey Map')}</td>
                    <td className="px-6 py-4 text-[#e5e4ed]">Survey #{d.surveyNumber || '\u2014'}</td>
                    <td className="px-6 py-4 font-mono text-[#6b7280]">{truncAddr(d.submittedBy)}</td>
                    <td className="px-6 py-4">
                      {d.status === 'verified' || filter === 'verified' ? <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#0284c7]/20 text-[#38bdf8] border border-[#0284c7]/40">VERIFIED</span> :
                       <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#be185d]/20 text-[#f472b6] border border-[#be185d]/40">PENDING REVIEW</span>}
                    </td>
                    <td className="px-6 py-4 font-mono text-[#6b7280]">{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '2023-10-24'}</td>
                    <td className="px-6 py-4 text-right">
                      {(d.status === 'verified' || filter === 'verified') ? 
                        <span className="text-[#38bdf8] font-bold uppercase text-[11px] hover:text-[#7dd3fc] cursor-pointer inline-flex items-center gap-1 transition-colors">VIEW</span> :
                        <span className="text-[#8470FF] font-bold uppercase text-[11px] hover:text-[#9988ff] cursor-pointer inline-flex items-center gap-1 transition-colors">REVIEW</span>
                      }
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

export default OfficerDocumentsPage;
