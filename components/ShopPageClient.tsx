'use client'

import { useState } from 'react'
import ShopGrid from '@/components/ShopGrid'
import ItemTypeFilter from '@/components/ItemTypeFilter'
import VbucksLottery from '@/components/VbucksLottery'

interface ShopPageClientProps {
  shopData: any
  currentDate: string
}

export default function ShopPageClient({ shopData, currentDate }: ShopPageClientProps) {
  const allItems = [
    ...shopData.featured,
    ...shopData.daily,
    ...(shopData.returned || [])
  ]
  
  const [filteredItems, setFilteredItems] = useState(allItems)

  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-b from-gray-800 to-blue-900 text-white py-12 border-b border-blue-500">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-md"></div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {currentDate}のアイテムショップ
          </h1>
          <p className="text-xl opacity-90">
            今日は {shopData.stats.totalItems} 個のアイテムが登場
          </p>
        </div>
      </section>

      {/* 今日のアイテムショップ */}
      <section className="py-12 bg-slate-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 flex items-center text-white">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
              <div className="w-5 h-5 bg-white rounded-sm"></div>
            </div>
            今日のアイテムショップ
          </h2>
          
          {/* 統計情報 */}
          <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-slate-700 to-blue-800 rounded-lg p-4 text-center border border-blue-500">
              <p className="text-2xl font-bold text-blue-400">{shopData.stats.totalItems}</p>
              <p className="text-sm text-gray-300">全アイテム</p>
            </div>
            <div className="bg-gradient-to-br from-slate-700 to-purple-800 rounded-lg p-4 text-center border border-purple-500">
              <p className="text-2xl font-bold text-purple-400">{shopData.stats.featured || shopData.featured.length}</p>
              <p className="text-sm text-gray-300">注目アイテム</p>
            </div>
            <div className="bg-gradient-to-br from-slate-700 to-green-800 rounded-lg p-4 text-center border border-green-500">
              <p className="text-2xl font-bold text-green-400">{shopData.stats.daily || shopData.daily.length}</p>
              <p className="text-sm text-gray-300">デイリーアイテム</p>
            </div>
            <div className="bg-gradient-to-br from-slate-700 to-orange-800 rounded-lg p-4 text-center border border-orange-500">
              <p className="text-2xl font-bold text-orange-400">
                {Math.round(allItems.reduce((sum, item) => sum + item.price, 0) / Math.max(shopData.stats.totalItems, 1))}
              </p>
              <p className="text-sm text-gray-300">平均価格</p>
            </div>
          </div>

          {/* フィルター */}
          <ItemTypeFilter items={allItems} onFilterChange={setFilteredItems} />

          {/* 全アイテム表示 */}
          <ShopGrid items={filteredItems} showAds={true} />
        </div>
      </section>

      {/* V-Bucks抽選 */}
      <section className="py-12 bg-gradient-to-br from-slate-700 to-blue-800">
        <div className="container mx-auto px-4">
          <VbucksLottery />
        </div>
      </section>
    </div>
  )
}