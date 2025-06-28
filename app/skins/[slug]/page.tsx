import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { ShopCompleteData, ShopCompleteItem } from '@/lib/shopComplete'
import fs from 'fs/promises'
import path from 'path'
import SkinImage from './SkinImage'
import { getTranslation } from '@/lib/translations'
import { SkinsSummaryData } from '@/lib/skinsSummary'

async function getAllSkins(): Promise<ShopCompleteItem[]> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'shop_complete.json')
    const data = await fs.readFile(filePath, 'utf-8')
    const shopData: ShopCompleteData = JSON.parse(data)
    return [...shopData.featured, ...shopData.daily, ...shopData.returned]
  } catch (error) {
    console.error('Error loading shop data:', error)
    return []
  }
}

async function getSkinById(id: string): Promise<ShopCompleteItem | null> {
  const skins = await getAllSkins()
  return skins.find(skin => skin.id === id) || null
}

interface PageProps {
  params: { slug: string }
}

// メタデータ生成
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const skin = await getSkinById(params.slug)
  
  if (!skin) {
    return {
      title: 'スキンが見つかりません',
    }
  }
  
  const translation = getTranslation(skin.id)
  const japaneseName = translation?.name || skin.name
  
  return {
    title: `【${japaneseName}】は買うべき？評価と入手方法 | Fortnite攻略`,
    description: `Fortniteの${japaneseName}スキンの詳細情報。レアリティ、価格、復刻履歴、プレイヤー評価をチェック。今買うべきかAIが徹底解説！`,
    openGraph: {
      title: `${japaneseName} - Fortnite Shop Tracker`,
      description: `${japaneseName}の詳細情報と買うべきか判定`,
      images: [skin.imageUrl],
    },
  }
}

export async function generateStaticParams() {
  const skins = await getAllSkins()
  return skins.map((skin) => ({
    slug: skin.id,
  }))
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

export default async function SkinDetailPage({ params }: PageProps) {
  const skin = await getSkinById(params.slug)

  if (!skin) {
    notFound()
  }
  
  const translation = getTranslation(skin.id)
  const japaneseName = translation?.name || skin.name
  const skinsSummary = await getSkinsSummary()
  const summary = skinsSummary?.summaries[skin.id]

  // レアリティの正規化
  const normalizedRarity = skin.rarity.toLowerCase().replace('gaminglegends', 'epic')
  
  const rarityStyles: Record<string, string> = {
    legendary: 'rarity-gradient-legendary',
    epic: 'rarity-gradient-epic',
    rare: 'rarity-gradient-rare',
    uncommon: 'rarity-gradient-uncommon',
    common: 'rarity-gradient-common',
  }

  const getRarityStyle = () => {
    return rarityStyles[normalizedRarity] || rarityStyles.common
  }

  const getRarityName = () => {
    const names: Record<string, string> = {
      legendary: 'レジェンダリー',
      epic: 'エピック',
      rare: 'レア',
      uncommon: 'アンコモン',
      common: 'コモン',
      gaminglegends: 'ゲーミングレジェンド'
    }
    return names[skin.rarity.toLowerCase()] || 'コモン'
  }

  // 購入推奨度の判定
  const getRecommendation = () => {
    // シンプルなロジックで判定（後で改善可能）
    if (skin.price >= 2000) return 3
    if (skin.price >= 1500) return 4
    return 5
  }

  const recommendation = getRecommendation()
  const shouldBuy = recommendation >= 4

  return (
    <div className="container mx-auto px-4 py-8">
      {/* パンくずリスト */}
      <nav className="text-sm mb-6">
        <Link href="/" className="text-blue-600 hover:underline">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{japaneseName}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左側：画像 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <SkinImage id={skin.id} name={skin.name} imageUrl={skin.imageUrl} />
          </div>
          
          {/* レアリティ表示 */}
          <div className="mt-4">
            <div className={`h-3 rounded-full ${getRarityStyle()}`} />
            <p className="text-center mt-2 text-gray-600">{getRarityName()}</p>
          </div>
        </div>

        {/* 右側：情報 */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{japaneseName}</h1>
            <p className="text-gray-600">{summary?.kidFriendlyDesc || skin.description}</p>
          </div>

          {/* 価格情報 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg">価格</span>
              <span className="text-2xl font-bold text-blue-600">
                {skin.price.toLocaleString()} V-Bucks
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
                  <span key={i} className={`text-2xl ${i < recommendation ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </span>
                ))}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${shouldBuy ? 'bg-green-100' : 'bg-red-100'}`}>
              <p className={`font-bold mb-2 ${shouldBuy ? 'text-green-800' : 'text-red-800'}`}>
                {shouldBuy ? '✅ 買うべき！' : '❌ 見送り推奨'}
              </p>
              <p className="text-sm">
                {summary?.buyReason || (
                  shouldBuy 
                    ? `${japaneseName}は${getRarityName()}スキンで、価格も適正です。デザインも魅力的なので、気に入ったなら購入をおすすめします！`
                    : `${japaneseName}は価格が高めです。V-Bucksに余裕がない場合は、他のスキンも検討してみましょう。`
                )}
              </p>
            </div>
          </div>

          {/* 基本情報 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-3">基本情報</h2>
            <dl className="space-y-2">
              {skin.set && (
                <div>
                  <dt className="text-gray-600 text-sm">セット</dt>
                  <dd className="font-semibold">{skin.set}</dd>
                </div>
              )}
              
              {skin.introduction && (
                <div>
                  <dt className="text-gray-600 text-sm">初登場</dt>
                  <dd className="font-semibold">
                    チャプター{skin.introduction.chapter} シーズン{skin.introduction.season}
                  </dd>
                </div>
              )}
              
              {skin.added && (
                <div>
                  <dt className="text-gray-600 text-sm">追加日</dt>
                  <dd className="font-semibold">
                    {new Date(skin.added).toLocaleDateString('ja-JP')}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* タグ */}
          <div className="flex flex-wrap gap-2">
            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
              #{getRarityName()}
            </span>
            {skin.set && (
              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                #{skin.set.replace('Part of the ', '').replace(' set.', '')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 関連スキン */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">関連するスキン</h2>
        <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
          関連スキンのリスト（実装予定）
        </div>
      </section>
    </div>
  )
}