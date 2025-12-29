import { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Check } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { getUserData } from '../../utils/storage';

export default function CreditsAndBilling({ navigate, onLogout }) {
  const [currentCredits, setCurrentCredits] = useState(3250);
  const [totalCredits, setTotalCredits] = useState(5000);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage first
    const userData = getUserData();
    if (userData) {
      setCurrentCredits(userData.credits || 3250);
      setTotalCredits(userData.totalCredits || 5000);
    }

    // Fetch credits from API
    apiRequest('/credits')
      .then(response => {
        if (response.success && response.credits) {
          setCurrentCredits(response.credits.current);
          setTotalCredits(response.credits.total);
        }
      })
      .catch(error => {
        console.error('Error fetching credits:', error);
      });

    // Fetch transactions from API
    apiRequest('/credits/transactions')
      .then(response => {
        if (response.success && response.transactions) {
          // Format dates
          const formatted = response.transactions.map(t => ({
            ...t,
            date: new Date(t.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })
          }));
          setTransactions(formatted);
        }
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const usagePercentage = totalCredits > 0 ? ((totalCredits - currentCredits) / totalCredits) * 100 : 0;

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
          <p className="text-gray-600">Manage your credits and subscription</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-[#0A2540] mb-4">Current Credits</h2>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Credits Remaining</span>
                <span className="text-2xl font-bold text-[#0A2540]">
                  {currentCredits.toLocaleString()} / {totalCredits.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-[#3B82F6] h-4 rounded-full transition-all"
                  style={{ width: `${usagePercentage}%` }}
                ></div>
              </div>
            </div>
            <Button 
              onClick={() => navigate('purchase-credits')}
              className="bg-[#0A2540] hover:bg-[#0A2540]/90"
            >
              Purchase More Credits
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-[#0A2540] mb-4">Recent Transactions</h2>
            {isLoading ? (
              <p className="text-gray-600 text-center py-4">Loading transactions...</p>
            ) : (
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">No transactions yet</p>
                ) : (
                  transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                  <span className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                  </span>
                </div>
                  ))
                )}
              </div>
            )}
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-[#0A2540] mb-6">Subscription Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <Card key={index} className={`p-6 ${plan.current ? 'border-2 border-[#3B82F6]' : ''}`}>
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-[#0A2540] mb-2">{plan.name}</h3>
                  <p className="text-3xl font-bold text-[#0A2540] mb-1">{plan.price}</p>
                  <p className="text-sm text-gray-600">{plan.credits}</p>
                </div>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-[#22C55E]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.current ? 'bg-[#3B82F6] hover:bg-[#3B82F6]/90' : 'bg-[#0A2540] hover:bg-[#0A2540]/90'}`}
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : 'Upgrade'}
                </Button>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

