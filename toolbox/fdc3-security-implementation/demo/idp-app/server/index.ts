import express from 'express';
import ViteExpress from 'vite-express';
import path from 'path';
import session from 'express-session';

// Extend session interface
declare module 'express-session' {
  interface SessionData {
    userId: string;
    isAuthenticated: boolean;
  }
}

const PORT = 4005;
const app = express();

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Session configuration
app.use(
  session({
    secret: 'fdc3-idp-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

console.log('Session middleware configured');

// Middleware to parse JSON
app.use(express.json());
console.log('JSON parsing middleware configured');

// Login endpoint
app.post('/api/login', (req, res) => {
  console.log('Login endpoint called');
  console.log('Request body:', req.body);
  console.log('Session before login:', req.session);

  // For demo purposes, always authenticate as 'demo-user'
  req.session.userId = 'demo-user';
  req.session.isAuthenticated = true;

  console.log('Session after login:', req.session);

  const response = {
    success: true,
    user: {
      id: 'demo-user',
      name: 'Demo User',
    },
  };

  console.log('Sending login response:', response);
  res.json(response);
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  console.log('Logout endpoint called');
  console.log('Session before logout:', req.session);

  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      res.status(500).json({ success: false, error: 'Failed to logout' });
    } else {
      console.log('Logout successful');
      res.json({ success: true });
    }
  });
});

// Check authentication status
app.get('/api/auth/status', (req, res) => {
  console.log('Auth status endpoint called');
  console.log('Session:', req.session);
  console.log('Session ID:', req.sessionID);

  if (req.session.isAuthenticated) {
    const response = {
      isAuthenticated: true,
      user: {
        id: req.session.userId,
        name: 'Demo User',
      },
    };
    console.log('User is authenticated, sending response:', response);
    res.json(response);
  } else {
    const response = {
      isAuthenticated: false,
      user: null,
    };
    console.log('User is not authenticated, sending response:', response);
    res.json(response);
  }
});

// Start server with ViteExpress
const httpServer = ViteExpress.listen(app, PORT, () => {
  console.log('==========================================');
  console.log(`🚀 IDP App server running on http://localhost:${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, '..')}`);
  console.log('📋 Available endpoints:');
  console.log('   POST /api/login - Login user');
  console.log('   POST /api/logout - Logout user');
  console.log('   GET  /api/auth/status - Check auth status');
  console.log('==========================================');
});

export default app;
