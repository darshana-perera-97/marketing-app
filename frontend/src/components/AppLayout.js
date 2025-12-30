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
  ChevronDown,
  UserCircle,
  Mail as MailIcon,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  ArrowLeft
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getUserData } from '../utils/storage';
import { getUserProfile } from '../utils/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function AppLayout({ children, navigate, onLogout, activePage }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Load collapsed state from localStorage
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });
  const [userData, setUserData] = useState(null);
  const [credits, setCredits] = useState(3250);
  const [totalCredits, setTotalCredits] = useState(5000);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState.toString());
  };

  useEffect(() => {
    // Get user data from localStorage first
    const storedUser = getUserData();
    if (storedUser) {
      setUserData(storedUser);
      setCredits(storedUser.credits || 3250);
      setTotalCredits(storedUser.totalCredits || 5000);
      
      // Optionally fetch fresh data from API
      getUserProfile()
        .then(response => {
          if (response.success && response.user) {
            setUserData(response.user);
            setCredits(response.user.credits || 3250);
            setTotalCredits(response.user.totalCredits || 5000);
          }
        })
        .catch(error => {
          console.error('Error fetching user profile:', error);
        });
    }
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', page: 'app-dashboard' },
    { icon: Share2, label: 'Social Media', page: 'social-media' },
    { icon: TrendingUp, label: 'Ad Copy', page: 'ad-copy' },
    { icon: Mail, label: 'Bulk Campaign', page: 'email-campaign' },
    { icon: History, label: 'History', page: 'history' },
    { icon: CreditCard, label: 'Credits & Billing', page: 'credits-billing' },
    { icon: FolderKanban, label: 'Campaigns', page: 'campaigns' },
  ];

  // Campaign manager menu items (shown when on campaigns page)
  const campaignMenuItems = [
    { icon: FolderKanban, label: 'Campaigns', page: 'campaigns' },
    { icon: Calendar, label: 'Content Calendar', page: 'content-calendar' },
    { icon: Sparkles, label: 'Credentials', page: 'purchase-credits' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
            <button 
              onClick={() => navigate('landing')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Sparkles className="w-8 h-8 text-[#0A2540]" />
              <span className="font-bold text-lg text-[#0A2540] hidden sm:inline">AI Marketing Assistant</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Credits Badge */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <span className="text-sm text-gray-600">Credits:</span>
              <span className="font-semibold text-[#0A2540]">{credits.toLocaleString()}</span>
              <span className="text-sm text-gray-500">/ {totalCredits.toLocaleString()}</span>
            </div>

            {/* User Menu Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity outline-none">
                  <div className="w-8 h-8 bg-[#0A2540] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  {userData && (
                    <span className="text-sm text-gray-700 hidden sm:inline">
                      {userData.name || userData.email}
                    </span>
                  )}
                  <ChevronDown className="w-4 h-4 text-gray-600 hidden sm:inline" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userData?.name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-gray-500 flex items-center gap-1">
                      <MailIcon className="w-3 h-3" />
                      {userData?.email || 'user@example.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('brand-setup')}>
                  <UserCircle className="w-4 h-4 mr-2" />
                  <span>Profile & Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('credits-billing')}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  <span>Credits & Billing</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} variant="destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed on desktop */}
        <aside className={`
          fixed md:fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 
          transform transition-all duration-300 ease-in-out mt-16 md:mt-16
          h-[calc(100vh-4rem)]
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-16' : 'md:w-64'} w-64
        `}>
          <nav className="p-4 space-y-2 h-full overflow-y-auto relative flex flex-col">
            <div className="flex-1">
              {/* Back to Dashboard button - shown on Campaign Manager pages */}
              {['campaigns', 'content-calendar', 'purchase-credits', 'credentials-email', 'credentials-whatsapp', 'credentials-facebook', 'credentials-instagram', 'credentials-linkedin'].includes(activePage) && (
                <button
                  onClick={() => {
                    navigate('app-dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 rounded-lg transition-colors mb-2
                    ${isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'}
                    text-gray-700 hover:bg-gray-100
                  `}
                  title={isCollapsed ? 'Back to Dashboard' : ''}
                >
                  <ArrowLeft className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="whitespace-nowrap">Back to Dashboard</span>}
                </button>
              )}
              
              {(['campaigns', 'content-calendar', 'purchase-credits', 'credentials-email', 'credentials-whatsapp', 'credentials-facebook', 'credentials-instagram', 'credentials-linkedin'].includes(activePage)
                ? campaignMenuItems
                : menuItems
              ).map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.page}
                  onClick={() => {
                    navigate(item.page);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 rounded-lg transition-colors
                    ${isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'}
                    ${activePage === item.page 
                      ? 'bg-[#0A2540] text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  title={isCollapsed ? item.label : ''}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                </button>
              );
              })}
            </div>

            <div className="pt-4 border-t border-gray-200 mt-auto">
              <button
                onClick={() => navigate('brand-setup')}
                className={`
                  w-full flex items-center gap-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors mb-2
                  ${isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'}
                `}
                title={isCollapsed ? 'Brand Setup' : ''}
              >
                <Settings className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap">Brand Setup</span>}
              </button>
              <button
                onClick={onLogout}
                className={`
                  w-full flex items-center gap-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors mb-2
                  ${isCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'}
                `}
                title={isCollapsed ? 'Logout' : ''}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap">Logout</span>}
              </button>
              
              {/* Collapse Toggle Button - At Bottom */}
              <button
                onClick={toggleSidebar}
                className="hidden md:flex w-full items-center justify-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200"
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                ) : (
                  <>
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Collapse</span>
                  </>
                )}
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content - Scrollable */}
        <main className={`flex-1 overflow-y-auto h-[calc(100vh-4rem)] p-6 md:p-8 transition-all duration-300 ${
          isCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}>
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

