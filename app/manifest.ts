import type { MetadataRoute } from 'next';

export const dynamic = 'force-static'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SendbyKatika',
    short_name: 'SendbyKatika',
    description: 'Send money to Africa without fees and at the best rates.',
    start_url: '/user/home',
    scope: '/',
    display: 'standalone',
    background_color: '#931ABD40',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/send_logo192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/send_logo512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}