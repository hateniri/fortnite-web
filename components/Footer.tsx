export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-300 to-pink-300 text-purple-900 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">🌟 フォートナイト ショップ図鑑 🌟</h3>
          <p className="text-lg mb-4">
            毎日午前5時に更新！お気に入りのスキンを見逃さないでね！
          </p>
          
          <div className="flex justify-center gap-4 mb-6">
            <span className="bg-white/50 px-4 py-2 rounded-full">
              🎮 毎日チェック
            </span>
            <span className="bg-white/50 px-4 py-2 rounded-full">
              💰 V-Bucks節約
            </span>
            <span className="bg-white/50 px-4 py-2 rounded-full">
              🌈 楽しく選ぼう
            </span>
          </div>
          
          <p className="text-sm opacity-80">
            ※これはファンが作った非公式サイトです。Epic Gamesとは関係ありません。
          </p>
          <p className="text-xs mt-2 opacity-60">
            Fortniteは Epic Games, Inc. の商標です。
          </p>
        </div>
      </div>
    </footer>
  )
}