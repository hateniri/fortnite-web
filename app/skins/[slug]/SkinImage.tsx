'use client'

import Image from 'next/image'
import { useState } from 'react'

interface SkinImageProps {
  id: string
  name: string
  imageUrl: string
}

export default function SkinImage({ id, name, imageUrl }: SkinImageProps) {
  const [imgSrc, setImgSrc] = useState(`/images/skins/${id}.webp`)

  return (
    <Image
      src={imgSrc}
      alt={`${name} スキン画像`}
      fill
      className="object-cover"
      priority
      sizes="(max-width: 1024px) 100vw, 50vw"
      onError={() => {
        // WebP画像が見つからない場合はオリジナルURLにフォールバック
        if (imgSrc !== imageUrl) {
          setImgSrc(imageUrl);
        }
      }}
    />
  )
}