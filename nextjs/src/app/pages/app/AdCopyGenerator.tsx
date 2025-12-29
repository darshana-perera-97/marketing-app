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

interface AdCopyGeneratorProps {
  navigate: (page: string) => void;
  onLogout: () => void;
}

export default function AdCopyGenerator({ navigate, onLogout }: AdCopyGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    platform: 'google',
    product: '',
    targetAudience: '',
    keyBenefit: '',
    cta: 'learn-more',
  });

  const [generatedAds, setGeneratedAds] = useState<Array<{
    id: number;
    headline: string;
    description: string;
    cta: string;
  }>>([]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const mockAds = [
        {
          id: 1,
          headline: "AI Marketing Made Simple",
          description: "Generate high-converting content in seconds. Join 10,000+ marketers saving 20+ hours per week with AI-powered tools.",
          cta: "Start Free Trial"
        },
        {
          id: 2,
          headline: "Save 20+ Hours Per Week",
          description: "Automate your content creation with AI. Create social posts, ads, and emails instantly. No credit card required.",
          cta: "Try It Free"
        },
        {
          id: 3,
          headline: "Marketing Automation That Works",
          description: "Stop wasting time on content creation. Let AI do the heavy lifting while you focus on strategy. Get started today!",
          cta: "Get Started Now"
        },
      ];
      setGeneratedAds(mockAds);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <AppLayout navigate={navigate} onLogout={onLogout} activePage="ad-copy">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Ad Copy Generator</h1>
          <p className="text-gray-600">Create high-converting ad copy for all platforms</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="p-6 h-fit">
            <h2 className="text-xl font-semibold text-[#0A2540] mb-6">Ad Details</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform *</Label>
                <Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value })}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google Ads</SelectItem>
                    <SelectItem value="facebook">Facebook Ads</SelectItem>
                    <SelectItem value="instagram">Instagram Ads</SelectItem>
                    <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
                    <SelectItem value="twitter">Twitter Ads</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">Product / Service *</Label>
                <Input
                  id="product"
                  placeholder="e.g., AI Marketing Software"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="bg-input-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience *</Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., Small business owners, Marketers"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="bg-input-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keyBenefit">Key Benefit *</Label>
                <Textarea
                  id="keyBenefit"
                  placeholder="What's the main benefit or value proposition?"
                  value={formData.keyBenefit}
                  onChange={(e) => setFormData({ ...formData, keyBenefit: e.target.value })}
                  className="bg-input-background min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta">Call to Action</Label>
                <Select value={formData.cta} onValueChange={(value) => setFormData({ ...formData, cta: value })}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="learn-more">Learn More</SelectItem>
                    <SelectItem value="sign-up">Sign Up</SelectItem>
                    <SelectItem value="get-started">Get Started</SelectItem>
                    <SelectItem value="try-free">Try Free</SelectItem>
                    <SelectItem value="buy-now">Buy Now</SelectItem>
                    <SelectItem value="contact">Contact Us</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !formData.product || !formData.keyBenefit}
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
                    Generate Ad Copy
                  </>
                )}
              </Button>

              <p className="text-sm text-gray-500 text-center">Cost: 30 credits</p>
            </div>
          </Card>

          {/* Generated Content */}
          <div className="space-y-4">
            {generatedAds.length === 0 ? (
              <Card className="p-12 text-center">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No ads generated yet</h3>
                <p className="text-gray-600">Fill in the form and click "Generate Ad Copy" to create content</p>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[#0A2540]">Generated Ad Copy</h2>
                  <span className="text-sm text-gray-600">{generatedAds.length} variations</span>
                </div>
                {generatedAds.map((ad) => (
                  <Card key={ad.id} className="p-6">
                    <div className="mb-4 space-y-4">
                      <div>
                        <Label className="text-xs text-gray-500 uppercase">Headline</Label>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{ad.headline}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500 uppercase">Description</Label>
                        <p className="text-gray-700 mt-1">{ad.description}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500 uppercase">Call to Action</Label>
                        <span className="inline-block mt-1 px-4 py-2 bg-[#3B82F6] text-white rounded-lg">
                          {ad.cta}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(`${ad.headline}\n\n${ad.description}\n\nCTA: ${ad.cta}`);
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
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
