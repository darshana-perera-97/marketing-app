import { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Copy, Save, Sparkles, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface SocialMediaGeneratorProps {
  navigate: (page: string) => void;
  onLogout: () => void;
}

export default function SocialMediaGenerator({ navigate, onLogout }: SocialMediaGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    platform: 'instagram',
    postType: 'promotional',
    topic: '',
    numberOfPosts: '3',
    tone: 'professional',
  });

  const [generatedPosts, setGeneratedPosts] = useState<Array<{ id: number; content: string; hashtags: string }>>([]);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      const mockPosts = [
        {
          id: 1,
          content: "🚀 Transform your marketing strategy with AI! Our latest features help you create content that converts in seconds. Try it today and see the difference.\n\nReady to level up your marketing game? Click the link in bio!",
          hashtags: "#AIMarketing #MarketingTools #ContentCreation #DigitalMarketing #MarketingAutomation"
        },
        {
          id: 2,
          content: "💡 Did you know? Businesses using AI for content creation save 20+ hours per week!\n\nImagine what you could do with that extra time. Our AI Marketing Assistant makes it possible.\n\nStart your free trial today! 👉 Link in bio",
          hashtags: "#ProductivityHacks #MarketingTips #AItools #BusinessGrowth #TimeManagement"
        },
        {
          id: 3,
          content: "✨ Say goodbye to writer's block! Our AI generates high-quality content for:\n• Social media posts\n• Ad campaigns\n• Email sequences\n• And more!\n\nJoin 10,000+ happy marketers today 🎯",
          hashtags: "#ContentMarketing #MarketingSolutions #AIAssistant #SocialMediaMarketing #GrowthHacking"
        },
      ];
      setGeneratedPosts(mockPosts);
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = (content: string, hashtags: string) => {
    navigator.clipboard.writeText(`${content}\n\n${hashtags}`);
    toast.success('Copied to clipboard!');
  };

  const handleSave = (id: number) => {
    toast.success('Saved to history!');
  };

  return (
    <AppLayout navigate={navigate} onLogout={onLogout} activePage="social-media">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Social Media Content Generator</h1>
          <p className="text-gray-600">Create engaging posts for all major platforms</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="p-6 h-fit">
            <h2 className="text-xl font-semibold text-[#0A2540] mb-6">Content Details</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform *</Label>
                <Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value })}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter / X</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="postType">Post Type *</Label>
                <Select value={formData.postType} onValueChange={(value) => setFormData({ ...formData, postType: value })}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="promotional">Promotional</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="testimonial">Testimonial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic / Product *</Label>
                <Textarea
                  id="topic"
                  placeholder="What do you want to post about? Be specific..."
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="bg-input-background min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfPosts">Number of Variations</Label>
                <Select value={formData.numberOfPosts} onValueChange={(value) => setFormData({ ...formData, numberOfPosts: value })}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 variation</SelectItem>
                    <SelectItem value="3">3 variations</SelectItem>
                    <SelectItem value="5">5 variations</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="humorous">Humorous</SelectItem>
                    <SelectItem value="inspirational">Inspirational</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !formData.topic}
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
                    Generate Posts
                  </>
                )}
              </Button>

              <p className="text-sm text-gray-500 text-center">
                Cost: {formData.numberOfPosts === '1' ? '10' : formData.numberOfPosts === '3' ? '25' : '40'} credits
              </p>
            </div>
          </Card>

          {/* Generated Content */}
          <div className="space-y-4">
            {generatedPosts.length === 0 ? (
              <Card className="p-12 text-center">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts generated yet</h3>
                <p className="text-gray-600">Fill in the form and click "Generate Posts" to create content</p>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[#0A2540]">Generated Content</h2>
                  <span className="text-sm text-gray-600">{generatedPosts.length} variations</span>
                </div>
                {generatedPosts.map((post) => (
                  <Card key={post.id} className="p-6">
                    <div className="mb-4">
                      <p className="text-gray-900 whitespace-pre-wrap mb-4">{post.content}</p>
                      <p className="text-[#3B82F6] text-sm">{post.hashtags}</p>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCopy(post.content, post.hashtags)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleSave(post.id)}
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
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
