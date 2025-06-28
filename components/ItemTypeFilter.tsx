'use client'

import { useState } from 'react'

interface ItemTypeFilterProps {
  items: any[]
  onFilterChange: (filteredItems: any[]) => void
}

export default function ItemTypeFilter({ items, onFilterChange }: ItemTypeFilterProps) {
  const [selectedType, setSelectedType] = useState<string>('all')

  // アイテムタイプの集計
  const typeCounts = items.reduce((acc, item) => {
    const itemType = item.type || 'その他'
    acc[itemType] = (acc[itemType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const handleFilterChange = (type: string) => {
    setSelectedType(type)
    if (type === 'all') {
      onFilterChange(items)
    } else {
      onFilterChange(items.filter(item => item.type === type))
    }
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-4 text-white">アイテムタイプで絞り込み</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedType === 'all'
              ? 'bg-blue-500 text-white border-2 border-blue-400'
              : 'bg-slate-700 text-gray-300 border-2 border-slate-600 hover:bg-slate-600'
          }`}
        >
          すべて ({items.length})
        </button>
        {Object.entries(typeCounts).sort(([, a], [, b]) => (b as number) - (a as number)).map(([type, count]) => (
          <button
            key={type}
            onClick={() => handleFilterChange(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedType === type
                ? 'bg-blue-500 text-white border-2 border-blue-400'
                : 'bg-slate-700 text-gray-300 border-2 border-slate-600 hover:bg-slate-600'
            }`}
          >
            {type} ({count as number})
          </button>
        ))}
      </div>
    </div>
  )
}