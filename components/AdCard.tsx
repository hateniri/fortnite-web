export default function AdCard() {
  return (
    <div className="bg-gradient-to-br from-slate-700 to-gray-800 rounded-lg p-4 text-white border border-slate-600">
      <div className="flex items-center mb-3">
        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center mr-2">
          <div className="w-3 h-3 bg-white rounded-sm"></div>
        </div>
        <span className="text-xs text-gray-400">スポンサー</span>
      </div>
      <h3 className="text-sm font-bold mb-2">
        ゲーマー向けキーボード
      </h3>
      <p className="text-xs text-gray-300 mb-3">
        プロも愛用の高性能ゲーミングキーボード
      </p>
      <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors">
        チェック
      </button>
    </div>
  )
}