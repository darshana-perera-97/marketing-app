import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { signup } from '../utils/api';
import { saveUserData } from '../utils/storage';
import { toast } from 'sonner';

export default function SignupPage({ navigate, onSignup }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = (value) => {
    setFormData({ ...formData, password: value });
    setPasswordStrength(checkPasswordStrength(value));
    if (errors.password) {
      setErrors({ ...errors, password: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});

    try {
      const response = await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        company: formData.company.trim()
      });
      
      if (response.success) {
        // Save to localStorage
        saveUserData(response.user, response.token);
        
        // Call onSignup with user data
        onSignup(response.user, response.token, false);
        
        // Navigate to dashboard
        navigate('app-dashboard');
        
        toast.success(response.message || 'Account created successfully! Welcome!');
      } else {
        toast.error(response.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.message || 'Signup failed. Please try again.';
      toast.error(errorMessage);
      
      // Set field-specific errors if available
      if (error.message) {
        if (error.message.includes('email') || error.message.includes('exists')) {
          setErrors({ email: error.message });
        } else if (error.message.includes('password')) {
          setErrors({ password: error.message });
        } else if (error.message.includes('name')) {
          setErrors({ name: error.message });
        }
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
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              className={`bg-input-background ${errors.name ? 'border-red-500' : ''}`}
              disabled={isLoading}
            />
            {errors.name && (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.name}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
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
            <Label htmlFor="company">Company Name (Optional)</Label>
            <Input
              id="company"
              type="text"
              placeholder="Acme Inc"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="bg-input-background"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className={`bg-input-background ${errors.password ? 'border-red-500' : ''}`}
              disabled={isLoading}
            />
            <div className="space-y-1">
              {formData.password && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        passwordStrength <= 1 ? 'bg-red-500' :
                        passwordStrength <= 2 ? 'bg-orange-500' :
                        passwordStrength <= 3 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {passwordStrength <= 1 ? 'Weak' :
                     passwordStrength <= 2 ? 'Fair' :
                     passwordStrength <= 3 ? 'Good' : 'Strong'}
                  </span>
                </div>
              )}
              {errors.password && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </div>
              )}
              {!errors.password && formData.password && (
                <p className="text-xs text-gray-500">At least 6 characters</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <input type="checkbox" required className="mt-1 rounded border-gray-300" />
            <span className="text-sm text-gray-600">
              I agree to the Terms of Service and Privacy Policy
            </span>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#0A2540] hover:bg-[#0A2540]/90"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Start Free Trial'}
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

