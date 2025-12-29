import { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowUpRight, Sparkles, Target, TrendingUp, Calendar, AlertCircle, X } from 'lucide-react';
import { getUserData } from '../../utils/storage';
import { apiRequest } from '../../utils/api';

export default function AppDashboard({ navigate, onLogout }) {
  const [userData, setUserData] = useState(null);
  const [showBrandSetupNotification, setShowBrandSetupNotification] = useState(false);
  const [stats, setStats] = useState([
    { 
      label: 'Credits Remaining', 
      value: '3,250', 
      total: '/ 5,000', 
      icon: Sparkles, 
      color: 'text-[#3B82F6]',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Content Generated', 
      value: '247', 
      subtitle: 'This month', 
      icon: Target, 
      color: 'text-[#22C55E]',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'Most Used Tool', 
      value: 'Social Media', 
      subtitle: '128 posts', 
      icon: TrendingUp, 
      color: 'text-[#F59E0B]',
      bgColor: 'bg-amber-50'
    },
    { 
      label: 'Scheduled Posts', 
      value: '18', 
      subtitle: 'Next 7 days', 
      icon: Calendar, 
      color: 'text-[#8B5CF6]',
      bgColor: 'bg-purple-50'
    },
  ]);

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = getUserData();
    if (storedUser) {
      setUserData(storedUser);
      // Check if brand setup is completed (default to false if field doesn't exist)
      setShowBrandSetupNotification(storedUser.brandSetupCompleted === false || storedUser.brandSetupCompleted === undefined);
    }
    
    // Also fetch fresh user data from API to check brand setup status
    apiRequest('/user/profile')
      .then(response => {
        if (response.success && response.user) {
          setUserData(response.user);
          // Show notification if brand setup is not completed (default to true if field doesn't exist for backward compatibility)
          setShowBrandSetupNotification(response.user.brandSetupCompleted === false);
        }
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
      });

    // Fetch dashboard stats from API
    const fetchDashboardData = async () => {
      try {
        // Fetch credits
        const creditsResponse = await apiRequest('/credits');
        if (creditsResponse.success && creditsResponse.credits) {
          setStats(prevStats => {
            const updated = [...prevStats];
            updated[0] = {
              ...updated[0],
              value: creditsResponse.credits.current.toLocaleString(),
              total: `/ ${creditsResponse.credits.total.toLocaleString()}`
            };
            return updated;
          });
        }

        // Fetch dashboard stats
        const statsResponse = await apiRequest('/dashboard/stats');
        if (statsResponse.success && statsResponse.stats) {
          const dashboardStats = statsResponse.stats;
          setStats(prevStats => {
            const updated = [...prevStats];
            // Update credits (already done above, but keep it)
            if (creditsResponse.success && creditsResponse.credits) {
              updated[0] = {
                ...updated[0],
                value: creditsResponse.credits.current.toLocaleString(),
                total: `/ ${creditsResponse.credits.total.toLocaleString()}`
              };
            }
            // Update content generated
            updated[1] = {
              ...updated[1],
              value: dashboardStats.contentGeneratedThisMonth?.toLocaleString() || '0',
              subtitle: 'This month'
            };
            // Update most used tool
            updated[2] = {
              ...updated[2],
              value: dashboardStats.mostUsedTool || 'Social Media',
              subtitle: `${dashboardStats.mostUsedToolCount || 0} posts`
            };
            // Update scheduled posts
            updated[3] = {
              ...updated[3],
              value: dashboardStats.scheduledPosts?.toLocaleString() || '0',
              subtitle: 'Next 7 days'
            };
            return updated;
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const [recentContent, setRecentContent] = useState([]);

  useEffect(() => {
    // Fetch recent content from history
    apiRequest('/content/history?limit=5')
      .then(response => {
        if (response.success && response.items) {
          const formatted = response.items.map(item => ({
            type: item.type,
            title: item.title,
            platform: item.platform || 'N/A',
            date: getTimeAgo(item.date),
            status: item.status || 'Draft'
          }));
          setRecentContent(formatted);
        }
      })
      .catch(error => {
        console.error('Error fetching recent content:', error);
        // Fallback to empty array
        setRecentContent([]);
      });
  }, []);

  // Helper function to get time ago
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const quickActions = [
    { label: 'Generate Social Post', page: 'social-media', icon: '📱' },
    { label: 'Create Ad Copy', page: 'ad-copy', icon: '📢' },
    { label: 'Write Email', page: 'email-campaign', icon: '✉️' },
    { label: 'View Calendar', page: 'content-calendar', icon: '📅' },
  ];

  return (
    <AppLayout navigate={navigate} onLogout={onLogout} activePage="app-dashboard">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Welcome Back! 👋</h1>
          <p className="text-gray-600">Here's what's happening with your marketing today</p>
        </div>

        {/* Brand Setup Notification */}
        {showBrandSetupNotification && (
          <Card className="mb-6 p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">Complete Your Brand Setup</h3>
                  <p className="text-sm text-blue-800 mb-3">
                    To get the most out of AI Marketing Assistant, please complete your brand setup. This helps us generate personalized content that matches your brand voice and style.
                  </p>
                  <Button
                    onClick={() => navigate('brand-setup')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    Complete Brand Setup Now
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[#0A2540]">{stat.value}</span>
                  {stat.total && <span className="text-gray-500">{stat.total}</span>}
                </div>
                {stat.subtitle && <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>}
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#0A2540] mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={() => navigate(action.page)}
                variant="outline"
                className="h-auto py-6 flex-col gap-2 hover:bg-gray-50 hover:border-[#3B82F6]"
              >
                <span className="text-3xl">{action.icon}</span>
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Recent Content */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#0A2540]">Recent Content</h2>
            <Button 
              variant="ghost" 
              onClick={() => navigate('history')}
              className="text-[#3B82F6]"
            >
              View All <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Title</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 hidden md:table-cell">Platform</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 hidden sm:table-cell">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentContent.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{item.type}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.title}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 hidden md:table-cell">{item.platform}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 hidden sm:table-cell">{item.date}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'Published' ? 'bg-green-100 text-green-800' :
                        item.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

