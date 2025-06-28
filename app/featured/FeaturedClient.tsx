'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getJapaneseName } from '@/lib/translations'

interface FeaturedSkin {
  id: string
  name: string
  japaneseName: string
  description: string
  rarity: string
  price: number
  imageUrl: string
  reason: string
  category: 'popular' | 'limited' | 'new' | 'rare'
}

const FEATURED_REASONS = {
  popular: '🔥 人気爆発中！',
  limited: '⏰ 期間限定！',
  new: '✨ 新登場！',
  rare: '💎 激レア！'
}

export default function FeaturedClient() {
  const [featuredSkins, setFeaturedSkins] = useState<FeaturedSkin[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    loadFeaturedSkins()
  }, [])

  const loadFeaturedSkins = async () => {
    try {
      // ショップデータから注目アイテムを選出
      const shopRes = await fetch('/shop_complete.json')
      const shopData = await shopRes.json()
      
      const featured: FeaturedSkin[] = []
      
      // Featured itemsから選出
      shopData.featured?.forEach((item: any) => {
        if (item.type === 'Outfit') {
          featured.push({
            id: item.id,
            name: item.name,
            japaneseName: getJapaneseName(item.id, item.name),
            description: item.description || '',
            rarity: item.rarity,
            price: item.price,
            imageUrl: item.imageUrl,
            reason: '今日のショップで大注目！みんなが欲しがってる人気スキン！',
            category: 'popular'
          })
        }
      })
      
      // Special itemsから選出
      shopData.special?.forEach((item: any) => {
        if (item.type === 'Outfit' && item.series) {
          featured.push({
            id: item.id,
            name: item.name,
            japaneseName: getJapaneseName(item.id, item.name),
            description: item.description || '',
            rarity: item.rarity,
            price: item.price,
            imageUrl: item.imageUrl,
            reason: 'コラボシリーズの特別なスキン！今だけのチャンス！',
            category: 'limited'
          })
        }
      })
      
      setFeaturedSkins(featured)
      setLoading(false)
    } catch (error) {
      console.error('Error loading featured skins:', error)
      setLoading(false)
    }
  }

  const filteredSkins = selectedCategory === 'all' 
    ? featuredSkins 
    : featuredSkins.filter(skin => skin.category === selectedCategory)

  const getRarityGradient = (rarity: string) => {
    const gradients: Record<string, string> = {
      legendary: 'from-yellow-300 to-amber-400',
      epic: 'from-purple-400 to-pink-400',
      rare: 'from-blue-400 to-sky-500',
      uncommon: 'from-green-400 to-emerald-500',
      common: 'from-gray-400 to-slate-500',
      marvel: 'from-red-500 to-red-700',
      gaminglegends: 'from-indigo-500 to-purple-600',
      icon: 'from-cyan-400 to-blue-500'
    }
    return gradients[rarity.toLowerCase()] || gradients.common
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl animate-pulse">おすすめスキンを読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* ヘッダー */}
      <section className="bg-gradient-to-r from-orange-400 to-pink-400 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ⭐ おすすめスキン ⭐
          </h1>
          <p className="text-xl opacity-90">
            今週の注目アイテムを厳選してお届け！
          </p>
        </div>
      </section>

      {/* カテゴリーフィルター */}
      <section className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                selectedCategory === 'all' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              すべて
            </button>
            <button
              onClick={() => setSelectedCategory('popular')}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                selectedCategory === 'popular' 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              🔥 人気
            </button>
            <button
              onClick={() => setSelectedCategory('limited')}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                selectedCategory === 'limited' 
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              ⏰ 期間限定
            </button>
            <button
              onClick={() => setSelectedCategory('new')}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                selectedCategory === 'new' 
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              ✨ 新登場
            </button>
            <button
              onClick={() => setSelectedCategory('rare')}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                selectedCategory === 'rare' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              💎 激レア
            </button>
          </div>
        </div>
      </section>

      {/* スキンリスト */}
      <section className="container mx-auto px-4 py-12">
        {filteredSkins.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-500">
              現在、このカテゴリーのおすすめスキンはありません
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkins.map((skin) => (
              <div
                key={skin.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
              >
                <div className={`h-2 bg-gradient-to-r ${getRarityGradient(skin.rarity)}`} />
                
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={skin.imageUrl}
                        alt={skin.japaneseName}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{FEATURED_REASONS[skin.category]}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-1">{skin.japaneseName}</h3>
                      <p className="text-gray-600 text-sm mb-2">{skin.name}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-bold text-blue-600">
                          {skin.price.toLocaleString()} V-Bucks
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mt-4 p-4 bg-yellow-50 rounded-lg">
                    💡 {skin.reason}
                  </p>
                  
                  <Link
                    href={`/skins/${skin.id}`}
                    className="mt-4 block text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    詳細を見る
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* おすすめの理由 */}
      <section className="bg-gradient-to-r from-purple-100 to-pink-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            🌟 なぜおすすめ？ 🌟
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="font-bold text-lg mb-2">人気爆発中</h3>
              <p className="text-gray-600">
                たくさんのプレイヤーが使っている今一番ホットなスキン！
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="font-bold text-lg mb-2">期間限定</h3>
              <p className="text-gray-600">
                今だけしか買えない特別なスキン。見逃したら後悔するかも！
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-bold text-lg mb-2">新登場</h3>
              <p className="text-gray-600">
                最新のスキンをいち早くゲット！みんなより先に使おう！
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="font-bold text-lg mb-2">激レア</h3>
              <p className="text-gray-600">
                めったに登場しないレアなスキン。持ってたら自慢できる！
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}