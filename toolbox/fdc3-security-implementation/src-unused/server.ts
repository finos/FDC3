import express from 'express';
import { LocalFDC3Security, JWKSResolver, createLocalFDC3Security, provisionJWKS } from './LocalFDC3Security';
import { Context, SymmetricKeyResponse } from '@finos/fdc3-context';
import { JSONWebEncryption, JSONWebSignature } from '@finos/fdc3-security';

interface ServerConfig {
  port?: number;
  jwksUrl: string;
  publicKeyResolver: (url: string) => JWKSResolver;
  allowListFunction: (url: string) => boolean;
  validityTimeLimit?: number;
  signingKeyId?: string;
  wrappingKeyId?: string;
}

export class FDC3SecurityServer {
  private app: express.Application;
  private security: LocalFDC3Security;
  private port: number;

  constructor(config: ServerConfig) {
    this.app = express();
    this.port = config.port || 3000;

    // Initialize security instance
    this.security = new LocalFDC3Security(
      {} as JsonWebKey, // Will be set in initialize()
      {} as JsonWebKey,
      {} as JsonWebKey,
      {} as JsonWebKey,
      config.jwksUrl,
      config.publicKeyResolver,
      config.allowListFunction,
      config.validityTimeLimit
    );

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', service: 'FDC3 Security Server' });
    });

    // Encrypt endpoint
    this.app.post('/encrypt', async (req, res) => {
      try {
        const { context, symmetricKey } = req.body;

        if (!context || !symmetricKey) {
          return res.status(400).json({
            error: 'Missing required parameters: context and symmetricKey',
          });
        }

        const result = await this.security.encrypt(context, symmetricKey);
        res.json({ encrypted: result });
      } catch (error) {
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Encryption failed',
        });
      }
    });

    // Decrypt endpoint
    this.app.post('/decrypt', async (req, res) => {
      try {
        const { encrypted, symmetricKey } = req.body;

        if (!encrypted || !symmetricKey) {
          return res.status(400).json({
            error: 'Missing required parameters: encrypted and symmetricKey',
          });
        }

        const result = await this.security.decrypt(encrypted, symmetricKey);
        res.json({ decrypted: result });
      } catch (error) {
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Decryption failed',
        });
      }
    });

    // Sign endpoint
    this.app.post('/sign', async (req, res) => {
      try {
        const { context, intent, channelId } = req.body;

        if (!context) {
          return res.status(400).json({
            error: 'Missing required parameter: context',
          });
        }

        const result = await this.security.sign(context, intent || null, channelId || null);
        res.json({ signature: result });
      } catch (error) {
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Signing failed',
        });
      }
    });

    // Check signature endpoint
    this.app.post('/check', async (req, res) => {
      try {
        const { jws, context, intent, channelId } = req.body;

        if (!jws || !context) {
          return res.status(400).json({
            error: 'Missing required parameters: jws and context',
          });
        }

        const result = await this.security.check(jws, context, intent || null, channelId || null);
        res.json({ authenticity: result });
      } catch (error) {
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Signature check failed',
        });
      }
    });

    // Create symmetric key endpoint
    this.app.post('/create-symmetric-key', async (req, res) => {
      try {
        const result = await this.security.createSymmetricKey();
        res.json({ symmetricKey: result });
      } catch (error) {
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Symmetric key creation failed',
        });
      }
    });

    // Wrap key endpoint
    this.app.post('/wrap-key', async (req, res) => {
      try {
        const { symmetricKey, publicKeyUrl } = req.body;

        if (!symmetricKey || !publicKeyUrl) {
          return res.status(400).json({
            error: 'Missing required parameters: symmetricKey and publicKeyUrl',
          });
        }

        const result = await this.security.wrapKey(symmetricKey, publicKeyUrl);
        res.json({ wrappedKey: result });
      } catch (error) {
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Key wrapping failed',
        });
      }
    });

    // Unwrap key endpoint
    this.app.post('/unwrap-key', async (req, res) => {
      try {
        const { symmetricKeyResponse } = req.body;

        if (!symmetricKeyResponse) {
          return res.status(400).json({
            error: 'Missing required parameter: symmetricKeyResponse',
          });
        }

        const result = await this.security.unwrapKey(symmetricKeyResponse);
        res.json({ unwrappedKey: result });
      } catch (error) {
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Key unwrapping failed',
        });
      }
    });

    // Get public keys endpoint
    this.app.get('/public-keys', (req, res) => {
      try {
        const result = this.security.getPublicKeys();
        res.json({ publicKeys: result });
      } catch (error) {
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Failed to get public keys',
        });
      }
    });

    // Error handling middleware
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Server error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
  }

  async initialize(): Promise<void> {
    // Create a new security instance with auto-generated keys
    this.security = await createLocalFDC3Security(
      this.security.jwksUrl,
      this.security.publicKeyResolver,
      this.security.allowListFunction,
      this.security.validityTimeLimit
    );
  }

  async start(): Promise<void> {
    await this.initialize();

    return new Promise(resolve => {
      this.app.listen(this.port, () => {
        console.log(`FDC3 Security Server running on port ${this.port}`);
        console.log(`Health check: http://localhost:${this.port}/health`);
        console.log(`Available endpoints:`);
        console.log(`  POST /encrypt`);
        console.log(`  POST /decrypt`);
        console.log(`  POST /sign`);
        console.log(`  POST /check`);
        console.log(`  POST /create-symmetric-key`);
        console.log(`  POST /wrap-key`);
        console.log(`  POST /unwrap-key`);
        console.log(`  GET  /public-keys`);
        resolve();
      });
    });
  }

  stop(): void {
    // Add graceful shutdown logic if needed
    console.log('FDC3 Security Server stopped');
  }
}

// Factory function to create and start the server
export async function createFDC3SecurityServer(config: ServerConfig): Promise<FDC3SecurityServer> {
  const server = new FDC3SecurityServer(config);
  await server.start();
  return server;
}
