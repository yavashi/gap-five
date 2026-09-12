import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GAP-FIVE | 自己評価と他者評価のギャップ診断',
  description: 'ビッグファイブ理論に基づく、自分と周囲の「認識ギャップ」を暴く性格診断',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
