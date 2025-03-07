import { ReduxProvider } from "@/lib/redux/Provider"; 
import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import ClientWrapper from "@/components/ClientWrapper";
import './globals.css'


const poppinsNormal = Poppins({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-poppins-normal'
});


export const metadata: Metadata = {
  title: "Katika Wallet NextJs + Redux App",
  description: "Using Redux Toolkit + TailwindCss"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppinsNormal.variable} font-poppins_normal`}>
        <ReduxProvider>
          <ClientWrapper>
            {children}
          </ClientWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}