import Provider from "@/lib/query/Provider";
import { ReduxProvider } from "@/lib/redux/Provider"; 
import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import ClientWrapper from "@/components/ClientWrapper";
import './globals.css';


const poppinsNormal = Poppins({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-poppins-normal'
});


export const metadata: Metadata = {
  title: "Katika Wallet",
  description: "Using Redux Toolkit + TailwindCss"
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
              {children}
            </ClientWrapper>
          </ReduxProvider>
        </Provider>
      </body>
    </html>
  );
}