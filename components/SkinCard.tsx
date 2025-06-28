'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface SkinCardProps {
  id: string
  name: string
  description: string
  rarity: string
  price: number
  imageUrl: string
  introduction?: {
    chapter: string
    season: string
    text: string
  }
  set?: string
  added?: string
  shopHistory?: string[]
}

export default function SkinCard({
  id,
  name,
  description,
  rarity,
  price,
  imageUrl,
  introduction,
  set,
  shopHistory
}: SkinCardProps) {
  const [imgSrc, setImgSrc] = useState(`/images/skins/${id}.webp`)
  // レアリティの正規化
  const normalizedRarity = rarity.toLowerCase().replace('gaminglegends', 'epic')
  
  const rarityStyles: Record<string, string> = {
    legendary: 'rarity-gradient-legendary',
    epic: 'rarity-gradient-epic',
    rare: 'rarity-gradient-rare',
    uncommon: 'rarity-gradient-uncommon',
    common: 'rarity-gradient-common',
  }

  const getRarityStyle = () => {
    return rarityStyles[normalizedRarity] || rarityStyles.common
  }

  // 最後から2番目の登場日を取得（復刻判定用）
  const getPreviousAppearance = () => {
    if (!shopHistory || shopHistory.length < 2) return null
    return shopHistory[shopHistory.length - 2]
  }

  const previousDate = getPreviousAppearance()
  const isReturned = previousDate ? new Date().getTime() - new Date(previousDate).getTime() > 30 * 24 * 60 * 60 * 1000 : false

  return (
    <Link href={`/skins/${id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
        {/* レアリティグラデーション */}
        <div className={`h-2 ${getRarityStyle()}`} />
        
        {/* 画像エリア */}
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={imgSrc}
            alt={`${name} スキン画像`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => {
              // WebP画像が見つからない場合はオリジナルURLにフォールバック
              if (imgSrc !== imageUrl) {
                setImgSrc(imageUrl);
              }
            }}
          />
          
          {/* 復刻バッジ */}
          {isReturned && (
            <span className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              復刻！
            </span>
          )}
          
          {/* セット名 */}
          {set && (
            <span className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              {set}
            </span>
          )}
        </div>
        
        {/* テキストエリア */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 text-gray-900">{name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {description}
          </p>
          
          <div className="flex justify-between items-center">
            <span className="text-blue-600 font-bold text-lg">
              {price.toLocaleString()} V-Bucks
            </span>
            <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              もっと読む →
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}