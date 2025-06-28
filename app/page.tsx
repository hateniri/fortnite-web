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
      <section className="bg-gradient-to-b from-blue-400 to-purple-400 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🌟 {currentDate}のアイテムショップ 🌟
          </h1>
          <p className="text-xl opacity-90">
            今日は {shopData.stats.totalItems} 個のアイテムが登場！
          </p>
        </div>
      </section>

      {/* 今日のアイテムショップ（全件表示） */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <span className="text-blue-500 mr-3 text-4xl">🛍️</span>
            今日のアイテムショップ
          </h2>
          
          {/* 統計情報 */}
          <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{shopData.stats.totalItems}</p>
              <p className="text-sm text-gray-600">全アイテム</p>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">{shopData.stats.featured || shopData.featured.length}</p>
              <p className="text-sm text-gray-600">注目アイテム</p>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-teal-100 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{shopData.stats.daily || shopData.daily.length}</p>
              <p className="text-sm text-gray-600">デイリーアイテム</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">
                {Math.round([...shopData.featured, ...shopData.daily].reduce((sum, item) => sum + item.price, 0) / Math.max(shopData.stats.totalItems, 1))}
              </p>
              <p className="text-sm text-gray-600">平均価格</p>
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
      <section className="py-12 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <VbucksLottery />
        </div>
      </section>

      {/* CTA セクション */}
      <section className="py-12 bg-gradient-to-r from-purple-400 to-pink-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            🌈 毎日新しいスキンが登場！ 🌈
          </h2>
          <p className="text-xl mb-6">
            お気に入りのスキンを見逃さないように、
            毎日遊びに来てね！
          </p>
          <Link
            href="/subscribe"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            更新通知を受け取る
          </Link>
        </div>
      </section>
    </div>
  )
}