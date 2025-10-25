/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Use SWC for faster minification
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header for security
  images: {
    domains: ['via.placeholder.com', 'picsum.photos', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 3600, // Cache images for 1 hour
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    scrollRestoration: true, // Better scroll restoration
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve server-side modules on the client
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        dns: false,
        http2: false,
        // Add googleapis and related modules to prevent client-side bundling
        googleapis: false,
        'google-auth-library': false,
        'googleapis-common': false,
        gtoken: false,
        jws: false,
        jwa: false,
      };
      
      // Exclude googleapis from client bundle
      config.externals = config.externals || [];
      config.externals.push({
        googleapis: 'googleapis',
        'google-auth-library': 'google-auth-library',
        'googleapis-common': 'googleapis-common',
      });
    }
    return config;
  },
}

module.exports = nextConfig
