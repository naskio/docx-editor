import React from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css'; // These styles apply to every route in the application

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
    <html lang='en'>
      <body className={fontClassNames}>{children}</body>
    </html>
  );
}
