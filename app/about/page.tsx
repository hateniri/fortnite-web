import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'このサイトについて | フォートナイト ショップ図鑑',
  description: 'フォートナイト ショップ図鑑は、毎日のアイテムショップ情報を日本語でお届けする非公式ファンサイトです。',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* ヘッダー */}
      <section className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🌟 このサイトについて 🌟
          </h1>
          <p className="text-xl opacity-90">
            フォートナイト ショップ図鑑へようこそ！
          </p>
        </div>
      </section>

      {/* メインコンテンツ */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* サイトの目的 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-purple-600">
              🎯 このサイトの目的
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              フォートナイト ショップ図鑑は、毎日更新されるアイテムショップの情報を
              <span className="font-bold text-blue-600">日本語で分かりやすく</span>
              お届けする非公式ファンサイトです。
            </p>
            <p className="text-lg text-gray-700">
              子供から大人まで、すべてのフォートナイトプレイヤーが
              楽しくスキンを選べるように作られています！
            </p>
          </div>

          {/* 主な機能 */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-purple-800">
              ✨ 主な機能
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <span className="text-2xl mr-2">🛍️</span>
                  毎日のショップ情報
                </h3>
                <p className="text-gray-700">
                  今日のアイテムショップに登場するスキンを画像付きで紹介。
                  日本語での説明付き！
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <span className="text-2xl mr-2">📚</span>
                  スキンデータベース
                </h3>
                <p className="text-gray-700">
                  2400種類以上のスキンを収録！
                  検索やフィルター機能で欲しいスキンがすぐ見つかる！
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <span className="text-2xl mr-2">🎰</span>
                  V-Bucks抽選会
                </h3>
                <p className="text-gray-700">
                  毎日1回チャレンジできる楽しい抽選会！
                  運が良ければV-Bucksが当たるかも！？（デモ機能）
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <span className="text-2xl mr-2">🎆</span>
                  復刻スキン情報
                </h3>
                <p className="text-gray-700">
                  長期間登場していなかったレアなスキンを特集！
                  見逃さないようにチェック！
                </p>
              </div>
            </div>
          </div>

          {/* Shadow Official戦略 */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-orange-800">
              🧩 私たちの想い
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              このサイトは、公式サイトでは実現できない
              <span className="font-bold text-orange-600">「あったらいいな」</span>
              を形にしました：
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-2xl mr-3">🚀</span>
                <div>
                  <strong>超高速表示</strong> - スマホでもサクサク見られる軽量設計
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">🇯🇵</span>
                <div>
                  <strong>完全日本語対応</strong> - ゲーム内の正式な日本語名を使用
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">👶</span>
                <div>
                  <strong>子供にも分かりやすい</strong> - 楽しくて親しみやすい説明文
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">📱</span>
                <div>
                  <strong>通知機能</strong> - LINEやDiscordで最新情報をお届け（準備中）
                </div>
              </li>
            </ul>
          </div>

          {/* 免責事項 */}
          <div className="bg-gray-100 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              ⚠️ 免責事項
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>• このサイトは非公式のファンサイトです</li>
              <li>• Epic Gamesとは一切関係ありません</li>
              <li>• V-Bucks抽選はデモ機能で、実際のV-Bucksはもらえません</li>
              <li>• スキンの価格や登場日は変更される可能性があります</li>
              <li>• 画像の著作権はEpic Gamesに帰属します</li>
            </ul>
          </div>

          {/* お問い合わせ */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-6 text-purple-600">
              💌 ご意見・ご要望
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              サイトへのご意見やご要望がありましたら、
              ぜひお聞かせください！
            </p>
            <div className="space-y-4">
              <Link
                href="/subscribe"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
              >
                更新通知を受け取る
              </Link>
              <p className="text-sm text-gray-500">
                ※お問い合わせ機能は準備中です
              </p>
            </div>
          </div>

          {/* 最後のメッセージ */}
          <div className="mt-12 text-center">
            <p className="text-2xl font-bold text-purple-600 mb-4">
              🎮 楽しいフォートナイトライフを！ 🎮
            </p>
            <p className="text-gray-600">
              毎日サイトをチェックして、お気に入りのスキンを見つけよう！
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}