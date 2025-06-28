import ShopGrid from '@/components/ShopGrid'
import Link from 'next/link'

// モックデータ（実際はshop.jsonから取得）
const mockShopData = {
  featured: [
    {
      id: 'renegade-raider',
      name: 'レネゲードレイダー',
      description: 'Fortniteの歴史に名を刻む伝説のOGスキン。2017年のシーズン1でのみ入手可能だった超レアアイテム。',
      rarity: 'rare' as const,
      price: 1200,
      imageUrl: '/api/placeholder/300/300',
      isReturned: true,
      lastSeen: '2017年11月'
    },
    {
      id: 'skull-trooper',
      name: 'スカルトルーパー',
      description: 'ハロウィン限定のホラースキン。毎年10月に復刻される可能性があるが、初期版は特別なスタイルを持つ。',
      rarity: 'epic' as const,
      price: 1500,
      imageUrl: '/api/placeholder/300/300',
    },
  ],
  daily: [
    {
      id: 'brite-bomber',
      name: 'ブライトボンバー',
      description: 'カラフルでポップなデザインが特徴の人気スキン。明るい色合いで戦場でも目立つこと間違いなし！',
      rarity: 'uncommon' as const,
      price: 800,
      imageUrl: '/api/placeholder/300/300',
    },
    {
      id: 'cuddle-team-leader',
      name: 'カドルチームリーダー',
      description: 'ピンクのクマの着ぐるみスキン。かわいい見た目とは裏腹に、戦場では恐れられる存在。',
      rarity: 'legendary' as const,
      price: 2000,
      imageUrl: '/api/placeholder/300/300',
    },
  ]
}

export default function HomePage() {
  const currentDate = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-b from-blue-900 to-purple-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {currentDate}のアイテムショップ
          </h1>
          <p className="text-xl opacity-90">
            AIが各スキンを日本語で分かりやすく解説！
          </p>
        </div>
      </section>

      {/* おすすめスキン */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <span className="text-yellow-500 mr-3 text-4xl">⭐</span>
            今日のおすすめスキン
          </h2>
          <ShopGrid items={mockShopData.featured} />
        </div>
      </section>

      {/* 復刻スキン */}
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
          <ShopGrid items={mockShopData.featured.filter(item => item.isReturned)} />
        </div>
      </section>

      {/* 通常ショップ */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">本日のショップ一覧</h2>
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                すべて
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                レジェンダリー
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                エピック
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                レア
              </button>
            </div>
          </div>
          <ShopGrid items={[...mockShopData.featured, ...mockShopData.daily]} showAds={true} />
        </div>
      </section>

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