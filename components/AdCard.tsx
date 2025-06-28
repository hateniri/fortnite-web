import BannerAd from './BannerAd'

export default function AdCard() {
  // Example custom product data - can be replaced with actual DMM products
  const sampleProduct = {
    title: "渡邊渚1st写真集「水平線」",
    price: "3,300円",
    imageUrl: "https://ebook-assets.dmm.com/digital/e-book/b950xshes88418/b950xshes88418pl.jpg",
    link: "https://al.dmm.com/?lurl=https%3A%2F%2Fbook.dmm.com%2Fproduct%2F6151670%2Fb950xshes88418%2F&af_id=gammon-002&ch=reward_ranking&ch_id=package_text"
  }
  
  return <BannerAd productData={sampleProduct} />
}