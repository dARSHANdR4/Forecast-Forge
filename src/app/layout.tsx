import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppShell } from '@/components/app/app-shell';

export const metadata: Metadata = {
  title: 'Forecast Forge — AI-Powered No-Code Forecasting',
  description: 'Go from CSV to predictions without writing a single line of code. Upload data, explore, clean, train ML models, and forecast — all in your browser.',
  keywords: ['machine learning', 'forecasting', 'no-code', 'CSV', 'predictions', 'data science'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <AppShell>
          {children}
        </AppShell>
        <Toaster />
      </body>
    </html>
  );
}
