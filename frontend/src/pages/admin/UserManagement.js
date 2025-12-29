import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function UserManagement({ navigate, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');

  const users = [
    { id: 1, email: 'user@example.com', plan: 'Growth', status: 'Active', credits: 3250, joined: 'Jan 15, 2025' },
    { id: 2, email: 'demo@company.com', plan: 'Starter', status: 'Active', credits: 850, joined: 'Jan 20, 2025' },
    { id: 3, email: 'marketing@startup.io', plan: 'Agency', status: 'Active', credits: 18500, joined: 'Dec 10, 2024' },
    { id: 4, email: 'admin@agency.com', plan: 'Growth', status: 'Active', credits: 4200, joined: 'Nov 5, 2024' },
    { id: 5, email: 'sales@business.com', plan: 'Starter', status: 'Suspended', credits: 0, joined: 'Jan 1, 2025' },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
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

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Plan</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Credits</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Joined</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm text-gray-900">{user.email}</td>
                    <td className="py-4 px-6">
                      <Badge variant="outline">{user.plan}</Badge>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{user.credits.toLocaleString()}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{user.joined}</td>
                    <td className="py-4 px-6">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toast.success('User details opened')}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

