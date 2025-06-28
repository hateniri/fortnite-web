import Image from 'next/image'
import Link from 'next/link'

interface SkinCardProps {
  id: string
  name: string
  description: string
  rarity: 'legendary' | 'epic' | 'rare' | 'uncommon' | 'common'
  price: number
  imageUrl: string
  isReturned?: boolean
  lastSeen?: string
}

export default function SkinCard({
  id,
  name,
  description,
  rarity,
  price,
  imageUrl,
  isReturned = false,
  lastSeen
}: SkinCardProps) {
  const rarityStyles = {
    legendary: 'rarity-gradient-legendary',
    epic: 'rarity-gradient-epic',
    rare: 'rarity-gradient-rare',
    uncommon: 'rarity-gradient-uncommon',
    common: 'rarity-gradient-common',
  }

  return (
    <Link href={`/skins/${id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
        {/* レアリティグラデーション */}
        <div className={`h-2 ${rarityStyles[rarity]}`} />
        
        {/* 画像エリア */}
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={imageUrl}
            alt={`${name} スキン画像`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          
          {/* 復刻バッジ */}
          {isReturned && (
            <span className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              復刻！
            </span>
          )}
          
          {/* 最終登場日 */}
          {lastSeen && (
            <span className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              前回: {lastSeen}
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