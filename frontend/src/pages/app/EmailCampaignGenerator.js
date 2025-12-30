import { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Copy, Save, Sparkles, RefreshCw, Mail, MessageCircle, CheckCircle2, AlertCircle, Edit2, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '../../utils/api';

export default function EmailCampaignGenerator({ navigate, onLogout }) {
  const [activeTab, setActiveTab] = useState('email');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(true);
  const [emailCredentials, setEmailCredentials] = useState(null);
  
  // Email form data
  const [emailFormData, setEmailFormData] = useState({
    subject: '',
    purpose: '',
    tone: 'professional',
    volume: 'medium',
  });

  // WhatsApp form data
  const [whatsappFormData, setWhatsappFormData] = useState({
    purpose: '',
    tone: 'friendly',
    volume: 'medium',
  });

  const [generatedContent, setGeneratedContent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(null);
  const [contentType, setContentType] = useState('email'); // 'email' or 'whatsapp'

  // Fetch email credentials on mount
  useEffect(() => {
    fetchEmailCredentials();
  }, []);

  const fetchEmailCredentials = async () => {
    try {
      setIsLoadingCredentials(true);
      const response = await apiRequest('/credentials/email');
      if (response.success && response.credentials) {
        setEmailCredentials(response.credentials);
      }
    } catch (error) {
      console.error('Error fetching email credentials:', error);
    } finally {
      setIsLoadingCredentials(false);
    }
  };

  const handleEmailGenerate = async () => {
    if (!emailFormData.purpose) {
      toast.error('Please provide email purpose');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiRequest('/content/email', {
        method: 'POST',
        body: JSON.stringify({
          subject: emailFormData.subject,
          purpose: emailFormData.purpose,
          tone: emailFormData.tone,
          volume: emailFormData.volume
        })
      });

      if (response.success) {
        const content = {
          subject: response.email.subject,
          body: response.email.body
        };
        setGeneratedContent(content);
        setEditedContent(content);
        setContentType('email');
        setIsEditing(false);
        toast.success('Email generated successfully!');
      } else {
        toast.error(response.message || 'Failed to generate email');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error.message || 'Failed to generate email. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWhatsAppGenerate = async () => {
    if (!whatsappFormData.purpose) {
      toast.error('Please provide message purpose');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiRequest('/content/whatsapp', {
        method: 'POST',
        body: JSON.stringify({
          purpose: whatsappFormData.purpose,
          tone: whatsappFormData.tone,
          volume: whatsappFormData.volume
        })
      });

      if (response.success) {
        const content = {
          message: response.whatsapp.message
        };
        setGeneratedContent(content);
        setEditedContent(content);
        setContentType('whatsapp');
        setIsEditing(false);
        toast.success('WhatsApp message generated successfully!');
      } else {
        toast.error(response.message || 'Failed to generate WhatsApp message');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error.message || 'Failed to generate WhatsApp message. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppLayout navigate={navigate} onLogout={onLogout} activePage="email-campaign">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Bulk Campaign Generator</h1>
          <p className="text-gray-600">Create compelling email sequences and WhatsApp messages</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="email">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="whatsapp">
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* Email Credentials Section */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-[#0A2540] mb-4">Email Details</h2>
                  
                  {isLoadingCredentials ? (
                    <div className="flex items-center justify-center py-4">
                      <RefreshCw className="w-5 h-5 animate-spin text-gray-400" />
                    </div>
                  ) : emailCredentials ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">Email configured</span>
                        </div>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => navigate('credentials-email')}
                          className="text-[#0A2540] hover:text-[#0A2540]/80 p-0 h-auto"
                        >
                          Configure
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-amber-600">
                          <AlertCircle className="w-4 h-4" />
                          <span>Email not configured</span>
                        </div>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => navigate('credentials-email')}
                          className="text-[#0A2540] hover:text-[#0A2540]/80 p-0 h-auto"
                        >
                          Configure
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Campaign Form */}
                <Card className="p-6 h-fit">
                  <h2 className="text-xl font-semibold text-[#0A2540] mb-6">Campaign Details</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email-subject">Subject Line (Optional)</Label>
                      <Input
                        id="email-subject"
                        placeholder="e.g., Transform Your Marketing with AI"
                        value={emailFormData.subject}
                        onChange={(e) => setEmailFormData({ ...emailFormData, subject: e.target.value })}
                        className="bg-input-background"
                      />
                      <p className="text-xs text-gray-500">Leave empty to auto-generate</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-purpose">Email Purpose *</Label>
                      <Textarea
                        id="email-purpose"
                        placeholder="What is this email about? (promotion, newsletter, welcome, product launch, etc.)"
                        value={emailFormData.purpose}
                        onChange={(e) => setEmailFormData({ ...emailFormData, purpose: e.target.value })}
                        className="bg-input-background min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-tone">Tone</Label>
                      <Select value={emailFormData.tone} onValueChange={(value) => setEmailFormData({ ...emailFormData, tone: value })}>
                        <SelectTrigger className="bg-input-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="conversational">Conversational</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-volume">Email Length</Label>
                      <Select value={emailFormData.volume} onValueChange={(value) => setEmailFormData({ ...emailFormData, volume: value })}>
                        <SelectTrigger className="bg-input-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short (50-100 words)</SelectItem>
                          <SelectItem value="medium">Medium (150-300 words)</SelectItem>
                          <SelectItem value="long">Long (300-500 words)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">Choose the desired length of your email content</p>
                    </div>

                    <Button 
                      onClick={handleEmailGenerate} 
                      disabled={isGenerating || !emailFormData.purpose}
                      className="w-full bg-[#0A2540] hover:bg-[#0A2540]/90"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating with AI...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Email with AI
                        </>
                      )}
                    </Button>

                    <p className="text-sm text-gray-500 text-center">Cost: 25 credits</p>
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                {!generatedContent || contentType !== 'email' ? (
                  <Card className="p-12 text-center">
                    <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No email generated yet</h3>
                    <p className="text-gray-600">Fill in the form and click "Generate Email" to create content</p>
                  </Card>
                ) : (
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-[#0A2540] mb-4">Generated Email</h2>
                    <div className="mb-4">
                      {!isEditing ? (
                        <>
                          <Label className="text-sm text-gray-600">Subject:</Label>
                          <p className="font-semibold text-[#0A2540] mb-4">{generatedContent.subject}</p>
                          <Label className="text-sm text-gray-600">Body:</Label>
                          <p className="text-gray-900 whitespace-pre-wrap mt-2">{generatedContent.body}</p>
                        </>
                      ) : (
                        <>
                          <div className="space-y-2 mb-4">
                            <Label htmlFor="edit-subject" className="text-sm text-gray-600">Subject:</Label>
                            <Input
                              id="edit-subject"
                              value={editedContent?.subject || ''}
                              onChange={(e) => setEditedContent({ ...editedContent, subject: e.target.value })}
                              className="bg-input-background"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-body" className="text-sm text-gray-600">Body:</Label>
                            <Textarea
                              id="edit-body"
                              value={editedContent?.body || ''}
                              onChange={(e) => setEditedContent({ ...editedContent, body: e.target.value })}
                              className="bg-input-background min-h-[300px]"
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      {!isEditing ? (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(`Subject: ${generatedContent.subject}\n\n${generatedContent.body}`);
                              toast.success('Copied to clipboard!');
                            }}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setIsEditing(true);
                              setEditedContent({ ...generatedContent });
                            }}
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={async () => {
                              if (!generatedContent || !generatedContent.subject || !generatedContent.body) {
                                toast.error('No email content to save');
                                return;
                              }
                              
                              try {
                                const response = await apiRequest('/emailers/save', {
                                  method: 'POST',
                                  body: JSON.stringify({
                                    subject: generatedContent.subject,
                                    body: generatedContent.body,
                                    type: 'email'
                                  })
                                });
                                
                                if (response.success) {
                                  toast.success(`Email saved! (${response.totalSaved}/10 saved)`);
                                } else {
                                  toast.error(response.message || 'Failed to save email');
                                }
                              } catch (error) {
                                console.error('Save error:', error);
                                toast.error(error.message || 'Failed to save email. Please try again.');
                              }
                            }}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              if (!editedContent || !editedContent.subject || !editedContent.body) {
                                toast.error('Email content cannot be empty');
                                return;
                              }
                              
                              setGeneratedContent({ ...editedContent });
                              setIsEditing(false);
                              toast.success('Changes saved locally!');
                            }}
                            className="bg-green-600 text-white hover:bg-green-700"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setEditedContent({ ...generatedContent });
                              setIsEditing(false);
                            }}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="whatsapp">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* Campaign Form */}
                <Card className="p-6 h-fit">
                  <h2 className="text-xl font-semibold text-[#0A2540] mb-6">Campaign Details</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp-purpose">Message Purpose *</Label>
                      <Textarea
                        id="whatsapp-purpose"
                        placeholder="What is this message about? (promotion, announcement, follow-up, product launch, etc.)"
                        value={whatsappFormData.purpose}
                        onChange={(e) => setWhatsappFormData({ ...whatsappFormData, purpose: e.target.value })}
                        className="bg-input-background min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatsapp-tone">Tone</Label>
                      <Select value={whatsappFormData.tone} onValueChange={(value) => setWhatsappFormData({ ...whatsappFormData, tone: value })}>
                        <SelectTrigger className="bg-input-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="conversational">Conversational</SelectItem>
                          <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatsapp-volume">Message Length</Label>
                      <Select value={whatsappFormData.volume} onValueChange={(value) => setWhatsappFormData({ ...whatsappFormData, volume: value })}>
                        <SelectTrigger className="bg-input-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short (20-50 words)</SelectItem>
                          <SelectItem value="medium">Medium (50-100 words)</SelectItem>
                          <SelectItem value="long">Long (100-200 words)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">Choose the desired length of your WhatsApp message</p>
                    </div>

                    <Button 
                      onClick={handleWhatsAppGenerate} 
                      disabled={isGenerating || !whatsappFormData.purpose}
                      className="w-full bg-[#0A2540] hover:bg-[#0A2540]/90"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating with AI...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate WhatsApp Message with AI
                        </>
                      )}
                    </Button>

                    <p className="text-sm text-gray-500 text-center">Cost: 25 credits</p>
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                {!generatedContent || contentType !== 'whatsapp' ? (
                  <Card className="p-12 text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No message generated yet</h3>
                    <p className="text-gray-600">Fill in the form and click "Generate WhatsApp Message" to create content</p>
                  </Card>
                ) : (
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-[#0A2540] mb-4">Generated WhatsApp Message</h2>
                    <div className="mb-4">
                      {!isEditing ? (
                        <>
                          <Label className="text-sm text-gray-600">Message:</Label>
                          <p className="text-gray-900 whitespace-pre-wrap mt-2">{generatedContent.message}</p>
                        </>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="edit-message" className="text-sm text-gray-600">Message:</Label>
                            <Textarea
                              id="edit-message"
                              value={editedContent?.message || ''}
                              onChange={(e) => setEditedContent({ ...editedContent, message: e.target.value })}
                              className="bg-input-background min-h-[300px]"
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      {!isEditing ? (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(generatedContent.message);
                              toast.success('Copied to clipboard!');
                            }}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setIsEditing(true);
                              setEditedContent({ ...generatedContent });
                            }}
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={async () => {
                              if (!generatedContent || !generatedContent.message) {
                                toast.error('No WhatsApp message to save');
                                return;
                              }
                              
                              try {
                                const response = await apiRequest('/emailers/save', {
                                  method: 'POST',
                                  body: JSON.stringify({
                                    message: generatedContent.message,
                                    type: 'whatsapp'
                                  })
                                });
                                
                                if (response.success) {
                                  toast.success(`WhatsApp template saved! (${response.totalSaved}/10 saved)`);
                                } else {
                                  toast.error(response.message || 'Failed to save WhatsApp template');
                                }
                              } catch (error) {
                                console.error('Save error:', error);
                                toast.error(error.message || 'Failed to save WhatsApp template. Please try again.');
                              }
                            }}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              if (!editedContent || !editedContent.message) {
                                toast.error('Message content cannot be empty');
                                return;
                              }
                              
                              setGeneratedContent({ ...editedContent });
                              setIsEditing(false);
                              toast.success('Changes saved locally!');
                            }}
                            className="bg-green-600 text-white hover:bg-green-700"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setEditedContent({ ...generatedContent });
                              setIsEditing(false);
                            }}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
