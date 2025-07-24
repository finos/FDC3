import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testServer() {
  console.log('Testing FDC3 Security Server...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const health = await healthResponse.json();
    console.log('Health check result:', health);
    console.log('');

    // Test creating a symmetric key
    console.log('2. Testing symmetric key creation...');
    const keyResponse = await fetch(`${BASE_URL}/create-symmetric-key`, {
      method: 'POST',
    });
    const { symmetricKey } = await keyResponse.json();
    console.log('Symmetric key created:', symmetricKey.kid);
    console.log('');

    // Test getting public keys
    console.log('3. Testing public keys retrieval...');
    const keysResponse = await fetch(`${BASE_URL}/public-keys`);
    const { publicKeys } = await keysResponse.json();
    console.log(
      'Public keys:',
      publicKeys.map((key: any) => ({ kid: key.kid, alg: key.alg }))
    );
    console.log('');

    // Test signing a context
    console.log('4. Testing context signing...');
    const context = {
      type: 'fdc3.instrument',
      id: { ticker: 'AAPL' },
    };

    const signResponse = await fetch(`${BASE_URL}/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context,
        intent: 'ViewChart',
        channelId: 'channel-1',
      }),
    });
    const { signature } = await signResponse.json();
    console.log('Signature created:', signature.substring(0, 50) + '...');
    console.log('');

    // Test checking a signature
    console.log('5. Testing signature verification...');
    const checkResponse = await fetch(`${BASE_URL}/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jws: signature,
        context,
        intent: 'ViewChart',
        channelId: 'channel-1',
      }),
    });
    const { authenticity } = await checkResponse.json();
    console.log('Signature verification result:', authenticity);
    console.log('');

    // Test encryption
    console.log('6. Testing encryption...');
    const encryptResponse = await fetch(`${BASE_URL}/encrypt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context,
        symmetricKey,
      }),
    });
    const { encrypted } = await encryptResponse.json();
    console.log('Encrypted data:', encrypted.substring(0, 50) + '...');
    console.log('');

    // Test decryption
    console.log('7. Testing decryption...');
    const decryptResponse = await fetch(`${BASE_URL}/decrypt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        encrypted,
        symmetricKey,
      }),
    });
    const { decrypted } = await decryptResponse.json();
    console.log('Decrypted data:', decrypted);
    console.log('');

    console.log('✅ All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testServer().catch(console.error);
}
