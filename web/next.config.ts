import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Remover configuração turbopack inválida
  },
  eslint: {
    // Durante o build, apenas avisos ao invés de erros
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Ignorar erros de TypeScript durante o build se necessário
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
