const express = require('express');
const cors = require('cors');
const { readJSONFile, writeJSONFile, getNextId, generateLongId } = require('./utils/fileStorage');
const { hashPassword, verifyPassword, generateToken, verifyToken } = require('./utils/auth');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.'
      });
    }
    
    const userId = verifyToken(token);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please log in again.'
      });
    }
    
    // Verify user exists
    const users = readJSONFile('users.json');
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please log in again.'
      });
    }
    
    // Attach user info to request
    req.userId = userId;
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Please log in again.'
    });
  }
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }
    
    // Read users from JSON file
    const users = readJSONFile('users.json');
    
    // Find user by email (case-insensitive)
    const user = users.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Verify password
    const isValidPassword = verifyPassword(password, user.password);
    
    // For demo purposes: also allow 'demo123' for any user
    if (!isValidPassword && password !== 'demo123') {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Generate token
    const token = generateToken(user.id);
    
    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      user: userWithoutPassword,
      token: token,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

app.post('/api/auth/signup', (req, res) => {
  try {
    const { name, email, password, company } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }
    
    // Name validation
    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters'
      });
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }
    
    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }
    
    // Read users from JSON file
    const users = readJSONFile('users.json');
    
    // Check if user already exists (case-insensitive)
    const existingUser = users.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please sign in instead.'
      });
    }
    
    // Create new user with long unique ID
    const newUser = {
      id: generateLongId(), // Generate UUID v4 long ID
      email: email.toLowerCase().trim(),
      name: name.trim(),
      password: hashPassword(password), // Hash password before storing
      role: 'user',
      isAdmin: false,
      plan: 'Starter', // Default plan
      credits: 1000, // Default credits for Starter plan
      totalCredits: 1000,
      company: (company || '').trim(),
      brandSetupCompleted: false, // New users must complete brand setup
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add user to array
    users.push(newUser);
    
    // Write back to file
    const saved = writeJSONFile('users.json', users);
    
    if (!saved) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create account. Please try again.'
      });
    }
    
    // Create initial dashboard stats for new user
    getOrCreateDashboardStats(newUser.id);
    
    // Add admin activity
    addAdminActivity(newUser.id, newUser.email, 'Created new account');
    
    // Generate token
    const token = generateToken(newUser.id);
    
    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      user: userWithoutPassword,
      token: token,
      message: 'Account created successfully! Welcome aboard!'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

// Helper function to get or create dashboard stats for a user
function getOrCreateDashboardStats(userId) {
  const stats = readJSONFile('dashboard-stats.json');
  let userStats = stats.find(s => s.userId === userId);
  
  if (!userStats) {
    userStats = {
      userId: userId,
      contentGenerated: 0,
      contentGeneratedThisMonth: 0,
      mostUsedTool: 'Social Media',
      mostUsedToolCount: 0,
      scheduledPosts: 0,
      lastUpdated: new Date().toISOString()
    };
    stats.push(userStats);
    writeJSONFile('dashboard-stats.json', stats);
  }
  
  return userStats;
}

// Helper function to update dashboard stats
function updateDashboardStats(userId, contentType, isScheduled = false) {
  const stats = readJSONFile('dashboard-stats.json');
  let userStats = stats.find(s => s.userId === userId);
  
  if (!userStats) {
    userStats = getOrCreateDashboardStats(userId);
  }
  
  // Update content generated
  userStats.contentGenerated += 1;
  
  // Update this month's count
  const now = new Date();
  const lastUpdated = new Date(userStats.lastUpdated);
  if (now.getMonth() === lastUpdated.getMonth() && now.getFullYear() === lastUpdated.getFullYear()) {
    userStats.contentGeneratedThisMonth += 1;
  } else {
    userStats.contentGeneratedThisMonth = 1;
  }
  
  // Update most used tool
  const toolCounts = {
    'Social Media': 0,
    'Ad Copy': 0,
    'Email': 0
  };
  
  // Count content types from content.json
  const content = readJSONFile('content.json');
  const userContent = content.filter(c => c.userId === userId);
  userContent.forEach(item => {
    if (item.type === 'Social Media') toolCounts['Social Media']++;
    else if (item.type === 'Ad Copy') toolCounts['Ad Copy']++;
    else if (item.type === 'Email') toolCounts['Email']++;
  });
  
  // Find most used tool
  const mostUsed = Object.entries(toolCounts).reduce((a, b) => 
    toolCounts[a[0]] > toolCounts[b[0]] ? a : b
  );
  userStats.mostUsedTool = mostUsed[0];
  userStats.mostUsedToolCount = mostUsed[1];
  
  // Update scheduled posts
  if (isScheduled) {
    userStats.scheduledPosts += 1;
  } else {
    // Count scheduled posts from content
    userStats.scheduledPosts = userContent.filter(c => c.status === 'Scheduled').length;
  }
  
  userStats.lastUpdated = new Date().toISOString();
  
  // Update in array
  const index = stats.findIndex(s => s.userId === userId);
  if (index >= 0) {
    stats[index] = userStats;
  } else {
    stats.push(userStats);
  }
  
  writeJSONFile('dashboard-stats.json', stats);
  return userStats;
}

// Helper function to add admin activity
function addAdminActivity(userId, userEmail, action) {
  const activities = readJSONFile('admin-activity.json');
  const newActivity = {
    id: getNextId(activities),
    userId: userId,
    userEmail: userEmail,
    action: action,
    timestamp: new Date().toISOString()
  };
  activities.unshift(newActivity); // Add to beginning
  // Keep only last 100 activities
  if (activities.length > 100) {
    activities.splice(100);
  }
  writeJSONFile('admin-activity.json', activities);
  return newActivity;
}

// User endpoints
app.get('/api/user/profile', authenticateToken, (req, res) => {
  try {
    // User is already attached to req by authenticateToken middleware
    const { password: _, ...userWithoutPassword } = req.user;
    
    res.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Dashboard stats endpoint
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const stats = getOrCreateDashboardStats(userId);
    
    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Content generation endpoints
app.post('/api/content/social-media', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const { platform, postType, topic, numberOfPosts, tone } = req.body;
    
    // Check user credits
    const user = req.user;
    
    const creditsNeeded = numberOfPosts === '1' ? 10 : numberOfPosts === '3' ? 25 : 40;
    
    if (user.credits < creditsNeeded) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credits'
      });
    }
    
    // Simulate AI generation delay
    setTimeout(() => {
      try {
        const mockPosts = [
          {
            id: Date.now(),
            content: `🚀 ${topic || 'Transform your marketing strategy with AI!'} Our latest features help you create content that converts in seconds. Try it today and see the difference.\n\nReady to level up your marketing game? Click the link in bio!`,
            hashtags: "#AIMarketing #MarketingTools #ContentCreation #DigitalMarketing #MarketingAutomation"
          },
          {
            id: Date.now() + 1,
            content: `💡 Did you know? ${topic || 'Businesses using AI for content creation save 20+ hours per week!'}\n\nImagine what you could do with that extra time. Our AI Marketing Assistant makes it possible.\n\nStart your free trial today! 👉 Link in bio`,
            hashtags: "#ProductivityHacks #MarketingTips #AItools #BusinessGrowth #TimeManagement"
          },
          {
            id: Date.now() + 2,
            content: `✨ Say goodbye to writer's block! ${topic || 'Our AI generates high-quality content for all your marketing needs.'}\n\nJoin 10,000+ happy marketers today 🎯`,
            hashtags: "#ContentMarketing #MarketingSolutions #AIAssistant #SocialMediaMarketing #GrowthHacking"
          },
        ];
        
        const generatedPosts = mockPosts.slice(0, parseInt(numberOfPosts) || 3);
        
        // Save to content.json
        const content = readJSONFile('content.json');
        generatedPosts.forEach((post, index) => {
          content.push({
            id: getNextId(content),
            userId: userId,
            type: 'Social Media',
            title: `${platform} post - ${topic || 'Generated content'}`,
            platform: platform,
            content: post.content,
            hashtags: post.hashtags,
            date: new Date().toISOString(),
            credits: creditsNeeded / generatedPosts.length,
            status: 'Draft'
          });
        });
        writeJSONFile('content.json', content);
        
        // Deduct credits
        user.credits -= creditsNeeded;
        user.updatedAt = new Date().toISOString();
        const users = readJSONFile('users.json');
        const userIndex = users.findIndex(u => u.id === userId);
        users[userIndex] = user;
        writeJSONFile('users.json', users);
        
        // Update dashboard stats
        updateDashboardStats(userId, 'Social Media', false);
        
        // Add admin activity
        addAdminActivity(userId, user.email, `Generated ${numberOfPosts} social media posts`);
        
        res.json({
          success: true,
          posts: generatedPosts,
          creditsUsed: creditsNeeded,
          remainingCredits: user.credits
        });
      } catch (error) {
        console.error('Error in social media generation callback:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }, 1500);
  } catch (error) {
    console.error('Social media generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.post('/api/content/ad-copy', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const user = req.user;
    const { platform, product, targetAudience, keyBenefit, cta } = req.body;
    
    const creditsNeeded = 30;
    
    if (user.credits < creditsNeeded) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credits'
      });
    }
    
    setTimeout(() => {
      try {
        const mockAds = [
          {
            id: 1,
            headline: `${product || 'AI Marketing Made Simple'}`,
            description: `${keyBenefit || 'Generate high-converting content in seconds.'} Join 10,000+ marketers saving 20+ hours per week with AI-powered tools.`,
            cta: cta || 'Start Free Trial'
          },
          {
            id: 2,
            headline: `Save 20+ Hours Per Week`,
            description: `Automate your content creation with AI. Create social posts, ads, and emails instantly. Perfect for ${targetAudience || 'marketers'}.`,
            cta: cta || 'Try It Free'
          },
          {
            id: 3,
            headline: `Marketing Automation That Works`,
            description: `${keyBenefit || 'Stop wasting time on content creation.'} Let AI do the heavy lifting while you focus on strategy. Get started today!`,
            cta: cta || 'Get Started Now'
          },
        ];
        
        // Save to content.json
        const content = readJSONFile('content.json');
        mockAds.forEach((ad, index) => {
          content.push({
            id: getNextId(content),
            userId: userId,
            type: 'Ad Copy',
            title: `${platform || 'Ad'} - ${ad.headline}`,
            platform: platform || 'Google Ads',
            content: `${ad.headline}\n\n${ad.description}\n\n${ad.cta}`,
            date: new Date().toISOString(),
            credits: creditsNeeded / mockAds.length,
            status: 'Draft'
          });
        });
        writeJSONFile('content.json', content);
        
        // Deduct credits
        user.credits -= creditsNeeded;
        user.updatedAt = new Date().toISOString();
        const users = readJSONFile('users.json');
        const userIndex = users.findIndex(u => u.id === userId);
        users[userIndex] = user;
        writeJSONFile('users.json', users);
        
        // Update dashboard stats
        updateDashboardStats(userId, 'Ad Copy', false);
        
        // Add admin activity
        addAdminActivity(userId, user.email, 'Generated ad copy');
        
        res.json({
          success: true,
          ads: mockAds,
          creditsUsed: creditsNeeded,
          remainingCredits: user.credits
        });
      } catch (error) {
        console.error('Error in ad-copy generation callback:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }, 1500);
  } catch (error) {
    console.error('Ad copy generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.post('/api/content/email', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const user = req.user;
    const { subject, purpose, tone } = req.body;
    
    const creditsNeeded = 25;
    
    if (user.credits < creditsNeeded) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credits'
      });
    }
    
    setTimeout(() => {
      try {
        const emailContent = {
          subject: subject || 'Transform Your Marketing with AI',
          body: `Hi there,\n\nI wanted to reach out and share something exciting with you. ${purpose || 'Our AI Marketing Assistant can help you create high-converting content in seconds.'}\n\nKey benefits:\n• Save 20+ hours per week\n• Generate content for all platforms\n• Maintain consistent brand voice\n• Scale your marketing efforts\n\nReady to get started? Click here to try it free!\n\nBest regards,\nThe Team`
        };
        
        // Save to content.json
        const content = readJSONFile('content.json');
        content.push({
          id: getNextId(content),
          userId: userId,
          type: 'Email',
          title: emailContent.subject,
          platform: 'Email',
          content: emailContent.body,
          date: new Date().toISOString(),
          credits: creditsNeeded,
          status: 'Draft'
        });
        writeJSONFile('content.json', content);
        
        // Deduct credits
        user.credits -= creditsNeeded;
        user.updatedAt = new Date().toISOString();
        const users = readJSONFile('users.json');
        const userIndex = users.findIndex(u => u.id === userId);
        users[userIndex] = user;
        writeJSONFile('users.json', users);
        
        // Update dashboard stats
        updateDashboardStats(userId, 'Email', false);
        
        // Add admin activity
        addAdminActivity(userId, user.email, 'Generated email campaign');
        
        res.json({
          success: true,
          email: emailContent,
          creditsUsed: creditsNeeded,
          remainingCredits: user.credits
        });
      } catch (error) {
        console.error('Error in email generation callback:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }, 1500);
  } catch (error) {
    console.error('Email generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// History endpoints
app.get('/api/content/history', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const { search, filter, page = 1, limit = 10 } = req.query;
    
    // Read content from JSON file
    const allContent = readJSONFile('content.json');
    
    // Filter by user ID
    let filtered = allContent.filter(item => item.userId === userId);
    
    // Apply search filter
    if (search) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply type filter
    if (filter && filter !== 'all') {
      filtered = filtered.filter(item => item.type === filter);
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedItems = filtered.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      items: paginatedItems,
      total: filtered.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filtered.length / parseInt(limit))
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Credits endpoints
app.get('/api/credits', authenticateToken, (req, res) => {
  try {
    const user = req.user;
    
    const usagePercentage = user.totalCredits > 0 
      ? ((user.totalCredits - user.credits) / user.totalCredits) * 100 
      : 0;
    
    res.json({
      success: true,
      credits: {
        current: user.credits,
        total: user.totalCredits,
        usagePercentage: Math.round(usagePercentage)
      }
    });
  } catch (error) {
    console.error('Get credits error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.get('/api/credits/transactions', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const content = readJSONFile('content.json');
    
    // Get user's content and create transactions
    const userContent = content
      .filter(item => item.userId === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 50) // Last 50 transactions
      .map(item => {
        // Check if it's a credit purchase
        if (item.type === 'Credit Purchase') {
          return {
            id: item.id,
            type: 'Purchased',
            amount: item.credits,
            description: item.title,
            date: new Date(item.date).toISOString().split('T')[0]
          };
        }
        // Regular usage transaction
        return {
          id: item.id,
          type: 'Used',
          amount: -item.credits,
          description: `${item.type} - ${item.title}`,
          date: new Date(item.date).toISOString().split('T')[0]
        };
      });
    
    res.json({
      success: true,
      transactions: userContent
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Purchase credits endpoint
app.post('/api/credits/purchase', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const { packageId, credits, amount } = req.body;
    
    if (!packageId || !credits || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Package ID, credits, and amount are required'
      });
    }
    
    // Validate credit packages
    const validPackages = {
      'starter': { credits: 1000, price: 29 },
      'growth': { credits: 5000, price: 79, bonus: 500 },
      'agency': { credits: 20000, price: 199, bonus: 2000 }
    };
    
    const packageInfo = validPackages[packageId];
    if (!packageInfo) {
      return res.status(400).json({
        success: false,
        message: 'Invalid package ID'
      });
    }
    
    // Verify amount matches package
    if (amount !== packageInfo.price) {
      return res.status(400).json({
        success: false,
        message: 'Amount does not match package price'
      });
    }
    
    // Update user credits
    const users = readJSONFile('users.json');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const user = users[userIndex];
    const totalCreditsToAdd = credits;
    
    // Add credits to user
    user.credits += totalCreditsToAdd;
    user.totalCredits += totalCreditsToAdd;
    user.updatedAt = new Date().toISOString();
    
    users[userIndex] = user;
    writeJSONFile('users.json', users);
    
    // Create transaction record in content.json (for transaction history)
    const content = readJSONFile('content.json');
    content.push({
      id: getNextId(content),
      userId: userId,
      type: 'Credit Purchase',
      title: `Purchased ${totalCreditsToAdd.toLocaleString()} credits`,
      platform: 'Payment',
      content: `Credit package: ${packageId}`,
      date: new Date().toISOString(),
      credits: totalCreditsToAdd,
      status: 'Completed',
      amount: amount
    });
    writeJSONFile('content.json', content);
    
    // Add admin activity
    addAdminActivity(userId, user.email, `Purchased ${totalCreditsToAdd.toLocaleString()} credits ($${amount})`);
    
    res.json({
      success: true,
      message: `Successfully purchased ${totalCreditsToAdd.toLocaleString()} credits!`,
      newCredits: user.credits,
      newTotalCredits: user.totalCredits,
      creditsAdded: totalCreditsToAdd
    });
  } catch (error) {
    console.error('Purchase credits error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Admin activity endpoint
app.get('/api/admin/activity', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const activities = readJSONFile('admin-activity.json');
    
    // Get most recent activities
    const recentActivities = activities
      .slice(0, parseInt(limit))
      .map(activity => ({
        ...activity,
        time: getTimeAgo(activity.timestamp)
      }));
    
    res.json({
      success: true,
      activities: recentActivities
    });
  } catch (error) {
    console.error('Get admin activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Helper function to get time ago string
function getTimeAgo(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now - time;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return time.toLocaleDateString();
}

// Admin endpoints
app.get('/api/admin/stats', authenticateToken, requireAdmin, (req, res) => {
  try {
    const users = readJSONFile('users.json');
    
    // Calculate stats from data
    const activeUsers = users.filter(u => !u.isAdmin && u.role === 'user').length;
    const totalCreditsUsed = users.reduce((sum, u) => sum + (u.totalCredits - u.credits), 0);
    const avgUsagePerUser = activeUsers > 0 ? Math.round(totalCreditsUsed / activeUsers) : 0;
    
    // Try to read from admin-stats.json, or use calculated values
    let stats = readJSONFile('admin-stats.json');
    if (!stats || !stats.activeUsers) {
      stats = {
        activeUsers: activeUsers,
        monthlyRevenue: 184920, // This would come from billing system
        creditsUsed: totalCreditsUsed,
        avgUsagePerUser: avgUsagePerUser,
        lastUpdated: new Date().toISOString()
      };
      writeJSONFile('admin-stats.json', stats);
    }
    
    res.json({
      success: true,
      stats: {
        activeUsers: stats.activeUsers || activeUsers,
        monthlyRevenue: stats.monthlyRevenue || 184920,
        creditsUsed: stats.creditsUsed || totalCreditsUsed,
        avgUsagePerUser: stats.avgUsagePerUser || avgUsagePerUser
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  try {
    const users = readJSONFile('users.json');
    
    const { search, filter } = req.query;
    
    // Remove passwords from user data
    let filtered = users.map(({ password, ...user }) => user);
    
    if (search) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        (user.name && user.name.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    if (filter && filter !== 'all') {
      filtered = filtered.filter(user => user.plan === filter);
    }
    
    res.json({
      success: true,
      users: filtered,
      total: filtered.length
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Plans endpoints
app.get('/api/admin/plans', (req, res) => {
  res.json({
    success: true,
    plans: [
      {
        id: 1,
        name: 'Starter',
        price: 29,
        credits: 1000,
        features: ['Social media content', 'Basic ad copy', 'Email templates'],
        active: true
      },
      {
        id: 2,
        name: 'Growth',
        price: 79,
        credits: 5000,
        features: ['All Starter features', 'Content calendar', 'AI images', 'Priority support'],
        active: true
      },
      {
        id: 3,
        name: 'Agency',
        price: 199,
        credits: 20000,
        features: ['All Growth features', 'Multi-user accounts', 'API access', '24/7 support'],
        active: true
      }
    ]
  });
});

// Credentials endpoints
app.get('/api/credentials', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const credentials = readJSONFile('credentials.json');
    
    // Get user's credentials
    const userCredentials = credentials.find(c => c.userId === userId);
    
    if (!userCredentials) {
      return res.json({
        success: true,
        credentials: {}
      });
    }
    
    // Return credentials without sensitive data (mask passwords)
    const safeCredentials = {};
    Object.keys(userCredentials).forEach(key => {
      if (key === 'userId' || key === 'updatedAt') return;
      if (key === 'whatsapp') {
        safeCredentials.whatsapp = {
          connected: userCredentials.whatsapp?.connected || false,
          qrCode: userCredentials.whatsapp?.qrCode || null
        };
      } else if (key.includes('password') || key.includes('Password')) {
        safeCredentials[key] = userCredentials[key] ? '••••••••' : null;
      } else {
        safeCredentials[key] = userCredentials[key];
      }
    });
    
    res.json({
      success: true,
      credentials: safeCredentials
    });
  } catch (error) {
    console.error('Get credentials error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.get('/api/credentials/email', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const credentials = readJSONFile('credentials.json');
    const userCredentials = credentials.find(c => c.userId === userId);
    
    if (!userCredentials || !userCredentials.email) {
      return res.json({
        success: true,
        credentials: null
      });
    }
    
    // Return actual values for editing (not masked)
    res.json({
      success: true,
      credentials: {
        email: userCredentials.email || '',
        smtpHost: userCredentials.smtpHost || '',
        smtpPort: userCredentials.smtpPort || '',
        smtpUsername: userCredentials.smtpUsername || '',
        smtpPassword: userCredentials.smtpPassword || '' // Return actual password for editing
      }
    });
  } catch (error) {
    console.error('Get email credentials error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.post('/api/credentials/email', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const { email, smtpHost, smtpPort, smtpUsername, smtpPassword } = req.body;
    
    // Validate required fields
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }
    
    // Validate SMTP settings (required for sending emails)
    if (!smtpHost || !smtpPort || !smtpUsername || !smtpPassword) {
      return res.status(400).json({
        success: false,
        message: 'All SMTP settings are required to send emails'
      });
    }
    
    // Validate SMTP port
    const port = parseInt(smtpPort);
    if (isNaN(port) || port < 1 || port > 65535) {
      return res.status(400).json({
        success: false,
        message: 'SMTP port must be a valid number between 1 and 65535'
      });
    }
    
    const credentials = readJSONFile('credentials.json');
    let userCredentials = credentials.find(c => c.userId === userId);
    
    if (!userCredentials) {
      userCredentials = { userId: userId };
      credentials.push(userCredentials);
    }
    
    // Update email credentials
    userCredentials.email = email;
    userCredentials.smtpHost = smtpHost;
    userCredentials.smtpPort = port.toString(); // Store as string but validated as number
    userCredentials.smtpUsername = smtpUsername;
    userCredentials.smtpPassword = smtpPassword; // In production, encrypt this
    userCredentials.updatedAt = new Date().toISOString();
    
    // Mark email as connected
    if (!userCredentials.email) {
      userCredentials.email = email;
    }
    
    const index = credentials.findIndex(c => c.userId === userId);
    if (index >= 0) {
      credentials[index] = userCredentials;
    } else {
      credentials.push(userCredentials);
    }
    
    writeJSONFile('credentials.json', credentials);
    
    res.json({
      success: true,
      message: 'Email credentials saved successfully'
    });
  } catch (error) {
    console.error('Save email credentials error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.get('/api/credentials/whatsapp', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const credentials = readJSONFile('credentials.json');
    const userCredentials = credentials.find(c => c.userId === userId);
    
    res.json({
      success: true,
      connected: !!(userCredentials && userCredentials.whatsapp && userCredentials.whatsapp.connected),
      qrCode: userCredentials?.whatsapp?.qrCode || null
    });
  } catch (error) {
    console.error('Get WhatsApp credentials error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.post('/api/credentials/whatsapp/qr', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const credentials = readJSONFile('credentials.json');
    let userCredentials = credentials.find(c => c.userId === userId);
    
    if (!userCredentials) {
      userCredentials = { userId: userId };
      credentials.push(userCredentials);
    }
    
    // Generate a mock QR code (in production, use actual WhatsApp Web API)
    // For demo, we'll create a data URL with a placeholder QR code
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
      <rect width="256" height="256" fill="white"/>
      <rect x="20" y="20" width="216" height="216" fill="none" stroke="#25D366" stroke-width="2"/>
      <text x="128" y="100" text-anchor="middle" font-size="16" fill="#25D366" font-weight="bold">WhatsApp</text>
      <text x="128" y="130" text-anchor="middle" font-size="12" fill="#666">QR Code</text>
      <text x="128" y="150" text-anchor="middle" font-size="10" fill="#999">Scan to connect</text>
      <circle cx="128" cy="180" r="30" fill="none" stroke="#25D366" stroke-width="2"/>
      <circle cx="128" cy="180" r="20" fill="none" stroke="#25D366" stroke-width="1"/>
    </svg>`;
    const qrCodeData = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;
    
    if (!userCredentials.whatsapp) {
      userCredentials.whatsapp = {};
    }
    
    userCredentials.whatsapp.qrCode = qrCodeData;
    userCredentials.whatsapp.qrGeneratedAt = new Date().toISOString();
    userCredentials.whatsapp.connected = false;
    userCredentials.updatedAt = new Date().toISOString();
    
    const index = credentials.findIndex(c => c.userId === userId);
    if (index >= 0) {
      credentials[index] = userCredentials;
    } else {
      credentials.push(userCredentials);
    }
    
    writeJSONFile('credentials.json', credentials);
    
    res.json({
      success: true,
      qrCode: qrCodeData,
      message: 'QR code generated successfully'
    });
  } catch (error) {
    console.error('Generate WhatsApp QR error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.delete('/api/credentials/whatsapp', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const credentials = readJSONFile('credentials.json');
    const userCredentials = credentials.find(c => c.userId === userId);
    
    if (userCredentials && userCredentials.whatsapp) {
      delete userCredentials.whatsapp;
      userCredentials.updatedAt = new Date().toISOString();
      
      const index = credentials.findIndex(c => c.userId === userId);
      credentials[index] = userCredentials;
      writeJSONFile('credentials.json', credentials);
    }
    
    res.json({
      success: true,
      message: 'WhatsApp disconnected successfully'
    });
  } catch (error) {
    console.error('Delete WhatsApp credentials error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.delete('/api/credentials/:platformId', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const { platformId } = req.params;
    const credentials = readJSONFile('credentials.json');
    const userCredentials = credentials.find(c => c.userId === userId);
    
    if (userCredentials && userCredentials[platformId]) {
      delete userCredentials[platformId];
      userCredentials.updatedAt = new Date().toISOString();
      
      const index = credentials.findIndex(c => c.userId === userId);
      credentials[index] = userCredentials;
      writeJSONFile('credentials.json', credentials);
    }
    
    res.json({
      success: true,
      message: 'Credentials removed successfully'
    });
  } catch (error) {
    console.error('Delete credentials error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Brand setup endpoint
app.post('/api/brand/setup', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const { brandName, industry, targetAudience, tone, language, keywords } = req.body;
    
    // Validation
    if (!brandName || !industry || !targetAudience || !tone || !language) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }
    
    // Update user's brand setup status
    const users = readJSONFile('users.json');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update user with brand setup data
    users[userIndex].brandSetupCompleted = true;
    users[userIndex].brandName = brandName;
    users[userIndex].brandIndustry = industry;
    users[userIndex].brandTargetAudience = targetAudience;
    users[userIndex].brandTone = tone;
    users[userIndex].brandLanguage = language;
    users[userIndex].brandKeywords = keywords || '';
    users[userIndex].updatedAt = new Date().toISOString();
    
    writeJSONFile('users.json', users);
    
    // Add admin activity
    addAdminActivity(userId, users[userIndex].email, 'Completed brand setup');
    
    res.json({
      success: true,
      message: 'Brand setup completed successfully!',
      brand: {
        name: brandName,
        industry,
        targetAudience,
        tone,
        language,
        keywords
      }
    });
  } catch (error) {
    console.error('Brand setup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;

