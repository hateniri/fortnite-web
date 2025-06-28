import { Metadata } from 'next'
import DatabaseClient from './DatabaseClient'

export const metadata: Metadata = {
  title: 'スキンデータベース - 全スキン一覧 | フォートナイト ショップ図鑑',
  description: 'Fortniteの全スキンを画像付きで検索・閲覧できるデータベース。レアリティ、シリーズ、チャプター別に探せます。',
}

export default function DatabasePage() {
  return <DatabaseClient />
}