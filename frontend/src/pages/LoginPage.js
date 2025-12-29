import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Sparkles, AlertCircle } from 'lucide-react';
import { login } from '../utils/api';
import { saveUserData } from '../utils/storage';
import { toast } from 'sonner';

export default function LoginPage({ navigate, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});

    try {
      const response = await login(email.trim(), password);
      
      if (response.success) {
        // Save to localStorage
        saveUserData(response.user, response.token);
        
        // Call onLogin with user data
        onLogin(response.user, response.token, response.user.isAdmin);
        
        // Navigate to appropriate dashboard
        if (response.user.isAdmin) {
          navigate('admin-dashboard');
        } else {
          navigate('app-dashboard');
        }
        
        toast.success('Login successful! Welcome back!');
      } else {
        toast.error(response.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Login failed. Please check your credentials and try again.';
      toast.error(errorMessage);
      
      // Set field-specific errors if available
      if (error.message && error.message.includes('email')) {
        setErrors({ email: error.message });
      } else if (error.message && error.message.includes('password')) {
        setErrors({ password: error.message });
      }
    } finally {
      setIsLoading(false);
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
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              className={`bg-input-background ${errors.email ? 'border-red-500' : ''}`}
              disabled={isLoading}
            />
            {errors.email && (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              className={`bg-input-background ${errors.password ? 'border-red-500' : ''}`}
              disabled={isLoading}
            />
            {errors.password && (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.password}</span>
              </div>
            )}
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

          <Button 
            type="submit" 
            className="w-full bg-[#0A2540] hover:bg-[#0A2540]/90"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
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
          <p className="text-sm text-blue-800 font-semibold mb-2">Demo Credentials:</p>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>Admin:</strong> admin@demo.com / demo123</p>
            <p><strong>User:</strong> user@demo.com / demo123</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

