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
    <div className="bg-gradient-to-br from-slate-700 to-blue-800 rounded-2xl p-8 text-center relative overflow-hidden border border-blue-500">
      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="fireworks">⭐</div>
          <div className="fireworks delay-1">✨</div>
          <div className="fireworks delay-2">💫</div>
        </div>
      )}

      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-md"></div>
        </div>
      </div>
      <h2 className="text-3xl font-bold mb-4 text-white">
        V-Bucks 抽選会
      </h2>

      {!hasPlayedToday ? (
        <>
          <p className="text-lg mb-6 text-gray-300">
            毎日1回チャレンジ！V-Bucksが当たるかも
          </p>

          <button
            onClick={playLottery}
            disabled={isPlaying}
            className={`
              px-8 py-4 rounded-lg font-bold text-xl border-2
              transform transition-all duration-200
              ${isPlaying 
                ? 'bg-gray-600 border-gray-500 cursor-not-allowed scale-95 text-gray-400' 
                : 'bg-blue-500 border-blue-400 text-white hover:scale-105 hover:shadow-lg hover:bg-blue-600'
              }
            `}
          >
            {isPlaying ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                抽選中...
              </span>
            ) : (
              '抽選スタート'
            )}
          </button>
        </>
      ) : (
        <>
          {result !== null && (
            <div className="mb-6">
              {result > 0 ? (
                <div className="animate-bounce">
                  <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-10 h-10 bg-white rounded-full"></div>
                  </div>
                  <p className="text-4xl font-bold text-yellow-400 mb-2">
                    おめでとう！
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {result === -1 ? '限定クーポン当選' : `${result} V-Bucks 当選`}
                  </p>
                  {result === -1 && (
                    <p className="text-lg text-blue-300 mt-2">
                      次回ショップで使える10%OFFクーポン
                    </p>
                  )}
                  <p className="text-sm text-gray-400 mt-4">
                    ※これはデモです。実際のV-Bucksはもらえません
                  </p>
                </div>
              ) : (
                <div>
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                  </div>
                  <p className="text-2xl font-bold text-gray-300">
                    残念！ハズレでした
                  </p>
                  <p className="text-lg text-gray-400 mt-2">
                    また明日チャレンジしよう
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="text-gray-400">
            次回の抽選は明日です！毎日チェックしよう
          </p>
        </>
      )}

      <div className="mt-8 p-4 bg-slate-600/50 rounded-lg border border-gray-500">
        <div className="flex items-center mb-2">
          <div className="w-6 h-6 bg-yellow-500 rounded-md flex items-center justify-center mr-2">
            <div className="w-3 h-3 bg-white rounded-sm"></div>
          </div>
          <h3 className="font-bold text-lg text-white">当選確率</h3>
        </div>
        <div className="text-sm text-gray-300 space-y-1">
          <p>5000 V-Bucks: 0.01%</p>
          <p>2800 V-Bucks: 0.1%</p>
          <p>1000 V-Bucks: 1%</p>
          <p>限定クーポン: 5%</p>
        </div>
        <p className="text-xs text-gray-400 mt-2">
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