/**
 * Next.js Configuration
 * Includes settings for Tor compatibility and environment variables
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Enable image optimization
  images: {
    domains: ['localhost'],
  },
  
  // Environment variables available to the client
  publicRuntimeConfig: {
    // Will be available on both server and client
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    isTorEnabled: process.env.NEXT_PUBLIC_TOR_ENABLED === 'true',
    onionAddress: process.env.NEXT_PUBLIC_ONION_ADDRESS || '',
  },
  
  // Server-side environment variables
  serverRuntimeConfig: {
    // Will only be available on the server side
    torProxyUrl: process.env.TOR_PROXY_URL || 'socks5h://127.0.0.1:9050',
  },
  
  // Custom webpack configuration for Tor compatibility
  webpack: (config, { isServer }) => {
    // Add polyfills for Tor compatibility
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        zlib: require.resolve('browserify-zlib'),
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify/browser'),
      };
    }
    
    return config;
  },
  
  // Custom headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 