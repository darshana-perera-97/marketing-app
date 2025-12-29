import AdminLayout from '../../components/AdminLayout';
import { Card } from '../../components/ui/card';
import { Users, DollarSign, Zap, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AdminDashboardProps {
  navigate: (page: string) => void;
  onLogout: () => void;
}

export default function AdminDashboard({ navigate, onLogout }: AdminDashboardProps) {
  const stats = [
    { 
      label: 'Active Users', 
      value: '2,847', 
      change: '+12.5%',
      icon: Users, 
      color: 'text-[#3B82F6]',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Monthly Revenue', 
      value: '$184,920', 
      change: '+8.2%',
      icon: DollarSign, 
      color: 'text-[#22C55E]',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'AI Credits Used', 
      value: '12.4M', 
      change: '+15.7%',
      icon: Zap, 
      color: 'text-[#F59E0B]',
      bgColor: 'bg-amber-50'
    },
    { 
      label: 'Avg Usage/User', 
      value: '4,356', 
      change: '+3.1%',
      icon: TrendingUp, 
      color: 'text-[#8B5CF6]',
      bgColor: 'bg-purple-50'
    },
  ];

  const revenueData = [
    { month: 'Jul', revenue: 145000 },
    { month: 'Aug', revenue: 152000 },
    { month: 'Sep', revenue: 168000 },
    { month: 'Oct', revenue: 171000 },
    { month: 'Nov', revenue: 175000 },
    { month: 'Dec', revenue: 184920 },
  ];

  const usageData = [
    { tool: 'Social Media', usage: 4200 },
    { tool: 'Ad Copy', usage: 3100 },
    { tool: 'Email', usage: 2800 },
    { tool: 'Images', usage: 1900 },
    { tool: 'Calendar', usage: 1200 },
  ];

  const recentActivity = [
    { user: 'user@example.com', action: 'Upgraded to Growth plan', time: '5 minutes ago' },
    { user: 'demo@company.com', action: 'Generated 15 social posts', time: '12 minutes ago' },
    { user: 'marketing@startup.io', action: 'Created new brand profile', time: '23 minutes ago' },
    { user: 'admin@agency.com', action: 'Added 3 team members', time: '1 hour ago' },
    { user: 'sales@business.com', action: 'Generated ad campaign', time: '2 hours ago' },
  ];

  return (
    <AdminLayout navigate={navigate} onLogout={onLogout} activePage="admin-dashboard">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of platform metrics and activity</p>
        </div>

        {/* KPI Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-sm text-[#22C55E] font-semibold">{stat.change}</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-[#0A2540]">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-[#0A2540] mb-6">Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-[#0A2540] mb-6">Tool Usage</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="tool" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Bar dataKey="usage" fill="#0A2540" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-[#0A2540] mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
