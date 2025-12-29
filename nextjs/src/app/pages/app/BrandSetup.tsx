import { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Upload } from 'lucide-react';

interface BrandSetupProps {
  navigate: (page: string) => void;
  onLogout: () => void;
}

export default function BrandSetup({ navigate, onLogout }: BrandSetupProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    brandName: '',
    industry: '',
    targetAudience: '',
    tone: 'professional',
    language: 'en',
    keywords: '',
  });

  const toneOptions = [
    { value: 'professional', label: 'Professional', emoji: '💼' },
    { value: 'casual', label: 'Casual', emoji: '😊' },
    { value: 'friendly', label: 'Friendly', emoji: '🤝' },
    { value: 'formal', label: 'Formal', emoji: '🎩' },
    { value: 'humorous', label: 'Humorous', emoji: '😄' },
  ];

  const handleSubmit = () => {
    // Save and redirect to dashboard
    navigate('app-dashboard');
  };

  return (
    <AppLayout navigate={navigate} onLogout={onLogout} activePage="brand-setup">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Brand Setup</h1>
          <p className="text-gray-600">Tell us about your brand to generate personalized content</p>
        </div>

        {/* Progress Steps */}
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
                  placeholder="e.g., innovative, reliable, affordable (comma separated)"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="bg-input-background"
                />
                <p className="text-sm text-gray-500">Keywords that describe your brand</p>
              </div>

              <div className="flex justify-between pt-4">
                <Button onClick={() => setStep(1)} variant="outline">
                  Previous
                </Button>
                <Button onClick={() => setStep(3)} className="bg-[#0A2540] hover:bg-[#0A2540]/90">
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[#0A2540] mb-6">Brand Assets</h2>
              
              <div className="space-y-2">
                <Label>Logo Upload</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[#3B82F6] transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Brand Colors (Optional)</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Primary</Label>
                    <div className="flex gap-2 mt-1">
                      <Input type="color" className="w-12 h-10 p-1" defaultValue="#0A2540" />
                      <Input placeholder="#0A2540" className="flex-1 bg-input-background" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Secondary</Label>
                    <div className="flex gap-2 mt-1">
                      <Input type="color" className="w-12 h-10 p-1" defaultValue="#3B82F6" />
                      <Input placeholder="#3B82F6" className="flex-1 bg-input-background" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Accent</Label>
                    <div className="flex gap-2 mt-1">
                      <Input type="color" className="w-12 h-10 p-1" defaultValue="#22C55E" />
                      <Input placeholder="#22C55E" className="flex-1 bg-input-background" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button onClick={() => setStep(2)} variant="outline">
                  Previous
                </Button>
                <Button onClick={handleSubmit} className="bg-[#22C55E] hover:bg-[#22C55E]/90">
                  Save & Complete
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
