'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { useLanguage } from '@/contexts/language-context'

interface MarketplaceFiltersProps {
  onFilterChange: (filters: any) => void
}

export function MarketplaceFilters({ onFilterChange }: MarketplaceFiltersProps) {
  const { t } = useLanguage()
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    type: 'all',
    rarity: 'all',
    condition: 'all',
    priceRange: [0, 1000] as [number, number],
  })

  const [activeQuickFilterType, setActiveQuickFilterType] = useState<string | null>(null)
  const [activeQuickFilterRarity, setActiveQuickFilterRarity] = useState<string | null>(null)

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
    
    // Update active quick filter state when type changes
    if (key === 'type') {
      if (value !== 'all') {
        setActiveQuickFilterType(value)
      } else {
        setActiveQuickFilterType(null)
      }
    }
    
    // Update active quick filter state when rarity changes
    if (key === 'rarity') {
      if (value !== 'all') {
        setActiveQuickFilterRarity(value)
      } else {
        setActiveQuickFilterRarity(null)
      }
    }
  }

  const handleQuickFilterType = (type: string) => {
    // If clicking the same filter, reset it
    if (activeQuickFilterType === type && filters.type === type) {
      setActiveQuickFilterType(null)
      handleFilterChange('type', 'all')
    } else {
      setActiveQuickFilterType(type)
      handleFilterChange('type', type)
    }
  }

  const handleQuickFilterRarity = (rarity: string) => {
    // If clicking the same filter, reset it
    if (activeQuickFilterRarity === rarity && filters.rarity === rarity) {
      setActiveQuickFilterRarity(null)
      handleFilterChange('rarity', 'all')
    } else {
      setActiveQuickFilterRarity(rarity)
      handleFilterChange('rarity', rarity)
    }
  }

  // Map Pokemon types to their emblem filenames (matching the types in the filter dropdown)
  const typeEmblems = [
    { type: 'Fire', filename: 'fire_type_symbol_paldea_by_jormxdos_dg5qlx5-300w.png' },
    { type: 'Water', filename: 'water_type_symbol_paldea_by_jormxdos_dg5qlxg-300w.png' },
    { type: 'Grass', filename: 'grass_type_symbol_paldea_by_jormxdos_dg5qly8-300w.png' },
    { type: 'Electric', filename: 'electric_type_symbol_paldea_by_jormxdos_dg5qlxv-300w.png' },
    { type: 'Psychic', filename: 'psychic_type_symbol_paldea_by_jormxdos_dg5qm06-300w.png' },
    { type: 'Fighting', filename: 'fighting_type_symbol_paldea_by_jormxdos_dg5qlys-300w.png' },
    { type: 'Darkness', filename: 'dark_type_symbol_paldea_by_jormxdos_dg5qm1n-300w.png' },
    { type: 'Metal', filename: 'steel_type_symbol_paldea_by_jormxdos_dg5qm1v-300w.png' }, // Metal = Steel in TCG
    { type: 'Fairy', filename: 'fairy_type_symbol_paldea_by_jormxdos_dg5qm20-300w.png' },
    { type: 'Dragon', filename: 'dragon_type_symbol_paldea_by_jormxdos_dg5qm1c-300w.png' },
    { type: 'Colorless', filename: 'normal_type_symbol_paldea_by_jormxdos_dg5qlwu-300w.png' }, // Colorless = Normal in TCG
  ]

  // Map Pokemon rarity to pokeball images
  const rarityPokeballs = [
    { rarity: 'Common', filename: 'poke-ball-pokemon-n99.png' },
    { rarity: 'Uncommon', filename: 'great-ball-pokemon-n98.png' },
    { rarity: 'Rare', filename: 'ultra-ball-pokemon-n83.png' },
    { rarity: 'Ultra Rare', filename: 'master-ball-pokemon-n82.png' },
  ]

  const categories = [
    { value: 'all', label: t.filters.allCategories },
    { value: 'Singles', label: 'Singles' },
    { value: 'Boosters', label: 'Boosters' },
    { value: 'Sealed', label: 'Sealed' },
    { value: 'Binders', label: 'Binders' },
    { value: 'Mystery', label: 'Mystery' },
  ]

  const types = [
    { value: 'all', label: t.filters.allTypes },
    { value: 'Fire', label: 'Fire' },
    { value: 'Water', label: 'Water' },
    { value: 'Grass', label: 'Grass' },
    { value: 'Electric', label: 'Electric' },
    { value: 'Psychic', label: 'Psychic' },
    { value: 'Fighting', label: 'Fighting' },
    { value: 'Darkness', label: 'Darkness' },
    { value: 'Metal', label: 'Metal' },
    { value: 'Fairy', label: 'Fairy' },
    { value: 'Dragon', label: 'Dragon' },
    { value: 'Colorless', label: 'Colorless' },
  ]

  const rarities = [
    { value: 'all', label: t.filters.allRarities },
    { value: 'Common', label: 'Common' },
    { value: 'Uncommon', label: 'Uncommon' },
    { value: 'Rare', label: 'Rare' },
    { value: 'Holo Rare', label: 'Holo Rare' },
    { value: 'Ultra Rare', label: 'Ultra Rare' },
    { value: 'Secret Rare', label: 'Secret Rare' },
  ]

  const conditions = [
    { value: 'all', label: t.filters.allConditions },
    { value: 'Mint', label: 'Mint' },
    { value: 'Near Mint', label: 'Near Mint' },
    { value: 'Lightly Played', label: 'Lightly Played' },
    { value: 'Moderately Played', label: 'Moderately Played' },
    { value: 'Heavily Played', label: 'Heavily Played' },
  ]

  return (
    <div className="space-y-4">
      {/* Quick Filter Type Emblems and Pokeballs */}
      <div className="flex items-center gap-2 flex-wrap">
        {typeEmblems.map(({ type, filename }) => (
          <button
            key={type}
            onClick={() => handleQuickFilterType(type)}
            className={`relative w-10 h-10 transition-all duration-200 hover:scale-110 ${
              activeQuickFilterType === type && filters.type === type
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background rounded-full'
                : 'opacity-70 hover:opacity-100'
            }`}
            title={`Filter: ${type}`}
          >
            <Image
              src={`/pokemon-emblem/${filename}`}
              alt={`${type} Type Filter`}
              fill
              className="object-contain"
            />
          </button>
        ))}
        {rarityPokeballs.map(({ rarity, filename }) => (
          <button
            key={rarity}
            onClick={() => handleQuickFilterRarity(rarity)}
            className={`relative w-14 h-14 transition-all duration-200 hover:scale-110 ${
              activeQuickFilterRarity === rarity && filters.rarity === rarity
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background rounded-full'
                : 'opacity-70 hover:opacity-100'
            }`}
            title={`Filter: ${rarity}`}
          >
            <Image
              src={`/pokeball/${filename}`}
              alt={`${rarity} Rarity Filter`}
              fill
              className="object-contain"
            />
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t.filters.searchPlaceholder}
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {t.filters.filters}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-card rounded-lg p-6 shadow-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label>{t.filters.category}</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label>{t.filters.type}</Label>
              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rarity */}
            <div className="space-y-2">
              <Label>{t.filters.rarity}</Label>
              <Select
                value={filters.rarity}
                onValueChange={(value) => handleFilterChange('rarity', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rarities.map((rarity) => (
                    <SelectItem key={rarity.value} value={rarity.value}>
                      {rarity.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Condition */}
            <div className="space-y-2">
              <Label>{t.filters.condition}</Label>
              <Select
                value={filters.condition}
                onValueChange={(value) => handleFilterChange('condition', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{t.filters.priceRange}</Label>
              <span className="text-sm text-muted-foreground">
                €{filters.priceRange[0]} - €{filters.priceRange[1]}
              </span>
            </div>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => handleFilterChange('priceRange', value as [number, number])}
              max={1000}
              step={10}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  )
}
