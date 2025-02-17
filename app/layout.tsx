import React from 'react';
import type { Metadata } from 'next';
// fonts
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
// These styles apply to every route in the application
import './globals.css';

// Define the font classes
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontClassNames = `${geistSans.variable} ${geistMono.variable} antialiased`;

  return (
    <html lang='en' suppressHydrationWarning>
      <body className={fontClassNames}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

// HTML metadata
export const metadata: Metadata = {
  title: {
    template: `%s | Docx Editor`,
    default: `Docx Editor`,
  },
  description: `Browser-based editor for creating .docx files using JS/TS with live preview`,
};
