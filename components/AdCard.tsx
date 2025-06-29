'use client'

import BannerAd from './BannerAd'
import { getRandomAd } from '@/lib/adProducts'
import { useEffect, useState } from 'react'

export default function AdCard() {
  const [product, setProduct] = useState(getRandomAd())
  
  // クライアントサイドでランダムに広告を変更
  useEffect(() => {
    setProduct(getRandomAd())
  }, [])
  
  return <BannerAd productData={product} />
}