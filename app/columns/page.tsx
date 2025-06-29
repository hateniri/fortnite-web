import Link from 'next/link'
import { columnsData } from '@/lib/columnsData'
import ColumnAd from '@/components/ColumnAd'

export const metadata = {
  title: 'コラム | フォートナイター',
  description: 'フォートナイトと子育て、教育、社会問題についての寄稿コラム集',
}

export default function ColumnsPage() {
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

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-2">コラム</h1>
        <p className="text-gray-400 mb-8">フォートナイトを通じて見える、令和の子育てと社会</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {columnsData.map((column) => (
            <Link
              key={column.id}
              href={`/columns/${column.id}`}
              className="block bg-slate-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-slate-700 hover:border-blue-500"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs text-white px-3 py-1 rounded-full ${getCategoryColor(column.category)}`}>
                    {categories[column.category]}
                  </span>
                  <span className="text-xs text-gray-500">vol.{20 - column.id}</span>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-3 line-clamp-2">
                  {column.title}
                </h2>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {column.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{column.date}</span>
                  <span>{column.author}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* コラム関連広告 */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">おすすめ商品</h2>
          <div className="max-w-md mx-auto">
            <ColumnAd position="sidebar" />
          </div>
        </div>
      </div>
    </div>
  )
}