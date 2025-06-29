'use client'

import BannerAd from './BannerAd'
import { getAdsByCategory } from '@/lib/adProducts'
import { useEffect, useState } from 'react'

export default function SidebarAd() {
  const [product, setProduct] = useState(() => {
    // 写真集カテゴリーから選択（サイドバーに適している）
    const photoAds = getAdsByCategory('photo')
    return photoAds[Math.floor(Math.random() * photoAds.length)]
  })
  
  useEffect(() => {
    const photoAds = getAdsByCategory('photo')
    setProduct(photoAds[Math.floor(Math.random() * photoAds.length)])
  }, [])
  
  return <BannerAd productData={product} className="mb-4" />
}