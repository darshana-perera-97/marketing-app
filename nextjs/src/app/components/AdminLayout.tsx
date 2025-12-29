import { ReactNode } from 'react';
import { Button } from '../components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  FileText, 
  LogOut,
  Menu,
  Sparkles,
  User,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { useState } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  navigate: (page: string) => void;
  onLogout: () => void;
  activePage: string;
}

export default function AdminLayout({ children, navigate, onLogout, activePage }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', page: 'admin-dashboard' },
    { icon: Users, label: 'User Management', page: 'admin-users' },
    { icon: CreditCard, label: 'Plans & Pricing', page: 'admin-plans' },
    { icon: FileText, label: 'Prompt Templates', page: 'admin-prompts' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-[#0A2540] border-b border-gray-700 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-white" />
              <span className="font-bold text-lg text-white hidden sm:inline">Admin Panel</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-[#0A2540]" />
              </div>
              <span className="text-white text-sm hidden sm:inline">Admin</span>
              <ChevronDown className="w-4 h-4 text-white hidden sm:inline" />
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
