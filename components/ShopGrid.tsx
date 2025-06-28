'use client'

import SkinCard from './SkinCard'
import AdCard from './AdCard'
import { Fragment } from 'react'

interface ShopItem {
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

interface ShopGridProps {
  items: ShopItem[]
  showAds?: boolean
}

export default function ShopGrid({ items, showAds = false }: ShopGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item, index) => (
        <Fragment key={item.id}>
          <SkinCard {...item} />
          
          {/* 8アイテムごとに広告を挿入（グリッドに馴染むように） */}
          {showAds && (index + 1) % 8 === 0 && index < items.length - 1 && (
            <AdCard />
          )}
        </Fragment>
      ))}
    </div>
  )
}