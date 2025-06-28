'use client'

import { useEffect, useRef } from 'react'

interface BannerAdProps {
  bannerId?: string
  affiliateId?: string
  className?: string
}

export default function BannerAd({ 
  bannerId = '1027_336_280',
  affiliateId = 'gammon-002',
  className = ''
}: BannerAdProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  
  useEffect(() => {
    if (!containerRef.current) return
    
    // 既存のスクリプトがあれば削除
    if (scriptRef.current && scriptRef.current.parentNode) {
      scriptRef.current.parentNode.removeChild(scriptRef.current)
    }
    
    // 新しいスクリプトを作成
    const script = document.createElement('script')
    script.src = `https://widget-view.dmm.com/js/banner_placement.js?affiliate_id=${affiliateId}&banner_id=${bannerId}`
    script.className = 'widget-banner-script'
    script.async = true
    
    scriptRef.current = script
    containerRef.current.appendChild(script)
    
    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current)
      }
    }
  }, [bannerId, affiliateId])
  
  return (
    <div className={`bg-slate-800 rounded-lg overflow-hidden border border-slate-600 inline-block ${className}`}>
      <div className="p-2 bg-slate-700 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center mr-2">
            <div className="w-2 h-2 bg-white rounded-sm"></div>
          </div>
          <span className="text-xs text-gray-400">PR</span>
        </div>
        <span className="text-xs text-gray-500">広告</span>
      </div>
      <div 
        ref={containerRef}
        className="banner-container flex items-center justify-center bg-slate-900" 
        style={{ width: '336px', height: '280px' }}
      >
        <ins className="widget-banner"></ins>
      </div>
    </div>
  )
}