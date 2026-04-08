import React, { useState, useCallback } from 'react';
import SharedNavbar from '../SharedNavbar.jsx';
import Footer from '../Footer.jsx';
import PageHeader from '../shared/PageHeader.jsx';
import StatCard from '../shared/StatCard.jsx';
import StatusBadge from '../shared/StatusBadge.jsx';
import { IconLand, IconTransfer, IconShield, IconAlert, IconNotification, IconDocument, IconMap, IconCheck, IconUpload, IconUser, IconBlockchain } from '../icons/Icons.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import useApi, { useMutation } from '../../hooks/useApi.js';
import { landAPI, coOwnerAPI, transferAPI, verificationAPI, notificationAPI } from '../../services/api.js';

const SellerPage = () => {
  const { wallet } = useAuth();

  // Data
  const { data: lands, loading: landsLoading, refetch: refetchLands } = useApi(useCallback(() => landAPI.list({ role: 'seller' }), []));
  const { data: transfers, loading: transfersLoading } = useApi(useCallback(() => transferAPI.getMyTransfers(), []));
  const { data: notifications } = useApi(useCallback(() => notificationAPI.getAll(), []));

  // Form: Registration
  const [regForm, setRegForm] = useState({ district: 'Pune', taluka: 'Haveli', village: '', surveyNumber: '', gatNumber: '', area: '', areaUnit: 'hectare', encumbrances: '', boundaryDescription: '' });
  const { execute: registerLand, loading: registering, error: regError } = useMutation(useCallback((data) => landAPI.register(data), []));
  const handleRegChange = (e) => setRegForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleRegSubmit = async (e) => {
    e.preventDefault();
    try { await registerLand(regForm); setRegForm({ district: 'Pune', taluka: 'Haveli', village: '', surveyNumber: '', gatNumber: '', area: '', areaUnit: 'hectare', encumbrances: '', boundaryDescription: '' }); refetchLands(); } catch {}
  };

  // Form: Co-owner
  const [coForm, setCoForm] = useState({ name: '', share: '', walletAddress: '', landId: '' });
  const { execute: addCoOwner, loading: addingCo } = useMutation(useCallback((d) => coOwnerAPI.add(d.landId, { name: d.name, share: d.share, walletAddress: d.walletAddress }), []));
  const handleCoChange = (e) => setCoForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleAddCo = async () => { if (!coForm.landId) return; try { await addCoOwner(coForm); setCoForm(p => ({ ...p, name: '', share: '', walletAddress: '' })); } catch {} };

  // Derived
  const landsList = Array.isArray(lands) ? lands : [];
  const transfersList = Array.isArray(transfers) ? transfers : [];
  const notifList = Array.isArray(notifications) ? notifications : [];
  const incomingOffers = transfersList.filter(t => t.status === 'pending');

  // Selected land verification
  const [selectedLandId, setSelectedLandId] = useState(null);
  const { data: verification } = useApi(
    useCallback(() => selectedLandId ? verificationAPI.getResults(selectedLandId) : Promise.resolve({ data: null }), [selectedLandId]),
    [selectedLandId], { immediate: !!selectedLandId }
  );

  const { execute: acceptOffer } = useMutation(useCallback((id) => transferAPI.accept(id), []));
  const { execute: rejectOffer } = useMutation(useCallback((id) => transferAPI.reject(id), []));

  const BG = { backgroundColor: '#0c0e14', backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(116,117,125,0.04) 1px, transparent 0)', backgroundSize: '32px 32px', color: '#e5e4ed' };

  return (
    <div className="text-on-surface flex flex-col min-h-screen" style={BG}>
      <SharedNavbar role="seller" activePage="dashboard" />

      <main className="relative z-10 p-8 max-w-[1600px] mx-auto space-y-8 w-full">
        <PageHeader title="Seller Dashboard" subtitle="Manage registered land assets and ownership transfers." icon={IconLand} />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Lands Registered" value={String(landsList.length).padStart(2, '0')} icon={IconLand} iconColor="primary" loading={landsLoading} accentBorder />
          <StatCard label="Pending Transfers" value={String(transfersList.filter(t => ['pending', 'in_review'].includes(t.status)).length).padStart(2, '0')} icon={IconTransfer} iconColor="secondary" loading={transfersLoading} accentBorder />
          <StatCard label="Verified" value={String(landsList.filter(l => l.status === 'verified').length).padStart(2, '0')} icon={IconShield} iconColor="green-500" loading={landsLoading} accentBorder />
          <StatCard label="Flagged" value={String(landsList.filter(l => ['flagged', 'officer_review'].includes(l.status)).length).padStart(2, '0')} icon={IconAlert} iconColor="error" loading={landsLoading} accentBorder />
        </div>

        {/* Map + Alerts */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-[70%] bg-surface-container rounded-xl overflow-hidden flex flex-col h-[500px]">
            <div className="p-5 flex justify-between items-center border-b border-outline-variant/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <IconMap className="text-primary" size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-headline font-bold">Land Boundary Mapping</h2>
                  <p className="text-[10px] text-on-surface-variant">Spatial validation against government records</p>
                </div>
              </div>
            </div>
            <div className="flex-grow flex items-center justify-center bg-surface-container-low">
              <div className="text-center text-on-surface-variant/40">
                <IconMap className="mx-auto mb-3 opacity-30" size={48} />
                <p className="text-xs">Select a land asset to view boundary polygon</p>
              </div>
            </div>
          </div>

          <div className="lg:w-[30%] bg-surface-container rounded-xl flex flex-col">
            <div className="px-5 py-4 border-b border-outline-variant/10 flex items-center gap-2">
              <IconNotification className="text-on-surface-variant" size={14} />
              <h2 className="text-sm font-headline font-bold">Recent Alerts</h2>
            </div>
            <div className="p-4 space-y-4 flex-grow overflow-y-auto">
              {notifList.length === 0 && <p className="text-xs text-on-surface-variant/40 text-center py-6">No recent alerts</p>}
              {notifList.slice(0, 5).map((n, i) => (
                <div key={n._id || i} className="flex gap-3 items-start">
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${n.type === 'warning' ? 'bg-error/10' : 'bg-secondary/10'}`}>
                    {n.type === 'warning' ? <IconAlert className="text-error" size={12} /> : <IconCheck className="text-secondary" size={12} />}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-on-surface">{n.title || 'Notification'}</p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">{n.message}</p>
                    <p className="text-[9px] text-on-surface-variant/30 mt-1 font-mono">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Registration Form + Verification */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-[70%] bg-surface-container rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <IconDocument className="text-primary" size={16} />
              </div>
              <h2 className="text-base font-headline font-bold">Register New Land Asset</h2>
            </div>
            {regError && <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-xs">{regError}</div>}
            <form onSubmit={handleRegSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'district', label: 'District', type: 'select', options: ['Pune', 'Satara', 'Mumbai Sub'] },
                  { name: 'taluka', label: 'Taluka', type: 'select', options: ['Haveli', 'Mulshi'] },
                  { name: 'village', label: 'Village', placeholder: 'e.g. Hinjewadi' },
                ].map(f => (
                  <div key={f.name} className="space-y-1.5">
                    <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60">{f.label}</label>
                    {f.type === 'select' ? (
                      <select name={f.name} value={regForm[f.name]} onChange={handleRegChange} className="w-full bg-surface-container-high border-none rounded-lg text-on-surface text-sm h-10 px-3 focus:ring-1 focus:ring-primary/40">
                        {f.options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input name={f.name} value={regForm[f.name]} onChange={handleRegChange} className="w-full bg-surface-container-high border-none rounded-lg text-on-surface text-sm h-10 px-3 focus:ring-1 focus:ring-primary/40" placeholder={f.placeholder} />
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'surveyNumber', label: 'Survey Number', placeholder: '102/A' },
                  { name: 'gatNumber', label: 'Gat Number', placeholder: '442' },
                  { name: 'area', label: 'Area (Hectares)', placeholder: '2.45', type: 'number' },
                ].map(f => (
                  <div key={f.name} className="space-y-1.5">
                    <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60">{f.label}</label>
                    <input name={f.name} value={regForm[f.name]} onChange={handleRegChange} type={f.type || 'text'} step={f.type === 'number' ? '0.01' : undefined} className="w-full bg-surface-container-high border-none rounded-lg text-on-surface text-sm h-10 px-3 focus:ring-1 focus:ring-primary/40" placeholder={f.placeholder} />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'encumbrances', label: 'Encumbrances', placeholder: 'Existing loans or disputes...' },
                  { name: 'boundaryDescription', label: 'Boundary Description', placeholder: 'Physical markers, adjacent plots...' },
                ].map(f => (
                  <div key={f.name} className="space-y-1.5">
                    <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60">{f.label}</label>
                    <textarea name={f.name} value={regForm[f.name]} onChange={handleRegChange} rows={2} className="w-full bg-surface-container-high border-none rounded-lg text-on-surface text-sm p-3 focus:ring-1 focus:ring-primary/40 resize-none" placeholder={f.placeholder} />
                  </div>
                ))}
              </div>
              <button type="submit" disabled={registering} className="w-full h-11 bg-primary/15 hover:bg-primary/25 border border-primary/20 text-primary font-bold text-sm rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {registering ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <IconBlockchain size={15} />}
                {registering ? 'Registering...' : 'Register on Blockchain'}
              </button>
            </form>
          </div>

          <div className="lg:w-[30%] bg-surface-container rounded-xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <IconShield className="text-on-surface-variant" size={14} />
                <h2 className="text-sm font-headline font-bold">Verification</h2>
              </div>
              {verification?.verdict && <StatusBadge status={verification.verdict} />}
            </div>
            {!selectedLandId ? (
              <p className="text-xs text-on-surface-variant/40 text-center py-8 flex-grow flex items-center justify-center">Select a land from the table to view verification</p>
            ) : (
              <div className="space-y-5 flex-grow">
                {[
                  { label: 'Name Match', value: verification?.nameScore || 0 },
                  { label: 'Area Consistency', value: verification?.areaScore || 0 },
                ].map(bar => (
                  <div key={bar.label} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-label uppercase text-on-surface-variant/60">
                      <span>{bar.label}</span><span>{bar.value}%</span>
                    </div>
                    <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${bar.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className="mt-auto w-full py-3 border border-outline-variant/20 rounded-lg text-on-surface text-xs font-medium hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2">
              <IconUpload size={14} /> Upload 7/12 Document
            </button>
          </div>
        </div>

        {/* Co-Owner Builder */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-[70%] bg-surface-container rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                <IconUser className="text-secondary" size={16} />
              </div>
              <h2 className="text-base font-headline font-bold">Co-Owner Builder</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-1.5">
                <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60">Land Asset</label>
                <select name="landId" value={coForm.landId} onChange={handleCoChange} className="w-full bg-surface-container-high border-none rounded-lg text-on-surface text-sm h-10 px-3 focus:ring-1 focus:ring-primary/40">
                  <option value="">Select...</option>
                  {landsList.map(l => <option key={l._id} value={l._id}>{l.location?.surveyNumber || l.surveyNumber} \u2014 {l.location?.village || l.village}</option>)}
                </select>
              </div>
              {[
                { name: 'name', label: 'Full Name', placeholder: 'Jane Doe' },
                { name: 'share', label: 'Share (%)', placeholder: '25', type: 'number' },
                { name: 'walletAddress', label: 'Wallet Address', placeholder: '0x...' },
              ].map(f => (
                <div key={f.name} className="space-y-1.5">
                  <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60">{f.label}</label>
                  <input name={f.name} value={coForm[f.name]} onChange={handleCoChange} type={f.type || 'text'} className="w-full bg-surface-container-high border-none rounded-lg text-on-surface text-sm h-10 px-3 focus:ring-1 focus:ring-primary/40" placeholder={f.placeholder} />
                </div>
              ))}
            </div>
            <button onClick={handleAddCo} disabled={addingCo} className="mt-4 h-10 px-6 bg-secondary/10 text-secondary font-bold text-xs rounded-lg border border-secondary/20 hover:bg-secondary/20 transition-all disabled:opacity-50 flex items-center gap-2">
              <IconUser size={14} /> {addingCo ? 'Adding...' : 'Add Co-Owner'}
            </button>
          </div>
          <div className="lg:w-[30%] bg-surface-container rounded-xl p-5">
            <h2 className="text-sm font-headline font-bold mb-5">Consent Tracker</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-surface-container-high rounded-lg"><span className="text-xs text-on-surface-variant">Co-Owners</span><span className="text-base font-bold">\u2014</span></div>
              <div className="flex justify-between items-center p-3 bg-surface-container-high rounded-lg"><span className="text-xs text-on-surface-variant">Signed NOCs</span><span className="text-base font-bold text-secondary">\u2014</span></div>
            </div>
          </div>
        </div>

        {/* Registered Lands Table + Offers */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-[70%] bg-surface-container rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-outline-variant/10 flex items-center gap-2">
              <IconDocument className="text-on-surface-variant" size={14} />
              <h2 className="text-sm font-headline font-bold">Registered Land Assets</h2>
              <span className="ml-auto text-[10px] text-on-surface-variant/40 font-mono">{landsList.length} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low/50">
                  <tr className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50">
                    <th className="px-5 py-3">Survey No.</th><th className="px-5 py-3">Village</th><th className="px-5 py-3">Area</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5 text-sm">
                  {landsLoading ? (
                    <tr><td colSpan={5} className="px-5 py-8 text-center text-on-surface-variant/40 text-xs">Loading...</td></tr>
                  ) : landsList.length === 0 ? (
                    <tr><td colSpan={5} className="px-5 py-8 text-center text-on-surface-variant/40 text-xs">No lands registered yet</td></tr>
                  ) : landsList.map(l => (
                    <tr key={l._id} className={`hover:bg-surface-container-high/30 transition-colors cursor-pointer ${selectedLandId === l._id ? 'bg-primary/5' : ''}`} onClick={() => setSelectedLandId(l._id)}>
                      <td className="px-5 py-3 font-mono text-xs">{l.location?.surveyNumber || l.surveyNumber}</td>
                      <td className="px-5 py-3 text-xs">{l.location?.village || l.village}</td>
                      <td className="px-5 py-3 text-xs">{l.area?.value || l.area} {l.area?.unit || 'HA'}</td>
                      <td className="px-5 py-3"><StatusBadge status={l.status} /></td>
                      <td className="px-5 py-3 text-right"><button className="text-primary text-xs font-medium hover:underline">View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:w-[30%] bg-surface-container rounded-xl flex flex-col">
            <div className="px-5 py-4 border-b border-outline-variant/10 flex items-center gap-2">
              <IconTransfer className="text-on-surface-variant" size={14} />
              <h2 className="text-sm font-headline font-bold">Incoming Offers</h2>
            </div>
            <div className="p-4 space-y-3 flex-grow overflow-y-auto">
              {incomingOffers.length === 0 ? (
                <p className="text-xs text-on-surface-variant/40 text-center py-6">No pending offers</p>
              ) : incomingOffers.map(o => (
                <div key={o._id} className="p-3 bg-surface-container-high rounded-lg border border-outline-variant/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-secondary">{o.buyerWallet ? `${o.buyerWallet.slice(0, 6)}...${o.buyerWallet.slice(-4)}` : '\u2014'}</span>
                    <span className="text-sm font-bold">{o.price || '\u2014'}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => acceptOffer(o._id)} className="flex-grow py-1.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-md hover:bg-secondary/20 transition-colors">Accept</button>
                    <button onClick={() => rejectOffer(o._id)} className="flex-grow py-1.5 bg-surface-container-highest text-on-surface text-[10px] font-bold rounded-md hover:bg-error/10 hover:text-error transition-colors">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SellerPage;
