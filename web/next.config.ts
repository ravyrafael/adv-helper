import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configurações experimentais
  experimental: {
    // Configurações para serverless functions se necessário
  },

  // ESLint: permitir warnings em builds
  eslint: {
    ignoreDuringBuilds: false,
  },

  // TypeScript: permitir warnings em builds
  typescript: {
    ignoreBuildErrors: false,
  },

  // Injetar variáveis de ambiente no cliente
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    CUSTOM_KEY: 'next-config-loaded',
  },

  // Headers CORS para API routes (se necessário)
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
