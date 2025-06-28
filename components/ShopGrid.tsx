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
          
          {/* 2アイテムごとに広告を挿入 */}
          {showAds && (index + 1) % 2 === 0 && index < items.length - 1 && (
            <div className="md:col-span-1">
              <AdCard />
            </div>
          )}
        </Fragment>
      ))}
    </div>
  )
}