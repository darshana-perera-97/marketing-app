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
  ShieldCheck,
  UserCircle,
  Mail as MailIcon,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getUserData } from '../utils/storage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function AdminLayout({ children, navigate, onLogout, activePage }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Load collapsed state from localStorage
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });
  const [userData, setUserData] = useState(null);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState.toString());
  };

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = getUserData();
    if (storedUser) {
      setUserData(storedUser);
    }
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', page: 'admin-dashboard' },
    { icon: Users, label: 'User Management', page: 'admin-users' },
    { icon: CreditCard, label: 'Plans & Pricing', page: 'admin-plans' },
    { icon: FileText, label: 'Prompt Templates', page: 'admin-prompts' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
            <button 
              onClick={() => navigate('landing')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Sparkles className="w-8 h-8 text-white" />
              <span className="font-bold text-lg text-white hidden sm:inline">AI Marketing Assistant</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Admin User Menu Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity outline-none">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-[#0A2540]" />
                  </div>
                  <span className="text-white text-sm hidden sm:inline">
                    {userData?.name || 'Admin'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-white hidden sm:inline" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#0A2540]" />
                      <p className="text-sm font-medium leading-none">
                        {userData?.name || 'Admin User'}
                      </p>
                    </div>
                    <p className="text-xs leading-none text-gray-500 flex items-center gap-1">
                      <MailIcon className="w-3 h-3" />
                      {userData?.email || 'admin@example.com'}
                    </p>
                    <span className="text-xs text-[#0A2540] font-semibold mt-1">Administrator</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('admin-dashboard')}>
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('admin-users')}>
                  <Users className="w-4 h-4 mr-2" />
                  <span>User Management</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Settings</span>
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
              {menuItems.map((item) => {
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

