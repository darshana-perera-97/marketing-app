import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Sparkles } from 'lucide-react';

interface LoginPageProps {
  navigate: (page: string) => void;
  onLogin: (asAdmin?: boolean) => void;
}

export default function LoginPage({ navigate, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: admin@demo.com logs in as admin
    if (email === 'admin@demo.com') {
      onLogin(true);
      navigate('admin-dashboard');
    } else {
      onLogin(false);
      navigate('app-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2540] to-[#3B82F6] flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-10 h-10 text-[#0A2540]" />
            <span className="font-bold text-2xl text-[#0A2540]">AI Marketing Assistant</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0A2540] mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-input-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-input-background"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <button type="button" className="text-[#3B82F6] hover:underline">
              Forgot password?
            </button>
          </div>

          <Button type="submit" className="w-full bg-[#0A2540] hover:bg-[#0A2540]/90">
            Sign In
          </Button>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button 
              type="button"
              onClick={() => navigate('signup')} 
              className="text-[#3B82F6] hover:underline font-semibold"
            >
              Sign up
            </button>
          </div>
        </form>

        {/* Demo credentials hint */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Demo:</strong> Use admin@demo.com for admin access or any email for user access
          </p>
        </div>
      </Card>
    </div>
  );
}
