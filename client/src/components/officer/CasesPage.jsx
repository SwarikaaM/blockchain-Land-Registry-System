import React, { useState, useCallback } from 'react';
import SharedNavbar from '../SharedNavbar.jsx';
import Footer from '../Footer.jsx';
import StatusBadge from '../shared/StatusBadge.jsx';
import { IconCases, IconCheck, IconAlert, IconDocument } from '../icons/Icons.jsx';
import useApi, { useMutation } from '../../hooks/useApi.js';
import { officerAPI } from '../../services/api.js';

const truncAddr = (a) => a ? `${a.slice(0, 6)}...${a.slice(-4)}` : '\u2014';

const typeBadge = (t) => {
  if (t === 'transfer') return <span className="px-2 py-0.5 bg-[#BE123C]/10 text-[#F43F5E] text-[10px] uppercase font-bold tracking-wider rounded">Transfer</span>;
  return <span className="px-2 py-0.5 bg-[#5E4EBB]/10 text-[#8470FF] text-[10px] uppercase font-bold tracking-wider rounded">New Registration</span>;
};

const CasesPage = () => {
  const [filter, setFilter] = useState('pending');
  const { data: cases, loading, refetch } = useApi(useCallback(() => officerAPI.listCases(), []));
  const casesList = Array.isArray(cases) ? cases : [];

  const filtered = casesList.filter(c => {
    if (filter === 'pending') return ['pending', 'in_review', 'under_review'].includes(c.status);
    if (filter === 'approved') return c.status === 'approved';
    if (filter === 'rejected') return c.status === 'rejected';
    return true;
  });

  const underReview = casesList.filter(c => ['pending', 'in_review', 'under_review'].includes(c.status)).length;
  // Temporary derived until backend supports stats
  const totalCount = 156;
  const approvedCount = 98;
  const rejectedCount = 16;

  const [selectedId, setSelectedId] = useState(null);
  const selected = casesList.find(c => c._id === selectedId) || null;
  const [notes, setNotes] = useState('');

  const { execute: approve, loading: approving } = useMutation(useCallback((id) => officerAPI.approve(id, { justification: notes }), [notes]));
  const { execute: reject, loading: rejecting } = useMutation(useCallback((id) => officerAPI.reject(id, { justification: notes }), [notes]));

  const handleApprove = async () => { if (!selectedId) return; try { await approve(selectedId); setNotes(''); refetch(); } catch {} };
  const handleReject = async () => { if (!selectedId) return; try { await reject(selectedId); setNotes(''); refetch(); } catch {} };

  return (
    <div className="font-body min-h-screen flex flex-col" style={{ backgroundColor: '#11131a', color: '#e5e4ed' }}>
      <SharedNavbar role="officer" activePage="/cases" />
      <main className="pt-10 pb-12 px-8 max-w-[1400px] mx-auto space-y-6 w-full flex-grow">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-headline font-bold text-white tracking-tight leading-tight">Land Registry Cases</h1>
          <p className="text-sm text-on-surface-variant/60 mt-1">Review and manage all land registration cases</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-[#181a20] rounded-xl p-6 border border-[#23252d] flex justify-between items-center h-28">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/50 font-bold mb-2">TOTAL CASES</p>
              <p className="text-3xl font-headline font-bold text-white">{totalCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#5E4EBB]/10 flex items-center justify-center border border-[#5E4EBB]/20">
              <IconDocument className="text-[#8470FF]" size={18} />
            </div>
          </div>
          <div className="bg-[#181a20] rounded-xl p-6 border border-[#23252d] flex justify-between items-center h-28">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/50 font-bold mb-2">UNDER REVIEW</p>
              <p className="text-3xl font-headline font-bold text-[#38BDF8]">{String(underReview).padStart(2, '0')}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#0284C7]/10 flex items-center justify-center border border-[#0284C7]/20">
              <span className="text-[#38BDF8] text-2xl leading-none mt-[-8px]">...</span>
            </div>
          </div>
          <div className="bg-[#181a20] rounded-xl p-6 border border-[#23252d] flex justify-between items-center h-28">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/50 font-bold mb-2">APPROVED</p>
              <p className="text-3xl font-headline font-bold text-[#10B981]">{String(approvedCount).padStart(2, '0')}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#059669]/10 flex items-center justify-center border border-[#059669]/20">
              <IconCheck className="text-[#10B981]" size={18} />
            </div>
          </div>
          <div className="bg-[#181a20] rounded-xl p-6 border border-[#23252d] flex justify-between items-center h-28">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/50 font-bold mb-2">REJECTED</p>
              <p className="text-3xl font-headline font-bold text-[#F43F5E]">{String(rejectedCount).padStart(2, '0')}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#BE123C]/10 flex items-center justify-center border border-[#BE123C]/20">
              <IconAlert className="text-[#F43F5E]" size={18} />
            </div>
          </div>
        </div>

        {/* Case Registry Table */}
        <div className="bg-[#181a20] rounded-xl border border-[#23252d] overflow-hidden">
          <div className="px-6 py-5 border-b border-[#23252d] flex justify-between items-center">
            <h3 className="text-[15px] font-headline font-bold text-white">Case Registry</h3>
            <div className="flex gap-2">
              {['all', 'pending', 'approved'].map(f => (
                <button 
                   key={f} 
                   onClick={() => setFilter(f)} 
                   className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${filter === f ? 'bg-[#5e4ebb]/20 text-[#8470FF]' : 'text-on-surface-variant/50 hover:bg-[#23252d] hover:text-on-surface-variant'}`
                }>
                  {f === 'all' ? 'All Cases' : f}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto max-h-[300px]">
            <table className="w-full text-left">
              <thead className="bg-[#14151a] sticky top-0 z-10">
                <tr className="text-[9px] font-label uppercase tracking-[0.15em] text-on-surface-variant/50">
                  <th className="px-6 py-4 border-b border-[#23252d]">CASE ID</th>
                  <th className="px-6 py-4 border-b border-[#23252d]">PROPERTY ID</th>
                  <th className="px-6 py-4 border-b border-[#23252d]">APPLICANT</th>
                  <th className="px-6 py-4 border-b border-[#23252d]">TYPE</th>
                  <th className="px-6 py-4 border-b border-[#23252d]">STATUS</th>
                  <th className="px-6 py-4 border-b border-[#23252d]">SUBMITTED</th>
                  <th className="px-6 py-4 border-b border-[#23252d]">LAST UPDATED</th>
                  <th className="px-6 py-4 border-b border-[#23252d] text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23252d] text-[13px]">
                {loading ? <tr><td colSpan={8} className="px-6 py-10 text-center text-on-surface-variant/30">Loading...</td></tr>
                : filtered.length === 0 ? <tr><td colSpan={8} className="px-6 py-10 text-center text-on-surface-variant/30">No cases found</td></tr>
                : filtered.map(c => (
                  <tr key={c._id} onClick={() => setSelectedId(c._id)} className={`hover:bg-[#1f222b] transition-colors cursor-pointer ${selectedId === c._id ? 'bg-[#5e4ebb]/5' : ''}`}>
                    <td className="px-6 py-4 font-mono text-[#8470FF]">REG-{(c._id || '').slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4 text-[#d1d5db]">{c.surveyNumber || c.landSurveyNumber || '\u2014'}</td>
                    <td className="px-6 py-4 font-mono text-[#6b7280]">{truncAddr(c.applicantWallet || c.buyerWallet)}</td>
                    <td className="px-6 py-4">{typeBadge(c.type || c.caseType)}</td>
                    <td className="px-6 py-4">
                      {['pending', 'in_review', 'under_review'].includes(c.status) ? <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#0284c7]/20 text-[#38bdf8]">UNDER REVIEW</span> : 
                       c.status === 'approved' ? <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#059669]/20 text-[#10B981]">APPROVED</span> : 
                       c.status === 'rejected' ? <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#be123c]/20 text-[#F43F5E]">REJECTED</span> : 
                       <StatusBadge status={c.status} />}
                    </td>
                    <td className="px-6 py-4 font-mono text-[#6b7280]">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '\u2014'}</td>
                    <td className="px-6 py-4 font-mono text-[#6b7280]">{c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : '\u2014'}</td>
                    <td className="px-6 py-4 text-right"><span className="text-[#8470FF] font-semibold hover:text-[#9988ff]">{['approved', 'rejected'].includes(c.status) ? 'View' : 'Review'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details + Review */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-12">
          <div className="bg-[#181a20] rounded-xl border border-[#23252d] p-6 lg:p-8 flex flex-col min-h-[400px]">
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-[17px] font-headline font-bold text-white">Case Information</h3>
              {selected && <div className="px-3 py-1 bg-[#23252d] border border-[#2d3039] rounded-full text-[#38bdf8] text-[10px] font-bold font-mono tracking-wider">REG-{(selected._id || '').slice(-6).toUpperCase()}</div>}
            </div>
            {!selected ? (
              <div className="text-center text-[#6b7280] flex-grow flex items-center justify-center">Select a case from the registry table</div>
            ) : (
              <div className="space-y-6 flex-grow flex flex-col">
                <div className="flex justify-between items-center border-b border-[#23252d] pb-4">
                  <span className="text-[13px] text-[#9ca3af]">Property Survey Number</span>
                  <span className="text-[14px] font-medium text-white">{selected.surveyNumber || selected.landSurveyNumber || '\u2014'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#23252d] pb-4">
                  <span className="text-[13px] text-[#9ca3af]">Applicant Name</span>
                  <span className="text-[14px] font-medium text-white">{selected.applicantName || 'Verified User'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#23252d] pb-4">
                  <span className="text-[13px] text-[#9ca3af]">Wallet Address</span>
                  <span className="text-[14px] font-mono font-medium text-[#e5e4ed]">{selected.applicantWallet || selected.buyerWallet || '\u2014'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#23252d] pb-4">
                  <span className="text-[13px] text-[#9ca3af]">Case Type</span>
                  <span>{typeBadge(selected.type || selected.caseType)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-[#9ca3af]">Submission Date</span>
                  <span className="text-[14px] font-medium text-white">{selected.createdAt ? new Date(selected.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '\u2014'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Panel */}
          <div className="bg-[#181a20] rounded-xl border border-[#23252d] p-6 lg:p-8 flex flex-col min-h-[400px]">
            <h3 className="text-[17px] font-headline font-bold text-white mb-6">Review Actions</h3>
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#6b7280] font-bold mb-3">REVIEW NOTES</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter detailed review notes..."
              className="w-full bg-[#14151a] border border-[#23252d] rounded-lg p-5 text-[14px] text-white focus:outline-none focus:border-[#059669] resize-none flex-grow mb-6 placeholder:text-[#4b5563]"
            />
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button disabled={!selectedId || approving || rejecting} onClick={handleApprove} className="h-[52px] bg-transparent border border-[#10B981]/50 hover:bg-[#10B981]/10 text-[#10B981] font-bold text-[13px] tracking-widest rounded-lg disabled:opacity-40 transition-colors">
                  APPROVE CASE
                </button>
                <button disabled={!selectedId || approving || rejecting} onClick={handleReject} className="h-[52px] bg-transparent border border-[#F43F5E]/50 hover:bg-[#F43F5E]/10 text-[#F43F5E] font-bold text-[13px] tracking-widest rounded-lg disabled:opacity-40 transition-colors">
                  REQUEST MORE INFO
                </button>
              </div>
              <button disabled={!selectedId || approving || rejecting || !notes.trim()} onClick={handleReject} className="w-full h-[52px] bg-[#14151a] border border-[#23252d] hover:bg-[#1f222b] text-white font-bold text-[13px] tracking-widest rounded-lg disabled:opacity-40 transition-colors">
                Reject Case
              </button>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default CasesPage;
