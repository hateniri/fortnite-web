import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'フォートナイター',
  description: 'Fortniteの今日のアイテムショップを日本語で分かりやすく解説。最新ニュース、マップ情報、V-Bucksプレゼント企画も！',
  keywords: 'Fortnite, フォートナイト, アイテムショップ, スキン, 日本語, 攻略, ニュース, マップ',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/logo.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'フォートナイター',
    description: '今日のFortniteショップを日本語で解説',
    type: 'website',
    images: [
      {
        url: '/logo.svg',
        width: 200,
        height: 200,
        alt: 'フォートナイター ロゴ',
      }
    ],
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