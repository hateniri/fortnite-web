'use client'

import BannerAd from './BannerAd'
import { getWeightedRandomAd } from '@/lib/adProducts'
import { useEffect, useState } from 'react'

export default function AdCard() {
  const [product, setProduct] = useState(() => 
    // ショップページではホビー商品の表示確率を上げる
    getWeightedRandomAd({ hobby: 3, photo: 2 })
  )
  
  // クライアントサイドでランダムに広告を変更
  useEffect(() => {
    setProduct(getWeightedRandomAd({ hobby: 3, photo: 2 }))
  }, [])
  
  return <BannerAd productData={product} />
}