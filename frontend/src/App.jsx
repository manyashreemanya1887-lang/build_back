import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import MarketplacePage from './pages/MarketplacePage';
import ListingDetailPage from './pages/ListingDetailPage';
import CreateListingWizard from './pages/CreateListingWizard';
import SellerDashboard from './pages/SellerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ModelEvaluationPage from './pages/ModelEvaluationPage';
import AuthPages from './pages/AuthPages';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/listings/:id" element={<ListingDetailPage />} />
              <Route path="/create-listing" element={<CreateListingWizard />} />
              <Route path="/seller-dashboard" element={<SellerDashboard />} />
              <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/model-evaluation" element={<ModelEvaluationPage />} />
              <Route path="/auth" element={<AuthPages />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
