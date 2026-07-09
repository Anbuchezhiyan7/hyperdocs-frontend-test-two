import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/providers';
import { Suspense } from 'react';
import { Plus_Jakarta_Sans, Open_Sans, Poppins, Lora } from 'next/font/google';
import Loader from '@/components/common/Loader';
import { headers } from 'next/headers';


export const metadata: Metadata = {
  title: 'Hyperblog',
  description: 'Hyperblog',
  icons: {
    icon: '/favicon.ico?v=3',
    shortcut: '/favicon.ico?v=3',
    apple: '/apple-icon.ico?v=3',
  },
  manifest: '/manifest.json',
};
const PlusJakartaSans = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-plus-jakarta-sans',
    preload: true,
    fallback: ['system-ui', 'Arial'],
});

const OpenSans = Open_Sans({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    style: ['normal', 'italic'],
    display: 'swap',
    variable: '--font-open-sans',
    preload: false,
    fallback: ['system-ui', 'Arial'],
});

const PoppinsFont = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    style: ['normal', 'italic'],
    display: 'swap',
    variable: '--font-poppins',
    preload: false,
    fallback: ['system-ui', 'Arial'],
});

const LoraFont = Lora({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    style: ['normal', 'italic'],
    display: 'swap',
    variable: '--font-lora',
    preload: false,
    fallback: ['serif'],
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const debugDataStr = headerList.get('x-middleware-debug');
  let debugData = null;
  if (debugDataStr) {
      try {
          debugData = JSON.parse(debugDataStr);
      } catch (e) {}
  }
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://hyperblog-backend-production-930673226563.asia-south1.run.app" crossOrigin="anonymous" />
        {/* KaTeX CSS — loaded non-render-blocking: media="print" defers download priority,
            onLoad swaps it to media="all" so styles apply once downloaded without blocking LCP */}
        <link
          rel="preload"
          as="style"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
          integrity="sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
          integrity="sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+"
          crossOrigin="anonymous"
          media="print"
          // @ts-ignore – onLoad is valid on <link> in browsers; TS doesn't model this
          onLoad="this.media='all'"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
            integrity="sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+"
            crossOrigin="anonymous"
          />
        </noscript>
      </head>
      <body className={`${PlusJakartaSans.variable} ${OpenSans.variable} ${PoppinsFont.variable} ${LoraFont.variable} ${PlusJakartaSans.className}`}>
        <Providers>
          <Suspense fallback={<Loader />}>{children}</Suspense>
        </Providers>
        {debugData && (
          <div id="check-host-api" className='hidden'>
           {/* {JSON.stringify(debugData, null, 2)} */}
          </div>
        )}
      </body>
    </html>
  );
}
