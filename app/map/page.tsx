import fs from 'fs/promises'
import path from 'path'
import Image from 'next/image'

interface Location {
  id: string
  name: string
  nameJa: string
  type: string
  location: {
    x: number
    y: number
    z: number
  }
  description: string
}

interface POIData {
  summary: string
  locations: Location[]
  totalCount: number
  lastUpdate: string
}

interface MapData {
  lastUpdate: string
  mapImage: string
  pois: any[]
  stats: {
    totalPOIs: number
    landmarks: number
    namedLocations: number
  }
}

interface MapHistoryItem {
  id: string
  name: string
  date: string
  image: string
  description: string
  featured: string[]
  isCurrent: boolean
}

interface MapHistoryData {
  lastUpdate: string
  maps: MapHistoryItem[]
  stats: {
    totalMaps: number
    currentChapter: number
    currentSeason: number
  }
}

async function getPOIData(): Promise<POIData | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'poi.json')
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading POI data:', error)
    return null
  }
}

async function getMapData(): Promise<MapData | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'map.json')
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading map data:', error)
    return null
  }
}

async function getMapHistoryData(): Promise<MapHistoryData | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'map_history.json')
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading map history data:', error)
    return null
  }
}

export default async function MapPage() {
  const poiData = await getPOIData()
  const mapData = await getMapData()
  const historyData = await getMapHistoryData()
  
  if (!poiData || !mapData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-gray-500 text-xl">マップデータを読み込めませんでした。</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* ヘッダー */}
      <section className="bg-gradient-to-b from-green-900 to-slate-900 text-white py-12 border-b border-green-500">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-md"></div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            フォートナイトマップ
          </h1>
          <p className="text-xl opacity-90">
            {poiData.summary}
          </p>
        </div>
      </section>

      {/* マップ表示 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-white flex items-center">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
              <div className="w-5 h-5 bg-white rounded-sm"></div>
            </div>
            現在のマップ
          </h2>

          {/* マップ画像とPOI */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
            <div className="relative">
              <div className="aspect-square bg-slate-700 rounded-lg overflow-hidden">
                <Image
                  src="/images/map.png"
                  alt="Fortnite Battle Royale Map"
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                  priority
                />
                
                {/* POIマーカー */}
                {poiData.locations.map((location) => (
                  <div
                    key={location.id}
                    className="absolute"
                    style={{
                      left: `${(location.location.x / 400) * 100}%`,
                      top: `${(location.location.y / 400) * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="group relative">
                      <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                        location.type === 'namedLocation' ? 'bg-red-500' : 'bg-yellow-500'
                      } hover:scale-150 transition-transform cursor-pointer`}></div>
                      
                      {/* ツールチップ */}
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        <div className="font-bold">{location.nameJa}</div>
                        <div className="text-sm text-gray-300">{location.type === 'namedLocation' ? '命名エリア' : 'ランドマーク'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 凡例 */}
            <div className="mt-4 flex items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                <span>命名エリア</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full border border-white"></div>
                <span>ランドマーク</span>
              </div>
              <div className="text-xs text-gray-400 ml-auto">
                最終更新: {new Date(poiData.lastUpdate).toLocaleDateString('ja-JP')}
              </div>
            </div>
          </div>

          {/* エリア一覧 */}
          <h3 className="text-2xl font-bold mb-6 text-white">主要エリア一覧</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {poiData.locations.map((location) => (
              <div key={location.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-green-500 transition-colors">
                <div className="flex items-center mb-3">
                  <div className={`w-6 h-6 rounded-full ${
                    location.type === 'namedLocation' ? 'bg-red-500' : 'bg-yellow-500'
                  } mr-3`}></div>
                  <h4 className="text-xl font-bold text-white">{location.nameJa}</h4>
                </div>
                <p className="text-sm text-gray-400 mb-3">{location.name}</p>
                <p className="text-gray-300">{location.description}</p>
                <div className="mt-4 text-xs text-gray-500">
                  座標: ({location.location.x}, {location.location.y})
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 統計情報 */}
      <section className="py-12 bg-slate-800 border-t border-slate-700">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-6 text-white text-center">マップ統計</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-slate-700 rounded-lg p-4 text-center border border-slate-600">
              <p className="text-2xl font-bold text-green-400">{mapData.stats.totalPOIs}</p>
              <p className="text-sm text-gray-300">総POI数</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4 text-center border border-slate-600">
              <p className="text-2xl font-bold text-red-400">{mapData.stats.namedLocations}</p>
              <p className="text-sm text-gray-300">命名エリア</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4 text-center border border-slate-600">
              <p className="text-2xl font-bold text-yellow-400">{mapData.stats.landmarks}</p>
              <p className="text-sm text-gray-300">ランドマーク</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4 text-center border border-slate-600">
              <p className="text-2xl font-bold text-blue-400">C6S3</p>
              <p className="text-sm text-gray-300">現在シーズン</p>
            </div>
          </div>
        </div>
      </section>

      {/* マップ履歴 */}
      {historyData && (
        <section className="py-12 bg-slate-800 border-t border-slate-700">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold mb-8 text-white text-center">マップの歴史</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {historyData.maps.map((mapItem) => (
                <div key={mapItem.id} className={`bg-slate-700 rounded-lg overflow-hidden border ${mapItem.isCurrent ? 'border-green-500' : 'border-slate-600'}`}>
                  <div className="aspect-video bg-slate-800 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <div className="w-16 h-16 bg-gray-600 rounded-lg mx-auto mb-2"></div>
                      <p className="text-sm">マップ画像</p>
                    </div>
                  </div>
                  <div className="p-4">
                    {mapItem.isCurrent && (
                      <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded-full mb-2">
                        現在
                      </span>
                    )}
                    <h4 className="text-lg font-bold text-white mb-2">{mapItem.name}</h4>
                    <p className="text-sm text-gray-400 mb-3">{new Date(mapItem.date).toLocaleDateString('ja-JP')}</p>
                    <p className="text-gray-300 text-sm mb-3">{mapItem.description}</p>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400">注目エリア:</p>
                      {mapItem.featured.slice(0, 2).map((area, index) => (
                        <span key={index} className="inline-block bg-slate-600 text-white text-xs px-2 py-1 rounded mr-1">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 控えめなスポンサー */}
      <section className="py-8 bg-slate-900 border-t border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-xs text-gray-400">スポンサー</span>
                <span className="text-sm text-white">ゲーミングモニター特価セール中</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}