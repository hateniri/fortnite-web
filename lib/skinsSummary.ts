export interface SkinSummary {
  name: string;
  kidFriendlyDesc: string;
  recommendation: number;
  shouldBuy: boolean;
  buyReason: string;
  targetAudience: string[];
}

export interface SkinsSummaryData {
  generated: string;
  totalItems: number;
  summaries: Record<string, SkinSummary>;
}

export async function getSkinsSummary(): Promise<SkinsSummaryData | null> {
  try {
    const response = await fetch('/skins_summary.json');
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error loading skins summary:', error);
    return null;
  }
}

export async function getSkinSummaryById(id: string): Promise<SkinSummary | null> {
  const data = await getSkinsSummary();
  if (!data) return null;
  return data.summaries[id] || null;
}