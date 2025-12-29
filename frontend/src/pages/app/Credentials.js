import { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Mail, MessageCircle, Facebook, Instagram, Linkedin, Plus, Check, X } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { toast } from 'sonner';

export default function Credentials({ navigate, onLogout }) {
  const [credentials, setCredentials] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const response = await apiRequest('/credentials');
      if (response.success) {
        const creds = response.credentials || {};
        // Process credentials to check if they exist
        const processedCreds = {};
        // Email exists if email field is present and not just masked
        processedCreds.email = !!(creds.email && creds.email !== '••••••••');
        // WhatsApp exists if connected is true
        processedCreds.whatsapp = !!(creds.whatsapp && creds.whatsapp.connected);
        // Other platforms
        processedCreds.facebook = !!creds.facebook;
        processedCreds.instagram = !!creds.instagram;
        processedCreds.twitter = !!creds.twitter;
        processedCreds.linkedin = !!creds.linkedin;
        setCredentials(processedCreds);
      }
    } catch (error) {
      console.error('Error fetching credentials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const platforms = [
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: 'Connect your email account',
      hasCredentials: credentials.email === true,
      page: 'credentials-email',
      comingSoon: false
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-50',
      iconColor: 'text-green-600',
      description: 'Connect WhatsApp Web',
      hasCredentials: credentials.whatsapp === true,
      page: 'credentials-whatsapp',
      comingSoon: false
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: 'Connect Facebook account',
      hasCredentials: credentials.facebook === true,
      page: 'credentials-facebook',
      comingSoon: true
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-pink-50',
      iconColor: 'text-pink-600',
      description: 'Connect Instagram account',
      hasCredentials: credentials.instagram === true,
      page: 'credentials-instagram',
      comingSoon: true
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: 'Connect LinkedIn account',
      hasCredentials: credentials.linkedin === true,
      page: 'credentials-linkedin',
      comingSoon: true
    },
  ];

  const handleRemove = async (platformId) => {
    try {
      const response = await apiRequest(`/credentials/${platformId}`, {
        method: 'DELETE'
      });
      if (response.success) {
        toast.success(`${platforms.find(p => p.id === platformId)?.name} credentials removed`);
        fetchCredentials();
      }
    } catch (error) {
      toast.error('Failed to remove credentials');
    }
  };

  if (isLoading) {
    return (
      <AppLayout navigate={navigate} onLogout={onLogout} activePage="purchase-credits">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A2540] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading credentials...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout navigate={navigate} onLogout={onLogout} activePage="purchase-credits">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Credentials</h1>
          <p className="text-gray-600">Manage your credentials and API access</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform) => {
            const IconComponent = platform.icon;
            return (
              <Card key={platform.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${platform.color} p-3 rounded-lg`}>
                    <IconComponent className={`w-6 h-6 ${platform.iconColor}`} />
                  </div>
                  {platform.hasCredentials && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
                        <Check className="w-3 h-3 text-green-600" />
                        <span className="text-xs font-semibold text-green-600">Connected</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(platform.id);
                        }}
                        className="p-1 hover:bg-red-50 rounded transition-colors"
                        title="Remove credentials"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-[#0A2540] mb-1">{platform.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{platform.description}</p>
                {platform.comingSoon ? (
                  <Button
                    disabled
                    className="w-full bg-gray-100 text-gray-500 cursor-not-allowed"
                  >
                    Coming Soon
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate(platform.page)}
                    className={`w-full ${
                      platform.hasCredentials
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-[#0A2540] hover:bg-[#0A2540]/90'
                    }`}
                  >
                    {platform.hasCredentials ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Update
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

