import React from "react";
// import RouteHandler from "./RouteHandler";
import Provider from "@/lib/query/Provider";
import { ReduxProvider } from "@/lib/redux/Provider"; 
import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import ClientWrapper from "@/components/ClientWrapper";
import './globals.css';
import ClientRouter from "./ClientRouter";

const poppinsNormal = Poppins({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-poppins-normal'
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://send.katika.io'),
  title: 'Katika Wallet',
  description: 'Envoyez de l’amour en Afrique, gratuitement. Jusqu’à 70 000 € par envoi, vers Mobile Money ou compte bancaire, à des taux imbattables. Recevez un cashback à chaque transaction avec Katika Wallet',
  openGraph: {
    title: 'Katika Wallet',
    description: 'Envoyez de l’amour en Afrique, gratuitement. Jusqu’à 70 000 € par envoi, vers Mobile Money ou compte bancaire, à des taux imbattables. Recevez un cashback à chaque transaction avec Katika Wallet',
    url: 'https://send.katika.io', // Replace with your domain
    siteName: 'Katika Wallet',
    images: [
      {
        url: '/logo_color.svg', // Replace with your image URL
        width: 1200,
        height: 630,
        alt: 'Katika Wallet ',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image', // Use 'summary_large_image' for a large image preview
    title: 'Katika Wallet',
    site: '@katikawallet', // Replace with your Twitter handle
    description: 'Envoyez de l’amour en Afrique, gratuitement. Jusqu’à 70 000 € par envoi, vers Mobile Money ou compte bancaire, à des taux imbattables. Recevez un cashback à chaque transaction avec Katika Wallet',
    images: ['/logo_color.svg'], // Replace with your image URL
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={`${poppinsNormal.className}`}>
        <Provider>
          <ReduxProvider>
            <ClientWrapper>
              <ClientRouter>{children}</ClientRouter>
            </ClientWrapper>
          </ReduxProvider>
        </Provider>
      </body>
    </html>
  );
}