import { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Mail, ArrowLeft, Eye, EyeOff, Info } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { toast } from 'sonner';

export default function CredentialsEmail({ navigate, onLogout }) {
  const [formData, setFormData] = useState({
    email: '',
    smtpHost: '',
    smtpPort: '',
    smtpUsername: '',
    smtpPassword: '',
  });
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchEmailCredentials();
  }, []);

  const fetchEmailCredentials = async () => {
    try {
      const response = await apiRequest('/credentials/email');
      if (response.success && response.credentials) {
        setFormData({
          email: response.credentials.email || '',
          smtpHost: response.credentials.smtpHost || '',
          smtpPort: response.credentials.smtpPort || '',
          smtpUsername: response.credentials.smtpUsername || '',
          smtpPassword: response.credentials.smtpPassword || '',
        });
      }
    } catch (error) {
      console.error('Error fetching email credentials:', error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.email) {
      toast.error('Email address is required');
      return;
    }
    
    // Validate SMTP settings (required for sending emails)
    if (!formData.smtpHost || !formData.smtpPort || !formData.smtpUsername || !formData.smtpPassword) {
      toast.error('All SMTP settings are required to send emails');
      return;
    }
    
    // Validate SMTP port is a valid number
    const port = parseInt(formData.smtpPort);
    if (isNaN(port) || port < 1 || port > 65535) {
      toast.error('SMTP port must be a valid number between 1 and 65535');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest('/credentials/email', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (response.success) {
        toast.success('Email credentials saved successfully!');
        // Reload the credentials data after saving to show updated values
        await fetchEmailCredentials();
        // Navigate back to credentials page after showing success message
        setTimeout(() => {
          navigate('purchase-credits');
        }, 1500);
      } else {
        toast.error(response.message || 'Failed to save email credentials');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save email credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <AppLayout navigate={navigate} onLogout={onLogout} activePage="purchase-credits">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A2540] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout navigate={navigate} onLogout={onLogout} activePage="purchase-credits">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('purchase-credits')}
            className="mb-4 text-[#0A2540] hover:text-[#0A2540]/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Credentials
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0A2540]">Email Credentials</h1>
              <p className="text-gray-600">Connect your email account</p>
            </div>
          </div>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-[#0A2540] mb-4">Email Account</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-input-background"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-[#0A2540] mb-2">SMTP Settings *</h2>
              <p className="text-sm text-gray-600 mb-4">Configure SMTP settings for sending emails. All fields are required.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host *</Label>
                  <Input
                    id="smtpHost"
                    type="text"
                    placeholder="smtp.gmail.com"
                    value={formData.smtpHost}
                    onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                    className="bg-input-background"
                    required
                  />
                  <p className="text-xs text-gray-500">Common: smtp.gmail.com, smtp.outlook.com, smtp.mail.yahoo.com</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port *</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    placeholder="587"
                    value={formData.smtpPort}
                    onChange={(e) => setFormData({ ...formData, smtpPort: e.target.value })}
                    className="bg-input-background"
                    required
                    min="1"
                    max="65535"
                  />
                  <p className="text-xs text-gray-500">Common ports: 587 (TLS), 465 (SSL), 25 (Standard)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username *</Label>
                  <Input
                    id="smtpUsername"
                    type="text"
                    placeholder="your.email@example.com"
                    value={formData.smtpUsername}
                    onChange={(e) => setFormData({ ...formData, smtpUsername: e.target.value })}
                    className="bg-input-background"
                    required
                  />
                  <p className="text-xs text-gray-500">Usually your email address</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password *</Label>
                  <div className="relative">
                    <Input
                      id="smtpPassword"
                      type={showSmtpPassword ? 'text' : 'password'}
                      placeholder="Enter SMTP password"
                      value={formData.smtpPassword}
                      onChange={(e) => setFormData({ ...formData, smtpPassword: e.target.value })}
                      className="bg-input-background pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showSmtpPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">For Gmail, use an App Password instead of your regular password</p>
                </div>
              </div>
            </div>

            <Card className="p-6 bg-blue-50 border-blue-200 mt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[#0A2540] mb-3">Common SMTP Settings</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">Gmail</p>
                      <p className="text-gray-600">Host: smtp.gmail.com</p>
                      <p className="text-gray-600">Port: 587 (TLS) or 465 (SSL)</p>
                      <p className="text-gray-600">Use App Password</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">Outlook/Hotmail</p>
                      <p className="text-gray-600">Host: smtp-mail.outlook.com</p>
                      <p className="text-gray-600">Port: 587</p>
                      <p className="text-gray-600">Use your email password</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">Yahoo</p>
                      <p className="text-gray-600">Host: smtp.mail.yahoo.com</p>
                      <p className="text-gray-600">Port: 587 or 465</p>
                      <p className="text-gray-600">Use App Password</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('purchase-credits')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#0A2540] hover:bg-[#0A2540]/90"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Credentials'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}

