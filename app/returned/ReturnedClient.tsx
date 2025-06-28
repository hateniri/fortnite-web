'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getJapaneseName } from '@/lib/translations'

interface ReturnedSkin {
  id: string
  name: string
  japaneseName: string
  description: string
  rarity: string
  price: number
  imageUrl: string
  daysGone: number
  lastSeen: string
  shopHistory: string[]
}

export default function ReturnedClient() {
  const [returnedSkins, setReturnedSkins] = useState<ReturnedSkin[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'days' | 'rarity' | 'price'>('days')

  useEffect(() => {
    loadReturnedSkins()
  }, [])

  const loadReturnedSkins = async () => {
    try {
      const shopRes = await fetch('/shop_complete.json')
      const shopData = await shopRes.json()
      
      const returned: ReturnedSkin[] = []
      
      // returnedカテゴリから取得
      if (shopData.returned && shopData.returned.length > 0) {
        shopData.returned.forEach((item: any) => {
          if (item.type === 'Outfit' && item.daysGone > 0) {
            returned.push({
              id: item.id,
              name: item.name,
              japaneseName: getJapaneseName(item.id, item.name),
              description: item.description || '',
              rarity: item.rarity,
              price: item.price,
              imageUrl: item.imageUrl,
              daysGone: item.daysGone,
              lastSeen: item.lastSeen,
              shopHistory: item.shopHistory || []
            })
          }
        })
      }
      
      // 通常アイテムからも復刻品を探す（30日以上経過）
      const allItems = [...(shopData.featured || []), ...(shopData.daily || []), ...(shopData.special || [])]
      allItems.forEach((item: any) => {
        if (item.type === 'Outfit' && item.daysGone && item.daysGone > 30) {
          const exists = returned.find(r => r.id === item.id)
          if (!exists) {
            returned.push({
              id: item.id,
              name: item.name,
              japaneseName: getJapaneseName(item.id, item.name),
              description: item.description || '',
              rarity: item.rarity,
              price: item.price,
              imageUrl: item.imageUrl,
              daysGone: item.daysGone,
              lastSeen: item.lastSeen,
              shopHistory: item.shopHistory || []
            })
          }
        }
      })
      
      // 日数でソート（降順）
      returned.sort((a, b) => b.daysGone - a.daysGone)
      
      setReturnedSkins(returned)
      setLoading(false)
    } catch (error) {
      console.error('Error loading returned skins:', error)
      setLoading(false)
    }
  }

  const sortedSkins = [...returnedSkins].sort((a, b) => {
    switch (sortBy) {
      case 'days':
        return b.daysGone - a.daysGone
      case 'rarity':
        const rarityOrder: Record<string, number> = {
          legendary: 5,
          epic: 4,
          rare: 3,
          uncommon: 2,
          common: 1
        }
        return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0)
      case 'price':
        return b.price - a.price
    }
  })

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

  const getDaysGoneColor = (days: number) => {
    if (days >= 365) return 'text-red-600'
    if (days >= 180) return 'text-orange-600'
    if (days >= 90) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getDaysGoneEmoji = (days: number) => {
    if (days >= 365) return '🌟'
    if (days >= 180) return '⭐'
    if (days >= 90) return '✨'
    return '🆕'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl animate-pulse">復刻スキンを読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* ヘッダー */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🎆 復刻スキン 🎆
          </h1>
          <p className="text-xl opacity-90">
            久しぶりにショップに登場したレアなスキンたち！
          </p>
        </div>
      </section>

      {/* 統計情報 */}
      {returnedSkins.length > 0 && (
        <section className="bg-white shadow-md py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-6 justify-center text-center">
              <div>
                <p className="text-3xl font-bold text-orange-600">
                  {returnedSkins.length}
                </p>
                <p className="text-gray-600">復刻スキン数</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600">
                  {Math.max(...returnedSkins.map(s => s.daysGone))}日
                </p>
                <p className="text-gray-600">最長不在期間</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">
                  {returnedSkins.filter(s => s.daysGone >= 365).length}
                </p>
                <p className="text-gray-600">1年以上ぶり</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ソートオプション */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setSortBy('days')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              sortBy === 'days' 
                ? 'bg-orange-500 text-white' 
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            不在期間順
          </button>
          <button
            onClick={() => setSortBy('rarity')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              sortBy === 'rarity' 
                ? 'bg-purple-500 text-white' 
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            レアリティ順
          </button>
          <button
            onClick={() => setSortBy('price')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              sortBy === 'price' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            価格順
          </button>
        </div>
      </section>

      {/* スキンリスト */}
      <section className="container mx-auto px-4 pb-12">
        {sortedSkins.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-2xl text-gray-500">
              現在、復刻スキンはありません
            </p>
            <p className="text-gray-400 mt-2">
              毎日チェックして、レアなスキンを見逃さないようにしよう！
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSkins.map((skin) => (
              <div
                key={skin.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
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
                        <span className="text-2xl">{getDaysGoneEmoji(skin.daysGone)}</span>
                        <span className={`font-bold ${getDaysGoneColor(skin.daysGone)}`}>
                          {skin.daysGone}日ぶり！
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-1">{skin.japaneseName}</h3>
                      <p className="text-gray-600 text-sm mb-2">{skin.name}</p>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-blue-600">
                          {skin.price.toLocaleString()} V-Bucks
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-800">
                      <span className="font-bold">💡 復刻情報：</span>
                      {skin.daysGone >= 365 
                        ? `なんと1年以上ぶりの登場！超レアチャンス！`
                        : skin.daysGone >= 180
                        ? `半年ぶりの登場！今を逃すと次はいつになるかわからない！`
                        : skin.daysGone >= 90
                        ? `3ヶ月ぶりの登場！久しぶりのチャンス！`
                        : `${skin.daysGone}日ぶりの登場！`
                      }
                    </p>
                    {skin.shopHistory && skin.shopHistory.length > 1 && (
                      <p className="text-xs text-gray-600 mt-2">
                        過去の登場回数: {skin.shopHistory.length}回
                      </p>
                    )}
                  </div>
                  
                  <Link
                    href={`/skins/${skin.id}`}
                    className="mt-4 block text-center bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    詳細を見る
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 復刻スキンの重要性 */}
      <section className="bg-gradient-to-r from-orange-100 to-red-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            🌟 なぜ復刻スキンは特別？ 🌟
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="font-bold text-lg mb-2">次はいつ？</h3>
              <p className="text-gray-600">
                復刻スキンは次いつ登場するかわからない！今がチャンス！
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="font-bold text-lg mb-2">レア度UP</h3>
              <p className="text-gray-600">
                長期間登場していないスキンは持っている人が少ない！
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-bold text-lg mb-2">狙い目</h3>
              <p className="text-gray-600">
                人気スキンが復刻したらすぐゲット！後悔しないように！
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}