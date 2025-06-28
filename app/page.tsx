import ShopPageClient from '@/components/ShopPageClient'
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
    <>
      <ShopPageClient shopData={shopData} currentDate={currentDate} />
      
      {/* 控えめなCTA */}
      <section className="py-8 bg-slate-800 border-t border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                毎日チェックして最新情報をゲット
              </h3>
              <p className="text-sm text-gray-400">
                新しいアイテムやニュースをお見逃しなく
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-slate-700 rounded-lg p-2 border border-slate-600">
                <span className="text-xs text-gray-400">スポンサー</span>
                <p className="text-sm text-white">ゲーミングチェア特価</p>
              </div>
              <Link
                href="/news"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                ニュースを見る
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}