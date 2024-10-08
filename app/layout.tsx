import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { RootHeader } from './_components/RootHeader';
import { RootFooter } from './_components/RootFooter';
import { GoogleAnalytics } from '@next/third-parties/google';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  title: {
    template: '%s | デイリースマメイト',
    default: 'デイリースマメイト',
  },
  description:
    'デイリースマメイトは、スマメイト27期以降の戦績を閲覧できるサービスです。',
  metadataBase: new URL('https://daily-smashmate.harukisb.net'),
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/apple-touch-icon.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    images: '/og.png',
    siteName: 'デイリースマメイト',
    type: 'website',
  },
  twitter: {
    card: 'summary',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={`${inter.className} flex min-h-screen flex-col antialiased`}
      >
        <RootHeader />
        <div className="container mx-auto w-screen max-w-4xl">{children}</div>
        <RootFooter />
      </body>
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}
