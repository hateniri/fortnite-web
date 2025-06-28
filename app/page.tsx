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
      
      {/* CTA セクション */}
      <section className="py-12 bg-gradient-to-r from-gray-800 to-blue-900 text-white border-t border-blue-500">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-md"></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">
            毎日新しいアイテムが登場
          </h2>
          <p className="text-xl mb-6 opacity-90">
            お気に入りのアイテムを見逃さないように、
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
    </>
  )
}