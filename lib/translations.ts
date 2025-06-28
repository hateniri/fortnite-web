import translations from '@/data/skinTranslations.json'

export interface SkinTranslation {
  name: string
  series?: string
  rarity?: string
}

export function getJapaneseName(id: string, fallback: string): string {
  const translation = (translations as any)[id]
  return translation?.name || fallback
}

export function getTranslation(id: string): SkinTranslation | null {
  return (translations as any)[id] || null
}