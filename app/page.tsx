import ShopGrid from '@/components/ShopGrid'
import Link from 'next/link'
import { ShopCompleteData } from '@/lib/shopComplete'
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

export default async function HomePage() {
  const shopData = await getShopData()
  const currentDate = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

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
      <section className="bg-gradient-to-b from-blue-900 to-purple-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {currentDate}のアイテムショップ
          </h1>
          <p className="text-xl opacity-90">
            総数: {shopData.stats.totalItems} アイテム
          </p>
        </div>
      </section>

      {/* おすすめスキン */}
      {shopData.featured.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 flex items-center">
              <span className="text-yellow-500 mr-3 text-4xl">⭐</span>
              注目のアイテム
            </h2>
            <ShopGrid items={shopData.featured} />
          </div>
        </section>
      )}

      {/* 復刻スキン */}
      {shopData.returned.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 flex items-center">
              <span className="text-red-500 mr-3 text-4xl">🔥</span>
              久しぶりの復刻！
            </h2>
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">
                <span className="font-bold">注目！</span>
                これらのスキンは長期間ショップに登場していませんでした。
                今がゲットのチャンス！
              </p>
            </div>
            <ShopGrid items={shopData.returned} />
          </div>
        </section>
      )}

      {/* 通常ショップ */}
      {shopData.daily.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">デイリーアイテム</h2>
            <ShopGrid items={shopData.daily} showAds={true} />
          </div>
        </section>
      )}

      {/* CTA セクション */}
      <section className="py-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            毎日更新中！
          </h2>
          <p className="text-xl mb-6">
            お気に入りのスキンを見逃さないように、
            毎日チェックしよう！
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