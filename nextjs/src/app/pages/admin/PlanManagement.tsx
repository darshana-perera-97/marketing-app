import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Check, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface PlanManagementProps {
  navigate: (page: string) => void;
  onLogout: () => void;
}

export default function PlanManagement({ navigate, onLogout }: PlanManagementProps) {
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: 'Starter',
      monthlyPrice: 29,
      yearlyPrice: 290,
      credits: 1000,
      features: [
        'Social media content generation',
        'Basic ad copy',
        'Email templates',
        '5 brand profiles',
        'Basic analytics',
        'Email support',
      ],
      active: true,
      subscribers: 847,
    },
    {
      id: 2,
      name: 'Growth',
      monthlyPrice: 79,
      yearlyPrice: 790,
      credits: 5000,
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
      active: true,
      subscribers: 1543,
    },
    {
      id: 3,
      name: 'Agency',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      credits: 20000,
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
      active: true,
      subscribers: 457,
    },
  ]);

  const [editingPlan, setEditingPlan] = useState<number | null>(null);

  return (
    <AdminLayout navigate={navigate} onLogout={onLogout} activePage="admin-plans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Plan & Pricing Management</h1>
          <p className="text-gray-600">Manage subscription plans and pricing</p>
        </div>

        {/* Revenue Overview */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">Total Subscribers</p>
            <p className="text-3xl font-bold text-[#0A2540]">2,847</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
            <p className="text-3xl font-bold text-[#22C55E]">$184,920</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">Avg Revenue/User</p>
            <p className="text-3xl font-bold text-[#3B82F6]">$64.95</p>
          </Card>
        </div>

        {/* Plans */}
        <div className="grid lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-[#0A2540] mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-600">{plan.subscribers} subscribers</p>
                </div>
                <Switch 
                  checked={plan.active}
                  onCheckedChange={() => {
                    toast.success(`${plan.name} plan ${plan.active ? 'disabled' : 'enabled'}`);
                  }}
                />
              </div>

              {editingPlan === plan.id ? (
                <div className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <Label>Monthly Price</Label>
                    <Input
                      type="number"
                      value={plan.monthlyPrice}
                      onChange={(e) => {
                        const newPlans = [...plans];
                        const index = newPlans.findIndex(p => p.id === plan.id);
                        newPlans[index].monthlyPrice = parseInt(e.target.value);
                        setPlans(newPlans);
                      }}
                      className="bg-input-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Yearly Price</Label>
                    <Input
                      type="number"
                      value={plan.yearlyPrice}
                      onChange={(e) => {
                        const newPlans = [...plans];
                        const index = newPlans.findIndex(p => p.id === plan.id);
                        newPlans[index].yearlyPrice = parseInt(e.target.value);
                        setPlans(newPlans);
                      }}
                      className="bg-input-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Credits</Label>
                    <Input
                      type="number"
                      value={plan.credits}
                      onChange={(e) => {
                        const newPlans = [...plans];
                        const index = newPlans.findIndex(p => p.id === plan.id);
                        newPlans[index].credits = parseInt(e.target.value);
                        setPlans(newPlans);
                      }}
                      className="bg-input-background"
                    />
                  </div>
                  <Button 
                    onClick={() => {
                      setEditingPlan(null);
                      toast.success('Plan updated successfully');
                    }}
                    className="w-full bg-[#22C55E] hover:bg-[#22C55E]/90"
                  >
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-4xl font-bold text-gray-900">${plan.monthlyPrice}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    <p className="text-sm text-gray-500">or ${plan.yearlyPrice}/year</p>
                    <p className="text-sm text-[#3B82F6] font-semibold mt-2">{plan.credits.toLocaleString()} credits/month</p>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-[#22C55E] flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => setEditingPlan(plan.id)}
                    variant="outline"
                    className="w-full"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Plan
                  </Button>
                </div>
              )}

              {/* Plan Stats */}
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">MRR</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${(plan.monthlyPrice * plan.subscribers).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Growth</p>
                    <p className="text-lg font-semibold text-[#22C55E]">+{Math.floor(Math.random() * 20)}%</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Credit Pricing */}
        <Card className="p-6 mt-8">
          <h2 className="text-xl font-semibold text-[#0A2540] mb-6">Credit Cost Configuration</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label>Social Media Post</Label>
              <Input type="number" defaultValue="10" className="bg-input-background" />
              <p className="text-xs text-gray-500">Credits per generation</p>
            </div>
            <div className="space-y-2">
              <Label>Ad Copy</Label>
              <Input type="number" defaultValue="30" className="bg-input-background" />
              <p className="text-xs text-gray-500">Credits per generation</p>
            </div>
            <div className="space-y-2">
              <Label>Email Campaign</Label>
              <Input type="number" defaultValue="25" className="bg-input-background" />
              <p className="text-xs text-gray-500">Credits per generation</p>
            </div>
            <div className="space-y-2">
              <Label>AI Image</Label>
              <Input type="number" defaultValue="50" className="bg-input-background" />
              <p className="text-xs text-gray-500">Credits per image</p>
            </div>
          </div>
          <Button className="mt-6 bg-[#0A2540] hover:bg-[#0A2540]/90">
            Update Credit Costs
          </Button>
        </Card>
      </div>
    </AdminLayout>
  );
}
