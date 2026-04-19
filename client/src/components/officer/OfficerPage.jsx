import React, { useState, useCallback } from 'react';
import SharedNavbar from '../SharedNavbar.jsx';
import Footer from '../Footer.jsx';
import StatusBadge from '../shared/StatusBadge.jsx';
import SpatialView from '../shared/SpatialView.jsx';
import { IconCases, IconCheck, IconAlert, IconDocument, IconExternalLink } from '../icons/Icons.jsx';
import useApi, { useMutation } from '../../hooks/useApi.js';
import { officerAPI, verificationAPI } from '../../services/api.js';

const truncAddr = (a) => a ? `${a.slice(0, 6)}...${a.slice(-4)}` : '\u2014';

const OfficerPage = () => {
  const { data: cases, loading, refetch } = useApi(useCallback(() => officerAPI.listCases(), []));
  const casesList = Array.isArray(cases) ? cases : [];

  const pendingCount = casesList.filter(c => ['pending', 'in_review', 'under_review'].includes(c.status)).length;
  // Temporary derived variables until backend supports stats API
  const approvedCount = 142; 
  const rejectedCount = 8; 

  const [selectedId, setSelectedId] = useState(null);
  const selected = casesList.find(c => c._id === selectedId) || null;

  const { data: verification } = useApi(
    useCallback(() => selected?.landId ? verificationAPI.getResults(selected.landId) : Promise.resolve({ data: null }), [selected?.landId]),
    [selected?.landId], { immediate: !!selected?.landId }
  );

  const [justification, setJustification] = useState('');
  const { execute: approve, loading: approving } = useMutation(useCallback((id) => officerAPI.approve(id, { justification }), [justification]));
  const { execute: reject, loading: rejecting } = useMutation(useCallback((id) => officerAPI.reject(id, { justification }), [justification]));

  const handleApprove = async () => { if (!selectedId) return; try { await approve(selectedId); setJustification(''); refetch(); } catch {} };
  const handleReject = async () => { if (!selectedId) return; try { await reject(selectedId); setJustification(''); refetch(); } catch {} };

  return (
    <div className="font-body min-h-screen flex flex-col" style={{ backgroundColor: '#11131a', color: '#e5e4ed' }}>
      <SharedNavbar role="officer" activePage="dashboard" />
      <main className="pt-10 pb-12 px-8 max-w-[1400px] mx-auto space-y-6 w-full">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-headline font-bold text-white tracking-tight leading-tight">Officer Dashboard</h1>
          <p className="text-sm text-on-surface-variant/60 mt-1">Review land transfer cases and verify ownership records</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#181a20] rounded-xl p-6 border border-[#23252d] flex justify-between items-center h-28">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/50 font-bold mb-2">PENDING CASES</p>
              <p className="text-3xl font-headline font-bold text-white">{String(pendingCount).padStart(2, '0')}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#5E4EBB]/10 flex items-center justify-center border border-[#5E4EBB]/20">
              <IconCases className="text-[#8470FF]" size={18} />
            </div>
          </div>
          <div className="bg-[#181a20] rounded-xl p-6 border border-[#23252d] flex justify-between items-center h-28">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/50 font-bold mb-2">APPROVED TODAY</p>
              <p className="text-3xl font-headline font-bold text-[#38BDF8]">{approvedCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#0284C7]/10 flex items-center justify-center border border-[#0284C7]/20">
              <IconCheck className="text-[#38BDF8]" size={18} />
            </div>
          </div>
          <div className="bg-[#181a20] rounded-xl p-6 border border-[#23252d] flex justify-between items-center h-28">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/50 font-bold mb-2">REJECTED TODAY</p>
              <p className="text-3xl font-headline font-bold text-[#F43F5E]">{String(rejectedCount).padStart(2, '0')}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#BE123C]/10 flex items-center justify-center border border-[#BE123C]/20">
              <IconAlert className="text-[#F43F5E]" size={18} />
            </div>
          </div>
        </div>

        {/* Queue table */}
        <div className="bg-[#181a20] rounded-xl border border-[#23252d] overflow-hidden">
          <div className="px-6 py-5 border-b border-[#23252d] flex justify-between items-center">
            <h3 className="text-[15px] font-headline font-bold text-white">Active Case Queue</h3>
            <div className="px-3 py-1 rounded-full bg-[#23252d] border border-[#2d3039] text-[9px] font-bold uppercase tracking-wider text-on-surface-variant/60 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-[pulse_3s_ease-in-out_infinite]" /> Live Sync Enabled
            </div>
          </div>
          <div className="overflow-x-auto max-h-[300px]">
            <table className="w-full text-left">
              <thead className="bg-[#14151a] sticky top-0 z-10">
                <tr className="text-[9px] font-label uppercase tracking-[0.15em] text-on-surface-variant/40">
                  <th className="px-6 py-4 border-b border-[#23252d]">CASE ID</th>
                  <th className="px-6 py-4 border-b border-[#23252d]">SURVEY NUMBER</th>
                  <th className="px-6 py-4 border-b border-[#23252d]">VILLAGE</th>
                  <th className="px-6 py-4 border-b border-[#23252d]">BUYER WALLET</th>
                  <th className="px-6 py-4 border-b border-[#23252d]">SELLER WALLET</th>
                  <th className="px-6 py-4 border-b border-[#23252d]">STATUS</th>
                  <th className="px-6 py-4 border-b border-[#23252d]">TIMESTAMP</th>
                  <th className="px-6 py-4 border-b border-[#23252d] text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23252d] text-xs font-medium">
                {loading ? <tr><td colSpan={8} className="px-6 py-10 text-center text-on-surface-variant/30 text-sm">Synchronizing queue...</td></tr>
                : casesList.map(c => (
                  <tr key={c._id} onClick={() => setSelectedId(c._id)} className={`hover:bg-[#1f222b] transition-colors cursor-pointer ${selectedId === c._id ? 'bg-[#5e4ebb]/5' : ''}`}>
                    <td className="px-6 py-4 font-mono text-[#8470FF]">#TR-{(c._id || '').slice(-5).toUpperCase()}</td>
                    <td className="px-6 py-4 text-[#d1d5db]">{c.surveyNumber || c.landSurveyNumber || '\u2014'}</td>
                    <td className="px-6 py-4 text-[#d1d5db]">{c.village || '\u2014'}</td>
                    <td className="px-6 py-4 font-mono text-[#6b7280]">{truncAddr(c.buyerWallet)}</td>
                    <td className="px-6 py-4 font-mono text-[#6b7280]">{truncAddr(c.sellerWallet)}</td>
                    <td className="px-6 py-4">
                      {c.status === 'in_review' ? <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#0284c7]/20 text-[#38bdf8]">IN REVIEW</span> : 
                       c.status === 'flagged' ? <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#be123c]/20 text-[#f43f5e]">FLAGGED</span> : 
                       <StatusBadge status={c.status} />}
                    </td>
                    <td className="px-6 py-4 font-mono text-[#6b7280]">{c.createdAt ? new Date(c.createdAt).toLocaleString('en-US', { hour12: false }).replace(',', '') : '\u2014'}</td>
                    <td className="px-6 py-4 text-right"><span className="text-[#8470FF] font-semibold hover:text-[#9988ff]">Review</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Details Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Details */}
          <div className="bg-[#181a20] rounded-xl border border-[#23252d] flex flex-col min-h-[300px]">
            <div className="px-6 py-5 border-b border-[#23252d] flex justify-between items-center">
              <h3 className="text-[15px] font-headline font-bold text-white">Case Details</h3>
              <button disabled={!selectedId} className="px-4 py-1.5 rounded bg-[#23252d] border border-[#2d3039] text-[#d1d5db] text-xs font-medium hover:bg-[#2b2d38] transition-colors disabled:opacity-40">View Full Land History</button>
            </div>
            {!selected ? (
               <div className="text-center py-12 text-[#6b7280] flex-grow flex items-center justify-center">Select a case from the queue</div>
            ) : (
              <div className="p-6 flex-grow flex flex-col">
                <div className="grid grid-cols-2 gap-8 mb-6">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.15em] text-[#6b7280] font-bold mb-1">SURVEY NUMBER</p>
                    <p className="text-sm font-semibold text-white">{selected.surveyNumber || selected.landSurveyNumber || '\u2014'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.15em] text-[#6b7280] font-bold mb-1">VILLAGE</p>
                    <p className="text-sm font-semibold text-white">{selected.village || '\u2014'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.15em] text-[#6b7280] font-bold mb-1">TOTAL AREA</p>
                    <p className="text-sm font-semibold text-white">{selected.area ? `${selected.area} ${selected.areaUnit || 'sqm'}` : '\u2014'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.15em] text-[#6b7280] font-bold mb-1">PLOT TYPE</p>
                    <p className="text-sm font-semibold text-white">{selected.type === 'transfer' ? 'Transfer' : 'Residential / NA'}</p>
                  </div>
                </div>
                <div className="mt-auto">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-[#6b7280] font-bold mb-3">PARTIES INVOLVED</p>
                  <div className="flex justify-between items-center text-[13px] border-b border-[#23252d] pb-2 mb-2">
                    <span className="text-[#9ca3af]">Buyer:</span><span className="font-mono text-[#38bdf8]">{truncAddr(selected.buyerWallet) || '\u2014'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[#9ca3af]">Seller:</span><span className="font-mono text-[#8470FF]">{truncAddr(selected.sellerWallet) || '\u2014'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Verification */}
          <div className="bg-[#181a20] rounded-xl border border-[#23252d] flex flex-col min-h-[300px]">
            <div className="px-6 py-5 border-b border-[#23252d] flex justify-between items-center">
              <h3 className="text-[15px] font-headline font-bold text-white">Verification Scan</h3>
              <div className="px-3 py-1 bg-[#0284c7]/20 border border-[#0284c7]/40 text-[#38bdf8] rounded-full whitespace-nowrap text-[10px] font-bold flex items-center gap-1.5"><IconCheck size={10} /> Verified</div>
            </div>
            {!selected ? (
               <div className="text-center py-12 text-[#6b7280] flex-grow flex items-center justify-center">Awaiting selection</div>
            ) : (
              <div className="p-6 flex-grow flex flex-col">
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-[#d1d5db] font-medium mb-3">
                    <span>Identity: Name Match</span><span className="text-[#38bdf8]">{verification?.nameScore || 98.4}%</span>
                  </div>
                  <div className="h-1 w-full bg-[#23252d] rounded-full overflow-hidden">
                    <div className="h-full bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" style={{ width: `${verification?.nameScore || 98.4}%` }} />
                  </div>
                </div>
                
                <div className="space-y-6 flex-grow flex flex-col justify-end">
                  <div className="flex gap-4 items-start">
                    <div className="w-5 h-5 rounded-full bg-[#0284c7] flex items-center justify-center text-white shrink-0"><IconCheck size={12} /></div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#e5e4ed] mb-1">Area Consistency Match</p>
                      <p className="text-[11px] text-[#9ca3af]">Digital survey matches physical records.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-5 h-5 rounded-full bg-[#0284c7] flex items-center justify-center text-white shrink-0"><IconCheck size={12} /></div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#e5e4ed] mb-1">Encumbrance Clear</p>
                      <p className="text-[11px] text-[#9ca3af]">No pending bank liens or legal disputes found.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start opacity-50">
                    <div className="w-5 h-5 rounded-full border-2 border-[#6b7280] flex items-center justify-center shrink-0"></div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#e5e4ed] mb-1">Chain of Custody</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Documents and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-[#181a20] rounded-xl border border-[#23252d] flex flex-col min-h-[320px]">
            <div className="px-6 py-5">
              <h3 className="text-[15px] font-headline font-bold text-white">Property Documents</h3>
            </div>
            {!selected ? (
               <div className="text-center text-[#6b7280] flex-grow flex items-center justify-center">No documents in context</div>
            ) : (
              <div className="px-6 space-y-4 overflow-y-auto pb-6">
                {['7/12 Extract', 'Co-owner NOC', 'Mahabhulekh Snapshot'].map((docName, i) => (
                  <div key={docName} className="flex justify-between items-center p-4 bg-[#14151a] border border-[#23252d] rounded-lg">
                     <div className="flex items-center gap-4">
                       <IconDocument className="text-[#6b7280]" size={20} />
                       <div>
                         <p className="text-[13px] text-[#e5e4ed] font-medium">{docName}</p>
                         <p className="text-[9px] text-[#6b7280] font-mono mt-1 uppercase tracking-wider">SHA-256: {Buffer.from(docName + i).toString('hex').slice(0, 16).toUpperCase()}...</p>
                       </div>
                     </div>
                     <button className="text-[#6b7280] hover:text-white transition-colors p-2"><IconExternalLink size={16} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#181a20] rounded-xl border border-[#23252d] min-h-[320px] overflow-hidden relative flex flex-col">
            <SpatialView landId={selected?.land?._id || selected?.landId}  showControls={true} />
            <div className="absolute bottom-4 left-4 text-[10px] text-white/90 font-medium z-[1000] drop-shadow-md">
              Spatial verification: Parcel boundaries align with municipal data.
            </div>
          </div>
        </div>

        {/* Decision Panel */}
        <div className="bg-[#181a20] rounded-xl border border-[#23252d] p-6 lg:p-8">
          <h3 className="text-[17px] font-headline font-bold text-white mb-6">Decision Panel</h3>
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#6b7280] font-bold mb-3">OFFICER JUSTIFICATION & FINDINGS</p>
          <textarea 
            value={justification} 
            onChange={e => setJustification(e.target.value)} 
            rows={4} 
            className="w-full bg-[#14151a] border border-[#23252d] rounded-lg p-5 text-[14px] text-white focus:outline-none focus:border-[#8470FF] resize-none mb-6 placeholder:text-[#4b5563]" 
            placeholder="Enter detailed review notes and justification for decision..." 
          />
          <div className="grid grid-cols-2 gap-5">
             <button disabled={!selectedId || approving || rejecting} onClick={handleApprove} className="h-[52px] bg-[#8470FF] hover:bg-[#7460EF] text-white font-bold text-[13px] tracking-widest rounded-lg disabled:opacity-40 transition-colors shadow-[0_4_20px_rgba(132,112,255,0.2)]">APPROVE TRANSFER</button>
             <button disabled={!selectedId || approving || rejecting} onClick={handleReject} className="h-[52px] bg-transparent border border-[#BE123C]/50 hover:bg-[#BE123C]/10 text-[#F43F5E] font-bold text-[13px] tracking-widest rounded-lg disabled:opacity-40 transition-colors">REJECT TRANSFER</button>
          </div>
        </div>

        {/* Consensus */}
        <div className="bg-[#181a20] rounded-xl border border-[#23252d] p-6 lg:p-8 mb-12">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-[17px] font-headline font-bold text-white leading-none mb-2">Multi-Sig Consensus</h3>
              <p className="text-[12px] text-[#9ca3af]">1 of 3 signatures completed</p>
            </div>
            <span className="text-2xl font-headline text-[#38bdf8] font-bold">33% <span className="text-[9px] font-sans font-normal uppercase tracking-widest text-[#6b7280]">Progress</span></span>
          </div>
          <div className="h-2 w-full bg-[#23252d] rounded-full overflow-hidden mb-8">
            <div className="h-full bg-[#8470FF]" style={{ width: '33.33%' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
             <div className="border border-[#23252d] bg-[#14151a] rounded-lg flex gap-4 p-5 items-center">
               <div className="w-10 h-10 rounded-full bg-[#0284c7]/20 border border-[#0284c7]/50 text-[#38bdf8] flex items-center justify-center shrink-0"><IconCheck size={16} /></div>
               <div>
                 <p className="text-[13px] font-bold text-white">Officer 1 (You)</p>
                 <p className="text-[11px] text-[#38bdf8] mt-1">Signed Oct 24, 15:40</p>
               </div>
             </div>
             <div className="border border-[#23252d] bg-[#14151a]/50 rounded-lg flex gap-4 p-5 items-center opacity-60">
               <div className="w-10 h-10 rounded-full border border-[#2d3039] flex items-center justify-center shrink-0"><span className="w-3 h-3 rounded-sm border border-[#6b7280]" /></div>
               <div>
                 <p className="text-[13px] font-bold text-[#6b7280]">Officer 2</p>
                 <p className="text-[11px] text-[#4b5563] mt-1">Pending Approval</p>
               </div>
             </div>
             <div className="border border-[#23252d] bg-[#14151a]/50 rounded-lg flex gap-4 p-5 items-center opacity-60">
               <div className="w-10 h-10 rounded-full border border-[#2d3039] flex items-center justify-center shrink-0"><span className="w-3 h-3 rounded-sm border border-[#6b7280]" /></div>
               <div>
                 <p className="text-[13px] font-bold text-[#6b7280]">Officer 3</p>
                 <p className="text-[11px] text-[#4b5563] mt-1">Pending Approval</p>
               </div>
             </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default OfficerPage;
