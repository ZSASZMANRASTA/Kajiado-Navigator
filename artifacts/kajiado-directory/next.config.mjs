/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Allow Replit preview iframe to embed the app
          { key: 'X-Frame-Options', value: 'ALLOWALL' },
          { key: 'Content-Security-Policy', value: "frame-ancestors *" },
          ...(process.env.NODE_ENV !== 'production'
            ? [{ key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' }]
            : []),
        ],
      },
    ];
  },
};

export default nextConfig;
