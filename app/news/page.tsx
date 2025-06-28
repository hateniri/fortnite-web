import fs from 'fs/promises'
import path from 'path'
import Image from 'next/image'
import CommentSection from '@/components/CommentSection'

interface NewsItem {
  id: string
  title: string
  body: string
  image: string
  tileImage: string
  sortingPriority: number
}

interface NewsData {
  lastUpdate: string
  br: NewsItem[]
  stw: any[]
  creative: any[]
}

async function getNewsData(): Promise<NewsData | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'news.json')
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading news data:', error)
    return null
  }
}

export default async function NewsPage() {
  const newsData = await getNewsData()
  
  if (!newsData || newsData.br.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-gray-500 text-xl">ニュースがありません。</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* ヘッダー */}
      <section className="bg-gradient-to-b from-purple-900 to-slate-900 text-white py-12 border-b border-purple-500">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-md"></div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            フォートナイト最新ニュース
          </h1>
          <p className="text-xl opacity-90">
            公式ニュースと匿名掲示板で盛り上がろう！
          </p>
        </div>
      </section>

      {/* ニュース一覧 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {newsData.br.map((news, index) => (
              <article key={news.id} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                {/* ニュース画像 */}
                {news.image && (
                  <div className="relative aspect-video bg-slate-900">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                )}

                {/* ニュース内容 */}
                <div className="p-6">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {news.title}
                  </h2>
                  
                  {news.body && (
                    <p className="text-gray-300 text-lg mb-6 whitespace-pre-wrap">
                      {news.body}
                    </p>
                  )}

                  <div className="flex items-center text-sm text-gray-400 mb-6">
                    <div className="w-4 h-4 bg-purple-600 rounded mr-2"></div>
                    <span>優先度: {news.sortingPriority}</span>
                  </div>
                </div>

                {/* コメントセクション */}
                <div className="p-6 bg-slate-900 border-t border-slate-700">
                  <CommentSection newsId={news.id} />
                </div>
              </article>
              
              {/* 3記事ごとに控えめな広告 */}
              {(index + 1) % 3 === 0 && index < newsData.br.length - 1 && (
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-600 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
                    <span className="text-xs text-gray-400">PR</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">
                    フォートナイト関連グッズをチェック
                  </p>
                  <button className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 transition-colors">
                    ショップを見る
                  </button>
                </div>
              )}
            ))}
          </div>
        </div>
      </section>

      {/* 注意事項 */}
      <section className="py-12 bg-slate-800 border-t border-slate-700">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-red-400 mb-2">
              注意事項
            </h3>
            <p className="text-gray-300">
              このコメント欄は完全匿名です。誹謗中傷はやめましょう（でも止められへんけどな）。
              投稿内容は各自の責任でお願いします。Epic Gamesとは一切関係ありません。
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}