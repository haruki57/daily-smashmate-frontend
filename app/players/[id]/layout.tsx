import '@/app/ui/global.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | デイリースマメイト',
    default: 'デイリースマメイト',
  },
  description:
    'デイリースマメイトは、スマメイト27期以降の戦績を閲覧できるサービスです。',
  metadataBase: process.env.URL ? new URL(process.env.URL) : undefined,
  formatDetection: {
    telephone: false,
  },
};

export default function playerPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container mx-auto">{children}</div>;
}
