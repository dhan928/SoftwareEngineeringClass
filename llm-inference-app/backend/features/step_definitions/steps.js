const { Given, When, Then, After, setDefaultTimeout } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');

setDefaultTimeout(30000);

let browser, page, isSignup;

Given('I am a new user who is not logged in', async () => {
  browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  page = await browser.newPage();
});

After(async () => {
  if (browser) await browser.close();
});

When('I navigate to the home URL', async () => {
  await page.goto('http://localhost:5500/index.html');
  await new Promise(r => setTimeout(r, 1000));
});

Then('I should see {string} on the page', async (text) => {
  await page.waitForSelector('body');
  const content = await page.evaluate(() => document.body.innerText);
  if (!content.includes(text)) {
    throw new Error(`Expected to see "${text}" on the page but did not`);
  }
});

Given('I am on the Login page', async () => {
  browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  page = await browser.newPage();
  isSignup = false;
  await page.goto('http://localhost:5500/login.html');
  await new Promise(r => setTimeout(r, 1000));
});

When('I enter a valid email and password', async () => {
  const email = isSignup ? `testuser_${Date.now()}@example.com` : 'cucumber_test@example.com';
  await page.type('input[type="email"]', email);
  await page.type('input[type="password"]', 'Test@1234');
});

When('I click the Login button', async () => {
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 3000));
});

Then('I should be redirected to my dashboard', async () => {
  const url = page.url();
  if (!url.includes('dashboard')) {
    throw new Error(`Expected dashboard URL but got: ${url}`);
  }
});

Given('I am on the Create Account page', async () => {
  browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  page = await browser.newPage();
  isSignup = true;
  await page.goto('http://localhost:5500/signup.html');
  await new Promise(r => setTimeout(r, 1000));
});

When('I click Submit', async () => {
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 3000));
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
