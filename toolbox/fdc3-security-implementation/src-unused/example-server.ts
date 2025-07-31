import { createFDC3SecurityServer, provisionJWKS } from './server';

async function main() {
  // Configuration for the FDC3 Security Server
  const config = {
    port: 3000,
    jwksUrl: 'https://example.com/.well-known/jwks.json', // Replace with your actual JWKS URL
    publicKeyResolver: (url: string) => provisionJWKS(url),
    allowListFunction: (url: string) => {
      // Implement your allowlist logic here
      // For example, only allow specific domains
      const allowedDomains = ['example.com', 'trusted-domain.com'];
      try {
        const domain = new URL(url).hostname;
        return allowedDomains.includes(domain);
      } catch {
        return false;
      }
    },
    validityTimeLimit: 300, // 5 minutes in seconds
  };

  try {
    console.log('Starting FDC3 Security Server...');
    const server = await createFDC3SecurityServer(config);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\nReceived SIGINT, shutting down gracefully...');
      server.stop();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\nReceived SIGTERM, shutting down gracefully...');
      server.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Run the server if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}
