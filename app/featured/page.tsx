import { Metadata } from 'next'
import FeaturedClient from './FeaturedClient'

export const metadata: Metadata = {
  title: 'おすすめスキン - 今週の注目アイテム | フォートナイト ショップ図鑑',
  description: '今週のFortniteおすすめスキンを厳選紹介！人気の高いスキンや期間限定スキンをチェックしよう。',
}

export default function FeaturedPage() {
  return <FeaturedClient />
}