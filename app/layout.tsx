import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'AI Resume Builder',
  description: 'An elegant, editorial-style AI resume builder',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#F9F8F6] text-[#1A1A1A] antialiased min-h-screen relative selection:bg-[#EAE5D9] selection:text-[#111]`} suppressHydrationWarning>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')] opacity-[0.4] pointer-events-none mix-blend-multiply" />
        <div className="relative z-10 min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
