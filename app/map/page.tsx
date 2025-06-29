'use client'

import { useState } from 'react'
import Image from 'next/image'
import CollaborationAd from '@/components/CollaborationAd'

interface CollabOption {
  id: string
  name: string
  nameEn?: string
  category: 'game' | 'anime' | 'drama' | 'movie' | 'musician'
  description?: string
  votes: number
}

const collabOptions: CollabOption[] = [
  // ゲーム
  { id: 'game1', name: 'モンスターハンター', nameEn: 'Monster Hunter', category: 'game', description: 'カプコンの大人気狩猟アクション', votes: 0 },
  { id: 'game2', name: 'バイオハザード', nameEn: 'Resident Evil', category: 'game', description: 'サバイバルホラーの金字塔', votes: 0 },
  { id: 'game3', name: 'ファイナルファンタジー', nameEn: 'Final Fantasy', category: 'game', description: 'スクエニの王道RPG', votes: 0 },
  { id: 'game4', name: 'ペルソナ', nameEn: 'Persona', category: 'game', description: 'アトラスの人気JRPG', votes: 0 },
  { id: 'game5', name: 'ダークソウル', nameEn: 'Dark Souls', category: 'game', description: '高難度アクションRPG', votes: 0 },
  
  // アニメ
  { id: 'anime1', name: '呪術廻戦', nameEn: 'Jujutsu Kaisen', category: 'anime', description: '人気バトルアニメ', votes: 0 },
  { id: 'anime2', name: 'チェンソーマン', nameEn: 'Chainsaw Man', category: 'anime', description: 'ダークファンタジー', votes: 0 },
  { id: 'anime3', name: 'SPY×FAMILY', nameEn: 'SPY×FAMILY', category: 'anime', description: 'スパイ×家族コメディ', votes: 0 },
  { id: 'anime4', name: '推しの子', nameEn: 'Oshi no Ko', category: 'anime', description: 'エンタメ業界サスペンス', votes: 0 },
  { id: 'anime5', name: 'ワンピース', nameEn: 'One Piece', category: 'anime', description: '海賊冒険アニメ', votes: 0 },
  
  // ドラマ
  { id: 'drama1', name: 'ウォーキング・デッド', nameEn: 'The Walking Dead', category: 'drama', description: 'ゾンビサバイバル', votes: 0 },
  { id: 'drama2', name: 'ストレンジャー・シングス', nameEn: 'Stranger Things', category: 'drama', description: 'Netflix人気ドラマ', votes: 0 },
  { id: 'drama3', name: 'ザ・ボーイズ', nameEn: 'The Boys', category: 'drama', description: 'ダークヒーロードラマ', votes: 0 },
  { id: 'drama4', name: 'ゲーム・オブ・スローンズ', nameEn: 'Game of Thrones', category: 'drama', description: 'ファンタジー大作', votes: 0 },
  { id: 'drama5', name: 'ブレイキング・バッド', nameEn: 'Breaking Bad', category: 'drama', description: 'クライムドラマの傑作', votes: 0 },
  
  // 映画
  { id: 'movie1', name: 'ゴジラ', nameEn: 'Godzilla', category: 'movie', description: '日本が誇る怪獣映画', votes: 0 },
  { id: 'movie2', name: 'ジュラシック・パーク', nameEn: 'Jurassic Park', category: 'movie', description: '恐竜パニック映画', votes: 0 },
  { id: 'movie3', name: 'ハリー・ポッター', nameEn: 'Harry Potter', category: 'movie', description: '魔法ファンタジー', votes: 0 },
  { id: 'movie4', name: 'トランスフォーマー', nameEn: 'Transformers', category: 'movie', description: 'ロボットアクション', votes: 0 },
  { id: 'movie5', name: 'パシフィック・リム', nameEn: 'Pacific Rim', category: 'movie', description: '巨大ロボvs怪獣', votes: 0 },
  
  // ミュージシャン
  { id: 'musician1', name: 'YOASOBI', category: 'musician', description: '小説音楽ユニット', votes: 0 },
  { id: 'musician2', name: 'ポスト・マローン', nameEn: 'Post Malone', category: 'musician', description: 'ヒップホップアーティスト', votes: 0 },
  { id: 'musician3', name: 'ビリー・アイリッシュ', nameEn: 'Billie Eilish', category: 'musician', description: 'ポップアーティスト', votes: 0 },
  { id: 'musician4', name: 'ザ・ウィークエンド', nameEn: 'The Weeknd', category: 'musician', description: 'R&Bアーティスト', votes: 0 },
  { id: 'musician5', name: 'ドージャ・キャット', nameEn: 'Doja Cat', category: 'musician', description: 'ラップ・ポップアーティスト', votes: 0 },
]

const categoryInfo = {
  game: { label: 'ゲーム', color: 'blue', emoji: '🎮' },
  anime: { label: 'アニメ', color: 'red', emoji: '🌸' },
  drama: { label: 'ドラマ', color: 'purple', emoji: '📺' },
  movie: { label: '映画', color: 'yellow', emoji: '🎬' },
  musician: { label: 'ミュージシャン', color: 'green', emoji: '🎵' },
}

export default function MapPage() {
  const [collaborations, setCollaborations] = useState<CollabOption[]>(collabOptions)
  const [votedItems, setVotedItems] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const handleVote = (id: string) => {
    if (votedItems.has(id)) return

    setCollaborations(prev => 
      prev.map(item => 
        item.id === id ? { ...item, votes: item.votes + 1 } : item
      )
    )
    setVotedItems(prev => new Set(Array.from(prev).concat(id)))
  }

  const filteredCollabs = selectedCategory === 'all' 
    ? collaborations 
    : collaborations.filter(item => item.category === selectedCategory)

  const sortedCollabs = [...filteredCollabs].sort((a, b) => b.votes - a.votes)

  return (
    <div className="min-h-screen bg-slate-900">
      {/* ヘッダー */}
      <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-12 border-b border-blue-500">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-md"></div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            フォートナイト コラボ投票
          </h1>
          <p className="text-xl opacity-90">
            次にコラボしてほしい作品に投票しよう！
          </p>
        </div>
      </section>

      {/* カテゴリーフィルター */}
      <section className="py-8 bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white border-2 border-blue-500'
                  : 'bg-slate-700 text-gray-300 border-2 border-slate-600 hover:bg-slate-600'
              }`}
            >
              すべて
            </button>
            {Object.entries(categoryInfo).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === key
                    ? `bg-${info.color}-600 text-white border-2 border-${info.color}-500`
                    : 'bg-slate-700 text-gray-300 border-2 border-slate-600 hover:bg-slate-600'
                }`}
              >
                <span>{info.emoji}</span>
                {info.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 投票リスト */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-white text-center">
            投票ランキング
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCollabs.map((collab, index) => {
              const info = categoryInfo[collab.category]
              const isVoted = votedItems.has(collab.id)
              
              return (
                <div
                  key={collab.id}
                  className={`bg-slate-800 rounded-lg p-6 border transition-all ${
                    isVoted ? 'border-gray-600' : 'border-slate-700 hover:border-blue-500'
                  }`}
                >
                  {/* ランキング表示 */}
                  {index < 3 && (
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-2xl font-bold ${
                        index === 0 ? 'text-yellow-400' :
                        index === 1 ? 'text-gray-300' :
                        'text-orange-400'
                      }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full bg-${info.color}-900 text-${info.color}-300`}>
                        {info.emoji} {info.label}
                      </span>
                    </div>
                  )}
                  
                  {index >= 3 && (
                    <div className="flex justify-end mb-4">
                      <span className={`text-xs px-2 py-1 rounded-full bg-${info.color}-900 text-${info.color}-300`}>
                        {info.emoji} {info.label}
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-white mb-2">
                    {collab.name}
                  </h3>
                  {collab.nameEn && (
                    <p className="text-sm text-gray-400 mb-3">{collab.nameEn}</p>
                  )}
                  {collab.description && (
                    <p className="text-gray-300 text-sm mb-4">{collab.description}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-blue-400">{collab.votes}</span>
                      <span className="text-sm text-gray-400">票</span>
                    </div>
                    
                    <button
                      onClick={() => handleVote(collab.id)}
                      disabled={isVoted}
                      className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        isVoted
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                      }`}
                    >
                      {isVoted ? '投票済み' : '投票する'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 注意事項 */}
          <div className="mt-12 bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-3">投票について</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• 各項目に1回のみ投票できます</li>
              <li>• この投票は非公式のファン投票です</li>
              <li>• 実際のコラボ実現を保証するものではありません</li>
              <li>• 楽しみながら投票してください！</li>
            </ul>
          </div>

          {/* コラボ関連商品広告 */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 text-white text-center">関連商品</h3>
            <CollaborationAd showMultiple={true} count={2} />
          </div>
        </div>
      </section>

      {/* 統計情報 */}
      <section className="py-12 bg-slate-800 border-t border-slate-700">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-6 text-white text-center">投票統計</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {Object.entries(categoryInfo).map(([key, info]) => {
              const categoryVotes = collaborations
                .filter(item => item.category === key)
                .reduce((sum, item) => sum + item.votes, 0)
              
              return (
                <div key={key} className="bg-slate-700 rounded-lg p-4 text-center border border-slate-600">
                  <p className="text-2xl font-bold text-blue-400">{categoryVotes}</p>
                  <p className="text-sm text-gray-300">{info.emoji} {info.label}</p>
                </div>
              )
            })}
          </div>
          
          {/* 追加の広告 */}
          <div className="mt-8 max-w-md mx-auto">
            <CollaborationAd />
          </div>
        </div>
      </section>
    </div>
  )
}