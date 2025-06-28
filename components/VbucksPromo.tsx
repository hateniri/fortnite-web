'use client'

import { useState, useEffect } from 'react'

export default function VbucksPromo() {
  const [nextCampaignDate, setNextCampaignDate] = useState<string>('')
  
  useEffect(() => {
    // 次回のキャンペーン日を生成（例: 次の月末）
    const today = new Date()
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const options: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      day: 'numeric',
      timeZone: 'Asia/Tokyo'
    }
    setNextCampaignDate(nextMonth.toLocaleDateString('ja-JP', options))
  }, [])
  
  return (
    <div className="bg-gradient-to-br from-slate-700 to-blue-800 rounded-2xl p-8 text-center relative overflow-hidden border border-blue-500">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-md"></div>
        </div>
      </div>
      
      <h2 className="text-3xl font-bold mb-4 text-white">
        V-Bucks プレゼント企画
      </h2>
      
      <div className="bg-slate-900/50 rounded-lg p-6 mb-6">
        <p className="text-xl text-gray-300 mb-4">
          現在、プレゼント企画は準備中です
        </p>
        <p className="text-lg text-blue-400 font-semibold">
          次回開催予定：{nextCampaignDate}頃
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-slate-600/50 rounded-lg p-4 border border-gray-500">
          <h3 className="font-bold text-lg text-white mb-2">
            過去のプレゼント企画
          </h3>
          <div className="text-sm text-gray-300 space-y-2">
            <p>• 2024年10月: 5,000 V-Bucks × 3名様</p>
            <p>• 2024年8月: 2,800 V-Bucks × 5名様</p>
            <p>• 2024年6月: 1,000 V-Bucks × 10名様</p>
          </div>
        </div>
        
        <div className="text-gray-400 text-sm">
          <p className="mb-2">
            定期的にV-Bucksプレゼント企画を開催しています！
          </p>
          <p>
            サイトをブックマークして、お見逃しなく
          </p>
        </div>
      </div>
      
      <div className="mt-6 p-3 bg-yellow-500/20 rounded-lg">
        <p className="text-yellow-300 text-sm font-medium">
          💡 ヒント: 月末に開催することが多いです
        </p>
      </div>
    </div>
  )
}