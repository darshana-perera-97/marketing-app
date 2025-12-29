import AppLayout from '../../components/AppLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { CreditCard, Zap, TrendingUp, ArrowUpRight, Check } from 'lucide-react';

interface CreditsAndBillingProps {
  navigate: (page: string) => void;
  onLogout: () => void;
}

export default function CreditsAndBilling({ navigate, onLogout }: CreditsAndBillingProps) {
  const currentCredits = 3250;
  const totalCredits = 5000;
  const usagePercentage = (currentCredits / totalCredits) * 100;

  const transactions = [
    { id: 1, type: 'Used', amount: -25, description: 'Social Media Content', date: 'Jan 28, 2025' },
    { id: 2, type: 'Used', amount: -30, description: 'Ad Copy Generation', date: 'Jan 27, 2025' },
    { id: 3, type: 'Added', amount: +5000, description: 'Monthly Reset - Growth Plan', date: 'Jan 1, 2025' },
    { id: 4, type: 'Used', amount: -25, description: 'Email Campaign', date: 'Dec 30, 2024' },
    { id: 5, type: 'Used', amount: -10, description: 'Social Media Content', date: 'Dec 29, 2024' },
  ];

  const plans = [
    {
      name: 'Starter',
      price: '$29',
      credits: '1,000 credits/month',
      features: ['Social media content', 'Basic ad copy', 'Email templates'],
      current: false,
    },
    {
      name: 'Growth',
      price: '$79',
      credits: '5,000 credits/month',
      features: ['All Starter features', 'Content calendar', 'AI images', 'Priority support'],
      current: true,
    },
    {
      name: 'Agency',
      price: '$199',
      credits: '20,000 credits/month',
      features: ['All Growth features', 'Multi-user accounts', 'API access', '24/7 support'],
      current: false,
    },
  ];

  return (
    <AppLayout navigate={navigate} onLogout={onLogout} activePage="credits-billing">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Credits & Billing</h1>
          <p className="text-gray-600">Manage your subscription and credit usage</p>
        </div>

        {/* Credit Usage */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 md:col-span-2">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-[#0A2540] mb-2">Credit Usage</h2>
                <p className="text-gray-600">Your monthly allowance resets on Jan 1, 2025</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Zap className="w-6 h-6 text-[#3B82F6]" />
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-4xl font-bold text-[#0A2540]">{currentCredits.toLocaleString()}</span>
                <span className="text-gray-600">/ {totalCredits.toLocaleString()} credits</span>
              </div>
              <Progress value={usagePercentage} className="h-3" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-600 mb-1">Used This Month</p>
                <p className="text-xl font-semibold text-gray-900">{(totalCredits - currentCredits).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Remaining</p>
                <p className="text-xl font-semibold text-[#22C55E]">{currentCredits.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Daily Average</p>
                <p className="text-xl font-semibold text-gray-900">62</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="bg-amber-50 p-3 rounded-lg mb-4">
              <TrendingUp className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Need More Credits?</h3>
            <p className="text-sm text-gray-600 mb-4">Upgrade your plan to get more credits and unlock premium features</p>
            <Button className="w-full bg-[#F59E0B] hover:bg-[#F59E0B]/90">
              View Plans
            </Button>
          </Card>
        </div>

        {/* Current Plan */}
        <Card className="p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[#0A2540] mb-2">Current Plan</h2>
              <div className="flex items-center gap-3">
                <Badge className="bg-[#3B82F6]">Growth Plan</Badge>
                <span className="text-gray-600">$79/month</span>
              </div>
            </div>
            <Button variant="outline">Manage Subscription</Button>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Billing Cycle</p>
              <p className="font-semibold text-gray-900">Monthly</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Next Billing Date</p>
              <p className="font-semibold text-gray-900">Feb 1, 2025</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Payment Method</p>
              <p className="font-semibold text-gray-900">•••• 4242</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </Card>

        {/* Upgrade Plans */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#0A2540] mb-6">Available Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <Card key={index} className={`p-6 ${plan.current ? 'border-2 border-[#3B82F6]' : ''}`}>
                {plan.current && (
                  <Badge className="mb-4 bg-[#3B82F6]">Current Plan</Badge>
                )}
                <h3 className="text-xl font-semibold text-[#0A2540] mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-[#3B82F6] font-semibold mb-4">{plan.credits}</p>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-[#22C55E]" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan.current ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button className="w-full bg-[#0A2540] hover:bg-[#0A2540]/90">
                    {index > 1 ? 'Upgrade' : 'Downgrade'}
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#0A2540]">Transaction History</h2>
            <Button variant="ghost" className="text-[#3B82F6]">
              View All <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === 'Added' ? 'bg-green-100' : 'bg-gray-200'
                  }`}>
                    <CreditCard className={`w-5 h-5 ${
                      transaction.type === 'Added' ? 'text-[#22C55E]' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-600">{transaction.date}</p>
                  </div>
                </div>
                <span className={`font-semibold ${
                  transaction.type === 'Added' ? 'text-[#22C55E]' : 'text-gray-900'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} credits
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
