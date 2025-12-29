import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Check, Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function PlanManagement({ navigate, onLogout }) {
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: 'Starter',
      price: 29,
      credits: 1000,
      features: ['Social media content', 'Basic ad copy', 'Email templates'],
      active: true,
    },
    {
      id: 2,
      name: 'Growth',
      price: 79,
      credits: 5000,
      features: ['All Starter features', 'Content calendar', 'AI images', 'Priority support'],
      active: true,
    },
    {
      id: 3,
      name: 'Agency',
      price: 199,
      credits: 20000,
      features: ['All Growth features', 'Multi-user accounts', 'API access', '24/7 support'],
      active: true,
    },
  ]);

  return (
    <AdminLayout navigate={navigate} onLogout={onLogout} activePage="admin-plans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Plan Management</h1>
          <p className="text-gray-600">Manage subscription plans and pricing</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#0A2540]">{plan.name}</h3>
                <div className="flex items-center gap-2">
                  <Switch checked={plan.active} onCheckedChange={(checked) => {
                    setPlans(plans.map(p => p.id === plan.id ? { ...p, active: checked } : p));
                    toast.success(`Plan ${checked ? 'activated' : 'deactivated'}`);
                  }} />
                  <span className="text-sm text-gray-600">{plan.active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <Label className="text-sm text-gray-600">Price</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-3xl font-bold text-[#0A2540]">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>

              <div className="mb-4">
                <Label className="text-sm text-gray-600">Credits</Label>
                <p className="text-lg font-semibold text-[#0A2540] mt-1">{plan.credits.toLocaleString()} credits/month</p>
              </div>

              <div className="mb-4">
                <Label className="text-sm text-gray-600 mb-2 block">Features</Label>
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-[#22C55E]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast.success('Edit plan feature coming soon')}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Plan
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

