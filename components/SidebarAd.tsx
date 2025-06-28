'use client'

export default function SidebarAd() {
  return (
    <div className="bg-slate-800 rounded-lg p-3 border border-slate-600 mb-4">
      <div className="flex items-center mb-2">
        <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
        <span className="text-xs text-gray-400">おすすめ</span>
      </div>
      <h4 className="text-sm font-bold text-white mb-1">
        フォートナイト攻略アプリ
      </h4>
      <p className="text-xs text-gray-300 mb-2">
        最新の武器情報やマップ攻略
      </p>
      <button className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors">
        ダウンロード
      </button>
    </div>
  )
}