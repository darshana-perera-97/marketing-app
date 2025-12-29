import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Sparkles } from 'lucide-react';

interface SignupPageProps {
  navigate: (page: string) => void;
  onSignup: () => void;
}

export default function SignupPage({ navigate, onSignup }: SignupPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2540] to-[#3B82F6] flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-10 h-10 text-[#0A2540]" />
            <span className="font-bold text-2xl text-[#0A2540]">AI Marketing Assistant</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0A2540] mb-2">Create Your Account</h1>
          <p className="text-gray-600">Start your 14-day free trial</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-input-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="bg-input-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              type="text"
              placeholder="Acme Inc"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="bg-input-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="bg-input-background"
            />
            <p className="text-xs text-gray-500">At least 8 characters</p>
          </div>

          <div className="flex items-start gap-2">
            <input type="checkbox" required className="mt-1 rounded border-gray-300" />
            <span className="text-sm text-gray-600">
              I agree to the Terms of Service and Privacy Policy
            </span>
          </div>

          <Button type="submit" className="w-full bg-[#0A2540] hover:bg-[#0A2540]/90">
            Start Free Trial
          </Button>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button 
              type="button"
              onClick={() => navigate('login')} 
              className="text-[#3B82F6] hover:underline font-semibold"
            >
              Sign in
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
