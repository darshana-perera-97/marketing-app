import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Sparkles, Target, TrendingUp, Calendar, Mail, Image, CheckCircle2, Star } from 'lucide-react';

interface LandingPageProps {
  navigate: (page: string) => void;
}

export default function LandingPage({ navigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-[#0A2540]" />
              <span className="font-bold text-xl text-[#0A2540]">AI Marketing Assistant</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => navigate('features')} className="text-gray-700 hover:text-[#0A2540]">Features</button>
              <button onClick={() => navigate('pricing')} className="text-gray-700 hover:text-[#0A2540]">Pricing</button>
              <button onClick={() => navigate('login')} className="text-gray-700 hover:text-[#0A2540]">Login</button>
              <Button onClick={() => navigate('signup')} className="bg-[#0A2540] hover:bg-[#0A2540]/90">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#0A2540] mb-6">
            AI Marketing Assistant for Growing Businesses
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Generate high-converting content, ads, and emails in seconds. Automate your marketing workflow with AI-powered tools designed for modern businesses.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('signup')} size="lg" className="bg-[#0A2540] hover:bg-[#0A2540]/90 px-8 py-6 text-lg">
              Start Free Trial
            </Button>
            <Button onClick={() => navigate('features')} size="lg" variant="outline" className="px-8 py-6 text-lg border-[#0A2540] text-[#0A2540]">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#0A2540] mb-12">Powerful Marketing Tools in One Platform</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Social Media Content', desc: 'Generate engaging posts for all platforms with AI-powered copywriting' },
              { icon: TrendingUp, title: 'Ad Copy Generator', desc: 'Create high-converting ad campaigns for Google, Facebook, and LinkedIn' },
              { icon: Mail, title: 'Email Campaigns', desc: 'Build compelling email sequences that drive conversions' },
              { icon: Calendar, title: 'Content Calendar', desc: 'Plan and schedule your content strategy with visual calendar' },
              { icon: Image, title: 'AI Image Generation', desc: 'Create custom visuals for your marketing campaigns' },
              { icon: Sparkles, title: 'Brand Voice AI', desc: 'Maintain consistent brand voice across all channels' },
            ].map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="w-12 h-12 text-[#3B82F6] mb-4" />
                <h3 className="font-semibold text-xl mb-2 text-[#0A2540]">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#0A2540] mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '1', title: 'Set Up Your Brand', desc: 'Tell us about your business, target audience, and brand voice' },
              { step: '2', title: 'Choose Your Tool', desc: 'Select from social media, ads, emails, or other content types' },
              { step: '3', title: 'Generate & Publish', desc: 'Get AI-generated content instantly, customize, and publish' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-[#3B82F6] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-xl mb-2 text-[#0A2540]">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#0A2540] mb-12">Perfect for Every Business</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {['Startups', 'E-commerce', 'Agencies', 'Enterprises'].map((useCase) => (
              <Card key={useCase} className="p-6 text-center hover:shadow-lg transition-shadow">
                <CheckCircle2 className="w-10 h-10 text-[#22C55E] mx-auto mb-3" />
                <h3 className="font-semibold text-lg text-[#0A2540]">{useCase}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#0A2540] mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 mb-8">Choose the plan that fits your needs</p>
          <Button onClick={() => navigate('pricing')} size="lg" className="bg-[#0A2540] hover:bg-[#0A2540]/90">
            View All Plans
          </Button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#0A2540] mb-12">Trusted by Growing Businesses</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', role: 'Marketing Manager', text: 'This tool has saved us 20+ hours per week on content creation!' },
              { name: 'Michael Chen', role: 'Founder', text: 'The AI generates content that actually converts. ROI has been incredible.' },
              { name: 'Emily Davis', role: 'Agency Owner', text: 'Managing multiple clients is so much easier now. Highly recommend!' },
            ].map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-[#0A2540]">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A2540] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6" />
                <span className="font-bold">AI Marketing Assistant</span>
              </div>
              <p className="text-gray-300 text-sm">Automate your marketing with AI</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><button onClick={() => navigate('features')}>Features</button></li>
                <li><button onClick={() => navigate('pricing')}>Pricing</button></li>
                <li>Use Cases</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Privacy</li>
                <li>Terms</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-300">
            <p>© 2025 AI Marketing Assistant. All rights reserved.</p>
            <p className="mt-2 text-xs text-gray-400">
              Demo: Login with any email for user access, or admin@demo.com for admin panel
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}