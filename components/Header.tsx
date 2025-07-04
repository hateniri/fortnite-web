'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-gradient-to-r from-gray-800 via-blue-900 to-indigo-900 text-white shadow-lg border-b border-blue-500">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold flex items-center">
            <img src="/logo-header.svg" alt="フォートナイター ロゴ" className="w-10 h-10 mr-3" />
            フォートナイター
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
            <Link href="/news" className="hover:text-yellow-300 transition-colors">
              ニュース
            </Link>
            <Link href="/columns" className="hover:text-yellow-300 transition-colors">
              コラム
            </Link>
            <Link href="/map" className="hover:text-yellow-300 transition-colors">
              コラボ投票
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
            <Link href="/news" className="block py-2 hover:text-yellow-300">
              ニュース
            </Link>
            <Link href="/columns" className="block py-2 hover:text-yellow-300">
              コラム
            </Link>
            <Link href="/map" className="block py-2 hover:text-yellow-300">
              コラボ投票
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