import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'このサイトについて | フォートナイターズ',
  description: 'フォートナイターズは、毎日のアイテムショップ情報を日本語でお届けする非公式ファンサイトです。',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* ヘッダー */}
      <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-12 border-b border-blue-500">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-md"></div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            このサイトについて
          </h1>
          <p className="text-xl opacity-90">
            フォートナイターズへようこそ！
          </p>
        </div>
      </section>

      {/* メインコンテンツ */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* サイトの目的 */}
          <div className="bg-slate-800 rounded-lg p-8 mb-8 border border-slate-700">
            <h2 className="text-3xl font-bold mb-6 text-blue-400">
              このサイトの目的
            </h2>
            <p className="text-lg text-gray-300 mb-4">
              フォートナイターズは、毎日更新されるアイテムショップの情報を
              <span className="font-bold text-blue-400">日本語で分かりやすく</span>
              お届けする非公式ファンサイトです。
            </p>
            <p className="text-lg text-gray-300">
              子供から大人まで、すべてのフォートナイトプレイヤーが
              楽しくスキンを選べるように作られています！
            </p>
          </div>

          {/* 主な機能 */}
          <div className="bg-slate-800 rounded-lg p-8 mb-8 border border-slate-700">
            <h2 className="text-3xl font-bold mb-6 text-blue-400">
              主な機能
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                <h3 className="text-xl font-bold mb-3 text-white">
                  毎日のショップ情報
                </h3>
                <p className="text-gray-300">
                  今日のアイテムショップに登場するスキンを画像付きで紹介。
                  日本語での説明付き！
                </p>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                <h3 className="text-xl font-bold mb-3 text-white">
                  マップ情報
                </h3>
                <p className="text-gray-300">
                  現在のマップとPOI情報を日本語で表示！
                  主要エリアの特徴もわかりやすく解説！
                </p>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                <h3 className="text-xl font-bold mb-3 text-white">
                  V-Bucks抽選会
                </h3>
                <p className="text-gray-300">
                  毎日1回チャレンジできる楽しい抽選会！
                  運が良ければV-Bucksが当たるかも！？（デモ機能）
                </p>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                <h3 className="text-xl font-bold mb-3 text-white">
                  最新ニュース
                </h3>
                <p className="text-gray-300">
                  フォートナイトの最新ニュースを日本語で配信！
                  匿名コメントで盛り上がろう！
                </p>
              </div>
            </div>
          </div>

          {/* Shadow Official戦略 */}
          <div className="bg-gradient-to-br from-slate-800 to-blue-900 rounded-lg p-8 mb-8 border border-blue-500">
            <h2 className="text-3xl font-bold mb-6 text-blue-400">
              私たちの想い
            </h2>
            <p className="text-lg text-gray-300 mb-4">
              このサイトは、公式サイトでは実現できない
              <span className="font-bold text-blue-400">「あったらいいな」</span>
              を形にしました：
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <strong className="text-white">超高速表示</strong>
                  <p className="text-sm mt-1">スマホでもサクサク見られる軽量設計</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <strong className="text-white">完全日本語対応</strong>
                  <p className="text-sm mt-1">ゲーム内の正式な日本語名を使用</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <strong className="text-white">子供にも分かりやすい</strong>
                  <p className="text-sm mt-1">楽しくて親しみやすい説明文</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div>
                  <strong className="text-white">通知機能</strong>
                  <p className="text-sm mt-1">LINEやDiscordで最新情報をお届け（準備中）</p>
                </div>
              </li>
            </ul>
          </div>

          {/* 免責事項 */}
          <div className="bg-slate-800 rounded-lg p-8 mb-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">
              免責事項
            </h2>
            <ul className="space-y-2 text-gray-300">
              <li>• このサイトは非公式のファンサイトです</li>
              <li>• Epic Gamesとは一切関係ありません</li>
              <li>• V-Bucks抽選はデモ機能で、実際のV-Bucksはもらえません</li>
              <li>• スキンの価格や登場日は変更される可能性があります</li>
              <li>• 画像の著作権はEpic Gamesに帰属します</li>
            </ul>
          </div>

          {/* お問い合わせ */}
          <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
            <h2 className="text-3xl font-bold mb-6 text-blue-400">
              ご意見・ご要望
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              サイトへのご意見やご要望がありましたら、
              ぜひお聞かせください！
            </p>
            <div className="space-y-4">
              <Link
                href="/subscribe"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                更新通知を受け取る
              </Link>
              <p className="text-sm text-gray-400">
                ※お問い合わせ機能は準備中です
              </p>
            </div>
          </div>

          {/* 最後のメッセージ */}
          <div className="mt-12 text-center">
            <p className="text-2xl font-bold text-blue-400 mb-4">
              楽しいフォートナイトライフを！
            </p>
            <p className="text-gray-400">
              毎日サイトをチェックして、お気に入りのスキンを見つけよう！
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}