import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Search, Filter, MoreVertical, Ban, RefreshCw, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface UserManagementProps {
  navigate: (page: string) => void;
  onLogout: () => void;
}

export default function UserManagement({ navigate, onLogout }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', plan: 'Growth', credits: 3250, used: 1750, status: 'Active', joined: 'Jan 15, 2025' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@company.com', plan: 'Agency', credits: 18500, used: 1500, status: 'Active', joined: 'Jan 10, 2025' },
    { id: 3, name: 'Mike Johnson', email: 'mike@startup.io', plan: 'Starter', credits: 750, used: 250, status: 'Active', joined: 'Jan 20, 2025' },
    { id: 4, name: 'Emily Davis', email: 'emily@business.com', plan: 'Growth', credits: 4200, used: 800, status: 'Active', joined: 'Jan 5, 2025' },
    { id: 5, name: 'Tom Wilson', email: 'tom@agency.com', plan: 'Agency', credits: 19200, used: 800, status: 'Active', joined: 'Dec 28, 2024' },
    { id: 6, name: 'Lisa Brown', email: 'lisa@demo.com', plan: 'Starter', credits: 500, used: 500, status: 'Suspended', joined: 'Jan 18, 2025' },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPlan === 'all' || user.plan === filterPlan;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout navigate={navigate} onLogout={onLogout} activePage="admin-users">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2540] mb-2">User Management</h1>
          <p className="text-gray-600">Manage users, subscriptions, and credits</p>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">Total Users</p>
            <p className="text-3xl font-bold text-[#0A2540]">2,847</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">Active Today</p>
            <p className="text-3xl font-bold text-[#22C55E]">1,243</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">New This Month</p>
            <p className="text-3xl font-bold text-[#3B82F6]">342</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">Suspended</p>
            <p className="text-3xl font-bold text-[#EF4444]">12</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input-background"
              />
            </div>
            <Select value={filterPlan} onValueChange={setFilterPlan}>
              <SelectTrigger className="w-full md:w-[200px] bg-input-background">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="Starter">Starter</SelectItem>
                <SelectItem value="Growth">Growth</SelectItem>
                <SelectItem value="Agency">Agency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Users Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">User</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 hidden lg:table-cell">Email</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Plan</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 hidden md:table-cell">Credits</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 hidden sm:table-cell">Joined</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600 lg:hidden">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 hidden lg:table-cell">{user.email}</td>
                    <td className="py-4 px-6">
                      <Badge variant="outline">{user.plan}</Badge>
                    </td>
                    <td className="py-4 px-6 hidden md:table-cell">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.credits.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Used: {user.used.toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 hidden sm:table-cell">{user.joined}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => toast.success('User details opened')}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => toast.success('Plan upgraded')}
                        >
                          <TrendingUp className="w-4 h-4 text-[#3B82F6]" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => toast.success('Credits reset')}
                        >
                          <RefreshCw className="w-4 h-4 text-[#22C55E]" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => toast.success(user.status === 'Active' ? 'User suspended' : 'User activated')}
                        >
                          <Ban className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-600">No users found matching your filters</p>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
