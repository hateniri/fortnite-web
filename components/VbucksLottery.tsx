'use client'

import { useState, useEffect } from 'react'

export default function VbucksLottery() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [hasPlayedToday, setHasPlayedToday] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)

  useEffect(() => {
    // 今日既にプレイしたかチェック
    const today = new Date().toDateString()
    const lastPlayed = localStorage.getItem('vbucksLotteryLastPlayed')
    if (lastPlayed === today) {
      setHasPlayedToday(true)
    }
  }, [])

  const playLottery = () => {
    if (hasPlayedToday) return

    setIsPlaying(true)
    setResult(null)
    setShowFireworks(false)

    // アニメーション時間
    setTimeout(() => {
      // 当選確率の設定（実際のV-Bucksカード金額に合わせる）
      const rand = Math.random()
      let prize = 0
      let prizeType = ''

      if (rand < 0.0001) {
        // 0.01% - 5000 V-Bucks
        prize = 5000
        prizeType = 'legendary'
      } else if (rand < 0.001) {
        // 0.1% - 2800 V-Bucks
        prize = 2800
        prizeType = 'epic'
      } else if (rand < 0.01) {
        // 1% - 1000 V-Bucks
        prize = 1000
        prizeType = 'rare'
      } else if (rand < 0.05) {
        // 5% - スキン割引クーポン（架空）
        prize = -1
        prizeType = 'coupon'
      }

      setResult(prize)
      setIsPlaying(false)

      if (prize > 0) {
        setShowFireworks(true)
        // 花火エフェクトを5秒後に非表示
        setTimeout(() => setShowFireworks(false), 5000)
      }

      // 今日プレイしたことを記録
      const today = new Date().toDateString()
      localStorage.setItem('vbucksLotteryLastPlayed', today)
      setHasPlayedToday(true)
    }, 2000)
  }

  return (
    <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 text-center relative overflow-hidden">
      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="fireworks">🎆</div>
          <div className="fireworks delay-1">🎇</div>
          <div className="fireworks delay-2">✨</div>
        </div>
      )}

      <h2 className="text-3xl font-bold mb-4 text-purple-800">
        🎰 V-Bucks 抽選会 🎰
      </h2>

      {!hasPlayedToday ? (
        <>
          <p className="text-lg mb-6 text-gray-700">
            毎日1回チャレンジ！V-Bucksが当たるかも！？
          </p>

          <button
            onClick={playLottery}
            disabled={isPlaying}
            className={`
              px-8 py-4 rounded-lg font-bold text-xl
              transform transition-all duration-200
              ${isPlaying 
                ? 'bg-gray-400 cursor-not-allowed scale-95' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105 hover:shadow-lg'
              }
            `}
          >
            {isPlaying ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">🎲</span>
                抽選中...
              </span>
            ) : (
              '抽選スタート！'
            )}
          </button>
        </>
      ) : (
        <>
          {result !== null && (
            <div className="mb-6">
              {result > 0 ? (
                <div className="animate-bounce">
                  <p className="text-4xl font-bold text-yellow-500 mb-2">
                    🎉 おめでとう！ 🎉
                  </p>
                  <p className="text-3xl font-bold text-purple-800">
                    {result === -1 ? '限定クーポン当選！' : `${result} V-Bucks 当選！`}
                  </p>
                  {result === -1 && (
                    <p className="text-lg text-purple-600 mt-2">
                      次回ショップで使える10%OFFクーポン！
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mt-4">
                    ※これはデモです。実際のV-Bucksはもらえません
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-2xl font-bold text-gray-600">
                    😅 残念！ハズレでした
                  </p>
                  <p className="text-lg text-gray-500 mt-2">
                    また明日チャレンジしてね！
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="text-gray-500">
            次回の抽選は明日です！毎日遊びに来てね！
          </p>
        </>
      )}

      <div className="mt-8 p-4 bg-white/50 rounded-lg">
        <h3 className="font-bold text-lg mb-2">🏆 当選確率</h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p>5000 V-Bucks: 0.01% 🌟</p>
          <p>2800 V-Bucks: 0.1% ⭐</p>
          <p>1000 V-Bucks: 1% ✨</p>
          <p>限定クーポン: 5% 🎫</p>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          ※実際のV-Bucksカード金額に合わせています
        </p>
      </div>

      <style jsx>{`
        .fireworks {
          position: absolute;
          font-size: 4rem;
          animation: firework 3s ease-out forwards;
        }
        
        .delay-1 {
          animation-delay: 0.5s;
          left: 20%;
        }
        
        .delay-2 {
          animation-delay: 1s;
          right: 20%;
        }
        
        @keyframes firework {
          0% {
            bottom: 0;
            opacity: 1;
            transform: scale(0.5);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
          100% {
            bottom: 100%;
            opacity: 0;
            transform: scale(2);
          }
        }
      `}</style>
    </div>
  )
}