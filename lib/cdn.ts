export const CDN_BASE = 'https://d3gp36gzzqygor.cloudfront.net'

export const CDN = {
  main: `${CDN_BASE}/main.png`,
  logoHoodie: `${CDN_BASE}/logo_hoodie.png`,
  logoNavbar: `${CDN_BASE}/logo1.svg`,
} as const

/** Pokemon type -> CDN emblem filename (no extension) */
export const EMBLEM_CDN: Record<string, string> = {
  Fire: 'fire',
  Water: 'water',
  Grass: 'grass',
  Electric: 'elec',
  Psychic: 'psy',
  Fighting: 'fighting',
  Darkness: 'dark',
  Metal: 'steel',
  Fairy: 'fairy',
  Dragon: 'drag',
  Colorless: 'normal1',
  Poison: 'posion',
}

/** Rarity -> CDN pokeball filename (no extension) */
export const POKEBALL_CDN: Record<string, string> = {
  Common: 'normal',
  Rare: 'great',
  'Ultra Rare': 'ultra',
  'Illustration Rare': 'master',
}

export function cdnEmblem(type: string): string {
  const name = EMBLEM_CDN[type] ?? type.toLowerCase()
  return `${CDN_BASE}/${name}.png`
}

export function cdnPokeball(rarity: string): string {
  const name = POKEBALL_CDN[rarity] ?? 'normal'
  return `${CDN_BASE}/${name}.png`
}

/** All CDN URLs to preload during splash (emblems + pokeballs + logos/main). */
export function getPreloadImageUrls(): string[] {
  const logos = [CDN.logoNavbar, CDN.main, CDN.logoHoodie]
  const emblems = Object.keys(EMBLEM_CDN).map((t) => cdnEmblem(t))
  const pokeballs = Object.keys(POKEBALL_CDN).map((r) => cdnPokeball(r))
  return [...logos, ...emblems, ...pokeballs]
}
