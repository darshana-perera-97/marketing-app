import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Sparkles, Check } from 'lucide-react';

interface PricingPageProps {
  navigate: (page: string) => void;
}

export default function PricingPage({ navigate }: PricingPageProps) {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individuals and small teams',
      monthlyPrice: 29,
      yearlyPrice: 290,
      credits: '1,000 credits/month',
      features: [
        'Social media content generation',
        'Basic ad copy',
        'Email templates',
        '5 brand profiles',
        'Basic analytics',
        'Email support',
      ],
      popular: false,
    },
    {
      name: 'Growth',
      description: 'Best for growing businesses',
      monthlyPrice: 79,
      yearlyPrice: 790,
      credits: '5,000 credits/month',
      features: [
        'Everything in Starter',
        'Advanced ad copy generation',
        'WhatsApp campaigns',
        'Content calendar',
        'AI image generation',
        'Unlimited brand profiles',
        'Advanced analytics',
        'Priority support',
      ],
      popular: true,
    },
    {
      name: 'Agency',
      description: 'For agencies and large teams',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      credits: '20,000 credits/month',
      features: [
        'Everything in Growth',
        'Multi-user accounts',
        'White-label options',
        'API access',
        'Custom integrations',
        'Dedicated account manager',
        'Custom training',
        '24/7 priority support',
      ],
      popular: false,
    },
  ];

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
              <button onClick={() => navigate('features')} className="text-gray-700 hover:text-[#0A2540]">Features</button>
              <button onClick={() => navigate('pricing')} className="text-[#0A2540] font-semibold">Pricing</button>
              <button onClick={() => navigate('login')} className="text-gray-700 hover:text-[#0A2540]">Login</button>
              <Button onClick={() => navigate('signup')} className="bg-[#0A2540] hover:bg-[#0A2540]/90">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-[#0A2540] mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 mb-8">Choose the plan that fits your needs. No hidden fees.</p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`${!isYearly ? 'text-[#0A2540] font-semibold' : 'text-gray-600'}`}>Monthly</span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`${isYearly ? 'text-[#0A2540] font-semibold' : 'text-gray-600'}`}>
              Yearly <span className="text-[#22C55E] text-sm">(Save 17%)</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative p-8 ${plan.popular ? 'border-2 border-[#3B82F6] shadow-xl' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-[#3B82F6] text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-[#0A2540] mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  <div className="mb-2">
                    <span className="text-5xl font-bold text-[#0A2540]">
                      ${isYearly ? Math.floor(plan.yearlyPrice / 12) : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  {isYearly && (
                    <p className="text-sm text-gray-500">Billed ${plan.yearlyPrice} yearly</p>
                  )}
                  <p className="text-sm text-[#3B82F6] font-semibold mt-2">{plan.credits}</p>
                </div>
                
                <Button 
                  onClick={() => navigate('signup')} 
                  className={`w-full mb-6 ${plan.popular ? 'bg-[#3B82F6] hover:bg-[#3B82F6]/90' : 'bg-[#0A2540] hover:bg-[#0A2540]/90'}`}
                >
                  Start Free Trial
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 mt-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#0A2540] mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: 'What are credits?', a: 'Credits are used to generate content. Each tool uses different amounts of credits based on complexity.' },
              { q: 'Can I change plans anytime?', a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
              { q: 'Is there a free trial?', a: 'Yes, all plans come with a 14-day free trial. No credit card required.' },
              { q: 'What happens if I run out of credits?', a: 'You can purchase additional credits or upgrade to a higher plan at any time.' },
            ].map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold text-[#0A2540] mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A2540] text-white py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-300 text-sm">© 2025 AI Marketing Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
