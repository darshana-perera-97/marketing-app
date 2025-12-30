import { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Mail, Trash2, Copy, Eye, EyeOff, ArrowLeft, Edit2, X, Check, MessageCircle, Instagram, Megaphone } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';
import { apiRequest } from '../../utils/api';

export default function SavedEmails({ navigate, onLogout }) {
  const [activeTab, setActiveTab] = useState('email');
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedTemplate, setExpandedTemplate] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [editedTemplateData, setEditedTemplateData] = useState(null);
  const [totalAll, setTotalAll] = useState(0);
  const [remaining, setRemaining] = useState(10);

  const fetchSavedTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest(`/emailers${activeTab !== 'all' ? `?type=${activeTab}` : ''}`);
      if (response.success) {
        setTemplates(response.templates || []);
        setTotalAll(response.totalAll || 0);
        setRemaining(response.remaining || 10);
      }
    } catch (error) {
      console.error('Error fetching saved templates:', error);
      toast.error('Failed to load saved templates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleDelete = async (templateId, templateType) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      const url = templateType === 'social-media' 
        ? `/emailers/${templateId}?type=social-media`
        : `/emailers/${templateId}`;
      const response = await apiRequest(url, {
        method: 'DELETE'
      });

      if (response.success) {
        toast.success('Template deleted successfully');
        fetchSavedTemplates(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to delete template');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete template');
    }
  };

  const handleCopy = (template) => {
    if (template.type === 'email') {
      navigator.clipboard.writeText(`Subject: ${template.subject}\n\n${template.body}`);
    } else if (template.type === 'whatsapp') {
      navigator.clipboard.writeText(template.message);
    } else if (template.type === 'social-media') {
      navigator.clipboard.writeText(`${template.content}\n\n${template.hashtags}`);
    } else if (template.type === 'ad-copy') {
      navigator.clipboard.writeText(`${template.headline}\n\n${template.description}\n\n${template.ctaText || template.cta}`);
    }
    toast.success('Copied to clipboard!');
  };

  const handleEdit = (template) => {
    setEditingTemplate(template.id);
    if (template.type === 'email') {
      setEditedTemplateData({
        subject: template.subject,
        body: template.body
      });
    } else if (template.type === 'whatsapp') {
      setEditedTemplateData({
        message: template.message
      });
    } else if (template.type === 'social-media') {
      setEditedTemplateData({
        content: template.content,
        hashtags: template.hashtags
      });
    } else if (template.type === 'ad-copy') {
      setEditedTemplateData({
        headline: template.headline,
        description: template.description,
        ctaText: template.ctaText,
        cta: template.cta,
        platform: template.platform
      });
    }
    setExpandedTemplate(null); // Close expanded view when editing
  };

  const handleCancelEdit = () => {
    setEditingTemplate(null);
    setEditedTemplateData(null);
  };

  const handleSaveEdit = async (templateId, templateType) => {
    if (templateType === 'email') {
      if (!editedTemplateData || !editedTemplateData.subject || !editedTemplateData.body) {
        toast.error('Subject and body cannot be empty');
        return;
      }
    } else if (templateType === 'whatsapp') {
      if (!editedTemplateData || !editedTemplateData.message) {
        toast.error('Message cannot be empty');
        return;
      }
    } else if (templateType === 'social-media') {
      if (!editedTemplateData || !editedTemplateData.content || !editedTemplateData.hashtags) {
        toast.error('Content and hashtags cannot be empty');
        return;
      }
    }

    try {
      let body = editedTemplateData;
      if (templateType === 'social-media') {
        body = { ...editedTemplateData, type: 'social-media' };
      } else if (templateType === 'ad-copy') {
        body = { ...editedTemplateData, type: 'ad-copy' };
      }
      const response = await apiRequest(`/emailers/${templateId}`, {
        method: 'PUT',
        body: JSON.stringify(body)
      });

      if (response.success) {
        toast.success('Template updated successfully');
        setEditingTemplate(null);
        setEditedTemplateData(null);
        fetchSavedTemplates(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to update template');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update template. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const renderTemplateCard = (template) => {
    const isEditing = editingTemplate === template.id;
    const isExpanded = expandedTemplate === template.id;
    const isSocialMedia = template.type === 'social-media';
    const isAdCopy = template.type === 'ad-copy';

    return (
      <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${
              template.type === 'email' ? 'bg-blue-50' : 
              template.type === 'whatsapp' ? 'bg-green-50' : 
              template.type === 'social-media' ? 'bg-purple-50' :
              'bg-orange-50'
            }`}>
              {template.type === 'email' ? (
                <Mail className="w-5 h-5 text-blue-600" />
              ) : template.type === 'whatsapp' ? (
                <MessageCircle className="w-5 h-5 text-green-600" />
              ) : template.type === 'social-media' ? (
                <Instagram className="w-5 h-5 text-purple-600" />
              ) : (
                <Megaphone className="w-5 h-5 text-orange-600" />
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500">{formatDate(template.createdAt)}</p>
              {(isSocialMedia || isAdCopy) && template.platform && (
                <p className="text-xs font-medium text-gray-700 mt-1 capitalize">{template.platform}</p>
              )}
            </div>
          </div>
        </div>

        {isEditing ? (
          <>
            <div className="space-y-3 mb-4">
              {template.type === 'email' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Subject:</label>
                    <Input
                      value={editedTemplateData?.subject || ''}
                      onChange={(e) => setEditedTemplateData({ ...editedTemplateData, subject: e.target.value })}
                      className="bg-input-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Body:</label>
                    <Textarea
                      value={editedTemplateData?.body || ''}
                      onChange={(e) => setEditedTemplateData({ ...editedTemplateData, body: e.target.value })}
                      className="bg-input-background min-h-[200px]"
                    />
                  </div>
                </>
              ) : template.type === 'whatsapp' ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Message:</label>
                  <Textarea
                    value={editedTemplateData?.message || ''}
                    onChange={(e) => setEditedTemplateData({ ...editedTemplateData, message: e.target.value })}
                    className="bg-input-background min-h-[200px]"
                  />
                </div>
              ) : template.type === 'ad-copy' ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Headline:</label>
                    <Input
                      value={editedTemplateData?.headline || ''}
                      onChange={(e) => setEditedTemplateData({ ...editedTemplateData, headline: e.target.value })}
                      className="bg-input-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description:</label>
                    <Textarea
                      value={editedTemplateData?.description || ''}
                      onChange={(e) => setEditedTemplateData({ ...editedTemplateData, description: e.target.value })}
                      className="bg-input-background min-h-[150px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Call to Action:</label>
                    <Input
                      value={editedTemplateData?.ctaText || ''}
                      onChange={(e) => setEditedTemplateData({ ...editedTemplateData, ctaText: e.target.value })}
                      className="bg-input-background"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Content:</label>
                  <Textarea
                    value={editedTemplateData?.content || ''}
                    onChange={(e) => setEditedTemplateData({ ...editedTemplateData, content: e.target.value })}
                    className="bg-input-background min-h-[200px]"
                  />
                  <div className="space-y-2 mt-3">
                    <label className="text-sm font-medium text-gray-700">Hashtags:</label>
                    <Input
                      value={editedTemplateData?.hashtags || ''}
                      onChange={(e) => setEditedTemplateData({ ...editedTemplateData, hashtags: e.target.value })}
                      className="bg-input-background"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSaveEdit(template.id, template.type)}
                className="flex-1 bg-green-600 text-white hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelEdit}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            {template.type === 'email' ? (
              <>
                <h3 className="font-semibold text-[#0A2540] mb-3 line-clamp-2">
                  {template.subject}
                </h3>
                <div className="mb-4">
                  {isExpanded ? (
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {template.body}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-700 line-clamp-4">
                      {truncateText(template.body, 200)}
                    </p>
                  )}
                </div>
              </>
            ) : template.type === 'whatsapp' ? (
              <div className="mb-4">
                {isExpanded ? (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {template.message}
                  </p>
                ) : (
                  <p className="text-sm text-gray-700 line-clamp-4">
                    {truncateText(template.message, 200)}
                  </p>
                )}
              </div>
            ) : template.type === 'ad-copy' ? (
              <>
                <h3 className="font-semibold text-lg text-[#0A2540] mb-2">
                  {template.headline}
                </h3>
                <div className="mb-4">
                  {isExpanded ? (
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {template.description}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-700 line-clamp-4">
                      {truncateText(template.description, 200)}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <div className="inline-block px-4 py-2 bg-[#0A2540] text-white rounded-md font-medium text-sm">
                    {template.ctaText || template.cta}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  {isExpanded ? (
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {template.content}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-700 line-clamp-4">
                      {truncateText(template.content, 200)}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <p className="text-[#3B82F6] text-sm">{template.hashtags}</p>
                </div>
                {template.designIdeas && template.designIdeas.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Design Ideas</span>
                    </div>
                    <div className="space-y-2">
                      {template.designIdeas.slice(0, 2).map((idea, idx) => (
                        <div key={idx} className="p-2 bg-white rounded border border-blue-100">
                          <h4 className="font-semibold text-xs text-gray-900 mb-1">{idea.title || `Design Idea ${idx + 1}`}</h4>
                          <p className="text-xs text-gray-700 mb-1">{idea.description}</p>
                          <div className="flex flex-wrap gap-1 text-xs">
                            {idea.colors && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">Colors: {idea.colors}</span>
                            )}
                            {idea.style && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded">Style: {idea.style}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex items-center gap-2 mb-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setExpandedTemplate(isExpanded ? null : template.id)}
                className="flex-1"
              >
                {isExpanded ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Show Less
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Show More
                  </>
                )}
              </Button>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy(template)}
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(template)}
                className="flex-1"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(template.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </Card>
    );
  };

  return (
    <AppLayout navigate={navigate} onLogout={onLogout} activePage="saved-emails">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('app-dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Saved Templates</h1>
          <p className="text-gray-600">View and manage your saved email, WhatsApp, and social media campaign templates</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A2540] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading saved templates...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {totalAll} saved template{totalAll !== 1 ? 's' : ''} ({remaining} remaining)
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="email">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="whatsapp">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </TabsTrigger>
                <TabsTrigger value="social-media">
                  <Instagram className="w-4 h-4 mr-2" />
                  Social Media
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                {templates.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved email templates yet</h3>
                    <p className="text-gray-600 mb-6">Save email templates from the Bulk Campaign Generator to view them here</p>
                    <Button onClick={() => navigate('email-campaign')} className="bg-[#0A2540] hover:bg-[#0A2540]/90">
                      Go to Email Generator
                    </Button>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => renderTemplateCard(template))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="whatsapp">
                {templates.length === 0 ? (
                  <Card className="p-12 text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved WhatsApp templates yet</h3>
                    <p className="text-gray-600 mb-6">Save WhatsApp templates from the Bulk Campaign Generator to view them here</p>
                    <Button onClick={() => navigate('email-campaign')} className="bg-[#0A2540] hover:bg-[#0A2540]/90">
                      Go to WhatsApp Generator
                    </Button>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => renderTemplateCard(template))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="social-media">
                {templates.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Instagram className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Social Media posts saved</h3>
                    <p className="text-gray-600 mb-6">Save social media posts from the Social Media Content Generator to view them here</p>
                    <Button onClick={() => navigate('social-media')} className="bg-[#0A2540] hover:bg-[#0A2540]/90">
                      Go to Social Media Generator
                    </Button>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => renderTemplateCard(template))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="ad-copy">
                {templates.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Ad Copies saved</h3>
                    <p className="text-gray-600 mb-6">Save ad copies from the Ad Copy Generator to view them here</p>
                    <Button onClick={() => navigate('ad-copy')} className="bg-[#0A2540] hover:bg-[#0A2540]/90">
                      Go to Ad Copy Generator
                    </Button>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => renderTemplateCard(template))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </AppLayout>
  );
}
