'use client'

import { getAdsByCategory, getRandomAd } from '@/lib/adProducts'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ColumnAdProps {
  className?: string
  position?: 'inline' | 'sidebar' | 'bottom'
}

export default function ColumnAd({ className = '', position = 'inline' }: ColumnAdProps) {
  const [currentAd, setCurrentAd] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // コラム用の広告（写真集・書籍系を優先）
    const photoAds = getAdsByCategory('photo')
    const bookAds = getAdsByCategory('book')
    const allColumnAds = [...photoAds, ...bookAds]
    
    if (allColumnAds.length > 0) {
      const randomAd = allColumnAds[Math.floor(Math.random() * allColumnAds.length)]
      setCurrentAd(randomAd)
    } else {
      setCurrentAd(getRandomAd())
    }
    setLoading(false)
  }, [])

  // ローディング状態
  if (loading) {
    return (
      <div className={`bg-gray-100 rounded-lg p-4 animate-pulse ${className}`}>
        <div className="h-32 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  // データなし
  if (!currentAd) {
    return (
      <div className={`bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-4 text-center ${className}`}>
        <p className="text-gray-500 text-sm">広告を読み込み中...</p>
      </div>
    )
  }

  const adSize = position === 'sidebar' ? 'compact' : 'standard'

  return (
    <div className={`bg-white rounded-lg shadow-sm border overflow-hidden ${className}`}>
      {/* 「PR」ラベル */}
      <div className="bg-gray-100 px-3 py-1 text-xs text-gray-600 font-medium">
        PR
      </div>
      
      <div className={`p-4 ${adSize === 'compact' ? 'flex flex-col' : 'flex flex-row gap-4'}`}>
        {/* 商品画像 */}
        <div className={`${adSize === 'compact' ? 'w-full mb-3' : 'w-32 flex-shrink-0'}`}>
          <Link href={currentAd.link} target="_blank" rel="noopener noreferrer">
            <img
              src={currentAd.imageUrl}
              alt={currentAd.title}
              className={`${
                adSize === 'compact' 
                  ? 'w-full h-40 object-cover' 
                  : 'w-full h-24 object-cover'
              } rounded-lg hover:opacity-90 transition-opacity`}
              loading="lazy"
            />
          </Link>
        </div>

        {/* 商品情報 */}
        <div className="flex-1 min-w-0">
          <Link href={currentAd.link} target="_blank" rel="noopener noreferrer">
            <h3 className={`font-medium text-gray-900 hover:text-blue-600 transition-colors ${
              adSize === 'compact' ? 'text-sm' : 'text-base'
            } line-clamp-2 mb-2`}>
              {currentAd.title}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between">
            <span className={`font-bold text-red-600 ${
              adSize === 'compact' ? 'text-sm' : 'text-lg'
            }`}>
              {currentAd.price}
            </span>
            
            <Link 
              href={currentAd.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium ${
                adSize === 'compact' ? 'text-xs' : 'text-sm'
              }`}
            >
              詳細を見る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}