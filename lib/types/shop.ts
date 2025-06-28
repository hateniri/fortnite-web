// Fortnite Shop APIのデータ型定義

export interface ShopData {
  hash: string
  date: string
  vbuckIcon: string
  entries: ShopEntry[]
}

export interface ShopEntry {
  regularPrice: number
  finalPrice: number
  devName: string
  offerId: string
  inDate: string
  outDate: string
  bundle?: Bundle
  banner?: Banner
  giftable: boolean
  refundable: boolean
  sortPriority: number
  layoutId: string
  layout: Layout
  tileSize: string
  newDisplayAssetPath?: string
  tracks?: Track[]
  items?: CosmeticItem[]
}

export interface Bundle {
  name: string
  info: string
  image: string
}

export interface Banner {
  value: string
  intensity: string
  backendValue: string
}

export interface Layout {
  id: string
  name: string
  index: number
  rank: number
  showIneligibleOffers: string
  useWidePreview: boolean
  displayType: string
}

export interface Track {
  id: string
  devName: string
  title: string
  artist: string
  releaseYear: number
  bpm: number
  duration: number
  difficulty: TrackDifficulty
  albumArt: string
  added: string
}

export interface TrackDifficulty {
  vocals: number
  guitar: number
  bass: number
  plasticBass: number
  drums: number
  plasticDrums: number
}

export interface CosmeticItem {
  id: string
  name: string
  description: string
  type: ItemType
  rarity: Rarity
  series?: Series
  set?: ItemSet
  introduction?: Introduction
  images: Images
  variants?: Variant[]
  searchTags?: string[]
  gameplay?: string[]
  showcaseVideo?: string
  displayAssetPath?: string
  definitionPath?: string
  path?: string
  added: string
  shopHistory?: string[]
}

export interface ItemType {
  value: string
  displayValue: string
  backendValue: string
}

export interface Rarity {
  value: string
  displayValue: string
  backendValue: string
}

export interface Series {
  value: string
  image: string
  colors: string[]
  backendValue: string
}

export interface ItemSet {
  value: string
  text: string
  backendValue: string
}

export interface Introduction {
  chapter: string
  season: string
  text: string
  backendValue: number
}

export interface Images {
  smallIcon?: string
  icon?: string
  featured?: string
  other?: Record<string, string>
}

export interface Variant {
  channel: string
  type: string
  options: VariantOption[]
}

export interface VariantOption {
  tag: string
  name: string
  image: string
}

// 処理済みデータの型定義
export interface ProcessedShopData {
  date: string
  lastUpdate: string
  featured: ProcessedItem[]
  daily: ProcessedItem[]
  special: ProcessedItem[]
  returned: ProcessedItem[]
}

export interface ProcessedItem {
  id: string
  name: string
  description: string
  rarity: 'legendary' | 'epic' | 'rare' | 'uncommon' | 'common'
  price: number
  imageUrl: string
  lastSeen?: string
  isReturned: boolean
  daysGone?: number
  shopHistory: string[]
  type: string
  set?: string
  series?: string
}