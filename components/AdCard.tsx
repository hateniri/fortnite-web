export default function AdCard() {
  return (
    <div className="bg-gray-100 rounded-lg p-6 text-center h-full min-h-[300px] flex flex-col items-center justify-center">
      <span className="text-xs text-gray-500 mb-2">広告</span>
      <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
        {/* Google AdSenseまたは他の広告プロバイダーのコード */}
        <p className="text-gray-400 text-sm">広告スペース</p>
      </div>
    </div>
  )
}