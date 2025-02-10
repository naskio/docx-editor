import React from 'react';
import type { Metadata } from 'next';
// styling
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css'; // These styles apply to every route in the application
import { ThemeProvider } from '@/components/theme-provider';

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
          {children}
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
