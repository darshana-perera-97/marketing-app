import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import LandingPage from './pages/LandingPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AppDashboard from './pages/app/AppDashboard';
import BrandSetup from './pages/app/BrandSetup';
import SocialMediaGenerator from './pages/app/SocialMediaGenerator';
import AdCopyGenerator from './pages/app/AdCopyGenerator';
import EmailCampaignGenerator from './pages/app/EmailCampaignGenerator';
import ContentCalendar from './pages/app/ContentCalendar';
import History from './pages/app/History';
import CreditsAndBilling from './pages/app/CreditsAndBilling';
import Credentials from './pages/app/Credentials';
import CredentialsEmail from './pages/app/CredentialsEmail';
import CredentialsWhatsApp from './pages/app/CredentialsWhatsApp';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import PlanManagement from './pages/admin/PlanManagement';
import PromptManager from './pages/admin/PromptManager';
import { isLoggedIn, isAdmin, getUserData, clearUserData } from './utils/storage';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isLoggedInState, setIsLoggedInState] = useState(false);
  const [isAdminState, setIsAdminState] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const loggedIn = isLoggedIn();
    const admin = isAdmin();
    
    if (loggedIn) {
      setIsLoggedInState(true);
      setIsAdminState(admin);
      // Redirect to appropriate dashboard
      setCurrentPage(admin ? 'admin-dashboard' : 'app-dashboard');
    }
  }, []);

  const navigate = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = (user, token, asAdmin = false) => {
    setIsLoggedInState(true);
    setIsAdminState(asAdmin);
    setCurrentPage(asAdmin ? 'admin-dashboard' : 'app-dashboard');
  };

  const handleLogout = () => {
    clearUserData();
    setIsLoggedInState(false);
    setIsAdminState(false);
    setCurrentPage('landing');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage navigate={navigate} />;
      case 'features':
        return <FeaturesPage navigate={navigate} />;
      case 'pricing':
        return <PricingPage navigate={navigate} />;
      case 'login':
        return <LoginPage navigate={navigate} onLogin={handleLogin} />;
      case 'signup':
        return <SignupPage navigate={navigate} onSignup={(user, token) => handleLogin(user, token, false)} />;
      case 'app-dashboard':
        return <AppDashboard navigate={navigate} onLogout={handleLogout} />;
      case 'brand-setup':
        return <BrandSetup navigate={navigate} onLogout={handleLogout} />;
      case 'social-media':
        return <SocialMediaGenerator navigate={navigate} onLogout={handleLogout} />;
      case 'ad-copy':
        return <AdCopyGenerator navigate={navigate} onLogout={handleLogout} />;
      case 'email-campaign':
        return <EmailCampaignGenerator navigate={navigate} onLogout={handleLogout} />;
      case 'content-calendar':
        return <ContentCalendar navigate={navigate} onLogout={handleLogout} />;
      case 'history':
        return <History navigate={navigate} onLogout={handleLogout} />;
      case 'credits-billing':
        return <CreditsAndBilling navigate={navigate} onLogout={handleLogout} />;
      case 'purchase-credits':
        return <Credentials navigate={navigate} onLogout={handleLogout} />;
      case 'credentials-email':
        return <CredentialsEmail navigate={navigate} onLogout={handleLogout} />;
      case 'credentials-whatsapp':
        return <CredentialsWhatsApp navigate={navigate} onLogout={handleLogout} />;
      case 'credentials-facebook':
        return <Credentials navigate={navigate} onLogout={handleLogout} />;
      case 'credentials-instagram':
        return <Credentials navigate={navigate} onLogout={handleLogout} />;
      case 'credentials-twitter':
        return <Credentials navigate={navigate} onLogout={handleLogout} />;
      case 'credentials-linkedin':
        return <Credentials navigate={navigate} onLogout={handleLogout} />;
      case 'admin-dashboard':
        return <AdminDashboard navigate={navigate} onLogout={handleLogout} />;
      case 'admin-users':
        return <UserManagement navigate={navigate} onLogout={handleLogout} />;
      case 'admin-plans':
        return <PlanManagement navigate={navigate} onLogout={handleLogout} />;
      case 'admin-prompts':
        return <PromptManager navigate={navigate} onLogout={handleLogout} />;
      default:
        return <LandingPage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
      <Toaster />
    </div>
  );
}

export default App;
