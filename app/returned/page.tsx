import { Metadata } from 'next'
import ReturnedClient from './ReturnedClient'

export const metadata: Metadata = {
  title: '復刻スキン - 久しぶりに登場したスキン | フォートナイト ショップ図鑑',
  description: '長期間ショップに登場していなかった復刻スキンをチェック！レアなスキンを見逃すな！',
}

export default function ReturnedPage() {
  return <ReturnedClient />
}