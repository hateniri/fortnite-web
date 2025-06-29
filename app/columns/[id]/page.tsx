import { notFound } from 'next/navigation'
import Link from 'next/link'
import { columnsData } from '@/lib/columnsData'
import BannerAd from '@/components/BannerAd'
import { getRandomAds } from '@/lib/adProducts'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const column = columnsData.find(c => c.id === parseInt(params.id))
  
  if (!column) {
    return {
      title: 'コラムが見つかりません | フォートナイター',
    }
  }

  return {
    title: `${column.title} | フォートナイター`,
    description: column.excerpt,
  }
}

export async function generateStaticParams() {
  return columnsData.map((column) => ({
    id: column.id.toString(),
  }))
}

export default function ColumnPage({ params }: { params: { id: string } }) {
  const column = columnsData.find(c => c.id === parseInt(params.id))

  if (!column) {
    notFound()
  }

  const categories = {
    gaming: 'ゲーム',
    parenting: '子育て',
    social: '社会',
    education: '教育',
    relationship: '人間関係',
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'gaming':
        return 'bg-purple-600'
      case 'parenting':
        return 'bg-blue-600'
      case 'social':
        return 'bg-green-600'
      case 'education':
        return 'bg-orange-600'
      case 'relationship':
        return 'bg-pink-600'
      default:
        return 'bg-gray-600'
    }
  }

  const prevColumn = columnsData.find(c => c.id === column.id - 1)
  const nextColumn = columnsData.find(c => c.id === column.id + 1)
  
  // ランダムに2つの広告を選択
  const ads = getRandomAds(2)

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/columns" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          コラム一覧に戻る
        </Link>

        <article className="bg-slate-800 rounded-lg p-8 border border-slate-700">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <span className={`text-xs text-white px-3 py-1 rounded-full ${getCategoryColor(column.category)}`}>
                {categories[column.category]}
              </span>
              <span className="text-sm text-gray-500">vol.{20 - column.id}</span>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">
              {column.title}
            </h1>
            
            <div className="flex items-center justify-between text-sm text-gray-500 border-b border-slate-700 pb-4">
              <span>{column.date}</span>
              <span>{column.author}</span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            {column.content.split('\n').map((paragraph, index) => {
              if (paragraph.trim() === '') {
                return <br key={index} />
              }
              
              // 記事の中盤（全体の40%の位置）に広告を挿入
              const totalParagraphs = column.content.split('\n').filter(p => p.trim() !== '').length
              const midPoint = Math.floor(totalParagraphs * 0.4)
              const currentParagraphIndex = column.content.split('\n').slice(0, index).filter(p => p.trim() !== '').length
              
              return (
                <>
                  <p key={index} className="text-gray-300 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                  {currentParagraphIndex === midPoint && ads[0] && (
                    <div className="my-8 flex justify-center">
                      <div className="max-w-sm">
                        <BannerAd productData={ads[0]} />
                      </div>
                    </div>
                  )}
                </>
              )
            })}
          </div>
        </article>

        {/* 記事下の広告 */}
        {ads[1] && (
          <div className="mt-8 flex justify-center">
            <div className="max-w-sm">
              <BannerAd productData={ads[1]} />
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {prevColumn ? (
            <Link
              href={`/columns/${prevColumn.id}`}
              className="flex items-center text-blue-400 hover:text-blue-300"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div className="text-left">
                <div className="text-xs text-gray-500">前の記事</div>
                <div className="text-sm">{prevColumn.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          
          {nextColumn ? (
            <Link
              href={`/columns/${nextColumn.id}`}
              className="flex items-center text-blue-400 hover:text-blue-300"
            >
              <div className="text-right">
                <div className="text-xs text-gray-500">次の記事</div>
                <div className="text-sm">{nextColumn.title}</div>
              </div>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  )
}