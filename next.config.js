/** @type {import('next').NextConfig} */

const nextConfig = {
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         // Prevents MIME type sniffing, reducing the risk of malicious uploads
  //         {
  //           key: 'X-Content-Type-Options',
  //           value: 'nosniff',
  //         },
  //         // Protects against clickjacking attacks by prevening your site from being embedded in iframes
  //         {
  //           key: 'X-Frame-Options',
  //           value: 'DENY',
  //         },
  //         // Controls how much referrer information is included with requests, balancing security and functionality
  //         {
  //           key: 'Referrer-Policy',
  //           value: 'strict-origin-when-cross-origin',
  //         },
  //       ],
  //     },
  //     {
  //       source: '/sw.js',
  //       headers: [
  //         // Ensures the service worker is interpreted correctly as JavaScript.
  //         {
  //           key: 'Content-Type',
  //           value: 'application/javascript; charset=utf-8',
  //         },
  //         // Prevents caching of the service worker, ensuring users always get the latest version.
  //         {
  //           key: 'Cache-Control',
  //           value: 'no-cache, no-store, must-revalidate',
  //         },
  //         //  Implements a strict Content Security Policy for the service worker, only allowing scripts from the same origin.
  //         {
  //           key: 'Content-Security-Policy',
  //           value: "default-src 'self'; script-src 'self'",
  //         },
  //       ],
  //     },
  //   ]
  // },
  
  output: 'export', // Static export only
  trailingSlash: true, // Static export only
  
  images: {
    unoptimized: true, // Static export only
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;