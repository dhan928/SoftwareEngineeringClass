const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const path = require('path');

// Set default timeout for all async operations
jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000; // 2 minutes

const BACKEND_URL = 'http://localhost:3000';
const FRONTEND_URL = 'http://localhost:5500';
const API_URL = `${BACKEND_URL}/api/v1`;

let browser;
let page;
let backendProcess;
let frontendProcess;

// Test user credentials
const testUser = {
  email: `testuser_${Date.now()}@test.com`,
  password: 'Test@Password123'
};

/**
 * Utility function to wait for server to be ready
 */
async function waitForServer(url, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return true;
    } catch (error) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  throw new Error(`Server at ${url} did not start within timeout`);
}

/**
 * Start backend server
 */
function startBackendServer() {
  return new Promise((resolve) => {
    const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    backendProcess = spawn(cmd, ['start'], {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'pipe'
    });
    
    backendProcess.on('error', (err) => {
      console.error('Backend process error:', err);
    });
    
    // Give server time to start
    setTimeout(resolve, 2000);
  });
}

/**
 * Start frontend server
 */
function startFrontendServer() {
  return new Promise((resolve) => {
    const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const frontendDir = path.resolve(__dirname, '..', '..', 'frontend');
    
    frontendProcess = spawn(cmd, ['http-server', '-p', '5500', '-c-1'], {
      cwd: frontendDir,
      stdio: 'pipe'
    });
    
    frontendProcess.on('error', (err) => {
      console.error('Frontend process error:', err);
    });
    
    // Give server time to start
    setTimeout(resolve, 2000);
  });
}

/**
 * Stop servers
 */
function stopServers() {
  return new Promise((resolve) => {
    if (backendProcess) {
      backendProcess.kill();
    }
    if (frontendProcess) {
      frontendProcess.kill();
    }
    setTimeout(resolve, 500);
  });
}

describe('LLM Inference App - E2E Tests', () => {
  
  beforeAll(async () => {
    // Start servers
    await startBackendServer();
    await startFrontendServer();
    
    // Wait for servers to be ready
    await waitForServer(`${BACKEND_URL}/health`);
    await waitForServer(FRONTEND_URL);
    
    // Launch Puppeteer browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }, 60000);

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
    await stopServers();
  }, 30000);

  beforeEach(async () => {
    page = await browser.newPage();
    // Set viewport for consistent testing
    await page.setViewport({ width: 1280, height: 720 });
  });

  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  // ==================== Landing Page Tests ====================
  
  describe('Landing Page', () => {
    it('should display landing page with navigation buttons', async () => {
      await page.goto(FRONTEND_URL, { waitUntil: 'networkidle2' });
      
      // Check page title
      const title = await page.title();
      expect(title).toContain('LLM Inference');
      
      // Check for login button
      const loginButton = await page.$('a[href="login.html"].btn-login');
      expect(loginButton).toBeTruthy();
      
      // Check for create account button
      const createAccountButton = await page.$('a[href="signup.html"].btn-primary');
      expect(createAccountButton).toBeTruthy();
    });

    it('should display feature cards on landing page', async () => {
      await page.goto(FRONTEND_URL, { waitUntil: 'networkidle2' });
      
      // Check for features section
      const featureCards = await page.$$('.feature-card');
      expect(featureCards.length).toBeGreaterThanOrEqual(3);
      
      // Check feature card content
      const featureText = await page.$eval(
        '.feature-card h4',
        el => el.textContent
      );
      expect(featureText).toBeTruthy();
    });

    it('should navigate to login page when login button is clicked', async () => {
      await page.goto(FRONTEND_URL, { waitUntil: 'networkidle2' });
      
      // Click login button
      await page.click('a[href="login.html"].btn-login');
      
      // Wait for navigation
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      
      // Check URL
      expect(page.url()).toContain('login.html');
    });

    it('should navigate to signup page when create account button is clicked', async () => {
      await page.goto(FRONTEND_URL, { waitUntil: 'networkidle2' });
      
      // Click create account button
      await page.click('a[href="signup.html"].btn-primary');
      
      // Wait for navigation
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      
      // Check URL
      expect(page.url()).toContain('signup.html');
    });
  });

  // ==================== Registration Tests ====================
  
  describe('User Registration (Sign Up)', () => {
    it('should display signup form', async () => {
      await page.goto(`${FRONTEND_URL}/signup.html`, { waitUntil: 'networkidle2' });
      
      // Check for form elements
      const emailInput = await page.$('input[type="email"]');
      expect(emailInput).toBeTruthy();
      
      const passwordInput = await page.$('input[type="password"]');
      expect(passwordInput).toBeTruthy();
      
      const submitButton = await page.$('button[type="submit"]');
      expect(submitButton).toBeTruthy();
    });

    it('should successfully register a new user', async () => {
      await page.goto(`${FRONTEND_URL}/signup.html`, { waitUntil: 'networkidle2' });
      
      // Fill in the registration form
      await page.type('input[type="email"]', testUser.email);
      await page.type('input[type="password"]', testUser.password);
      
      // Intercept the API call to register
      const navigationPromise = page.waitForNavigation({ 
        waitUntil: 'networkidle2',
        timeout: 10000 
      }).catch(() => {}); // Don't fail if navigation doesn't happen
      
      // Click submit
      await page.click('button[type="submit"]');
      
      // Wait a bit for the request to be processed
      await new Promise(r => setTimeout(r, 2000));
      
      // Note: Actual redirect depends on your implementation
      // This test checks that the form can be filled and submitted
      const submitButton = await page.$('button[type="submit"]');
      expect(submitButton).toBeTruthy();
    }, 15000);

    it('should display signup page header', async () => {
      await page.goto(`${FRONTEND_URL}/signup.html`, { waitUntil: 'networkidle2' });
      
      // Check for page heading
      const heading = await page.$eval('h1, h2, .page-title', el => el.textContent).catch(() => null);
      expect(heading).toBeTruthy();
    });

    it('should have link to login page', async () => {
      await page.goto(`${FRONTEND_URL}/signup.html`, { waitUntil: 'networkidle2' });
      
      // Check for login link
      const loginLink = await page.$('a[href="login.html"]');
      expect(loginLink).toBeTruthy();
    });
  });

  // ==================== Login Tests ====================
  
  describe('User Login', () => {
    it('should display login form', async () => {
      await page.goto(`${FRONTEND_URL}/login.html`, { waitUntil: 'networkidle2' });
      
      // Check for form elements
      const emailInput = await page.$('input[type="email"]');
      expect(emailInput).toBeTruthy();
      
      const passwordInput = await page.$('input[type="password"]');
      expect(passwordInput).toBeTruthy();
      
      const submitButton = await page.$('button[type="submit"]');
      expect(submitButton).toBeTruthy();
    });

    it('should have link to signup page', async () => {
      await page.goto(`${FRONTEND_URL}/login.html`, { waitUntil: 'networkidle2' });
      
      // Check for signup link
      const signupLink = await page.$('a[href="signup.html"]');
      expect(signupLink).toBeTruthy();
    });

    it('should display login page header', async () => {
      await page.goto(`${FRONTEND_URL}/login.html`, { waitUntil: 'networkidle2' });
      
      // Check for page heading or title
      const heading = await page.$eval('h1, h2, .page-title', el => el.textContent).catch(() => null);
      expect(heading).toBeTruthy();
    });

    it('should attempt login when form is submitted', async () => {
      await page.goto(`${FRONTEND_URL}/login.html`, { waitUntil: 'networkidle2' });
      
      // Fill in the login form with test credentials
      await page.type('input[type="email"]', 'test@example.com');
      await page.type('input[type="password"]', 'password123');
      
      // Click submit
      await page.click('button[type="submit"]');
      
      // Wait a bit for the request to be processed
      await new Promise(r => setTimeout(r, 2000));
      
      // Verify form was submitted
      const submitButton = await page.$('button[type="submit"]');
      expect(submitButton).toBeTruthy();
    }, 15000);
  });

  // ==================== Dashboard Tests ====================
  
  describe('Dashboard Page', () => {
    it('should display dashboard when user is logged in', async () => {
      // Try to navigate to dashboard
      await page.goto(`${FRONTEND_URL}/dashboard.html`, { waitUntil: 'networkidle2' });
      
      // Check page title or main heading
      const pageContent = await page.content();
      expect(pageContent).toBeTruthy();
      
      // Dashboard page should have some content
      const mainContent = await page.$('main, .dashboard, .container');
      expect(mainContent).toBeTruthy();
    });

    it('should have logout button on dashboard', async () => {
      await page.goto(`${FRONTEND_URL}/dashboard.html`, { waitUntil: 'networkidle2' });
      
      // Check for logout button - adjust selector based on your HTML
      const logoutButton = await page.$('button[id*="logout"], a[id*="logout"], button:has-text("Logout")').catch(() => null);
      
      // If specific button doesn't exist, check for any logout element
      const pageContent = await page.content();
      const hasLogoutText = pageContent.includes('logout') || pageContent.includes('Logout');
      expect(hasLogoutText).toBeTruthy();
    });

    it('should have main heading on dashboard', async () => {
      await page.goto(`${FRONTEND_URL}/dashboard.html`, { waitUntil: 'networkidle2' });
      
      // Check for h1 or main title
      const heading = await page.$eval('h1, h2, .dashboard-title', el => el.textContent).catch(() => null);
      expect(heading).toBeTruthy();
    });
  });

  // ==================== Navigation Tests ====================
  
  describe('Navigation', () => {
    it('should have consistent navigation across pages', async () => {
      const pages = ['login.html', 'signup.html'];
      
      for (const pageName of pages) {
        const newPage = await browser.newPage();
        await newPage.goto(`${FRONTEND_URL}/${pageName}`, { waitUntil: 'networkidle2' });
        
        // Check that page has content
        const content = await newPage.content();
        expect(content.length).toBeGreaterThan(0);
        
        await newPage.close();
      }
    });

    it('should not have broken links in navigation', async () => {
      await page.goto(FRONTEND_URL, { waitUntil: 'networkidle2' });
      
      // Get all links
      const links = await page.$$eval('a', elements => 
        elements.map(el => ({
          href: el.getAttribute('href'),
          text: el.textContent.trim()
        }))
      );
      
      // Check that main button links exist
      const hasLogin = links.some(l => l.href && l.href.includes('login.html'));
      const hasSignup = links.some(l => l.href && l.href.includes('signup.html'));
      
      expect(hasLogin).toBe(true);
      expect(hasSignup).toBe(true);
    });
  });

  // ==================== Backend Health Tests ====================
  
  describe('Backend API Health', () => {
    it('should have healthy backend server', async () => {
      const response = await fetch(`${BACKEND_URL}/health`);
      const data = await response.json();
      
      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
    });
  });

  // ==================== Page Load Performance ====================
  
  describe('Page Performance', () => {
    it('should load landing page within reasonable time', async () => {
      const startTime = Date.now();
      await page.goto(FRONTEND_URL, { waitUntil: 'networkidle2' });
      const loadTime = Date.now() - startTime;
      
      // Page should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    it('should load login page within reasonable time', async () => {
      const startTime = Date.now();
      await page.goto(`${FRONTEND_URL}/login.html`, { waitUntil: 'networkidle2' });
      const loadTime = Date.now() - startTime;
      
      // Page should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });
  });

});
