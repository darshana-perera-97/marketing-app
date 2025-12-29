import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface PromptManagerProps {
  navigate: (page: string) => void;
  onLogout: () => void;
}

export default function PromptManager({ navigate, onLogout }: PromptManagerProps) {
  const [selectedTool, setSelectedTool] = useState('social-media');

  const tools = [
    { id: 'social-media', name: 'Social Media', color: 'bg-pink-500' },
    { id: 'ad-copy', name: 'Ad Copy', color: 'bg-blue-500' },
    { id: 'email', name: 'Email', color: 'bg-green-500' },
    { id: 'whatsapp', name: 'WhatsApp', color: 'bg-emerald-500' },
  ];

  const [prompts, setPrompts] = useState({
    'social-media': {
      current: `You are a professional social media content creator. Generate engaging {platform} posts based on the following details:

Topic: {topic}
Post Type: {postType}
Tone: {tone}
Brand Voice: {brandVoice}

Requirements:
- Create compelling copy that drives engagement
- Include relevant emojis
- Suggest 5-10 relevant hashtags
- Keep within platform character limits
- Match the specified tone and brand voice

Output format:
Post Content: [Your engaging post text]
Hashtags: [Relevant hashtags]`,
      versions: [
        { version: 'v2.1', date: 'Jan 25, 2025', author: 'Admin' },
        { version: 'v2.0', date: 'Jan 10, 2025', author: 'Admin' },
      ]
    },
    'ad-copy': {
      current: `You are an expert copywriter specializing in high-converting ad copy. Create compelling ad content based on:

Platform: {platform}
Product/Service: {product}
Target Audience: {targetAudience}
Key Benefit: {keyBenefit}
CTA: {cta}

Requirements:
- Create attention-grabbing headlines (30-60 characters)
- Write persuasive descriptions (60-90 characters)
- Focus on benefits, not just features
- Include a strong call-to-action
- Use power words and emotional triggers

Output format:
Headline: [Compelling headline]
Description: [Persuasive ad copy]
CTA: [Strong call-to-action]`,
      versions: [
        { version: 'v1.5', date: 'Jan 20, 2025', author: 'Admin' },
      ]
    },
    'email': {
      current: `You are a professional email marketing specialist. Create compelling email campaigns based on:

Campaign Type: {type}
Topic: {topic}
Goal: {goal}
Brand Voice: {brandVoice}

Requirements:
- Create an attention-grabbing subject line (40-50 characters)
- Write preview text that complements the subject
- Structure the email with clear sections
- Include a strong call-to-action
- Personalize where appropriate
- Match brand voice and tone

Output format:
Subject Line: [Compelling subject]
Preview Text: [Supporting preview]
Email Body: [Well-structured content]`,
      versions: [
        { version: 'v1.8', date: 'Jan 22, 2025', author: 'Admin' },
      ]
    },
    'whatsapp': {
      current: `You are a WhatsApp marketing specialist. Create concise, engaging WhatsApp messages based on:

Campaign Type: {type}
Topic: {topic}
Goal: {goal}

Requirements:
- Keep messages concise (max 300 characters)
- Use emojis strategically for engagement
- Include clear call-to-action
- Make it conversational and friendly
- Add urgency when appropriate

Output format:
WhatsApp Message: [Concise, engaging message with emojis]`,
      versions: [
        { version: 'v1.2', date: 'Jan 18, 2025', author: 'Admin' },
      ]
    },
  });

  const [editedPrompt, setEditedPrompt] = useState(prompts[selectedTool as keyof typeof prompts].current);

  const handleToolChange = (toolId: string) => {
    setSelectedTool(toolId);
    setEditedPrompt(prompts[toolId as keyof typeof prompts].current);
  };

  const handleSave = () => {
    toast.success('Prompt template saved successfully');
  };

  const handleReset = () => {
    setEditedPrompt(prompts[selectedTool as keyof typeof prompts].current);
    toast.success('Reset to current version');
  };

  return (
    <AdminLayout navigate={navigate} onLogout={onLogout} activePage="admin-prompts">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Prompt Template Manager</h1>
          <p className="text-gray-600">Manage and optimize AI prompts for each tool</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Tool Sidebar */}
          <Card className="p-4 h-fit">
            <h3 className="font-semibold text-gray-900 mb-4">Tools</h3>
            <div className="space-y-2">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolChange(tool.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    selectedTool === tool.id
                      ? 'bg-[#0A2540] text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${tool.color}`}></div>
                  <span>{tool.name}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Prompt Editor */}
          <Card className="p-6 lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#0A2540]">
                  {tools.find(t => t.id === selectedTool)?.name} Prompt
                </h2>
                <Badge>Current Version</Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <Label>Prompt Template</Label>
                <Textarea
                  value={editedPrompt}
                  onChange={(e) => setEditedPrompt(e.target.value)}
                  className="min-h-[500px] font-mono text-sm bg-input-background"
                />
                <p className="text-sm text-gray-500">
                  Use variables like {'{platform}'}, {'{topic}'}, {'{tone}'} etc. to customize the prompt
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-[#22C55E] hover:bg-[#22C55E]/90">
                  <Save className="w-4 h-4 mr-2" />
                  Save Prompt
                </Button>
                <Button onClick={handleReset} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Variables Reference */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Available Variables</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  '{platform}', '{topic}', '{postType}', '{tone}',
                  '{brandVoice}', '{product}', '{targetAudience}', '{keyBenefit}',
                  '{cta}', '{type}', '{goal}'
                ].map((variable) => (
                  <code key={variable} className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-800">
                    {variable}
                  </code>
                ))}
              </div>
            </div>
          </Card>

          {/* Version History */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Version History</h3>
            <div className="space-y-3">
              {prompts[selectedTool as keyof typeof prompts].versions.map((version, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-gray-900">{version.version}</span>
                    <Button size="sm" variant="ghost" onClick={() => toast.success('Version restored')}>
                      Restore
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600">{version.date}</p>
                  <p className="text-xs text-gray-500">By {version.author}</p>
                </div>
              ))}
            </div>

            {/* Metrics */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Performance</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Generation Time</span>
                  <span className="font-semibold text-gray-900">2.4s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-semibold text-[#22C55E]">98.7%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tokens/Request</span>
                  <span className="font-semibold text-gray-900">450</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
