import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ToastProvider } from '@/lib/toast';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AdvHelper - Assistência Jurídica com IA',
  description:
    'Plataforma de assistência jurídica que utiliza IA para analisar documentos PDF, identificar pontos críticos e acelerar a criação de petições.',
  keywords: [
    'advogado',
    'petição',
    'IA',
    'análise',
    'documentos',
    'jurídico',
    'assistência',
  ],
  authors: [{ name: 'AdvHelper' }],
  creator: 'AdvHelper',
  publisher: 'AdvHelper',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001',
  ),
  openGraph: {
    title: 'AdvHelper - Assistência Jurídica com IA',
    description:
      'Encontre pontos críticos em documentos jurídicos em segundos com nossa IA especializada.',
    url: '/',
    siteName: 'AdvHelper',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AdvHelper - Assistência Jurídica com IA',
    description:
      'Encontre pontos críticos em documentos jurídicos em segundos com nossa IA especializada.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ToastProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
