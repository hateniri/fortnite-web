export interface AdProduct {
  id: string
  title: string
  price: string
  imageUrl: string
  link: string
  category: 'book' | 'photo' | 'video' | 'game'
}

export const adProducts: AdProduct[] = [
  {
    id: 'book-watanabe',
    title: '渡邊渚1st写真集「水平線」',
    price: '3,300円',
    imageUrl: 'https://ebook-assets.dmm.com/digital/e-book/b950xshes88418/b950xshes88418pl.jpg',
    link: 'https://al.dmm.com/?lurl=https%3A%2F%2Fbook.dmm.com%2Fproduct%2F6151670%2Fb950xshes88418%2F&af_id=gammon-002&ch=reward_ranking&ch_id=package_text',
    category: 'photo'
  },
  {
    id: 'book-medalist',
    title: 'メダリスト（13）',
    price: '792円',
    imageUrl: 'https://ebook-assets.dmm.com/digital/e-book/b900ckds38992/b900ckds38992pl.jpg',
    link: 'https://al.dmm.com/?lurl=https%3A%2F%2Fbook.dmm.com%2Fproduct%2F4016510%2Fb900ckds38992%2F&af_id=gammon-002&ch=reward_ranking&ch_id=package_text',
    category: 'book'
  },
  {
    id: 'photo-elimari',
    title: 'エリマリ姉妹 Super girls FRIDAYデジタル写真集',
    price: '1,980円',
    imageUrl: 'https://ebook-assets.dmm.com/digital/e-book/b900ckds40912/b900ckds40912pl.jpg',
    link: 'https://al.dmm.com/?lurl=https%3A%2F%2Fbook.dmm.com%2Fproduct%2F6152452%2Fb900ckds40912%2F&af_id=gammon-002&ch=reward_ranking&ch_id=package_text',
    category: 'photo'
  },
  {
    id: 'video-tek00102',
    title: '大人気ビデオコンテンツ',
    price: '期間限定価格',
    imageUrl: 'https://pics.dmm.co.jp/digital/video/tek00102/tek00102pl.jpg',
    link: 'https://al.dmm.co.jp/?lurl=https%3A%2F%2Fwww.dmm.co.jp%2Fdigital%2Fvideoa%2F-%2Fdetail%2F%3D%2Fcid%3Dtek00102%2F&af_id=gammon-002&ch=special&ch_id=package',
    category: 'video'
  },
  {
    id: 'video-sone00720',
    title: 'プレミアムビデオコンテンツ',
    price: '限定価格',
    imageUrl: 'https://pics.dmm.co.jp/digital/video/sone00720/sone00720pl.jpg',
    link: 'https://al.dmm.co.jp/?lurl=https%3A%2F%2Fwww.dmm.co.jp%2Fdigital%2Fvideoa%2F-%2Fdetail%2F%3D%2Fcid%3Dsone00720%2F&af_id=gammon-002&ch=special&ch_id=package',
    category: 'video'
  }
]

// ランダムに広告を取得する関数
export function getRandomAd(): AdProduct {
  const randomIndex = Math.floor(Math.random() * adProducts.length)
  return adProducts[randomIndex]
}

// カテゴリー別に広告を取得する関数
export function getAdsByCategory(category: AdProduct['category']): AdProduct[] {
  return adProducts.filter(ad => ad.category === category)
}

// 指定された数の広告をランダムに取得する関数
export function getRandomAds(count: number): AdProduct[] {
  const shuffled = [...adProducts].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}