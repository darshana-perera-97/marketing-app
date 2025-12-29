import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function PromptManager({ navigate, onLogout }) {
  const [selectedTool, setSelectedTool] = useState('social-media');
  const [prompt, setPrompt] = useState('Generate engaging social media content for {platform} about {topic}. Make it {tone} and include relevant hashtags.');

  const tools = [
    { value: 'social-media', label: 'Social Media' },
    { value: 'ad-copy', label: 'Ad Copy' },
    { value: 'email', label: 'Email Campaigns' },
  ];

  const handleSave = () => {
    toast.success('Prompt template saved!');
  };

  const handleReset = () => {
    setPrompt('Generate engaging social media content for {platform} about {topic}. Make it {tone} and include relevant hashtags.');
    toast.success('Prompt reset to default');
  };

  return (
    <AdminLayout navigate={navigate} onLogout={onLogout} activePage="admin-prompts">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Prompt Templates</h1>
          <p className="text-gray-600">Manage AI prompt templates for content generation</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-[#0A2540] mb-4">Select Tool</h2>
            <div className="space-y-2">
              {tools.map((tool) => (
                <button
                  key={tool.value}
                  onClick={() => setSelectedTool(tool.value)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                    selectedTool === tool.value
                      ? 'border-[#0A2540] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {tool.label}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <div className="mb-4">
              <Label className="text-sm text-gray-600 mb-2 block">Current Tool</Label>
              <Badge variant="outline" className="text-base px-3 py-1">
                {tools.find(t => t.value === selectedTool)?.label}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt Template</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-input-background min-h-[300px] font-mono text-sm"
                  placeholder="Enter your prompt template here..."
                />
                <p className="text-xs text-gray-500">
                  Use variables like {'{platform}'}, {'{topic}'}, {'{tone}'} that will be replaced with actual values
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSave}
                  className="bg-[#0A2540] hover:bg-[#0A2540]/90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Template
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleReset}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Default
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

