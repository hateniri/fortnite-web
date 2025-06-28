'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-gradient-to-b from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold flex items-center">
            <span className="text-3xl mr-2">🎮</span>
            Fortnite Shop Tracker
          </Link>
          
          {/* モバイルメニューボタン */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="メニュー"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-yellow-300 transition-colors">
              ホーム
            </Link>
            <Link href="/featured" className="hover:text-yellow-300 transition-colors">
              おすすめ
            </Link>
            <Link href="/returned" className="hover:text-yellow-300 transition-colors">
              復刻スキン
            </Link>
            <Link href="/about" className="hover:text-yellow-300 transition-colors">
              このサイトについて
            </Link>
          </nav>
        </div>
        
        {/* モバイルメニュー */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/20">
            <Link href="/" className="block py-2 hover:text-yellow-300">
              ホーム
            </Link>
            <Link href="/featured" className="block py-2 hover:text-yellow-300">
              おすすめ
            </Link>
            <Link href="/returned" className="block py-2 hover:text-yellow-300">
              復刻スキン
            </Link>
            <Link href="/about" className="block py-2 hover:text-yellow-300">
              このサイトについて
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}