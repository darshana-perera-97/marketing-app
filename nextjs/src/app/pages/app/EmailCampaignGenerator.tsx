import { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Copy, Save, Sparkles, RefreshCw, Mail, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface EmailCampaignGeneratorProps {
  navigate: (page: string) => void;
  onLogout: () => void;
}

export default function EmailCampaignGenerator({ navigate, onLogout }: EmailCampaignGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('email');
  const [formData, setFormData] = useState({
    type: 'promotional',
    topic: '',
    goal: '',
  });

  const [generatedContent, setGeneratedContent] = useState<{
    subject?: string;
    preview?: string;
    body?: string;
    message?: string;
  } | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      if (activeTab === 'email') {
        setGeneratedContent({
          subject: "🚀 Transform Your Marketing with AI - Limited Time Offer",
          preview: "Save 20+ hours per week on content creation...",
          body: `Hi there,

Are you tired of spending hours creating marketing content? We have exciting news for you!

Our AI Marketing Assistant helps businesses like yours:
• Generate social media posts in seconds
• Create high-converting ad copy
• Write engaging email campaigns
• Plan content calendars effortlessly

Special Offer: Start your 14-day free trial today and get 50% off your first month!

What you'll get:
✓ 5,000 AI credits per month
✓ Unlimited brand profiles
✓ Advanced analytics
✓ Priority support

Join 10,000+ marketers who have already transformed their workflow.

Ready to get started? Click the button below:

[Start Your Free Trial]

Best regards,
The AI Marketing Team

P.S. This offer expires in 48 hours - don't miss out!`
        });
      } else {
        setGeneratedContent({
          message: `🎉 *Special Offer Just For You!*

Hi! We noticed you're interested in automating your marketing.

Our AI Marketing Assistant can help you:
✅ Create content 10x faster
✅ Save 20+ hours per week
✅ Boost engagement by 40%

🎁 *Limited Time:* Get 50% OFF your first month!

Start your FREE 14-day trial now:
👉 [Your Link Here]

Questions? Just reply to this message!`
        });
      }
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <AppLayout navigate={navigate} onLogout={onLogout} activePage="email-campaign">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Email & WhatsApp Campaign Generator</h1>
          <p className="text-gray-600">Create compelling campaigns that drive conversions</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="email">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="whatsapp">
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </TabsTrigger>
          </TabsList>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card className="p-6 h-fit">
              <h2 className="text-xl font-semibold text-[#0A2540] mb-6">Campaign Details</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="type">Campaign Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="bg-input-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="promotional">Promotional</SelectItem>
                      <SelectItem value="welcome">Welcome Series</SelectItem>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">Topic / Offer *</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., New product launch, Special discount"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="bg-input-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal">Campaign Goal *</Label>
                  <Textarea
                    id="goal"
                    placeholder="What action do you want recipients to take?"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="bg-input-background min-h-[100px]"
                  />
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !formData.topic || !formData.goal}
                  className="w-full bg-[#0A2540] hover:bg-[#0A2540]/90"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Campaign
                    </>
                  )}
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  Cost: {activeTab === 'email' ? '25' : '15'} credits
                </p>
              </div>
            </Card>

            {/* Generated Content */}
            <div className="space-y-4">
              {!generatedContent ? (
                <Card className="p-12 text-center">
                  <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaign generated yet</h3>
                  <p className="text-gray-600">Fill in the form and click "Generate Campaign" to create content</p>
                </Card>
              ) : (
                <>
                  <TabsContent value="email" className="mt-0 space-y-4">
                    {generatedContent.subject && (
                      <Card className="p-6">
                        <Label className="text-xs text-gray-500 uppercase mb-2 block">Subject Line</Label>
                        <p className="text-lg font-semibold text-gray-900 mb-4">{generatedContent.subject}</p>
                        
                        <Label className="text-xs text-gray-500 uppercase mb-2 block">Preview Text</Label>
                        <p className="text-gray-700 mb-4">{generatedContent.preview}</p>
                        
                        <Label className="text-xs text-gray-500 uppercase mb-2 block">Email Body</Label>
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <pre className="text-sm text-gray-900 whitespace-pre-wrap font-sans">{generatedContent.body}</pre>
                        </div>

                        <div className="flex gap-2 pt-4 mt-4 border-t border-gray-200">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(`Subject: ${generatedContent.subject}\n\n${generatedContent.body}`);
                              toast.success('Copied to clipboard!');
                            }}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toast.success('Saved to history!')}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="ml-auto"
                          >
                            Edit
                          </Button>
                        </div>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="whatsapp" className="mt-0 space-y-4">
                    {generatedContent.message && (
                      <Card className="p-6">
                        <Label className="text-xs text-gray-500 uppercase mb-2 block">WhatsApp Message</Label>
                        <div className="bg-[#DCF8C6] p-6 rounded-lg rounded-tl-none mb-4">
                          <pre className="text-sm text-gray-900 whitespace-pre-wrap font-sans">{generatedContent.message}</pre>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                          <p className="text-sm text-blue-800">
                            💡 <strong>Tip:</strong> WhatsApp messages work best when they're concise and include clear CTAs. Use emojis to increase engagement!
                          </p>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-gray-200">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(generatedContent.message || '');
                              toast.success('Copied to clipboard!');
                            }}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toast.success('Saved to history!')}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="ml-auto"
                          >
                            Edit
                          </Button>
                        </div>
                      </Card>
                    )}
                  </TabsContent>
                </>
              )}
            </div>
          </div>
        </Tabs>
      </div>
    </AppLayout>
  );
}
