import { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { apiRequest } from '../../utils/api';
import { toast } from 'sonner';
import { getUserData, saveUserData } from '../../utils/storage';

export default function BrandSetup({ navigate, onLogout }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    brandName: '',
    industry: '',
    targetAudience: '',
    tone: 'professional',
    language: 'en',
    keywords: '',
  });

  // Load existing brand data on component mount
  useEffect(() => {
    const loadBrandData = async () => {
      try {
        // First try to get from localStorage
        const storedUser = getUserData();
        if (storedUser && storedUser.brandSetupCompleted) {
          setFormData({
            brandName: storedUser.brandName || '',
            industry: storedUser.brandIndustry || '',
            targetAudience: storedUser.brandTargetAudience || '',
            tone: storedUser.brandTone || 'professional',
            language: storedUser.brandLanguage || 'en',
            keywords: storedUser.brandKeywords || '',
          });
          setIsLoading(false);
          return;
        }

        // Fetch fresh data from API
        const response = await apiRequest('/user/profile');
        if (response.success && response.user && response.user.brandSetupCompleted) {
          setFormData({
            brandName: response.user.brandName || '',
            industry: response.user.brandIndustry || '',
            targetAudience: response.user.brandTargetAudience || '',
            tone: response.user.brandTone || 'professional',
            language: response.user.brandLanguage || 'en',
            keywords: response.user.brandKeywords || '',
          });
          
          // Update localStorage with fresh data
          if (storedUser) {
            const updatedUser = {
              ...storedUser,
              ...response.user
            };
            saveUserData(updatedUser, localStorage.getItem('userToken'));
          }
        }
      } catch (error) {
        console.error('Error loading brand data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBrandData();
  }, []);

  const toneOptions = [
    { value: 'professional', label: 'Professional', emoji: '💼' },
    { value: 'casual', label: 'Casual', emoji: '😊' },
    { value: 'friendly', label: 'Friendly', emoji: '🤝' },
    { value: 'formal', label: 'Formal', emoji: '🎩' },
    { value: 'humorous', label: 'Humorous', emoji: '😄' },
  ];

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.brandName || !formData.industry || !formData.targetAudience || !formData.tone || !formData.language) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await apiRequest('/brand/setup', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      if (response.success) {
        // Update user data in localStorage
        const userData = getUserData();
        if (userData) {
          const updatedUser = {
            ...userData,
            brandSetupCompleted: true,
            brandName: formData.brandName,
            brandIndustry: formData.industry,
            brandTargetAudience: formData.targetAudience,
            brandTone: formData.tone,
            brandLanguage: formData.language,
            brandKeywords: formData.keywords
          };
          saveUserData(updatedUser, localStorage.getItem('userToken'));
        }
        
        toast.success('Brand setup completed successfully!');
        navigate('app-dashboard');
      } else {
        toast.error(response.message || 'Failed to save brand setup');
      }
    } catch (error) {
      console.error('Brand setup error:', error);
      toast.error(error.message || 'Failed to save brand setup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout navigate={navigate} onLogout={onLogout} activePage="brand-setup">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A2540] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading brand information...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout navigate={navigate} onLogout={onLogout} activePage="brand-setup">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Brand Setup</h1>
              <p className="text-gray-600">
                {formData.brandName ? 'Update your brand information' : 'Tell us about your brand to generate personalized content'}
              </p>
            </div>
            {formData.brandName && (
              <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium">✓ Brand data loaded</p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s ? 'bg-[#0A2540] text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-24 h-1 mx-2 ${
                    step > s ? 'bg-[#0A2540]' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-xl mx-auto mt-2 text-sm text-gray-600">
            <span>Brand Info</span>
            <span>Tone & Voice</span>
            <span>Assets</span>
          </div>
        </div>

        <Card className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[#0A2540] mb-6">Basic Information</h2>
              
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name *</Label>
                <Input
                  id="brandName"
                  placeholder="e.g., Acme Corporation"
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  className="bg-input-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                    <SelectItem value="food">Food & Beverage</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience *</Label>
                <Textarea
                  id="targetAudience"
                  placeholder="Describe your ideal customer (age, interests, pain points, etc.)"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="bg-input-background min-h-[100px]"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setStep(2)} className="bg-[#0A2540] hover:bg-[#0A2540]/90">
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[#0A2540] mb-6">Brand Voice & Tone</h2>
              
              <div className="space-y-2">
                <Label>Brand Tone *</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {toneOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, tone: option.value })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.tone === option.value 
                          ? 'border-[#0A2540] bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{option.emoji}</div>
                      <div className="text-sm font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Primary Language *</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Brand Keywords</Label>
                <Input
                  id="keywords"
                  placeholder="e.g., innovative, reliable, customer-focused"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="bg-input-background"
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="bg-[#0A2540] hover:bg-[#0A2540]/90">
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[#0A2540] mb-6">Brand Assets (Optional)</h2>
              <p className="text-gray-600">You can add brand assets later in settings</p>
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  className="bg-[#0A2540] hover:bg-[#0A2540]/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Complete Setup'}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}

