import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Sparkles, Share2, TrendingUp, Mail, Calendar, Image } from 'lucide-react';

interface FeaturesPageProps {
  navigate: (page: string) => void;
}

export default function FeaturesPage({ navigate }: FeaturesPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => navigate('landing')} className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-[#0A2540]" />
              <span className="font-bold text-xl text-[#0A2540]">AI Marketing Assistant</span>
            </button>
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => navigate('features')} className="text-[#0A2540] font-semibold">Features</button>
              <button onClick={() => navigate('pricing')} className="text-gray-700 hover:text-[#0A2540]">Pricing</button>
              <button onClick={() => navigate('login')} className="text-gray-700 hover:text-[#0A2540]">Login</button>
              <Button onClick={() => navigate('signup')} className="bg-[#0A2540] hover:bg-[#0A2540]/90">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0A2540] to-[#3B82F6]">
        <div className="max-w-7xl mx-auto text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Powerful Features for Modern Marketing</h1>
          <p className="text-xl opacity-90">Everything you need to automate and scale your marketing efforts</p>
        </div>
      </section>

      {/* Features Tabs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="social" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-12 max-w-4xl mx-auto">
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="ads">Ads</TabsTrigger>
              <TabsTrigger value="email">Emails</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="images">AI Images</TabsTrigger>
            </TabsList>

            <TabsContent value="social">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <Share2 className="w-16 h-16 text-[#3B82F6] mb-6" />
                  <h2 className="text-3xl font-bold text-[#0A2540] mb-4">Social Media Content Generator</h2>
                  <p className="text-gray-600 mb-6">Create engaging posts for all major platforms with AI-powered copywriting. Generate multiple variations, optimize for each platform, and maintain consistent brand voice.</p>
                  <ul className="space-y-3">
                    {['Support for Facebook, Instagram, Twitter, LinkedIn', 'Multiple post variations in seconds', 'Hashtag suggestions', 'Emoji optimization', 'Platform-specific best practices'].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Card className="p-8 bg-gray-50">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-32 bg-gray-300 rounded"></div>
                    <div className="text-center text-sm text-gray-500">Product Preview Mockup</div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="ads">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <TrendingUp className="w-16 h-16 text-[#3B82F6] mb-6" />
                  <h2 className="text-3xl font-bold text-[#0A2540] mb-4">Ad Copy Generator</h2>
                  <p className="text-gray-600 mb-6">Generate high-converting ad copy for Google Ads, Facebook Ads, and LinkedIn campaigns. Create headlines, descriptions, and CTAs that drive results.</p>
                  <ul className="space-y-3">
                    {['Multiple headline variations', 'Compelling ad descriptions', 'A/B testing suggestions', 'CTA optimization', 'Ad format compliance'].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Card className="p-8 bg-gray-50">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-32 bg-gray-300 rounded"></div>
                    <div className="text-center text-sm text-gray-500">Product Preview Mockup</div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="email">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <Mail className="w-16 h-16 text-[#3B82F6] mb-6" />
                  <h2 className="text-3xl font-bold text-[#0A2540] mb-4">Email & WhatsApp Campaigns</h2>
                  <p className="text-gray-600 mb-6">Build compelling email sequences and WhatsApp messages that drive conversions. Create welcome series, promotional emails, and follow-up sequences.</p>
                  <ul className="space-y-3">
                    {['Subject line generation', 'Email body templates', 'WhatsApp message optimization', 'Personalization tokens', 'Campaign sequences'].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Card className="p-8 bg-gray-50">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-32 bg-gray-300 rounded"></div>
                    <div className="text-center text-sm text-gray-500">Product Preview Mockup</div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="calendar">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <Calendar className="w-16 h-16 text-[#3B82F6] mb-6" />
                  <h2 className="text-3xl font-bold text-[#0A2540] mb-4">Content Calendar</h2>
                  <p className="text-gray-600 mb-6">Plan and schedule your entire content strategy with our visual calendar. Drag-and-drop scheduling, multi-platform planning, and team collaboration.</p>
                  <ul className="space-y-3">
                    {['Visual monthly calendar view', 'Drag-and-drop scheduling', 'Platform color coding', 'Bulk scheduling', 'Team collaboration'].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Card className="p-8 bg-gray-50">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-32 bg-gray-300 rounded"></div>
                    <div className="text-center text-sm text-gray-500">Product Preview Mockup</div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="images">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <Image className="w-16 h-16 text-[#3B82F6] mb-6" />
                  <h2 className="text-3xl font-bold text-[#0A2540] mb-4">AI Image Generation</h2>
                  <p className="text-gray-600 mb-6">Create custom visuals for your marketing campaigns with AI-powered image generation. No design skills required.</p>
                  <ul className="space-y-3">
                    {['Text-to-image generation', 'Multiple style options', 'High-resolution exports', 'Brand-consistent visuals', 'Unlimited variations'].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Card className="p-8 bg-gray-50">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-32 bg-gray-300 rounded"></div>
                    <div className="text-center text-sm text-gray-500">Product Preview Mockup</div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#0A2540] mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8">Join thousands of businesses automating their marketing with AI</p>
          <Button onClick={() => navigate('signup')} size="lg" className="bg-[#0A2540] hover:bg-[#0A2540]/90 px-8 py-6 text-lg">
            Start Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A2540] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-300 text-sm">© 2025 AI Marketing Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
