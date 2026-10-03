import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });
export const metadata: Metadata = { title: 'Univyx', description: 'Your verified campus community', manifest: '/manifest.webmanifest' };
export const viewport: Viewport = { themeColor: '#FF6B1A', width: 'device-width', initialScale: 1 };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body className={jakarta.variable}>{children}</body></html>; }
