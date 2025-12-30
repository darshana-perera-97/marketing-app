const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

/**
 * Generate email content using OpenAI
 */
async function generateEmailContent(prompt, options = {}) {
  try {
    // Check if API key is configured
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env file.');
    }

    const {
      tone = 'professional',
      subject = '',
      purpose = '',
      volume = 'medium',
      emailDetails = {}
    } = options;

    // Build a comprehensive prompt for email generation
    let systemPrompt = `You are an expert email marketing copywriter with years of experience creating high-converting email campaigns. Your emails are engaging, persuasive, and drive action. You understand the importance of clear structure, compelling copy, and strong calls-to-action.`;

    let userPrompt = `Create a professional email campaign with the following requirements:\n\n`;
    
    if (purpose) {
      userPrompt += `Email Purpose: ${purpose}\n`;
    }
    
    if (subject) {
      userPrompt += `Subject Line (optional - generate if not provided): ${subject}\n`;
    } else {
      userPrompt += `Subject Line: Generate a compelling, attention-grabbing subject line\n`;
    }
    
    userPrompt += `Tone: ${tone}\n\n`;
    
    // Include email details if available (from credentials)
    if (emailDetails.email) {
      userPrompt += `Sender Information: ${emailDetails.email}\n`;
    }
    
    if (prompt) {
      userPrompt += `\nAdditional Context/Details: ${prompt}\n`;
    }
    
    userPrompt += `\nRequirements for the email:\n`;
    userPrompt += `1. Create a compelling subject line that grabs attention (if not already provided)\n`;
    userPrompt += `2. Write an engaging email body with:\n`;
    userPrompt += `   - A strong opening that hooks the reader\n`;
    userPrompt += `   - Clear, well-structured content with proper paragraphs\n`;
    userPrompt += `   - Bullet points or numbered lists where appropriate\n`;
    userPrompt += `   - A clear and compelling call-to-action\n`;
    userPrompt += `   - Professional closing\n`;
    // Define volume requirements
    let volumeDescription = '';
    let wordCount = '';
    if (volume === 'short') {
      volumeDescription = 'Short and concise';
      wordCount = '50-100 words';
    } else if (volume === 'long') {
      volumeDescription = 'Detailed and comprehensive';
      wordCount = '300-500 words';
    } else {
      volumeDescription = 'Medium length';
      wordCount = '150-300 words';
    }
    
    userPrompt += `3. Maintain the ${tone} tone throughout\n`;
    userPrompt += `4. Make it conversion-focused and action-oriented\n`;
    userPrompt += `5. Length: ${volumeDescription} - aim for approximately ${wordCount}\n\n`;
    userPrompt += `IMPORTANT: Return your response as a valid JSON object with exactly two fields:\n`;
    userPrompt += `- "subject": The email subject line (string)\n`;
    userPrompt += `- "body": The complete email body text (string, use \\n for line breaks)`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0].message.content;
    
    try {
      const parsed = JSON.parse(response);
      return {
        success: true,
        subject: parsed.subject || subject || 'Important Update',
        body: parsed.body || response
      };
    } catch (parseError) {
      // If JSON parsing fails, try to extract subject and body from text
      const lines = response.split('\n');
      let extractedSubject = subject || lines[0] || 'Important Update';
      let extractedBody = response;
      
      // Try to find subject line
      const subjectMatch = response.match(/subject[:\s]+(.+)/i);
      if (subjectMatch) {
        extractedSubject = subjectMatch[1].trim();
        extractedBody = response.replace(subjectMatch[0], '').trim();
      }
      
      return {
        success: true,
        subject: extractedSubject,
        body: extractedBody
      };
    }
  } catch (error) {
    console.error('OpenAI generation error:', error);
    throw error;
  }
}

/**
 * Generate WhatsApp message content using OpenAI
 */
async function generateWhatsAppContent(prompt, options = {}) {
  try {
    // Check if API key is configured
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env file.');
    }

    const {
      tone = 'friendly',
      purpose = '',
      volume = 'medium'
    } = options;

    // Build a comprehensive prompt for WhatsApp message generation
    let systemPrompt = `You are an expert WhatsApp marketing copywriter. You create engaging, conversational messages that drive action. WhatsApp messages should be concise, personal, and use emojis appropriately. They should feel like a natural conversation while being persuasive.`;

    let userPrompt = `Create a WhatsApp marketing message with the following requirements:\n\n`;
    
    if (purpose) {
      userPrompt += `Message Purpose: ${purpose}\n`;
    }
    
    userPrompt += `Tone: ${tone}\n\n`;
    
    if (prompt) {
      userPrompt += `\nAdditional Context/Details: ${prompt}\n`;
    }
    
    // Define volume requirements for WhatsApp
    let volumeDescription = '';
    let wordCount = '';
    if (volume === 'short') {
      volumeDescription = 'Very short and concise';
      wordCount = '20-50 words';
    } else if (volume === 'long') {
      volumeDescription = 'Detailed but still conversational';
      wordCount = '100-200 words';
    } else {
      volumeDescription = 'Medium length';
      wordCount = '50-100 words';
    }
    
    userPrompt += `\nRequirements for the WhatsApp message:\n`;
    userPrompt += `1. Write an engaging WhatsApp message with:\n`;
    userPrompt += `   - A friendly, conversational opening\n`;
    userPrompt += `   - Clear and concise content\n`;
    userPrompt += `   - Appropriate use of emojis (not excessive)\n`;
    userPrompt += `   - A clear call-to-action\n`;
    userPrompt += `   - Natural, personal tone\n`;
    userPrompt += `2. Maintain the ${tone} tone throughout\n`;
    userPrompt += `3. Make it conversion-focused and action-oriented\n`;
    userPrompt += `4. Length: ${volumeDescription} - aim for approximately ${wordCount}\n`;
    userPrompt += `5. Remember: WhatsApp messages should feel personal and conversational, not like formal emails\n\n`;
    userPrompt += `IMPORTANT: Return your response as a valid JSON object with exactly one field:\n`;
    userPrompt += `- "message": The complete WhatsApp message text (string, use \\n for line breaks, include emojis where appropriate)`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8, // Slightly higher for more creative/conversational tone
      max_tokens: 1000,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0].message.content;
    
    try {
      const parsed = JSON.parse(response);
      return {
        success: true,
        message: parsed.message || response
      };
    } catch (parseError) {
      // If JSON parsing fails, return the raw response
      return {
        success: true,
        message: response
      };
    }
  } catch (error) {
    console.error('OpenAI WhatsApp generation error:', error);
    throw error;
  }
}

/**
 * Generate social media content using OpenAI
 */
async function generateSocialMediaContent(prompt, options = {}) {
  try {
    // Check if API key is configured
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env file.');
    }

    const {
      platform = 'instagram',
      postType = 'promotional',
      tone = 'professional',
      numberOfPosts = 1
    } = options;

    // Build platform-specific guidelines
    const platformGuidelines = {
      instagram: 'Instagram posts should be visually engaging, use emojis, and include relevant hashtags. Keep it concise and eye-catching.',
      facebook: 'Facebook posts should be conversational, engaging, and encourage comments. Can be longer than Instagram.',
      twitter: 'Twitter/X posts should be concise (under 280 characters), punchy, and use hashtags strategically.',
      linkedin: 'LinkedIn posts should be professional, value-driven, and thought-provoking. Focus on business insights.',
      tiktok: 'TikTok captions should be short, catchy, and use trending hashtags. Keep it fun and engaging.'
    };

    const platformGuide = platformGuidelines[platform] || platformGuidelines.instagram;

    // Build a comprehensive prompt for social media generation
    let systemPrompt = `You are an expert social media content creator with years of experience creating viral, engaging posts across all platforms. You understand platform-specific best practices, audience psychology, and how to craft content that drives engagement and conversions.`;

    let userPrompt = `Create ${numberOfPosts} ${platform} ${postType} post${numberOfPosts > 1 ? 's' : ''} with the following requirements:\n\n`;
    
    if (prompt) {
      userPrompt += `Topic/Content: ${prompt}\n`;
    }
    
    userPrompt += `Platform: ${platform}\n`;
    userPrompt += `Post Type: ${postType}\n`;
    userPrompt += `Tone: ${tone}\n\n`;
    userPrompt += `Platform Guidelines: ${platformGuide}\n\n`;
    
    userPrompt += `Requirements for each post:\n`;
    userPrompt += `1. Create engaging, platform-appropriate content\n`;
    userPrompt += `2. Include relevant hashtags (5-10 hashtags for Instagram, 2-3 for Twitter, 3-5 for others)\n`;
    userPrompt += `3. Maintain the ${tone} tone throughout\n`;
    userPrompt += `4. Make it conversion-focused and action-oriented\n`;
    userPrompt += `5. Follow ${platform} best practices for content length and style\n`;
    userPrompt += `6. Include a clear call-to-action\n\n`;
    userPrompt += `IMPORTANT: Return your response as a valid JSON object with an array called "posts" containing ${numberOfPosts} object(s). Each object should have:\n`;
    userPrompt += `- "content": The main post text (string, use \\n for line breaks)\n`;
    userPrompt += `- "hashtags": Relevant hashtags as a string (space-separated, include #)\n`;
    userPrompt += `- "imagePrompt": A detailed description for generating an image for this post (string, be specific about style, colors, composition, mood)`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0].message.content;
    
    try {
      const parsed = JSON.parse(response);
      if (parsed.posts && Array.isArray(parsed.posts)) {
        return {
          success: true,
          posts: parsed.posts
        };
      } else {
        // Fallback: try to extract posts from response
        throw new Error('Invalid response format');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Fallback: create a single post from the response
      return {
        success: true,
        posts: [{
          content: response,
          hashtags: `#${platform} #${postType} #marketing`,
          imagePrompt: `A professional ${postType} image related to ${prompt || 'marketing'}, ${tone} tone, modern design, social media style`
        }]
      };
    }
  } catch (error) {
    console.error('OpenAI social media generation error:', error);
    throw error;
  }
}

/**
 * Generate image sketch using DALL-E
 */
async function generateImage(prompt, options = {}) {
  try {
    // Check if API key is configured
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env file.');
    }

    const {
      size = '1024x1024',
      quality = 'standard',
      style = 'vivid',
      isSketch = true
    } = options;

    // Validate size for DALL-E 3 (only supports 1024x1024, 1792x1024, 1024x1792)
    const validSizes = ['1024x1024', '1792x1024', '1024x1792'];
    const imageSize = validSizes.includes(size) ? size : '1024x1024';

    // Build enhanced prompt for sketch generation
    let enhancedPrompt;
    if (isSketch) {
      enhancedPrompt = `Create a simple sketch or rough draft illustration for a social media post: ${prompt}. Style: sketch, rough draft, line drawing, minimal design, basic layout, simple composition, pencil or pen style, not a finished design, just a visual concept sketch.`;
    } else {
      enhancedPrompt = `Create a professional social media post image: ${prompt}. Style: modern, clean, eye-catching, suitable for social media, high quality, professional design.`;
    }

    try {
      // Try DALL-E 3 first (better quality)
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1,
        size: imageSize,
        quality: quality,
        style: style
      });

      if (response.data && response.data[0] && response.data[0].url) {
        return {
          success: true,
          imageUrl: response.data[0].url,
          revisedPrompt: response.data[0].revised_prompt || prompt
        };
      } else {
        throw new Error('No image URL returned from DALL-E 3');
      }
    } catch (dalle3Error) {
      // Fallback to DALL-E 2 if DALL-E 3 fails
      console.log('DALL-E 3 failed, trying DALL-E 2...', dalle3Error.message);
      const validSizes2 = ['256x256', '512x512', '1024x1024'];
      const imageSize2 = validSizes2.includes(size) ? size : '1024x1024';
      
      const response = await openai.images.generate({
        model: 'dall-e-2',
        prompt: enhancedPrompt,
        n: 1,
        size: imageSize2
      });

      if (response.data && response.data[0] && response.data[0].url) {
        return {
          success: true,
          imageUrl: response.data[0].url,
          revisedPrompt: prompt
        };
      } else {
        throw new Error('No image URL returned from DALL-E');
      }
    }
  } catch (error) {
    console.error('DALL-E image generation error:', error);
    throw error;
  }
}

/**
 * Generate design ideas for social media posts
 */
async function generateDesignIdeas(prompt, options = {}) {
  try {
    // Check if API key is configured
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env file.');
    }

    const {
      platform = 'instagram',
      postType = 'promotional',
      tone = 'professional'
    } = options;

    const systemPrompt = `You are an expert graphic designer and social media content strategist. You provide creative design ideas and visual concepts for social media posts. Your suggestions are practical, actionable, and tailored to each platform's best practices.`;

    const userPrompt = `Based on the following social media post content, provide 3-5 specific design ideas for creating the visual/image component of this post:\n\n` +
      `Post Content/Topic: ${prompt}\n` +
      `Platform: ${platform}\n` +
      `Post Type: ${postType}\n` +
      `Tone: ${tone}\n\n` +
      `Provide design ideas that include:\n` +
      `- Color scheme suggestions\n` +
      `- Layout and composition ideas\n` +
      `- Visual elements to include\n` +
      `- Typography recommendations\n` +
      `- Style and aesthetic direction\n` +
      `- Any specific imagery or graphics to consider\n\n` +
      `Return your response as a JSON object with a "designIdeas" array. Each design idea should have:\n` +
      `- "title": A short title for the design concept\n` +
      `- "description": A detailed description of the design idea\n` +
      `- "colors": Suggested color palette\n` +
      `- "elements": Key visual elements to include\n` +
      `- "style": The overall style/aesthetic\n\n` +
      `Make the ideas creative, practical, and suitable for ${platform} platform.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0].message.content;
    
    try {
      const parsed = JSON.parse(response);
      if (parsed.designIdeas && Array.isArray(parsed.designIdeas)) {
        return {
          success: true,
          designIdeas: parsed.designIdeas
        };
      } else {
        // Fallback: create a simple design idea from the response
        return {
          success: true,
          designIdeas: [{
            title: 'Design Concept',
            description: response || 'A modern, eye-catching design that aligns with the post content and platform requirements.',
            colors: 'Vibrant and engaging color palette',
            elements: 'Key visual elements that support the message',
            style: 'Modern and professional'
          }]
        };
      }
    } catch (parseError) {
      console.error('JSON parse error for design ideas:', parseError);
      // Fallback design idea
      return {
        success: true,
        designIdeas: [{
          title: 'Design Concept',
          description: response || 'A modern, eye-catching design that aligns with the post content and platform requirements.',
          colors: 'Vibrant and engaging color palette',
          elements: 'Key visual elements that support the message',
          style: 'Modern and professional'
        }]
      };
    }
  } catch (error) {
    console.error('Design ideas generation error:', error);
    throw error;
  }
}

/**
 * Generate ad copy using OpenAI
 */
async function generateAdCopy(prompt, options = {}) {
  try {
    // Check if API key is configured
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env file.');
    }

    const {
      platform = 'google',
      product = '',
      targetAudience = '',
      keyBenefit = '',
      cta = 'learn-more'
    } = options;

    // Build platform-specific guidelines
    const platformGuidelines = {
      google: 'Google Ads should have clear, concise headlines (30 characters max for headline 1, 90 characters max for description). Focus on keywords and clear value proposition.',
      facebook: 'Facebook Ads should be engaging, conversational, and use emotional appeal. Headlines can be longer, descriptions should be compelling and include social proof.',
      instagram: 'Instagram Ads should be visually-focused with short, punchy headlines. Use emojis sparingly. Focus on lifestyle and aspirational messaging.',
      linkedin: 'LinkedIn Ads should be professional, B2B focused, and value-driven. Headlines should be clear and benefit-oriented. Descriptions should include business outcomes.',
      twitter: 'Twitter Ads should be concise, attention-grabbing, and conversational. Headlines must be very short. Use hashtags strategically.'
    };

    const platformGuide = platformGuidelines[platform] || platformGuidelines.google;

    // Map CTA values to actual CTA text
    const ctaMap = {
      'learn-more': 'Learn More',
      'get-started': 'Get Started',
      'try-free': 'Try Free',
      'buy-now': 'Buy Now',
      'sign-up': 'Sign Up'
    };
    const ctaText = ctaMap[cta] || cta;

    // Build a comprehensive prompt for ad copy generation
    let systemPrompt = `You are an expert advertising copywriter with years of experience creating high-converting ad copy across all major advertising platforms. You understand platform-specific best practices, audience psychology, and how to craft compelling headlines and descriptions that drive clicks and conversions.`;

    let userPrompt = `Create 3 high-converting ad copy variations for ${platform} with the following requirements:\n\n`;
    
    if (product) {
      userPrompt += `Product/Service: ${product}\n`;
    }
    
    if (targetAudience) {
      userPrompt += `Target Audience: ${targetAudience}\n`;
    }
    
    if (keyBenefit) {
      userPrompt += `Key Benefit/Value Proposition: ${keyBenefit}\n`;
    }
    
    userPrompt += `Call to Action: ${ctaText}\n`;
    userPrompt += `Platform: ${platform}\n\n`;
    userPrompt += `Platform Guidelines: ${platformGuide}\n\n`;
    
    if (prompt) {
      userPrompt += `Additional Context: ${prompt}\n\n`;
    }
    
    userPrompt += `Requirements for each ad variation:\n`;
    userPrompt += `1. Create a compelling headline that:\n`;
    userPrompt += `   - Grabs attention immediately\n`;
    userPrompt += `   - Highlights the key benefit or value proposition\n`;
    userPrompt += `   - Is optimized for ${platform} platform\n`;
    userPrompt += `   - Follows platform character limits\n`;
    userPrompt += `2. Write an engaging description that:\n`;
    userPrompt += `   - Expands on the headline\n`;
    userPrompt += `   - Clearly communicates the value proposition\n`;
    userPrompt += `   - Includes a compelling reason to act\n`;
    userPrompt += `   - Is tailored to ${targetAudience || 'the target audience'}\n`;
    userPrompt += `   - Follows ${platform} best practices\n`;
    userPrompt += `3. Include the call-to-action: "${ctaText}"\n`;
    userPrompt += `4. Make each variation unique but equally compelling\n`;
    userPrompt += `5. Ensure all copy is conversion-focused and action-oriented\n\n`;
    userPrompt += `IMPORTANT: Return your response as a valid JSON object with an array called "ads" containing exactly 3 objects. Each object should have:\n`;
    userPrompt += `- "headline": The ad headline (string, optimized for ${platform})\n`;
    userPrompt += `- "description": The ad description (string, optimized for ${platform})\n`;
    userPrompt += `- "cta": The call-to-action text (string, use "${ctaText}")`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0].message.content;
    
    try {
      const parsed = JSON.parse(response);
      if (parsed.ads && Array.isArray(parsed.ads)) {
        return {
          success: true,
          ads: parsed.ads
        };
      } else {
        // Fallback: try to extract ads from response
        throw new Error('Invalid response format');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Fallback: create ads from the response
      return {
        success: true,
        ads: [
          {
            headline: product || 'Transform Your Business',
            description: keyBenefit || 'Discover the solution you\'ve been looking for.',
            cta: ctaText
          },
          {
            headline: 'Get Started Today',
            description: `Perfect for ${targetAudience || 'your business'}. ${keyBenefit || 'Experience the difference.'}`,
            cta: ctaText
          },
          {
            headline: 'Join Thousands of Happy Customers',
            description: `${keyBenefit || 'See why businesses choose us.'} Start your journey today.`,
            cta: ctaText
          }
        ]
      };
    }
  } catch (error) {
    console.error('OpenAI ad copy generation error:', error);
    throw error;
  }
}

module.exports = {
  generateEmailContent,
  generateWhatsAppContent,
  generateSocialMediaContent,
  generateImage,
  generateDesignIdeas,
  generateAdCopy
};

