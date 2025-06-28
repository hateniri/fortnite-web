import ShopGrid from '@/components/ShopGrid'
import VbucksLottery from '@/components/VbucksLottery'
import Link from 'next/link'
import { ShopCompleteData } from '@/lib/shopComplete'
import { SkinsSummaryData } from '@/lib/skinsSummary'
import fs from 'fs/promises'
import path from 'path'

async function getShopData(): Promise<ShopCompleteData | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'shop_complete.json')
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading shop data:', error)
    return null
  }
}

async function getSkinsSummary(): Promise<SkinsSummaryData | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'skins_summary.json')
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading skins summary:', error)
    return null
  }
}

export default async function HomePage() {
  const shopData = await getShopData()
  const skinsSummary = await getSkinsSummary()
  const currentDate = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  // サマリーデータをアイテムにマージ
  const mergeWithSummary = (items: any[]) => {
    if (!skinsSummary) return items
    return items.map(item => ({
      ...item,
      kidFriendlyDesc: skinsSummary.summaries[item.id]?.kidFriendlyDesc
    }))
  }

  if (!shopData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-xl">ショップデータを読み込めませんでした。</p>
      </div>
    )
  }

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

      {/* 今日のアイテムショップ（全件表示） */}
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
                {Math.round([...shopData.featured, ...shopData.daily].reduce((sum, item) => sum + item.price, 0) / Math.max(shopData.stats.totalItems, 1))}
              </p>
              <p className="text-sm text-gray-300">平均価格</p>
            </div>
          </div>

          {/* 全アイテム表示 */}
          <ShopGrid items={mergeWithSummary([
            ...shopData.featured,
            ...shopData.daily,
            ...(shopData.returned || [])
          ])} showAds={true} />
        </div>
      </section>

      {/* V-Bucks抽選 */}
      <section className="py-12 bg-gradient-to-br from-slate-700 to-blue-800">
        <div className="container mx-auto px-4">
          <VbucksLottery />
        </div>
      </section>

      {/* CTA セクション */}
      <section className="py-12 bg-gradient-to-r from-gray-800 to-blue-900 text-white border-t border-blue-500">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-md"></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">
            毎日新しいスキンが登場
          </h2>
          <p className="text-xl mb-6 opacity-90">
            お気に入りのスキンを見逃さないように、
            毎日チェックしよう
          </p>
          <Link
            href="/subscribe"
            className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors border border-blue-400"
          >
            更新通知を受け取る
          </Link>
        </div>
      </section>
    </div>
  )
}