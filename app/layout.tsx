import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fortnite Shop Tracker - 今日のアイテムショップ',
  description: 'Fortniteの今日のアイテムショップを日本語で分かりやすく解説。AIが各スキンの特徴や買うべきかを判定！',
  keywords: 'Fortnite, フォートナイト, アイテムショップ, スキン, 日本語, 攻略',
  openGraph: {
    title: 'Fortnite Shop Tracker',
    description: '今日のFortniteショップを日本語で解説',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}