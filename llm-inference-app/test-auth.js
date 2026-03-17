// Test script for signup and login
const http = require('http');

function makeRequest(method, path, body) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: `/api/v1${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    body: JSON.parse(data)
                });
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function runTests() {
    console.log('=== Testing Signup and Login with Supabase ===\n');

    try {
        // Test 1: Signup
        console.log('1. Testing SIGNUP...');
        const testEmail = `test${Date.now()}@example.com`;
        const testPassword = 'TestPassword123!';
        
        const signupRes = await makeRequest('POST', '/auth/register', {
            email: testEmail,
            password: testPassword
        });

        console.log(`Status: ${signupRes.status}`);
        console.log('Response:', JSON.stringify(signupRes.body, null, 2));

        if (!signupRes.body.success) {
            console.log('❌ SIGNUP FAILED\n');
            return;
        }

        const userId = signupRes.body.data.userId;
        console.log('✅ SIGNUP SUCCESSFUL');
        console.log(`   User ID: ${userId}`);
        console.log(`   Email: ${signupRes.body.data.email}\n`);

        // Test 2: Login
        console.log('2. Testing LOGIN...');
        const loginRes = await makeRequest('POST', '/auth/login', {
            email: testEmail,
            password: testPassword
        });

        console.log(`Status: ${loginRes.status}`);
        console.log('Response:', JSON.stringify(loginRes.body, null, 2));

        if (!loginRes.body.success) {
            console.log('❌ LOGIN FAILED\n');
            return;
        }

        const token = loginRes.body.data.token;
        const user = loginRes.body.data.user;
        console.log('✅ LOGIN SUCCESSFUL');
        console.log(`   Token: ${token.substring(0, 50)}...`);
        console.log(`   User ID: ${user.userId}`);
        console.log(`   Email: ${user.email}\n`);

        // Test 3: Login with wrong password
        console.log('3. Testing LOGIN with Wrong Password...');
        const wrongPassRes = await makeRequest('POST', '/auth/login', {
            email: testEmail,
            password: 'WrongPassword123!'
        });

        console.log(`Status: ${wrongPassRes.status}`);
        if (!wrongPassRes.body.success) {
            console.log('✅ Correctly rejected wrong password');
            console.log(`   Error: ${wrongPassRes.body.message}\n`);
        } else {
            console.log('❌ Should have rejected wrong password\n');
        }

        console.log('=== All Tests Completed Successfully! ===');

    } catch (error) {
        console.error('Error:', error.message);
    }
}

runTests();
