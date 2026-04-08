import React, { useState, useCallback } from 'react';
import SharedNavbar from '../SharedNavbar.jsx';
import Footer from '../Footer.jsx';
import PageHeader from '../shared/PageHeader.jsx';
import StatCard from '../shared/StatCard.jsx';
import StatusBadge from '../shared/StatusBadge.jsx';
import { IconTransfer, IconCheck, IconAlert } from '../icons/Icons.jsx';
import useApi from '../../hooks/useApi.js';
import { transferAPI } from '../../services/api.js';

const BG = { backgroundColor: '#0c0e14', backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(116,117,125,0.04) 1px, transparent 0)', backgroundSize: '32px 32px', color: '#e5e4ed' };
const truncAddr = (a) => a ? `${a.slice(0, 6)}...${a.slice(-4)}` : '\u2014';

const TransfersPage = () => {
  const [filter, setFilter] = useState('all');
  const { data: transfers, loading } = useApi(useCallback(() => transferAPI.getMyTransfers(), []));
  const transfersList = Array.isArray(transfers) ? transfers : [];

  const filtered = transfersList.filter(t => {
    if (filter === 'pending') return ['pending', 'in_review'].includes(t.status);
    if (filter === 'completed') return t.status === 'completed';
    if (filter === 'rejected') return t.status === 'rejected';
    return true;
  });

  const pendingCount = transfersList.filter(t => ['pending', 'in_review'].includes(t.status)).length;
  const completedCount = transfersList.filter(t => t.status === 'completed').length;
  const rejectedCount = transfersList.filter(t => t.status === 'rejected').length;

  return (
    <div className="font-body min-h-screen flex flex-col" style={BG}>
      <SharedNavbar role="buyer" activePage="/buyer/transfers" />
      <main className="flex-grow w-full max-w-7xl mx-auto px-8 py-10">
        <PageHeader title="Transfer Requests" subtitle="Track land transfer transactions and escrow status." icon={IconTransfer} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total" value={loading ? '...' : transfersList.length} icon={IconTransfer} iconColor="primary" />
          <StatCard label="Pending" value={loading ? '...' : pendingCount} icon={IconTransfer} iconColor="secondary" />
          <StatCard label="Completed" value={loading ? '...' : completedCount} icon={IconCheck} iconColor="green-500" />
          <StatCard label="Rejected" value={loading ? '...' : rejectedCount} icon={IconAlert} iconColor="error" />
        </div>

        <div className="flex gap-1.5 mb-4">
          {['all', 'pending', 'completed', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${filter === f ? 'bg-primary/10 text-primary' : 'text-on-surface-variant/40 hover:bg-surface-container-high'}`}>{f}</button>
          ))}
        </div>

        <div className="bg-surface-container rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low/50">
                <tr className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50">
                  <th className="px-5 py-3">ID</th><th className="px-5 py-3">Property</th><th className="px-5 py-3">Seller</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5 text-xs">
                {loading ? <tr><td colSpan={6} className="px-5 py-8 text-center text-on-surface-variant/40">Loading...</td></tr>
                : filtered.length === 0 ? <tr><td colSpan={6} className="px-5 py-8 text-center text-on-surface-variant/40">No transfers found</td></tr>
                : filtered.map(t => (
                  <tr key={t._id} className="hover:bg-surface-container-high/30 transition-colors">
                    <td className="px-5 py-3 font-mono text-primary/60">#{(t._id || '').slice(-6).toUpperCase()}</td>
                    <td className="px-5 py-3">{t.landSurveyNumber || '\u2014'}</td>
                    <td className="px-5 py-3 font-mono text-on-surface-variant/50">{truncAddr(t.sellerWallet)}</td>
                    <td className="px-5 py-3 font-bold">{t.price ? `\u20B9${Number(t.price).toLocaleString()}` : '\u2014'}</td>
                    <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-5 py-3 font-mono text-on-surface-variant/50">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '\u2014'}</td>
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

export default TransfersPage;
