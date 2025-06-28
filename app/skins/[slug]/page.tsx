import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'

interface PageProps {
  params: { slug: string }
}

// メタデータ生成
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // 実際の実装では、スキンデータから動的に生成
  const skinName = params.slug.replace(/-/g, ' ')
  
  return {
    title: `【${skinName}】は買うべき？評価と入手方法 | Fortnite攻略`,
    description: `Fortniteの${skinName}スキンの詳細情報。レアリティ、価格、復刻履歴、プレイヤー評価をチェック。今買うべきかAIが徹底解説！`,
    openGraph: {
      title: `${skinName} - Fortnite Shop Tracker`,
      description: `${skinName}の詳細情報と買うべきか判定`,
    },
  }
}

export default function SkinDetailPage({ params }: PageProps) {
  // 実際の実装では、params.slugを使ってデータを取得
  const mockSkin = {
    id: params.slug,
    name: 'レネゲードレイダー',
    rarity: 'rare' as const,
    price: 1200,
    description: 'Fortniteが始まったばかりの頃（2017年）にしか買えなかった伝説のスキンです！',
    lastSeen: '2017年11月',
    recommendation: 5,
    shouldBuy: true,
    buyReason: 'このスキンは特別なので、普通のショップには出てきません。もし見つけたら、すぐにゲットしましょう！',
    tags: ['レア', 'OG', '初期スキン'],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* パンくずリスト */}
      <nav className="text-sm mb-6">
        <Link href="/" className="text-blue-600 hover:underline">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{mockSkin.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左側：画像 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src="/api/placeholder/400/400"
              alt={`${mockSkin.name} スキン画像`}
              fill
              className="object-cover"
            />
          </div>
          
          {/* レアリティ表示 */}
          <div className="mt-4">
            <div className={`h-3 rounded-full rarity-gradient-${mockSkin.rarity}`} />
          </div>
        </div>

        {/* 右側：情報 */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{mockSkin.name}</h1>
            <p className="text-gray-600">{mockSkin.description}</p>
          </div>

          {/* 価格情報 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg">価格</span>
              <span className="text-2xl font-bold text-blue-600">
                {mockSkin.price.toLocaleString()} V-Bucks
              </span>
            </div>
          </div>

          {/* 買うべき？判定 */}
          <div className="bg-yellow-50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-3 flex items-center">
              <span className="text-2xl mr-2">🤔</span>
              このスキンは買うべき？
            </h2>
            
            {/* 星評価 */}
            <div className="flex items-center mb-3">
              <span className="mr-2">おすすめ度：</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-2xl ${i < mockSkin.recommendation ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </span>
                ))}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${mockSkin.shouldBuy ? 'bg-green-100' : 'bg-red-100'}`}>
              <p className={`font-bold mb-2 ${mockSkin.shouldBuy ? 'text-green-800' : 'text-red-800'}`}>
                {mockSkin.shouldBuy ? '✅ 買うべき！' : '❌ 見送り推奨'}
              </p>
              <p className="text-sm">{mockSkin.buyReason}</p>
            </div>
          </div>

          {/* どんな人におすすめ？ */}
          <div className="bg-purple-50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-3">
              <span className="text-2xl mr-2">🎯</span>
              どんな人におすすめ？
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>レアなスキンを集めたい人</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>ベテランプレイヤーとして見られたい人</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>シンプルでカッコいいスキンが好きな人</span>
              </li>
            </ul>
          </div>

          {/* タグ */}
          <div className="flex flex-wrap gap-2">
            {mockSkin.tags.map((tag) => (
              <span key={tag} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>

          {/* 最終登場情報 */}
          {mockSkin.lastSeen && (
            <div className="text-sm text-gray-600 border-t pt-4">
              <p>最終登場: {mockSkin.lastSeen}</p>
            </div>
          )}
        </div>
      </div>

      {/* 関連スキン */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">関連するスキン</h2>
        {/* ここに関連スキンのグリッドを表示 */}
        <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
          関連スキンのリスト（実装予定）
        </div>
      </section>
    </div>
  )
}