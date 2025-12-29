import { useState } from 'react';
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
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import PlanManagement from './pages/admin/PlanManagement';
import PromptManager from './pages/admin/PromptManager';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const navigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleLogin = (asAdmin = false) => {
    setIsLoggedIn(true);
    setIsAdmin(asAdmin);
    setCurrentPage('app-dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
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
        return <SignupPage navigate={navigate} onSignup={handleLogin} />;
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