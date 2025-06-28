'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { getJapaneseName } from '@/lib/translations'

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
  kidFriendlyDesc?: string
  daysGone?: number
  isReturned?: boolean | null
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
  shopHistory,
  kidFriendlyDesc,
  daysGone,
  isReturned
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

  // 新登場か復刻かを判定
  const isNew = !shopHistory || shopHistory.length === 1
  const isReturnedItem = isReturned === true || (typeof daysGone === 'number' && daysGone > 30)

  return (
    <Link href={`/skins/${id}`} className="block">
      <div className="skin-card bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
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
          
          {/* 新登場/復刻バッジ */}
          {isNew && (
            <span className="absolute top-2 right-2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
              NEW 🎉
            </span>
          )}
          {isReturnedItem && typeof daysGone === 'number' && daysGone > 0 && (
            <span className="absolute top-2 right-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              復刻（{daysGone}日ぶり）
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
          <h3 className="font-bold text-lg mb-2 text-gray-900">{getJapaneseName(id, name)}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {kidFriendlyDesc || description}
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