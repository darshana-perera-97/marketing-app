import AppLayout from '../../components/AppLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowUpRight, Sparkles, Target, TrendingUp, Calendar } from 'lucide-react';

interface AppDashboardProps {
  navigate: (page: string) => void;
  onLogout: () => void;
}

export default function AppDashboard({ navigate, onLogout }: AppDashboardProps) {
  const stats = [
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
  ];

  const recentContent = [
    { type: 'Social Media', title: 'Product launch announcement', platform: 'Instagram', date: '2 hours ago', status: 'Published' },
    { type: 'Ad Copy', title: 'Summer sale campaign', platform: 'Google Ads', date: '5 hours ago', status: 'Draft' },
    { type: 'Email', title: 'Newsletter - Weekly tips', platform: 'Email', date: '1 day ago', status: 'Scheduled' },
    { type: 'Social Media', title: 'Customer testimonial post', platform: 'Facebook', date: '1 day ago', status: 'Published' },
    { type: 'Ad Copy', title: 'New feature announcement', platform: 'LinkedIn', date: '2 days ago', status: 'Published' },
  ];

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

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[#0A2540]">{stat.value}</span>
                {stat.total && <span className="text-gray-500">{stat.total}</span>}
              </div>
              {stat.subtitle && <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>}
            </Card>
          ))}
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
