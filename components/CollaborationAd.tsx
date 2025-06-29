'use client'

import { getAdsByCategory, getRandomAd } from '@/lib/adProducts'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface CollaborationAdProps {
  className?: string
  showMultiple?: boolean
  count?: number
}

export default function CollaborationAd({ 
  className = '', 
  showMultiple = false, 
  count = 1 
}: CollaborationAdProps) {
  const [currentAds, setCurrentAds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // コラボ用の広告（ホビー・ゲーム系を優先）
    const hobbyAds = getAdsByCategory('hobby')
    const gameAds = getAdsByCategory('game')
    const videoAds = getAdsByCategory('video')
    const allCollabAds = [...hobbyAds, ...gameAds, ...videoAds]
    
    if (showMultiple) {
      const shuffled = [...allCollabAds].sort(() => 0.5 - Math.random())
      setCurrentAds(shuffled.slice(0, count))
    } else {
      if (allCollabAds.length > 0) {
        const randomAd = allCollabAds[Math.floor(Math.random() * allCollabAds.length)]
        setCurrentAds([randomAd])
      } else {
        const fallbackAd = getRandomAd()
        setCurrentAds(fallbackAd ? [fallbackAd] : [])
      }
    }
    setLoading(false)
  }, [showMultiple, count])

  // ローディング状態
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: showMultiple ? count : 1 }).map((_, index) => (
          <div key={index} className="bg-gray-100 rounded-lg p-4 animate-pulse">
            <div className="h-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  // データなし
  if (currentAds.length === 0) {
    return (
      <div className={`bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-4 text-center ${className}`}>
        <p className="text-gray-500 text-sm">コラボ関連商品を読み込み中...</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {showMultiple ? (
        // 複数広告表示（グリッド形式）
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentAds.map((ad, index) => (
            <CollaborationAdCard key={`${ad.id}-${index}`} ad={ad} />
          ))}
        </div>
      ) : (
        // 単一広告表示
        <CollaborationAdCard ad={currentAds[0]} />
      )}
    </div>
  )
}

function CollaborationAdCard({ ad }: { ad: any }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* 「コラボ商品」ラベル */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-xs text-white font-medium">
        コラボ商品
      </div>
      
      <div className="p-4">
        {/* 商品画像 */}
        <div className="w-full mb-3">
          <Link href={ad.link} target="_blank" rel="noopener noreferrer">
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="w-full h-40 object-cover rounded-lg hover:opacity-90 transition-opacity"
              loading="lazy"
            />
          </Link>
        </div>

        {/* 商品情報 */}
        <div>
          <Link href={ad.link} target="_blank" rel="noopener noreferrer">
            <h3 className="font-medium text-gray-900 hover:text-purple-600 transition-colors text-sm line-clamp-2 mb-2">
              {ad.title}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between">
            <span className="font-bold text-purple-600 text-sm">
              {ad.price}
            </span>
            
            <Link 
              href={ad.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium text-xs"
            >
              チェック
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}