import { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { MessageCircle, ArrowLeft, QrCode, RefreshCw, Check } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { toast } from 'sonner';

export default function CredentialsWhatsApp({ navigate, onLogout }) {
  const [qrCode, setQrCode] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await apiRequest('/credentials/whatsapp');
      if (response.success) {
        setIsConnected(response.connected || false);
        if (response.qrCode) {
          setQrCode(response.qrCode);
        }
      }
    } catch (error) {
      console.error('Error checking WhatsApp connection:', error);
    }
  };

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const response = await apiRequest('/credentials/whatsapp/qr', {
        method: 'POST'
      });
      if (response.success && response.qrCode) {
        setQrCode(response.qrCode);
        setIsConnected(false);
        toast.success('QR code generated. Scan it with WhatsApp to connect.');
      } else {
        toast.error(response.message || 'Failed to generate QR code');
      }
    } catch (error) {
      console.error('QR generation error:', error);
      toast.error('Failed to generate QR code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('/credentials/whatsapp', {
        method: 'DELETE'
      });
      if (response.success) {
        setIsConnected(false);
        setQrCode(null);
        toast.success('WhatsApp disconnected successfully');
      }
    } catch (error) {
      toast.error('Failed to disconnect WhatsApp');
    } finally {
      setIsLoading(false);
    }
  };

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
            <div className="bg-green-50 p-3 rounded-lg">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0A2540]">WhatsApp Web</h1>
              <p className="text-gray-600">Connect your WhatsApp account via QR code</p>
            </div>
          </div>
        </div>

        {isConnected ? (
          <Card className="p-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-50 p-4 rounded-full">
                  <Check className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-[#0A2540] mb-2">WhatsApp Connected</h2>
              <p className="text-gray-600 mb-6">Your WhatsApp account is successfully connected</p>
              <Button
                onClick={handleDisconnect}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                disabled={isLoading}
              >
                {isLoading ? 'Disconnecting...' : 'Disconnect WhatsApp'}
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-[#0A2540] mb-2">Scan QR Code</h2>
              <p className="text-gray-600">
                Open WhatsApp on your phone, go to Settings → Linked Devices, and scan this QR code
              </p>
            </div>

            {qrCode ? (
              <div className="flex flex-col items-center space-y-6">
                <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                  <img
                    src={qrCode}
                    alt="WhatsApp QR Code"
                    className="w-64 h-64"
                  />
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={generateQRCode}
                    variant="outline"
                    disabled={isGenerating}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                    Generate New QR Code
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  The QR code will expire in 60 seconds. Generate a new one if needed.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-6">
                <div className="bg-gray-50 p-12 rounded-lg border-2 border-dashed border-gray-300">
                  <QrCode className="w-24 h-24 text-gray-400 mx-auto" />
                </div>
                <Button
                  onClick={generateQRCode}
                  className="bg-[#0A2540] hover:bg-[#0A2540]/90"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4 mr-2" />
                      Generate QR Code
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-500 text-center max-w-md">
                  Click the button above to generate a QR code. Then scan it with WhatsApp on your phone to connect.
                </p>
              </div>
            )}
          </Card>
        )}

        <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-[#0A2540] mb-3">How to Connect</h3>
          <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
            <li>Open WhatsApp on your phone</li>
            <li>Go to Settings → Linked Devices</li>
            <li>Tap "Link a Device"</li>
            <li>Scan the QR code shown above</li>
            <li>Wait for the connection to be established</li>
          </ol>
        </Card>
      </div>
    </AppLayout>
  );
}

