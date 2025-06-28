'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

interface BannerAdProps {
  bannerId?: string
  affiliateId?: string
  className?: string
  productData?: {
    title: string
    price: string
    imageUrl: string
    link: string
  }
}

export default function BannerAd({ 
  bannerId = '1027_336_280',
  affiliateId = 'gammon-002',
  className = '',
  productData
}: BannerAdProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  
  useEffect(() => {
    if (!containerRef.current || productData) return
    
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
  }, [bannerId, affiliateId, productData])
  
  // Custom product card style (matches SkinCard design)
  if (productData) {
    return (
      <a href={productData.link} target="_blank" rel="sponsored" className="block">
        <div className={`skin-card bg-slate-700 border border-slate-600 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:border-blue-500 ${className}`}>
          {/* Header bar with PR tag */}
          <div className="h-8 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center px-3">
            <span className="text-white text-sm font-bold flex items-center">
              <span className="mr-2">🎁</span>
              PR
            </span>
          </div>
          
          {/* Product image */}
          <div className="relative aspect-square bg-slate-800">
            <Image
              src={productData.imageUrl}
              alt={productData.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <span className="absolute top-2 right-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              広告
            </span>
          </div>
          
          {/* Product info */}
          <div className="p-4 bg-slate-700">
            <h3 className="font-bold text-lg mb-2 text-white line-clamp-2">{productData.title}</h3>
            <div className="flex justify-between items-center mt-3">
              <span className="text-purple-400 font-bold text-xl">{productData.price}</span>
              <span className="text-sm text-gray-400">詳細を見る</span>
            </div>
          </div>
        </div>
      </a>
    )
  }
  
  // Fallback to script-based ad with SkinCard style
  return (
    <div className={`skin-card bg-slate-700 border border-slate-600 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:border-purple-500 ${className}`}>
      <div className="h-8 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center px-3">
        <span className="text-white text-sm font-bold flex items-center">
          <span className="mr-2">🎁</span>
          PR
        </span>
      </div>
      <div 
        ref={containerRef}
        className="relative bg-slate-800" 
        style={{ aspectRatio: '1' }}
      >
        <ins className="widget-banner"></ins>
        <span className="absolute top-2 right-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          広告
        </span>
      </div>
    </div>
  )
}