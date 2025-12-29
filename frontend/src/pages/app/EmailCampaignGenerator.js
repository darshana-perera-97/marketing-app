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

export default function EmailCampaignGenerator({ navigate, onLogout }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    type: 'email',
    subject: '',
    purpose: '',
    tone: 'professional',
  });

  const [generatedContent, setGeneratedContent] = useState(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedContent({
        subject: formData.subject || "Transform Your Marketing with AI",
        body: "Hi there,\n\nI wanted to reach out and share something exciting with you. Our AI Marketing Assistant can help you create high-converting content in seconds.\n\nKey benefits:\n• Save 20+ hours per week\n• Generate content for all platforms\n• Maintain consistent brand voice\n• Scale your marketing efforts\n\nReady to get started? Click here to try it free!\n\nBest regards,\nThe Team",
      });
      setIsGenerating(false);
      toast.success('Email generated successfully!');
    }, 2000);
  };

  return (
    <AppLayout navigate={navigate} onLogout={onLogout} activePage="email-campaign">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Email & WhatsApp Campaign Generator</h1>
          <p className="text-gray-600">Create compelling email sequences and WhatsApp messages</p>
        </div>

        <Tabs defaultValue="email" className="mb-8">
          <TabsList>
            <TabsTrigger value="email">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="whatsapp">
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="p-6 h-fit">
                <h2 className="text-xl font-semibold text-[#0A2540] mb-6">Email Details</h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject Line</Label>
                    <Input
                      id="subject"
                      placeholder="e.g., Transform Your Marketing with AI"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="bg-input-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Email Purpose *</Label>
                    <Textarea
                      id="purpose"
                      placeholder="What is this email about? (promotion, newsletter, welcome, etc.)"
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      className="bg-input-background min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <Select value={formData.tone} onValueChange={(value) => setFormData({ ...formData, tone: value })}>
                      <SelectTrigger className="bg-input-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleGenerate} 
                    disabled={isGenerating || !formData.purpose}
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
                        Generate Email
                      </>
                    )}
                  </Button>

                  <p className="text-sm text-gray-500 text-center">Cost: 25 credits</p>
                </div>
              </Card>

              <div className="space-y-4">
                {!generatedContent ? (
                  <Card className="p-12 text-center">
                    <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No email generated yet</h3>
                    <p className="text-gray-600">Fill in the form and click "Generate Email" to create content</p>
                  </Card>
                ) : (
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-[#0A2540] mb-4">Generated Email</h2>
                    <div className="mb-4">
                      <Label className="text-sm text-gray-600">Subject:</Label>
                      <p className="font-semibold text-[#0A2540] mb-4">{generatedContent.subject}</p>
                      <Label className="text-sm text-gray-600">Body:</Label>
                      <p className="text-gray-900 whitespace-pre-wrap mt-2">{generatedContent.body}</p>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
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
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="whatsapp">
            <Card className="p-12 text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">WhatsApp Campaigns</h3>
              <p className="text-gray-600">Coming soon! WhatsApp message generation will be available here.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

