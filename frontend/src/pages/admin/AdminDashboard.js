import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Card } from '../../components/ui/card';
import { Users, DollarSign, Zap, TrendingUp } from 'lucide-react';
import { apiRequest } from '../../utils/api';

export default function AdminDashboard({ navigate, onLogout }) {
  const [stats, setStats] = useState([
    { 
      label: 'Active Users', 
      value: '0', 
      change: '+0%',
      icon: Users, 
      color: 'text-[#3B82F6]',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Monthly Revenue', 
      value: '$0', 
      change: '+0%',
      icon: DollarSign, 
      color: 'text-[#22C55E]',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'AI Credits Used', 
      value: '0', 
      change: '+0%',
      icon: Zap, 
      color: 'text-[#F59E0B]',
      bgColor: 'bg-amber-50'
    },
    { 
      label: 'Avg Usage/User', 
      value: '0', 
      change: '+0%',
      icon: TrendingUp, 
      color: 'text-[#8B5CF6]',
      bgColor: 'bg-purple-50'
    },
  ]);

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Fetch admin stats
    apiRequest('/admin/stats')
      .then(response => {
        if (response.success && response.stats) {
          const adminStats = response.stats;
          setStats([
            { 
              label: 'Active Users', 
              value: adminStats.activeUsers?.toLocaleString() || '0', 
              change: '+12.5%',
              icon: Users, 
              color: 'text-[#3B82F6]',
              bgColor: 'bg-blue-50'
            },
            { 
              label: 'Monthly Revenue', 
              value: `$${adminStats.monthlyRevenue?.toLocaleString() || '0'}`, 
              change: '+8.2%',
              icon: DollarSign, 
              color: 'text-[#22C55E]',
              bgColor: 'bg-green-50'
            },
            { 
              label: 'AI Credits Used', 
              value: adminStats.creditsUsed?.toLocaleString() || '0', 
              change: '+15.7%',
              icon: Zap, 
              color: 'text-[#F59E0B]',
              bgColor: 'bg-amber-50'
            },
            { 
              label: 'Avg Usage/User', 
              value: adminStats.avgUsagePerUser?.toLocaleString() || '0', 
              change: '+3.1%',
              icon: TrendingUp, 
              color: 'text-[#8B5CF6]',
              bgColor: 'bg-purple-50'
            },
          ]);
        }
      })
      .catch(error => {
        console.error('Error fetching admin stats:', error);
      });

    // Fetch recent activity
    apiRequest('/admin/activity?limit=5')
      .then(response => {
        if (response.success && response.activities) {
          setRecentActivity(response.activities.map(activity => ({
            user: activity.userEmail,
            action: activity.action,
            time: activity.time
          })));
        }
      })
      .catch(error => {
        console.error('Error fetching admin activity:', error);
        setRecentActivity([]);
      });
  }, []);

  return (
    <AdminLayout navigate={navigate} onLogout={onLogout} activePage="admin-dashboard">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of platform metrics and activity</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className="text-sm text-[#22C55E] font-semibold">{stat.change}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-[#0A2540]">{stat.value}</p>
              </Card>
            );
          })}
        </div>

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

