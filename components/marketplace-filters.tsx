'use client'

import { useState } from 'react'
import Image from 'next/image'
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { PokemonSearchIcon } from '@/components/icons/pokemon-search-icon'
import { TypingAnimation } from '@/components/ui/typing-animation'
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
import { cdnEmblem, cdnPokeball } from '@/lib/cdn'

interface MarketplaceFiltersProps {
  onFilterChange: (filters: any) => void
  totalProducts?: number
}

const typeEmblems = [
  'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Fighting',
  'Darkness', 'Metal', 'Fairy', 'Dragon', 'Colorless', 'Poison',
]

export function MarketplaceFilters({ onFilterChange, totalProducts = 0 }: MarketplaceFiltersProps) {
  const { t, language } = useLanguage()
  const [showFilters, setShowFilters] = useState(false)
  const [showSort, setShowSort] = useState(false)
  const [sortBy, setSortBy] = useState('default')
  const [isInputFocused, setIsInputFocused] = useState(false)

  // Animated placeholder words based on language
  const placeholderWords = {
    en: ["Search products...", "Find Pikachu...", "Look for Charizard...", "Search cards..."],
    es: ["Buscar productos...", "Buscar Pikachu...", "Buscar Charizard...", "Buscar cartas..."],
    ca: ["Cercar productes...", "Cercar Pikachu...", "Cercar Charizard...", "Cercar cartes..."],
    sv: ["Sök produkter...", "Sök Pikachu...", "Sök Charizard...", "Sök kort..."],
  }
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    type: 'all',
    rarity: 'all',
    condition: 'all',
    printedIn: 'all',
    language: 'all',
    priceRange: [0, 1000] as [number, number],
    sortBy: 'default',
  })

  const [activeQuickFilterTypes, setActiveQuickFilterTypes] = useState<string[]>([])
  const [activeQuickFilterRarity, setActiveQuickFilterRarity] = useState<string | null>(null)
  const [activeQuickFilterLanguage, setActiveQuickFilterLanguage] = useState<string | null>(null)

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
    
    if (key === 'sortBy') {
      setSortBy(value)
    }
    
    // Update active quick filter state when type changes (for dropdown)
    if (key === 'type' && value === 'all') {
      setActiveQuickFilterTypes([])
    }
    
    // Update active quick filter state when rarity changes
    if (key === 'rarity') {
      if (value !== 'all') {
        setActiveQuickFilterRarity(value)
      } else {
        setActiveQuickFilterRarity(null)
      }
    }
    
    // Update active quick filter state when language changes
    if (key === 'language') {
      if (value !== 'all') {
        setActiveQuickFilterLanguage(value)
      } else {
        setActiveQuickFilterLanguage(null)
      }
    }
  }

  const handleQuickFilterType = (type: string) => {
    // Convert to lowercase to match database values
    const typeLower = type.toLowerCase()
    
    // Toggle the type in the active filters array
    const isCurrentlyActive = activeQuickFilterTypes.includes(type)
    let newActiveTypes: string[]
    
    if (isCurrentlyActive) {
      // Remove from active types
      newActiveTypes = activeQuickFilterTypes.filter(t => t !== type)
    } else {
      // Add to active types
      newActiveTypes = [...activeQuickFilterTypes, type]
    }
    
    setActiveQuickFilterTypes(newActiveTypes)
    
    // Update the filter - if no types selected, use 'all', otherwise use array of lowercase types
    if (newActiveTypes.length === 0) {
      handleFilterChange('type', 'all')
    } else {
      // Store as comma-separated string or array - we'll use array format
      handleFilterChange('type', newActiveTypes.map(t => t.toLowerCase()))
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

  const handleQuickFilterLanguage = (language: string) => {
    // If clicking the same filter, reset it
    if (activeQuickFilterLanguage === language && filters.language === language) {
      setActiveQuickFilterLanguage(null)
      handleFilterChange('language', 'all')
    } else {
      setActiveQuickFilterLanguage(language)
      handleFilterChange('language', language)
    }
  }

  const rarityPokeballs = [
    'Common',
    'Rare',
    'Ultra Rare',
    'Illustration Rare',
  ]

  const categories = [
    { value: 'all', label: t.filters.allCategories },
    { value: 'Singles', label: 'Singles' },
    { value: 'Graded', label: 'Graded' },
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
    { value: 'Poison', label: 'Poison' },
  ]

  const rarities = [
    { value: 'all', label: t.filters.allRarities },
    { value: 'Common', label: 'Common' },
    { value: 'Uncommon', label: 'Uncommon' },
    { value: 'Rare', label: 'Rare' },
    { value: 'Promo', label: 'Promo' },
    { value: 'Double Rare', label: 'Double Rare' },
    { value: 'Ultra Rare', label: 'Ultra Rare' },
    { value: 'Illustration Rare', label: 'Illustration Rare' },
    { value: 'Special Illustration Rare', label: 'Special Illustration Rare' },
    { value: 'Hyper Rare', label: 'Hyper Rare' },
  ]

  const conditions = [
    { value: 'all', label: t.filters.allConditions },
    { value: 'Mint', label: 'Mint' },
    { value: 'Near Mint', label: 'Near Mint' },
    { value: 'Excellent', label: 'Excellent' },
    { value: 'Good', label: 'Good' },
    { value: 'Light Played', label: 'Light Played' },
    { value: 'Played', label: 'Played' },
    { value: 'Poor', label: 'Poor' },
  ]

  // Pokemon sets/eras (Printed in)
  const sets = [
    { value: 'all', label: t.filters.allSets },
    { value: 'Scarlet & Violet', label: 'Scarlet & Violet' },
    { value: 'Scarlet & Violet Paldean Fates', label: 'Scarlet & Violet Paldean Fates' },
    { value: 'Scarlet & Violet Stellar Crown', label: 'Scarlet & Violet Stellar Crown' },
    { value: 'Shrouded Fable', label: 'Shrouded Fable' },
    { value: 'Temporal Forces', label: 'Temporal Forces' },
    { value: 'Twilight Masquerade', label: 'Twilight Masquerade' },
    { value: 'Obsidian Flames', label: 'Obsidian Flames' },
    { value: 'Paldea Evolved', label: 'Paldea Evolved' },
    { value: 'Base Set', label: 'Base Set' },
    { value: 'Jungle', label: 'Jungle' },
    { value: 'Fossil', label: 'Fossil' },
    { value: 'Base Set 2', label: 'Base Set 2' },
    { value: 'Team Rocket', label: 'Team Rocket' },
    { value: 'Gym Heroes', label: 'Gym Heroes' },
    { value: 'Gym Challenge', label: 'Gym Challenge' },
    { value: 'Neo Genesis', label: 'Neo Genesis' },
    { value: 'Neo Discovery', label: 'Neo Discovery' },
    { value: 'Neo Revelation', label: 'Neo Revelation' },
    { value: 'Neo Destiny', label: 'Neo Destiny' },
    { value: 'Expedition', label: 'Expedition' },
    { value: 'Aquapolis', label: 'Aquapolis' },
    { value: 'Skyridge', label: 'Skyridge' },
    { value: 'Ruby & Sapphire', label: 'Ruby & Sapphire' },
    { value: 'Sword & Shield', label: 'Sword & Shield' },
    { value: 'Sword & Shield - Evolving Skies', label: 'Sword & Shield - Evolving Skies' },
    { value: 'Sword & Shield - Fusion Strike', label: 'Sword & Shield - Fusion Strike' },
    { value: 'Sword & Shield - Brilliant Stars', label: 'Sword & Shield - Brilliant Stars' },
    { value: 'Sword & Shield - Astral Radiance', label: 'Sword & Shield - Astral Radiance' },
    { value: 'Sword & Shield - Lost Origin', label: 'Sword & Shield - Lost Origin' },
    { value: 'Sword & Shield - Silver Tempest', label: 'Sword & Shield - Silver Tempest' },
    { value: 'Sword & Shield - Crown Zenith', label: 'Sword & Shield - Crown Zenith' },
    { value: 'Sun & Moon', label: 'Sun & Moon' },
    { value: 'XY', label: 'XY' },
    { value: 'Black & White', label: 'Black & White' },
    { value: 'Diamond & Pearl', label: 'Diamond & Pearl' },
    { value: 'EX', label: 'EX' },
    { value: 'Hidden Fates', label: 'Hidden Fates' },
    { value: 'Champions Path', label: 'Champions Path' },
    { value: 'Shining Fates', label: 'Shining Fates' },
    { value: 'Celebrations', label: 'Celebrations' },
  ]

  const languages = [
    { value: 'all', label: t.filters.allLanguages },
    { value: 'English', label: 'English' },
    { value: 'Japanese', label: 'Japanese' },
    { value: 'Spanish', label: 'Spanish' },
  ]

  return (
    <div className="space-y-4">
      {/* Quick Filter Type Emblems - Centered on mobile, left-aligned on larger screens */}
      <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
        {typeEmblems.map((type) => {
          const isActive = activeQuickFilterTypes.includes(type)
          return (
            <button
              key={type}
              onClick={() => handleQuickFilterType(type)}
              className={`relative w-10 h-10 transition-all duration-200 ${
                isActive
                  ? 'opacity-100 scale-110'
                  : 'opacity-70 hover:opacity-100 hover:scale-110'
              }`}
              title={`Filter: ${type}`}
            >
              <Image
                src={cdnEmblem(type)}
                alt={`${type} Type Filter`}
                fill
                sizes="40px"
                className="object-contain"
                unoptimized
              />
            </button>
          )
        })}
      </div>

      {/* Quick Filter Pokeballs and Language - Centered on mobile, left-aligned on larger screens */}
      <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
        {rarityPokeballs.map((rarity) => {
          const isActive = activeQuickFilterRarity === rarity && filters.rarity === rarity
          return (
            <button
              key={rarity}
              onClick={() => handleQuickFilterRarity(rarity)}
              className={`relative w-12 h-12 sm:w-14 sm:h-14 transition-all duration-200 ${
                isActive
                  ? 'opacity-100 scale-110'
                  : 'opacity-70 hover:opacity-100 hover:scale-110'
              }`}
              title={`Filter: ${rarity}`}
            >
              <Image
                src={cdnPokeball(rarity)}
                alt={`${rarity} Rarity Filter`}
                fill
                sizes="(max-width: 640px) 48px, 56px"
                className="object-contain"
                unoptimized
              />
            </button>
          )
        })}
        
        {/* Language Quick Filters - Nintendo L/R Button Style - Space between on mobile, together on larger screens */}
        <div className="flex items-center justify-between md:justify-start md:gap-2 w-full md:w-auto md:ml-2">
          <button
          onClick={() => handleQuickFilterLanguage('English')}
          className={`relative transition-all duration-200 hover:scale-105 flex items-center gap-2 px-3 py-2 border-2 ${
            activeQuickFilterLanguage === 'English' && filters.language === 'English'
              ? 'bg-gray-100 border-green-400 shadow-lg shadow-green-400/50'
              : 'bg-gray-100 border-gray-600 hover:bg-gray-200'
          }`}
          style={{
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '4px',
            borderBottomLeftRadius: '4px',
            borderBottomRightRadius: '4px',
          }}
          title="Filter: English"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <span className="text-black font-bold text-sm">L</span>
          </div>
          <span className={`text-sm font-medium ${
            activeQuickFilterLanguage === 'English' && filters.language === 'English'
              ? 'text-gray-700'
              : 'text-gray-700'
          }`}>
            English
          </span>
          </button>
          <button
          onClick={() => handleQuickFilterLanguage('Japanese')}
          className={`relative transition-all duration-200 hover:scale-105 flex items-center gap-2 px-3 py-2 border-2 ${
            activeQuickFilterLanguage === 'Japanese' && filters.language === 'Japanese'
              ? 'bg-gray-100 border-green-400 shadow-lg shadow-green-400/50'
              : 'bg-gray-100 border-gray-600 hover:bg-gray-200'
          }`}
          style={{
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '12px',
            borderBottomLeftRadius: '4px',
            borderBottomRightRadius: '4px',
          }}
          title="Filter: Japanese"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <span className="text-black font-bold text-sm">R</span>
          </div>
          <span className={`text-sm font-medium ${
            activeQuickFilterLanguage === 'Japanese' && filters.language === 'Japanese'
              ? 'text-gray-700'
              : 'text-gray-700'
          }`}>
            にほんご
          </span>
        </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="space-y-2">
        {/* Search and Buttons Row - Stacked on mobile, same row on desktop */}
        <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center">
          {/* Search Input - Full width on mobile, part of flex on desktop */}
          <div className="relative w-full md:flex-1">
            <PokemonSearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <Input
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              className="pl-10"
            />
            {!filters.search && !isInputFocused && (
              <div className="absolute left-10 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-sm">
                <TypingAnimation
                  words={placeholderWords[language] || placeholderWords.en}
                  typeSpeed={80}
                  deleteSpeed={40}
                  pauseDelay={2000}
                  loop={true}
                  showCursor={true}
                  blinkCursor={true}
                  cursorStyle="line"
                />
              </div>
            )}
          </div>
          
          {/* Buttons Row - Below search on mobile, beside on desktop */}
          <div className="flex gap-2 items-center flex-wrap md:flex-nowrap">
            {/* Card Count - Hidden on mobile/tablet, visible on desktop */}
            <div className="hidden lg:flex items-center h-10 px-4 bg-primary/10 border border-primary/30 rounded-md text-sm font-medium text-primary whitespace-nowrap">
              {totalProducts} {t.marketplace.cardsLabel || 'Cards'}
            </div>
            <Button
              variant="outline"
              className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground relative flex-1 md:flex-initial"
              onClick={() => {
                setShowSort(!showSort)
                setShowFilters(false)
              }}
            >
              <ArrowUpDown className="w-4 h-4" />
              {t.filters.sort}
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground flex-1 md:flex-initial"
              onClick={() => {
                setShowFilters(!showFilters)
                setShowSort(false)
              }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t.filters.filters}
            </Button>
          </div>
        </div>
        
        {/* Search Hint */}
        <p className="text-xs text-muted-foreground/70 pl-1">
          {t.filters.searchHint}
        </p>
      </div>

      {/* Sort Dropdown */}
      {showSort && (
        <div className="bg-card rounded-lg p-4 shadow-lg border border-border mt-2">
          <Label className="text-sm font-semibold mb-3 block">{t.filters.sort}</Label>
          <div className="space-y-2">
            <button
              onClick={() => {
                handleFilterChange('sortBy', 'default')
                setShowSort(false)
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                sortBy === 'default'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {t.filters.sortDefault || 'Default'}
            </button>
            <button
              onClick={() => {
                handleFilterChange('sortBy', 'price-low')
                setShowSort(false)
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                sortBy === 'price-low'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {t.filters.sortPriceLow || 'Price: Low to High'}
            </button>
            <button
              onClick={() => {
                handleFilterChange('sortBy', 'price-high')
                setShowSort(false)
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                sortBy === 'price-high'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {t.filters.sortPriceHigh || 'Price: High to Low'}
            </button>
            <button
              onClick={() => {
                handleFilterChange('sortBy', 'name-asc')
                setShowSort(false)
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                sortBy === 'name-asc'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {t.filters.sortNameAsc || 'Name: A-Z'}
            </button>
            <button
              onClick={() => {
                handleFilterChange('sortBy', 'name-desc')
                setShowSort(false)
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                sortBy === 'name-desc'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {t.filters.sortNameDesc || 'Name: Z-A'}
            </button>
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-card rounded-lg p-6 shadow-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Printed In */}
            <div className="space-y-2">
              <Label>{t.filters.printedIn}</Label>
              <Select
                value={filters.printedIn}
                onValueChange={(value) => handleFilterChange('printedIn', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sets.map((set) => (
                    <SelectItem key={set.value} value={set.value}>
                      {set.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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

            {/* Language */}
            <div className="space-y-2">
              <Label>{t.filters.language}</Label>
              <Select
                value={filters.language}
                onValueChange={(value) => handleFilterChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
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
