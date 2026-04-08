import React, { useState, useCallback } from 'react';
import SharedNavbar from '../SharedNavbar.jsx';
import Footer from '../Footer.jsx';
import PageHeader from '../shared/PageHeader.jsx';
import StatCard from '../shared/StatCard.jsx';
import StatusBadge from '../shared/StatusBadge.jsx';
import { IconLand, IconTransfer, IconMap, IconSearch, IconNotification, IconCheck, IconChevron, IconAlert } from '../icons/Icons.jsx';
import SpatialView from '../shared/SpatialView.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import useApi, { useMutation } from '../../hooks/useApi.js';
import { landAPI, transferAPI, notificationAPI } from '../../services/api.js';

const BG = { backgroundColor: '#0c0e14', backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(116,117,125,0.04) 1px, transparent 0)', backgroundSize: '32px 32px', color: '#e5e4ed' };
const truncAddr = (a) => a ? `${a.slice(0, 6)}...${a.slice(-4)}` : '\u2014';

const BuyerPage = () => {
  const { truncatedWallet } = useAuth();

  const { data: myLands, loading: landsLoading } = useApi(useCallback(() => landAPI.list({ role: 'buyer' }), []));
  const { data: transfers, loading: transfersLoading } = useApi(useCallback(() => transferAPI.getMyTransfers(), []));
  const { data: notifications } = useApi(useCallback(() => notificationAPI.getAll(), []));

  const landsList = Array.isArray(myLands) ? myLands : [];
  const transfersList = Array.isArray(transfers) ? transfers : [];
  const notifList = Array.isArray(notifications) ? notifications : [];

  // Search
  const [searchForm, setSearchForm] = useState({ village: '', surveyNumber: '', status: '' });
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);

  const handleSearch = async () => {
    setSearchLoading(true);
    try { const r = await landAPI.search(searchForm); setSearchResults(Array.isArray(r.data?.data || r.data) ? (r.data?.data || r.data) : []); }
    catch { setSearchResults([]); }
    finally { setSearchLoading(false); }
  };

  const { execute: createOffer, loading: offerLoading } = useMutation(useCallback((d) => transferAPI.createOffer(d), []));
  const handleTransfer = async () => { if (!selectedParcel) return; try { await createOffer({ landId: selectedParcel._id }); alert('Transfer request sent!'); } catch {} };

  const activeTransfers = transfersList.filter(t => !['completed', 'rejected'].includes(t.status)).length;
  const pendingTransfers = transfersList.filter(t => t.status === 'pending').length;

  return (
    <div className="font-body min-h-screen flex flex-col" style={BG}>
      <SharedNavbar role="buyer" activePage="dashboard" />
      <main className="flex-grow w-full max-w-7xl mx-auto px-8 py-10">
        <PageHeader title="Buyer Dashboard" subtitle="Explore verified land parcels and manage purchase requests." icon={IconLand} />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Owned Lands" value={String(landsList.length).padStart(2, '0')} icon={IconLand} iconColor="primary" loading={landsLoading} />
          <StatCard label="Active Transfers" value={String(activeTransfers).padStart(2, '0')} icon={IconTransfer} iconColor="secondary" loading={transfersLoading} />
          <StatCard label="Pending Offers" value={String(pendingTransfers).padStart(2, '0')} icon={IconTransfer} iconColor="tertiary-container" loading={transfersLoading} />
          <StatCard label="Notifications" value={notifList.length} icon={IconNotification} iconColor="on-surface-variant" />
        </div>

        {/* Map */}
        <div className="w-full h-[350px] rounded-xl overflow-hidden border border-outline-variant/10 flex items-center justify-center mb-8 relative z-0">
          <SpatialView 
            center={selectedParcel?.location?.lat ? [selectedParcel.location.lat, selectedParcel.location.lon] : [18.5362, 73.9167]} 
            markers={searchResults?.map(r => ({ position: r.location?.lat ? [r.location.lat, r.location.lon] : [18.5362 + (Math.random()*0.02 - 0.01), 73.9167 + (Math.random()*0.02 - 0.01)] })) || []}
            polygonData={selectedParcel && !selectedParcel.location?.lat ? null : false} // Force default polygon if selected
          />
        </div>

        {/* Search + Parcel Details */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mb-8">
          <div className="lg:col-span-4 bg-surface-container p-6 rounded-xl space-y-5">
            <div className="flex items-center gap-2">
              <IconSearch className="text-secondary" size={14} />
              <h4 className="text-sm font-headline font-bold">Land Search</h4>
            </div>
            <div className="space-y-3">
              {[
                { key: 'village', label: 'Village', placeholder: 'e.g. Hinjewadi' },
                { key: 'surveyNumber', label: 'Survey Number', placeholder: 'e.g. 89/C' },
              ].map(f => (
                <div key={f.key} className="space-y-1">
                  <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60">{f.label}</label>
                  <input value={searchForm[f.key]} onChange={e => setSearchForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full bg-surface-container-high border-none rounded-lg text-on-surface text-sm h-10 px-3 focus:ring-1 focus:ring-primary/40" placeholder={f.placeholder} />
                </div>
              ))}
              <div className="space-y-1">
                <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60">Status</label>
                <select value={searchForm.status} onChange={e => setSearchForm(p => ({ ...p, status: e.target.value }))} className="w-full bg-surface-container-high border-none rounded-lg text-on-surface text-sm h-10 px-3 focus:ring-1 focus:ring-primary/40">
                  <option value="">All</option><option value="verified">Verified</option><option value="pending">Pending</option>
                </select>
              </div>
            </div>
            <button onClick={handleSearch} disabled={searchLoading} className="w-full h-10 bg-primary/15 hover:bg-primary/25 border border-primary/20 text-primary font-bold text-xs rounded-lg transition-all disabled:opacity-50 uppercase tracking-wider">
              {searchLoading ? 'Searching...' : 'Apply Filters'}
            </button>
            {searchResults !== null && <p className="text-[10px] text-on-surface-variant/40">{searchResults.length} result(s)</p>}
            {searchResults?.length > 0 && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {searchResults.map(r => (
                  <button key={r._id} onClick={() => setSelectedParcel(r)} className={`w-full text-left p-2.5 rounded-lg border transition-colors text-xs ${selectedParcel?._id === r._id ? 'border-primary bg-primary/5' : 'border-outline-variant/10 hover:bg-surface-container-high'}`}>
                    <p className="font-bold">{r.location?.surveyNumber || r.surveyNumber}</p>
                    <p className="text-[10px] text-on-surface-variant">{r.location?.village || r.village} \u2014 {r.area?.value || r.area} {r.area?.unit || 'HA'}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-6 bg-surface-container p-6 rounded-xl flex flex-col justify-between min-h-[320px]">
            {selectedParcel ? (
              <>
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-headline font-bold mb-0.5">Parcel {selectedParcel.location?.surveyNumber || selectedParcel.surveyNumber}</h2>
                      <p className="text-xs text-on-surface-variant">{selectedParcel.location?.village || selectedParcel.village} District</p>
                    </div>
                    <StatusBadge status={selectedParcel.status || 'pending'} />
                  </div>
                  <div className="grid grid-cols-2 gap-y-5 gap-x-8">
                    {[
                      { label: 'Area', value: `${selectedParcel.area?.value || selectedParcel.area} ${selectedParcel.area?.unit || 'HA'}` },
                      { label: 'District', value: selectedParcel.location?.district || selectedParcel.district || '\u2014' },
                      { label: 'Owner', value: truncAddr(selectedParcel.owner?.walletAddress || selectedParcel.ownerWallet) },
                      { label: 'Gat No.', value: selectedParcel.location?.gatNumber || selectedParcel.gatNumber || '\u2014' },
                    ].map(r => (
                      <div key={r.label}>
                        <p className="text-[9px] uppercase font-bold tracking-widest text-on-surface-variant/40 mb-1">{r.label}</p>
                        <p className="text-sm font-medium">{r.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button className="flex-1 h-10 bg-surface-container-high border border-outline-variant/20 text-on-surface text-xs font-bold rounded-lg hover:bg-surface-container-highest transition-all uppercase tracking-wider">History</button>
                  <button onClick={handleTransfer} disabled={offerLoading} className="flex-[2] h-10 bg-primary/15 hover:bg-primary/25 border border-primary/20 text-primary text-xs font-bold rounded-lg transition-all disabled:opacity-50 uppercase tracking-wider flex items-center justify-center gap-2">
                    {offerLoading ? 'Sending...' : 'Initiate Transfer'} <IconChevron size={12} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-on-surface-variant/30">
                <div className="text-center"><IconSearch className="mx-auto mb-3 opacity-30" size={32} /><p className="text-xs">Search and select a parcel</p></div>
              </div>
            )}
          </div>
        </div>

        {/* Owned Lands + Active Transfers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-surface-container rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-outline-variant/10 flex justify-between items-center">
              <h4 className="text-sm font-headline font-bold">Owned Lands</h4>
              <span className="text-[10px] text-on-surface-variant/40 font-mono">{landsList.length} total</span>
            </div>
            <div className="overflow-auto max-h-[280px]">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-surface-container">
                  <tr className="text-[10px] font-label uppercase text-on-surface-variant/50 tracking-widest border-b border-outline-variant/10">
                    <th className="px-5 py-3">Survey ID</th><th className="px-5 py-3">Village</th><th className="px-5 py-3">Area</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5 text-xs">
                  {landsLoading ? <tr><td colSpan={3} className="px-5 py-6 text-center text-on-surface-variant/40">Loading...</td></tr>
                  : landsList.length === 0 ? <tr><td colSpan={3} className="px-5 py-6 text-center text-on-surface-variant/40">No owned lands</td></tr>
                  : landsList.map(l => (
                    <tr key={l._id} className="hover:bg-surface-container-high/30 transition-colors">
                      <td className="px-5 py-3 font-bold">{l.location?.surveyNumber || l.surveyNumber}</td>
                      <td className="px-5 py-3 text-on-surface-variant">{l.location?.village || l.village}</td>
                      <td className="px-5 py-3">{l.area?.value || l.area} {l.area?.unit || 'HA'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-surface-container rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-outline-variant/10 flex justify-between items-center">
              <h4 className="text-sm font-headline font-bold">Active Transfers</h4>
              <span className="text-[10px] text-on-surface-variant/40 font-mono">{activeTransfers} pending</span>
            </div>
            <div className="overflow-auto max-h-[280px]">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-surface-container">
                  <tr className="text-[10px] font-label uppercase text-on-surface-variant/50 tracking-widest border-b border-outline-variant/10">
                    <th className="px-5 py-3">Seller</th><th className="px-5 py-3">Price</th><th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5 text-xs">
                  {transfersLoading ? <tr><td colSpan={3} className="px-5 py-6 text-center text-on-surface-variant/40">Loading...</td></tr>
                  : transfersList.length === 0 ? <tr><td colSpan={3} className="px-5 py-6 text-center text-on-surface-variant/40">No transfers</td></tr>
                  : transfersList.map(t => (
                    <tr key={t._id} className="hover:bg-surface-container-high/30 transition-colors">
                      <td className="px-5 py-3 font-mono text-on-surface-variant/50">{truncAddr(t.sellerWallet)}</td>
                      <td className="px-5 py-3 font-bold">{t.price ? `\u20B9${Number(t.price).toLocaleString()}` : '\u2014'}</td>
                      <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-surface-container p-6 rounded-xl">
          <div className="flex items-center gap-2 mb-5">
            <IconNotification className="text-on-surface-variant" size={14} />
            <h4 className="text-sm font-headline font-bold">Recent Alerts</h4>
          </div>
          <div className="space-y-3 max-h-[180px] overflow-auto">
            {notifList.length === 0 ? <p className="text-xs text-on-surface-variant/40 text-center py-4">No recent alerts</p>
            : notifList.slice(0, 5).map((n, i) => (
              <div key={n._id || i} className="flex gap-3 items-start p-2.5 rounded-lg hover:bg-surface-container-high transition-colors">
                <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  {n.type === 'warning' ? <IconAlert className="text-error" size={12} /> : <IconCheck className="text-secondary" size={12} />}
                </div>
                <div>
                  <p className="text-xs font-medium">{n.title || 'Notification'}</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">{n.message}</p>
                  <p className="text-[9px] text-on-surface-variant/30 mt-1 font-mono">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BuyerPage;
