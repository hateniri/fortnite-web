'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getJapaneseName } from '@/lib/translations'

interface SkinData {
  id: string
  name: string
  japaneseName: string
  description: string
  type: string
  rarity: string
  series?: string
  set?: string
  introduction?: {
    chapter: string
    season: string
    text: string
  }
  releaseDate: string
  images: {
    icon: string
    featured: string
    background?: string
  }
  shopHistory: string[]
  searchTags: string[]
}

interface DatabaseData {
  lastUpdate: string
  stats: {
    total: number
    byRarity: Array<{ rarity: string; count: number }>
    bySeries: number
    bySet: number
    popular: number
    og: number
  }
  skins: SkinData[]
  categories: {
    popular: string[]
    recent: string[]
    og: string[]
  }
}

export default function DatabaseClient() {
  const [data, setData] = useState<DatabaseData | null>(null)
  const [search, setSearch] = useState('')
  const [filterRarity, setFilterRarity] = useState<string>('all')
  const [filterChapter, setFilterChapter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/skins_database.json')
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const filteredSkins = useMemo(() => {
    if (!data) return []
    
    let skins = [...data.skins]
    
    // 検索フィルター
    if (search) {
      const searchLower = search.toLowerCase()
      skins = skins.filter(skin => 
        skin.japaneseName.toLowerCase().includes(searchLower) ||
        skin.name.toLowerCase().includes(searchLower) ||
        skin.searchTags.some(tag => tag.includes(searchLower))
      )
    }
    
    // レアリティフィルター
    if (filterRarity !== 'all') {
      skins = skins.filter(skin => skin.rarity === filterRarity)
    }
    
    // チャプターフィルター
    if (filterChapter !== 'all') {
      skins = skins.filter(skin => skin.introduction?.chapter === filterChapter)
    }
    
    // ソート
    switch (sortBy) {
      case 'newest':
        skins.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
        break
      case 'oldest':
        skins.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime())
        break
      case 'popular':
        skins.sort((a, b) => b.shopHistory.length - a.shopHistory.length)
        break
      case 'name':
        skins.sort((a, b) => a.japaneseName.localeCompare(b.japaneseName))
        break
    }
    
    return skins
  }, [data, search, filterRarity, filterChapter, sortBy])

  const handleImageError = (skinId: string) => {
    setImageErrors(prev => new Set(prev).add(skinId))
  }

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      legendary: 'from-yellow-300 to-amber-400',
      epic: 'from-purple-400 to-pink-400',
      rare: 'from-blue-400 to-sky-500',
      uncommon: 'from-green-400 to-emerald-500',
      common: 'from-gray-400 to-slate-500',
    }
    return colors[rarity.toLowerCase()] || colors.common
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">データベース読み込み中...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-red-500">データベースの読み込みに失敗しました</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* ヘッダー */}
      <section className="bg-gradient-to-r from-purple-400 to-pink-400 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">🎮 スキンデータベース</h1>
          <p className="text-xl">
            全 {data.stats.total} 種類のスキンを収録！
          </p>
        </div>
      </section>

      {/* フィルター */}
      <section className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="grid md:grid-cols-4 gap-4">
            {/* 検索 */}
            <div>
              <input
                type="text"
                placeholder="スキン名で検索..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {/* レアリティ */}
            <div>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                value={filterRarity}
                onChange={(e) => setFilterRarity(e.target.value)}
              >
                <option value="all">全レアリティ</option>
                <option value="legendary">レジェンダリー</option>
                <option value="epic">エピック</option>
                <option value="rare">レア</option>
                <option value="uncommon">アンコモン</option>
                <option value="common">コモン</option>
              </select>
            </div>
            
            {/* チャプター */}
            <div>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                value={filterChapter}
                onChange={(e) => setFilterChapter(e.target.value)}
              >
                <option value="all">全チャプター</option>
                <option value="1">チャプター1</option>
                <option value="2">チャプター2</option>
                <option value="3">チャプター3</option>
                <option value="4">チャプター4</option>
                <option value="5">チャプター5</option>
              </select>
            </div>
            
            {/* ソート */}
            <div>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">新しい順</option>
                <option value="oldest">古い順</option>
                <option value="popular">人気順</option>
                <option value="name">名前順</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 text-gray-600">
            {filteredSkins.length} 件のスキンが見つかりました
          </div>
        </div>
      </section>

      {/* スキン一覧 */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredSkins.map((skin) => (
            <Link
              key={skin.id}
              href={`/skins/${skin.id}`}
              className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className={`h-1 bg-gradient-to-r ${getRarityColor(skin.rarity)}`} />
              <div className="relative aspect-square bg-gray-100">
                {!imageErrors.has(skin.id) ? (
                  <Image
                    src={`/images/skins/${skin.id}.webp`}
                    alt={skin.japaneseName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                    onError={() => handleImageError(skin.id)}
                  />
                ) : (
                  <Image
                    src={skin.images.icon}
                    alt={skin.japaneseName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                  />
                )}
              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm truncate">{skin.japaneseName}</h3>
                <p className="text-xs text-gray-500 truncate">{skin.set || skin.series || skin.type}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}