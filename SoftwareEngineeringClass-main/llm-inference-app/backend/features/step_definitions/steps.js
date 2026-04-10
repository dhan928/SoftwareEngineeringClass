const { Given, When, Then, After, Before, BeforeAll, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const path = require('path');

let browser, page;
let serverProcess = null;
let startedServer = false;
let requestHandlerAttached = false;

setDefaultTimeout(30 * 1000);

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForHttpOk(url, timeoutMs = 15000) {
  const start = Date.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) return;
    } catch (_) {
      // ignore until ready
    }
    if (Date.now() - start > timeoutMs) {
      throw new Error(`Timed out waiting for ${url}`);
    }
    await sleep(250);
  }
}

function startFrontendServer() {
  const frontendDir = path.resolve(__dirname, '..', '..', '..', 'frontend');
  const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  return spawn(cmd, ['http-server', '-p', '5500', '-c-1'], { cwd: frontendDir, stdio: 'inherit' });
}

function attachApiMocks() {
  if (requestHandlerAttached) return;
  requestHandlerAttached = true;

  page.on('request', (req) => {
    const url = req.url();
    const method = req.method();

    const corsHeaders = {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': '*',
      'access-control-allow-methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    };

    const respondJson = (status, obj) =>
      req.respond({
        status,
        contentType: 'application/json',
        headers: corsHeaders,
        body: JSON.stringify(obj),
      });

    // Allow frontend assets to load
    if (url.startsWith('http://localhost:5500/')) {
      req.continue();
      return;
    }

    // Handle CORS preflight for API calls
    if (method === 'OPTIONS' && url.startsWith('http://localhost:3000/api/v1/')) {
      req.respond({ status: 204, headers: corsHeaders, body: '' });
      return;
    }

    // Mock auth endpoints used by frontend
    if (url === 'http://localhost:3000/api/v1/auth/login' && method === 'POST') {
      respondJson(200, {
        success: true,
        message: 'Login successful',
        data: {
          token: 'fake-jwt-token',
          user: { userId: 'user-123', email: 'testuser@example.com' },
        },
      });
      return;
    }

    if (url === 'http://localhost:3000/api/v1/auth/register' && method === 'POST') {
      respondJson(201, {
        success: true,
        message: 'Account created successfully',
        data: { userId: 'user-123', email: 'testuser@example.com' },
      });
      return;
    }

    // Mock inference endpoints used by dashboard initialization
    if (url.startsWith('http://localhost:3000/api/v1/inference') && method === 'GET') {
      respondJson(200, { success: true, data: [] });
      return;
    }

    // Any unexpected request fails loudly so scenarios don't silently flake
    respondJson(500, { success: false, message: `Unmocked request: ${method} ${url}` });
  });
}

BeforeAll(async function() {
  // Ensure the frontend is being served for UI tests.
  // If something is already listening on :5500, reuse it.
  try {
    await waitForHttpOk('http://localhost:5500/index.html', 1500);
  } catch (_) {
    serverProcess = startFrontendServer();
    startedServer = true;
    await waitForHttpOk('http://localhost:5500/index.html', 15000);
  }
});

AfterAll(async function() {
  if (startedServer && serverProcess && !serverProcess.killed) {
    serverProcess.kill();
  }
});

Before(async function() {
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();

    await page.setRequestInterception(true);
    requestHandlerAttached = false;
    attachApiMocks();
  } catch (error) {
    console.error('Failed to launch browser:', error);
    throw error;
  }
});

After(async function() {
  if (browser) {
    await browser.close();
  }
});

// Given Steps
Given('I am a new user who is not logged in', async () => {
  // Browser already initialized in Before hook
});

Given('I am on the Login page', async () => {
  await page.goto('http://localhost:5500/login.html');
  await new Promise(r => setTimeout(r, 1000));
});

Given('I am on the Create Account page', async () => {
  await page.goto('http://localhost:5500/signup.html');
  await new Promise(r => setTimeout(r, 1000));
});

// When Steps
When('I navigate to the home URL', async () => {
  await page.goto('http://localhost:5500/index.html');
  await new Promise(r => setTimeout(r, 1000));
});

When('I enter a valid email and password', async function() {
  // Detect which page we're on
  const url = page.url();
  const email = url.includes('signup') ? `testuser_${Date.now()}@example.com` : 'testuser@example.com';
  
  try {
    await page.type('input[type="email"]', email, { delay: 50 });
    await page.type('input[type="password"]', 'TestPass123!', { delay: 50 });
  } catch (error) {
    console.error('Failed to enter credentials:', error);
    throw error;
  }
});

When('I click the Login button', async () => {
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 2000));
});

When('I click Submit', async () => {
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 2000));
});

When('I click the Logout button', async () => {
  // The frontend uses confirm() in logoutUser(); accept it automatically.
  page.once('dialog', async (dialog) => {
    try {
      await dialog.accept();
    } catch (_) {
      // ignore
    }
  });

  await page.click('#navLogoutBtn');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1000));
});

// Then Steps
Then('I should see {string} on the page', async (text) => {
  try {
    const content = await page.content();
    if (!content.includes(text)) {
      throw new Error(`Expected to see "${text}" on the page but did not`);
    }
  } catch (error) {
    console.error('Text not found:', error);
    throw error;
  }
});

Then('I should be redirected to my dashboard', async () => {
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 }).catch(() => {});
  const url = page.url();
  if (!url.includes('dashboard')) {
    throw new Error(`Expected dashboard URL but got: ${url}`);
  }
});

Then('I should be redirected to the home page', async () => {
  const url = page.url();
  if (!url.includes('index.html')) {
    throw new Error(`Expected home URL (index.html) but got: ${url}`);
  }
});

Then('my account should be created', async () => {
  const url = page.url();
  if (!url.includes('dashboard')) {
    throw new Error(`Account creation did not redirect to dashboard`);
  }
});

Then('I should be logged into the app', async () => {
  const url = page.url();
  if (!url.includes('dashboard')) {
    throw new Error(`Expected to be logged in but URL was: ${url}`);
  }
});
