import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/pages/LandingPage.jsx';
import BuyerPage from './components/buyer/BuyerPage.jsx';
import SellerPage from './components/seller/SellerPage.jsx';
import OfficerPage from './components/officer/OfficerPage.jsx';
import DocumentsPage from './components/buyer/DocumentsPage.jsx';
import TransfersPage from './components/buyer/TransfersPage.jsx';
import SellerDocumentsPage from './components/seller/SellerDocumentsPage.jsx';
import SellerTransfersPage from './components/seller/SellerTransfersPage.jsx';
import OfficerDocumentsPage from './components/officer/OfficerDocumentsPage.jsx';
import CasesPage from './components/officer/CasesPage.jsx';
import './tailwind.css';

function App() {
  return (
    <Router>
      <div className="dark">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/buyer" element={<BuyerPage />} />
          <Route path="/seller" element={<SellerPage />} />
          <Route path="/officer" element={<OfficerPage />} />
          {/* Buyer routes */}
          <Route path="/buyer/documents" element={<DocumentsPage />} />
          <Route path="/buyer/transfers" element={<TransfersPage />} />
          {/* Seller routes */}
          <Route path="/seller/documents" element={<SellerDocumentsPage />} />
          <Route path="/seller/transfers" element={<SellerTransfersPage />} />
          {/* Officer routes */}
          <Route path="/officer/documents" element={<OfficerDocumentsPage />} />
          <Route path="/cases" element={<CasesPage />} />
          {/* Legacy routes (default to buyer) */}
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/transfers" element={<TransfersPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
