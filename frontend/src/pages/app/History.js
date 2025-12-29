import { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Search, Filter, Copy, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '../../utils/api';

export default function History({ navigate, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTool, setFilterTool] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [historyItems, setHistoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch history from API
    const fetchHistory = async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (filterTool !== 'all') params.append('filter', filterTool);
        
        const response = await apiRequest(`/content/history?${params.toString()}`);
        if (response.success) {
          // Format dates for display
          const formatted = response.items.map(item => ({
            ...item,
            date: new Date(item.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })
          }));
          setHistoryItems(formatted);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
        toast.error('Failed to load history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [searchTerm, filterTool]);

  const filteredItems = historyItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterTool === 'all' || item.type === filterTool;
    return matchesSearch && matchesFilter;
  });

  return (
    <AppLayout navigate={navigate} onLogout={onLogout} activePage="history">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Content History</h1>
          <p className="text-gray-600">View and manage all your generated content</p>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input-background"
              />
            </div>
            <Select value={filterTool} onValueChange={setFilterTool}>
              <SelectTrigger className="w-full md:w-[200px] bg-input-background">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tools</SelectItem>
                <SelectItem value="Social Media">Social Media</SelectItem>
                <SelectItem value="Ad Copy">Ad Copy</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Table
              </Button>
              <Button 
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
              >
                Cards
              </Button>
            </div>
          </div>
        </Card>

        {viewMode === 'table' && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Type</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Title</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 hidden md:table-cell">Platform</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 hidden sm:table-cell">Date</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <Badge variant="outline">{item.type}</Badge>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">{item.title}</td>
                      <td className="py-4 px-6 text-sm text-gray-600 hidden md:table-cell">{item.platform}</td>
                      <td className="py-4 px-6 text-sm text-gray-600 hidden sm:table-cell">{item.date}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'Published' ? 'bg-green-100 text-green-800' :
                          item.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => toast.success('Copied to clipboard!')}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => toast.success('Downloaded!')}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {viewMode === 'cards' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="outline">{item.type}</Badge>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'Published' ? 'bg-green-100 text-green-800' :
                    item.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span>{item.platform}</span>
                  <span>•</span>
                  <span>{item.date}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-600">{item.credits} credits</span>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => toast.success('Copied!')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => toast.success('Deleted!')}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {isLoading && (
          <Card className="p-12 text-center">
            <p className="text-gray-600">Loading history...</p>
          </Card>
        )}

        {!isLoading && filteredItems.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-gray-600">No content found matching your filters</p>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}

