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
  type?: string
  backendType?: string
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
  isReturned,
  type = 'スキン',
  backendType
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
  
  // アイテムタイプに応じたアイコン
  const getTypeIcon = () => {
    switch(type) {
      case 'スキン': return '👤'
      case 'つるはし': return '⛏️'
      case 'グライダー': return '🪂'
      case 'バックアクセサリー': return '🎒'
      case 'エモート': return '💃'
      case 'ラップ': return '🎨'
      case 'ミュージック': return '🎵'
      case 'ロード画面': return '🖼️'
      case 'スプレー': return '🎯'
      case 'おもちゃ': return '🎮'
      default: return '📦'
    }
  }
  
  // アイテムタイプに応じた背景色
  const getTypeBgColor = () => {
    switch(type) {
      case 'スキン': return 'from-blue-600 to-indigo-700'
      case 'つるはし': return 'from-orange-600 to-red-700'
      case 'グライダー': return 'from-sky-600 to-blue-700'
      case 'バックアクセサリー': return 'from-green-600 to-emerald-700'
      case 'エモート': return 'from-purple-600 to-pink-700'
      default: return 'from-gray-600 to-gray-700'
    }
  }

  return (
    <Link href={`/skins/${id}`} className="block">
      <div className="skin-card bg-slate-700 border border-slate-600 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:border-blue-500">
        {/* アイテムタイプバー */}
        <div className={`h-8 bg-gradient-to-r ${getTypeBgColor()} flex items-center px-3`}>
          <span className="text-white text-sm font-bold flex items-center">
            <span className="mr-2">{getTypeIcon()}</span>
            {type}
          </span>
        </div>
        
        {/* 画像エリア */}
        <div className="relative aspect-square bg-slate-800">
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
            <span className="absolute top-2 right-2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              NEW
            </span>
          )}
          {isReturnedItem && typeof daysGone === 'number' && daysGone > 0 && (
            <span className="absolute top-2 right-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              復刻（{daysGone}日ぶり）
            </span>
          )}
          
          {/* レアリティバッジ */}
          <div className={`absolute bottom-2 left-2 px-3 py-1 rounded ${getRarityStyle()}`}>
            <span className="text-white text-xs font-bold uppercase">
              {rarity}
            </span>
          </div>
        </div>
        
        {/* テキストエリア */}
        <div className="p-4 bg-slate-700">
          <h3 className="font-bold text-lg mb-2 text-white">{getJapaneseName(id, name)}</h3>
          {set && (
            <p className="text-gray-400 text-xs mb-2">
              {set}
            </p>
          )}
          
          <div className="flex justify-between items-center mt-3">
            <span className="text-blue-400 font-bold text-xl">
              {price.toLocaleString()} V-Bucks
            </span>
            <span className="text-sm text-gray-400">
              詳細を見る
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}