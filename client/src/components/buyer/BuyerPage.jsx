import React, { useState, useCallback } from 'react';
import SharedNavbar from '../SharedNavbar.jsx';
import Footer from '../Footer.jsx';
import PageHeader from '../shared/PageHeader.jsx';
import StatCard from '../shared/StatCard.jsx';
import StatusBadge from '../shared/StatusBadge.jsx';
import { IconLand, IconTransfer, IconSearch, IconNotification, IconCheck, IconChevron, IconAlert, IconMapPin } from '../icons/Icons.jsx';
import SpatialView from '../shared/SpatialView.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import useApi, { useMutation } from '../../hooks/useApi.js';
import { landAPI, transferAPI, notificationAPI } from '../../services/api.js';

const BG = { backgroundColor: '#0c0e14', backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(116,117,125,0.04) 1px, transparent 0)', backgroundSize: '32px 32px', color: '#e5e4ed' };
const truncAddr = (a) => a ? `${a.slice(0, 6)}...${a.slice(-4)}` : '\u2014';

const BuyerPage = () => {
  useAuth(); // ensure auth context is available

  // State declarations must come first
  const [searchForm, setSearchForm] = useState({ village: '', surveyNumber: '', status: '' });
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [currentPage, setCurrentPage] = useState(1);
  const landsPerPage = 10; // Show 10 lands per page

  // Fetch all available lands from sellers (real data) with pagination
  const { data: availableLands, loading: availableLandsLoading, refetch: refetchAvailableLands } = useApi(useCallback(() => landAPI.search({ page: currentPage, limit: landsPerPage }), [currentPage]));
  // Fetch buyer's owned lands
  const { data: ownedLands, loading: ownedLandsLoading } = useApi(useCallback(() => landAPI.list({ role: 'buyer' }), []));
  const { data: transfers, loading: transfersLoading, refetch: refetchTransfers } = useApi(useCallback(() => transferAPI.getMyTransfers(), []));
  const { data: notifications } = useApi(useCallback(() => notificationAPI.getAll(), []));

  const availableLandsList = Array.isArray(availableLands?.data) ? availableLands.data : Array.isArray(availableLands) ? availableLands : [];
  const ownedLandsList = Array.isArray(ownedLands) ? ownedLands : [];
  const transfersList = Array.isArray(transfers) ? transfers : [];
  const notifList = Array.isArray(notifications) ? notifications : [];

  // Filter available lands based on search criteria (default shows all)
  const filteredLands = availableLandsList.filter(land => {
    const villageMatch = !searchForm.village || 
      (land.location?.village || land.village || '').toLowerCase().includes(searchForm.village.toLowerCase());
    const surveyMatch = !searchForm.surveyNumber || 
      (land.location?.surveyNumber || land.surveyNumber || '').toLowerCase().includes(searchForm.surveyNumber.toLowerCase());
    const statusMatch = !searchForm.status || land.status === searchForm.status;
    return villageMatch && surveyMatch && statusMatch;
  });

  const handleSearch = () => {
    // Reset to first page when applying search filters
    setCurrentPage(1);
    // Search is now just filtering the available lands
    console.log('Filtering lands with criteria:', searchForm);
    console.log('Filtered results:', filteredLands.length);
  };

  const handleViewLandDetails = (land) => {
    setSelectedParcel(land);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setSelectedParcel(null);
    setViewMode('list');
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = availableLands?.pagination?.totalPages || 1;
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Get pagination metadata
  const pagination = availableLands?.pagination || {};
  const totalPages = pagination.totalPages || 1;
  const totalLands = pagination.total || availableLandsList.length;
  
  // Display lands - show paginated results or filtered results
  const displayLands = searchForm.village || searchForm.surveyNumber || searchForm.status 
    ? filteredLands 
    : availableLandsList;

  
  const { execute: createOffer, loading: offerLoading } = useMutation(useCallback((d) => transferAPI.createOffer(d), []));
  const handleTransfer = async () => { 
  if (!selectedParcel) {
    console.log('No parcel selected');
    return;
  }
  console.log('Initiating transfer for land:', selectedParcel._id);
  try { 
    await createOffer({ 
      landId: selectedParcel._id,
      price: 1000, // Default price for testing
      currency: 'POL' 
    }); 
    alert('Transfer request sent!');
    console.log('Transfer request successful');
    // Automatically refresh both transfers and available lands lists
    await refetchTransfers();
    await refetchAvailableLands();
    // Clear selected parcel and go back to list view
    setSelectedParcel(null);
    setViewMode('list');
  } catch (error) {
    console.error('Transfer failed:', error);
    alert('Transfer failed: ' + (error.response?.data?.error || error.message));
  } 
};

  const activeTransfers = transfersList.filter(t => !['completed', 'rejected'].includes(t.status)).length;
  const pendingTransfers = transfersList.filter(t => t.status === 'pending').length;

  return (
    <div className="font-body min-h-screen flex flex-col" style={BG}>
      <SharedNavbar role="buyer" activePage="dashboard" />
      <main className="flex-grow w-full max-w-7xl mx-auto px-8 py-10">
        <PageHeader title="Buyer Dashboard" subtitle="Explore verified land parcels and manage purchase requests." icon={IconLand} />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Available Lands" value={String(availableLandsList.length).padStart(2, '0')} icon={IconLand} iconColor="primary" loading={availableLandsLoading} />
          <StatCard label="Active Transfers" value={String(activeTransfers).padStart(2, '0')} icon={IconTransfer} iconColor="secondary" loading={transfersLoading} />
          <StatCard label="Pending Offers" value={String(pendingTransfers).padStart(2, '0')} icon={IconTransfer} iconColor="tertiary-container" loading={transfersLoading} />
          <StatCard label="Notifications" value={notifList.length} icon={IconNotification} iconColor="on-surface-variant" />
        </div>

        {/* Map */}
        <div className="w-full h-[350px] rounded-xl overflow-hidden border border-outline-variant/10 flex items-center justify-center mb-8 relative z-0">
          <SpatialView 
            landId={selectedParcel?._id}
            center={selectedParcel?.location?.lat ? [selectedParcel.location.lat, selectedParcel.location.lon] : [18.5362, 73.9167]} 
            markers={selectedParcel ? [{ position: selectedParcel.location?.lat ? [selectedParcel.location.lat, selectedParcel.location.lon] : [18.5362, 73.9167] }] : []}
            polygonData={selectedParcel && !selectedParcel.location?.lat ? null : false} // Force default polygon if selected
          />
        </div>

        {/* Search + Available Lands */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Land Search */}
          <div className="bg-surface-container p-6 rounded-xl space-y-5">
            <div className="flex items-center gap-2">
              <IconSearch size={16} className="text-on-surface-variant" />
              <h3 className="text-sm font-headline font-bold">Land Search</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60">Village</label>
                <input value={searchForm.village} onChange={e => setSearchForm(p => ({ ...p, village: e.target.value }))} className="w-full bg-surface-container-high border-none rounded-lg text-on-surface text-sm h-10 px-3 focus:ring-1 focus:ring-primary/40" placeholder="Enter village name" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60">Survey Number</label>
                <input value={searchForm.surveyNumber} onChange={e => setSearchForm(p => ({ ...p, surveyNumber: e.target.value }))} className="w-full bg-surface-container-high border-none rounded-lg text-on-surface text-sm h-10 px-3 focus:ring-1 focus:ring-primary/40" placeholder="Enter survey number" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60">Status</label>
                <select value={searchForm.status} onChange={e => setSearchForm(p => ({ ...p, status: e.target.value }))} className="w-full bg-surface-container-high border-none rounded-lg text-on-surface text-sm h-10 px-3 focus:ring-1 focus:ring-primary/40">
                  <option value="">All</option><option value="verified">Verified</option><option value="pending">Pending</option>
                </select>
              </div>
            </div>
            <button onClick={handleSearch} disabled={availableLandsLoading} className="w-full h-10 bg-primary/15 hover:bg-primary/25 border border-primary/20 text-primary font-bold text-xs rounded-lg transition-all disabled:opacity-50 uppercase tracking-wider">
              {availableLandsLoading ? 'Loading...' : 'Apply Filters'}
            </button>
            <p className="text-[10px] text-on-surface-variant/40">{displayLands.length} result(s) from {availableLandsList.length} available lands</p>
          </div>

          {/* Available Lands List or Land Details */}
          <div className="bg-surface-container p-6 rounded-xl">
            {viewMode === 'list' ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-headline font-bold">Available Lands</h3>
                  <span className="text-[10px] text-on-surface-variant/40">{totalLands} lands</span>
                </div>
                <div className="space-y-2 max-h-[280px] overflow-y-auto">
                  {displayLands.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-10 h-10 rounded-full bg-surface-variant/20 flex items-center justify-center mx-auto mb-3">
                        <IconSearch size={16} className="text-on-surface-variant" />
                      </div>
                      <p className="text-xs text-on-surface-variant">No lands found</p>
                    </div>
                  ) : (
                    displayLands.map(land => (
                      <div key={land._id} className="bg-surface-container-high rounded-lg p-3 flex items-center justify-between hover:bg-surface-container-highest transition-colors">
                        <div className="flex-1">
                          <p className="font-bold text-xs">{land.location?.surveyNumber || land.surveyNumber}</p>
                          <p className="text-[10px] text-on-surface-variant">{land.location?.village || land.village} \u2014 {land.area?.value || land.area} {land.area?.unit || 'HA'}</p>
                        </div>
                        <button 
                          onClick={() => handleViewLandDetails(land)}
                          className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                        >
                          <IconChevron size={14} className="text-primary" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination Controls */}
                {!searchForm.village && !searchForm.surveyNumber && !searchForm.status && totalPages > 1 && (
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-outline-variant/10">
                    <div className="text-[10px] text-on-surface-variant/60">
                      Showing {((currentPage - 1) * landsPerPage) + 1}-{Math.min(currentPage * landsPerPage, totalLands)} of {totalLands} lands
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="w-8 h-8 rounded-lg bg-surface-container-high border border-outline-variant/20 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-highest"
                      >
                        <IconChevron size={12} className="text-on-surface-variant rotate-180" />
                      </button>
                      <span className="text-[10px] text-on-surface-variant font-mono min-w-[60px] text-center">
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 rounded-lg bg-surface-container-high border border-outline-variant/20 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-highest"
                      >
                        <IconChevron size={12} className="text-on-surface-variant" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Land Details View */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleBackToList}
                      className="w-8 h-8 rounded-full bg-surface-variant/20 hover:bg-surface-variant/30 flex items-center justify-center transition-colors"
                    >
                      <IconChevron size={14} className="text-on-surface-variant rotate-180" />
                    </button>
                    <h3 className="text-sm font-headline font-bold">Land Details</h3>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-mono ${selectedParcel?.status === 'registered' ? 'bg-surface-variant/30 text-surface-variant' : 'bg-tertiary-container/30 text-tertiary'}`}>{selectedParcel?.status}</span>
                </div>
                
                {selectedParcel && (
                  <div className="space-y-4">
                    <div className="bg-surface-container-high rounded-lg p-4 space-y-3">
                      <div className="flex justify-between py-2 border-b border-outline-variant/10">
                        <span className="text-on-surface-variant text-xs">Survey ID</span>
                        <span className="font-bold text-xs">{selectedParcel.location?.surveyNumber || selectedParcel.surveyNumber}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-outline-variant/10">
                        <span className="text-on-surface-variant text-xs">Village</span>
                        <span className="font-bold text-xs">{selectedParcel.location?.village || selectedParcel.village}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-outline-variant/10">
                        <span className="text-on-surface-variant text-xs">Area</span>
                        <span className="font-bold text-xs">{selectedParcel.area?.value || selectedParcel.area} {selectedParcel.area?.unit || 'HA'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-outline-variant/10">
                        <span className="text-on-surface-variant text-xs">District</span>
                        <span className="font-bold text-xs">{selectedParcel.location?.district}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-outline-variant/10">
                        <span className="text-on-surface-variant text-xs">Owner</span>
                        <span className="font-bold text-xs">{selectedParcel.owner?.profile?.fullName || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-on-surface-variant text-xs">Gat Number</span>
                        <span className="font-bold text-xs">{selectedParcel.location?.gatNumber || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button className="flex-1 h-10 bg-surface-container-high border border-outline-variant/20 text-on-surface text-xs font-bold rounded-lg hover:bg-surface-container-highest transition-all uppercase tracking-wider">History</button>
                      <button onClick={handleTransfer} disabled={offerLoading} className="flex-[2] h-10 bg-primary/15 hover:bg-primary/25 border border-primary/20 text-primary text-xs font-bold rounded-lg transition-all disabled:opacity-50 uppercase tracking-wider flex items-center justify-center gap-2">
                        {offerLoading ? 'Sending...' : 'Initiate Transfer'} <IconChevron size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Owned Lands + Active Transfers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-surface-container rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-outline-variant/10 flex justify-between items-center">
              <h4 className="text-sm font-headline font-bold">Owned Lands</h4>
              <span className="text-[10px] text-on-surface-variant/40 font-mono">{ownedLandsList.length} total</span>
            </div>
            <div className="overflow-auto max-h-[280px]">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-surface-container">
                  <tr className="text-[10px] font-label uppercase text-on-surface-variant/50 tracking-widest border-b border-outline-variant/10">
                    <th className="px-5 py-3">Survey ID</th><th className="px-5 py-3">Village</th><th className="px-5 py-3">Area</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5 text-xs">
                  {ownedLandsLoading ? <tr><td colSpan={3} className="px-5 py-6 text-center text-on-surface-variant/40">Loading...</td></tr>
                  : ownedLandsList.length === 0 ? <tr><td colSpan={3} className="px-5 py-6 text-center text-on-surface-variant/40">No owned lands</td></tr>
                  : ownedLandsList.map(l => (
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
                      <td className="px-5 py-3">{t.seller?.profile?.fullName || truncAddr(t.seller?.walletAddress) || 'Unknown'}</td>
                      <td className="px-5 py-3 font-bold">{t.price?.amount ? `${t.price.amount} ${t.price.currency || 'POL'}` : '\u2014'}</td>
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
