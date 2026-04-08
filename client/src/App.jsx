import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
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

// ── Protected Route wrapper ────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-on-surface-variant font-label text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* Buyer routes */}
      <Route path="/buyer" element={<ProtectedRoute><BuyerPage /></ProtectedRoute>} />
      <Route path="/buyer/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
      <Route path="/buyer/transfers" element={<ProtectedRoute><TransfersPage /></ProtectedRoute>} />

      {/* Seller routes */}
      <Route path="/seller" element={<ProtectedRoute><SellerPage /></ProtectedRoute>} />
      <Route path="/seller/documents" element={<ProtectedRoute><SellerDocumentsPage /></ProtectedRoute>} />
      <Route path="/seller/transfers" element={<ProtectedRoute><SellerTransfersPage /></ProtectedRoute>} />

      {/* Officer routes */}
      <Route path="/officer" element={<ProtectedRoute><OfficerPage /></ProtectedRoute>} />
      <Route path="/officer/documents" element={<ProtectedRoute><OfficerDocumentsPage /></ProtectedRoute>} />
      <Route path="/cases" element={<ProtectedRoute><CasesPage /></ProtectedRoute>} />

      {/* Legacy routes */}
      <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
      <Route path="/transfers" element={<ProtectedRoute><TransfersPage /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="dark">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
