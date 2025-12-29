import { ReactNode } from 'react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  LayoutDashboard, 
  Share2, 
  TrendingUp, 
  Mail, 
  Calendar, 
  History, 
  CreditCard, 
  Settings, 
  LogOut,
  Menu,
  Sparkles,
  User,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  navigate: (page: string) => void;
  onLogout: () => void;
  activePage: string;
}

export default function AppLayout({ children, navigate, onLogout, activePage }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const credits = 3250;
  const totalCredits = 5000;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', page: 'app-dashboard' },
    { icon: Share2, label: 'Social Media', page: 'social-media' },
    { icon: TrendingUp, label: 'Ad Copy', page: 'ad-copy' },
    { icon: Mail, label: 'Email Campaigns', page: 'email-campaign' },
    { icon: Calendar, label: 'Content Calendar', page: 'content-calendar' },
    { icon: History, label: 'History', page: 'history' },
    { icon: CreditCard, label: 'Credits & Billing', page: 'credits-billing' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-[#0A2540]" />
              <span className="font-bold text-lg text-[#0A2540] hidden sm:inline">AI Marketing Assistant</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Credits Badge */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <span className="text-sm text-gray-600">Credits:</span>
              <span className="font-semibold text-[#0A2540]">{credits.toLocaleString()}</span>
              <span className="text-sm text-gray-500">/ {totalCredits.toLocaleString()}</span>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-[#0A2540] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600 hidden sm:inline" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-200 ease-in-out mt-16 md:mt-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <nav className="p-4 space-y-2 h-full overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  navigate(item.page);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${activePage === item.page 
                    ? 'bg-[#0A2540] text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}

            <div className="pt-4 border-t border-gray-200 mt-4">
              <button
                onClick={() => navigate('brand-setup')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Settings className="w-5 h-5" />
                <span>Brand Setup</span>
              </button>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden mt-16"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
