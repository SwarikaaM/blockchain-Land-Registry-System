import React, { useState, useCallback } from 'react';
import SharedNavbar from '../SharedNavbar.jsx';
import Footer from '../Footer.jsx';
import PageHeader from '../shared/PageHeader.jsx';
import StatCard from '../shared/StatCard.jsx';
import StatusBadge from '../shared/StatusBadge.jsx';
import { IconTransfer, IconCheck, IconEscrow, IconBlockchain } from '../icons/Icons.jsx';
import useApi, { useMutation } from '../../hooks/useApi.js';
import { transferAPI, landAPI } from '../../services/api.js';

const BG = { backgroundColor: '#0c0e14', backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(116,117,125,0.04) 1px, transparent 0)', backgroundSize: '32px 32px', color: '#e5e4ed' };

const SellerTransfersPage = () => {
  const [filter, setFilter] = useState('all');
  const { data: transfers, loading, refetch } = useApi(useCallback(() => transferAPI.getMyTransfers(), []));
  const { data: lands } = useApi(useCallback(() => landAPI.list({ role: 'seller' }), []));
  
  const transfersList = Array.isArray(transfers) ? transfers : [];
  const landsList = Array.isArray(lands) ? lands : [];

  const filtered = transfersList.filter(t => {
    if (filter === 'pending') return t.status === 'pending' || t.status === 'in_review';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  const activeCount = transfersList.filter(t => !['completed', 'rejected'].includes(t.status)).length;
  const completedCount = transfersList.filter(t => t.status === 'completed').length;
  const escrowCount = transfersList.filter(t => t.status === 'escrow').length;

  const [form, setForm] = useState({ surveyNumber: '', buyerWallet: '', amount: '', transferType: 'Sale', conditions: '' });
  const { execute: createTransfer, loading: creating, error: createErr } = useMutation(useCallback((d) => transferAPI.createOffer(d), []));
  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.surveyNumber) return;
    try { await createTransfer({ landSurveyNumber: form.surveyNumber, buyerWallet: form.buyerWallet, price: form.amount, type: form.transferType, conditions: form.conditions }); setForm({ surveyNumber: '', buyerWallet: '', amount: '', transferType: 'Sale', conditions: '' }); refetch(); } catch {}
  };

  const truncAddr = (a) => a ? `${a.slice(0, 6)}...${a.slice(-4)}` : '\u2014';

  return (
    <div className="text-on-surface flex flex-col min-h-screen" style={BG}>
      <SharedNavbar role="seller" activePage="/seller/transfers" />
      <main className="flex-grow w-full max-w-7xl mx-auto px-8 py-10">
        <PageHeader title="Transfer Management" subtitle="Track and manage all land transfer transactions." icon={IconTransfer} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Active Transfers" value={loading ? '...' : activeCount} icon={IconTransfer} iconColor="primary" />
          <StatCard label="Completed" value={loading ? '...' : completedCount} icon={IconCheck} iconColor="secondary" />
          <StatCard label="In Escrow" value={loading ? '...' : String(escrowCount).padStart(2, '0')} icon={IconEscrow} iconColor="tertiary-container" />
          <StatCard label="Total" value={loading ? '...' : transfersList.length} icon={IconTransfer} iconColor="on-surface-variant" />
        </div>

        {/* Transfer Queue */}
        <div className="bg-surface-container rounded-xl overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-outline-variant/10 flex justify-between items-center">
            <h3 className="text-sm font-headline font-bold">Active Transfer Queue</h3>
            <div className="flex gap-1.5">
              {['all', 'pending', 'completed'].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${filter === f ? 'bg-primary/10 text-primary' : 'text-on-surface-variant/40 hover:bg-surface-container-high'}`}>{f}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low/50">
                <tr className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50">
                  <th className="px-5 py-3">ID</th><th className="px-5 py-3">Property</th><th className="px-5 py-3">Buyer</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5 text-xs">
                {loading ? <tr><td colSpan={6} className="px-5 py-8 text-center text-on-surface-variant/40">Loading...</td></tr>
                : filtered.length === 0 ? <tr><td colSpan={6} className="px-5 py-8 text-center text-on-surface-variant/40">No transfers found</td></tr>
                : filtered.map(t => (
                  <tr key={t._id} className="hover:bg-surface-container-high/30 transition-colors">
                    <td className="px-5 py-3 font-mono text-primary/60">#{(t._id || '').slice(-6).toUpperCase()}</td>
                    <td className="px-5 py-3">{t.landSurveyNumber || '\u2014'}</td>
                    <td className="px-5 py-3 font-mono text-on-surface-variant/50">{truncAddr(t.buyerWallet)}</td>
                    <td className="px-5 py-3 font-bold">{t.price ? `\u20B9${Number(t.price).toLocaleString()}` : '\u2014'}</td>
                    <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-5 py-3 font-mono text-on-surface-variant/50">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '\u2014'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Initiate Transfer Form */}
        <div className="bg-surface-container rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><IconTransfer className="text-primary" size={16} /></div>
            <h3 className="text-sm font-headline font-bold">Initiate New Transfer</h3>
          </div>
          {createErr && <div className="mb-4 p-2.5 bg-error/10 border border-error/20 rounded-lg text-error text-xs">{createErr}</div>}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60">Property Survey Number</label>
                  <select name="surveyNumber" value={form.surveyNumber} onChange={handleChange} className="w-full bg-surface-container-high border-none rounded-lg text-on-surface text-sm h-10 px-3 focus:ring-1 focus:ring-primary/40">
                    <option value="" disabled>Select a property...</option>
                    {landsList.map(l => <option key={l._id} value={l.location?.surveyNumber || l.surveyNumber}>{l.location?.surveyNumber || l.surveyNumber} \u2014 {l.location?.village || l.village}</option>)}
                  </select>
                </div>
                {[
                  { name: 'buyerWallet', label: 'Buyer Wallet Address', placeholder: '0x...' },
                  { name: 'amount', label: 'Transfer Amount (\u20B9)', placeholder: '0.00', type: 'number' },
                ].map(f => (
                  <div key={f.name} className="space-y-1.5">
                    <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60">{f.label}</label>
                    <input name={f.name} value={form[f.name]} onChange={handleChange} type={f.type || 'text'} className="w-full bg-surface-container-high border-none rounded-lg text-on-surface text-sm h-10 px-3 focus:ring-1 focus:ring-primary/40" placeholder={f.placeholder} />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60">Transfer Type</label>
                  <select name="transferType" value={form.transferType} onChange={handleChange} className="w-full bg-surface-container-high border-none rounded-lg text-on-surface text-sm h-10 px-3 focus:ring-1 focus:ring-primary/40">
                    <option>Sale</option><option>Gift</option><option>Inheritance</option><option>Partition</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60">Special Conditions</label>
                  <textarea name="conditions" value={form.conditions} onChange={handleChange} rows={3} className="w-full bg-surface-container-high border-none rounded-lg text-on-surface text-sm p-3 focus:ring-1 focus:ring-primary/40 resize-none" placeholder="Any special terms..." />
                </div>
              </div>
            </div>
            <button type="submit" disabled={creating} className="w-full mt-5 h-11 bg-primary/15 hover:bg-primary/25 border border-primary/20 text-primary font-bold text-sm rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {creating ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <IconBlockchain size={15} />}
              {creating ? 'Processing...' : 'Initiate Transfer'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SellerTransfersPage;
