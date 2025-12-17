import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const imageMap = {
  fire_card: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEieb2-wIETwMrWB55jh7UdSFJ09tlsjvyJrw2JuH5I_8NEZOn3XG8EYoGhnZTwjM5i7DGe9FP7VA8t5AHQqU9s7X9pKUoQ9uBxfAI3-3nkEK0PfAkgoL_vGGhKY8IbxyKHhsrlwLRfgHsc/s1600/103-charizard.jpg',
  water_card: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgkzIeHHeHXNAx2fAKyM5vNdGwx5lY6MWoLuKgZaG7Fgrsx-nz_S_mADVMdz1g5CgogOGcnV5z2-V6Qj86_MfLd47G1IhcNsW1j7Lim241CeyVTVO2Mf263vSrqptxi_jGQxVurahHwCVE/w1200-h630-p-k-no-nu/104-blastoise-ex.jpg',
  grass_card: 'https://tcgplayer-cdn.tcgplayer.com/product/527885_in_1000x1000.jpg',
  electric_card: 'https://i0.wp.com/sixprizes.com/wp-content/uploads/pikachu-next-destinies-nde-39.jpg?ssl=1',
  psychic_card: 'https://lh3.googleusercontent.com/mcu8h1IG2AFSXpg-susbHojoUIh3eoIWmJVb1KRa2fQaFx2AwsjOUcrOhAfV4Ao1xVzi-5m_ofYXqN4yHGyYp1FhVTU6yPh7CPLw7IEixH4=h500',
  dragon_card: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh_0eVQ1Yi0mDw-3maRFnkz2YZ2y18NmN-bylnjtuqYnzldvVCACbgnwC1xcPosJMx86d0jLiUz0Vx1UDuHM9JwJM_JDChpo_e3YxlKbU1PjOaDfuh-_kCzvfp5HqfWYN6BIHAKBGnv0NE/s1600/91-dragonite-ex-d.jpg',
  fairy_card: 'https://pbs.twimg.com/media/Gqna7uGWsAAvyVK.jpg',
  dark_card: 'https://images.pokemoncard.io/images/swsh7/swsh7-189_hiresopt.jpg',
  fighting_card: 'https://assets.pokemon.com/static-assets/content-assets/cms2/img/cards/web/XY3/XY3_EN_46.png',
  metal_card: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhGulzhfkjHlX3Couv1IRyxx48ClcNXfM5Lb38A_DIfMdUIDy4JMn_y7npeFhvXf7UufmVzq74kDyauVcHbPpMpucuLH0H8-Gr-BIBDAJXOc_kHbYzYaGoZyVbnVvC3xt5utmELzsbDokw/s1600/28-steelix.jpg',
  blog_1: 'https://cdn.abacus.ai/images/6a47bd32-bf92-4ca5-a7bb-efa91e59096b.png',
  blog_2: 'https://i.ytimg.com/vi/qQPvNrmykwY/maxresdefault.jpg',
  blog_3: 'https://i.ebayimg.com/images/g/HygAAOSwbmpiIAX1/s-l1200.jpg',
}

async function main() {
  console.log('Starting seed...')

  // Create admin test user
  const hashedPassword = await bcrypt.hash('johndoe123', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'admin',
    },
  })
  console.log('Admin user created:', adminUser.email)

  // Create products
  const products = [
    // Singles - Fire Type
    {
      name: 'Charizard - Stormfront',
      description: 'Legendary Fire-type Pokemon card from Stormfront set. Pristine condition with vibrant colors.',
      price: 299.99,
      category: 'Singles',
      type: 'Fire',
      rarity: 'Ultra Rare',
      set: 'Stormfront',
      condition: 'Near Mint',
      image: imageMap.fire_card,
      stock: 3,
      featured: true,
    },
    {
      name: 'Arcanine GX - Hidden Fates',
      description: 'Powerful Fire-type GX card with stunning artwork.',
      price: 45.50,
      category: 'Singles',
      type: 'Fire',
      rarity: 'Rare',
      set: 'Hidden Fates',
      condition: 'Near Mint',
      image: imageMap.fire_card,
      stock: 8,
    },
    {
      name: 'Flareon - Jungle',
      description: 'Classic Fire evolution from the original Jungle set.',
      price: 18.75,
      category: 'Singles',
      type: 'Fire',
      rarity: 'Holo Rare',
      set: 'Jungle',
      condition: 'Lightly Played',
      image: imageMap.fire_card,
      stock: 12,
    },
    // Singles - Water Type
    {
      name: 'Blastoise EX - FireRed & LeafGreen',
      description: 'Iconic Water-type EX card. Perfect for collectors.',
      price: 189.99,
      category: 'Singles',
      type: 'Water',
      rarity: 'Ultra Rare',
      set: 'FireRed & LeafGreen',
      condition: 'Mint',
      image: imageMap.water_card,
      stock: 2,
      featured: true,
    },
    {
      name: 'Lapras V - Sword & Shield',
      description: 'Beautiful Water-type V card with excellent pull rate.',
      price: 32.00,
      category: 'Singles',
      type: 'Water',
      rarity: 'Rare',
      set: 'Sword & Shield',
      condition: 'Near Mint',
      image: imageMap.water_card,
      stock: 15,
    },
    {
      name: 'Gyarados - Base Set',
      description: 'Original Gyarados from the Base Set. Classic artwork.',
      price: 28.50,
      category: 'Singles',
      type: 'Water',
      rarity: 'Holo Rare',
      set: 'Base Set',
      condition: 'Near Mint',
      image: imageMap.water_card,
      stock: 6,
    },
    // Singles - Grass Type
    {
      name: 'Venusaur - TCG Classic',
      description: 'Stunning Grass-type starter evolution.',
      price: 125.00,
      category: 'Singles',
      type: 'Grass',
      rarity: 'Holo Rare',
      set: 'TCG Classic',
      condition: 'Mint',
      image: imageMap.grass_card,
      stock: 5,
    },
    {
      name: 'Leafeon VMAX - Evolving Skies',
      description: 'Powerful Grass-type VMAX with amazing artwork.',
      price: 55.99,
      category: 'Singles',
      type: 'Grass',
      rarity: 'Ultra Rare',
      set: 'Evolving Skies',
      condition: 'Near Mint',
      image: imageMap.grass_card,
      stock: 7,
    },
    // Singles - Electric Type
    {
      name: 'Pikachu - Next Destinies',
      description: 'Adorable Electric-type Pikachu card. Fan favorite!',
      price: 24.99,
      category: 'Singles',
      type: 'Electric',
      rarity: 'Rare',
      set: 'Next Destinies',
      condition: 'Near Mint',
      image: imageMap.electric_card,
      stock: 20,
      featured: true,
    },
    {
      name: 'Raichu GX - Shining Legends',
      description: 'Electrifying GX card with brilliant holographic effect.',
      price: 38.00,
      category: 'Singles',
      type: 'Electric',
      rarity: 'Rare',
      set: 'Shining Legends',
      condition: 'Mint',
      image: imageMap.electric_card,
      stock: 9,
    },
    // Singles - Psychic Type
    {
      name: 'Mewtwo EX - Genetic Apex',
      description: 'Legendary Psychic Pokemon. One of the most sought-after cards.',
      price: 349.99,
      category: 'Singles',
      type: 'Psychic',
      rarity: 'Secret Rare',
      set: 'Genetic Apex',
      condition: 'Mint',
      image: imageMap.psychic_card,
      stock: 1,
      featured: true,
    },
    {
      name: 'Espeon V - Evolving Skies',
      description: 'Elegant Psychic-type V card with beautiful artwork.',
      price: 42.50,
      category: 'Singles',
      type: 'Psychic',
      rarity: 'Rare',
      set: 'Evolving Skies',
      condition: 'Near Mint',
      image: imageMap.psychic_card,
      stock: 11,
    },
    // Singles - Dragon Type
    {
      name: 'Dragonite EX - Dragon Frontiers',
      description: 'Majestic Dragon-type EX card. Premium condition.',
      price: 215.00,
      category: 'Singles',
      type: 'Dragon',
      rarity: 'Ultra Rare',
      set: 'Dragon Frontiers',
      condition: 'Near Mint',
      image: imageMap.dragon_card,
      stock: 3,
    },
    {
      name: 'Rayquaza VMAX - Evolving Skies',
      description: 'Powerful Dragon-type VMAX with stunning design.',
      price: 89.99,
      category: 'Singles',
      type: 'Dragon',
      rarity: 'Ultra Rare',
      set: 'Evolving Skies',
      condition: 'Mint',
      image: imageMap.dragon_card,
      stock: 4,
    },
    // Singles - Fairy Type
    {
      name: 'Sylveon VMAX - Evolving Skies',
      description: 'Charming Fairy-type VMAX. Perfect for collectors.',
      price: 68.00,
      category: 'Singles',
      type: 'Fairy',
      rarity: 'Ultra Rare',
      set: 'Evolving Skies',
      condition: 'Mint',
      image: imageMap.fairy_card,
      stock: 6,
    },
    // Singles - Dark Type
    {
      name: 'Umbreon V - Evolving Skies',
      description: 'Stunning Dark-type V card. Highly collectible.',
      price: 125.00,
      category: 'Singles',
      type: 'Darkness',
      rarity: 'Ultra Rare',
      set: 'Evolving Skies',
      condition: 'Mint',
      image: imageMap.dark_card,
      stock: 5,
      featured: true,
    },
    // Singles - Fighting Type
    {
      name: 'Machamp - Furious Fists',
      description: 'Powerful Fighting-type Pokemon with excellent condition.',
      price: 35.00,
      category: 'Singles',
      type: 'Fighting',
      rarity: 'Holo Rare',
      set: 'Furious Fists',
      condition: 'Near Mint',
      image: imageMap.fighting_card,
      stock: 10,
    },
    // Singles - Metal Type
    {
      name: 'Steelix - Stormfront',
      description: 'Sturdy Metal-type card with classic artwork.',
      price: 42.00,
      category: 'Singles',
      type: 'Metal',
      rarity: 'Holo Rare',
      set: 'Stormfront',
      condition: 'Near Mint',
      image: imageMap.metal_card,
      stock: 8,
    },
    // Boosters
    {
      name: 'Evolving Skies Booster Pack',
      description: 'Sealed booster pack from the popular Evolving Skies set. Chance for Eeveelution cards!',
      price: 8.99,
      category: 'Boosters',
      type: 'Colorless',
      rarity: 'Common',
      set: 'Evolving Skies',
      condition: 'Mint',
      image: imageMap.blog_3,
      stock: 50,
    },
    {
      name: 'Fusion Strike Booster Pack',
      description: 'Sealed booster pack with exciting Pokemon from Fusion Strike.',
      price: 7.50,
      category: 'Boosters',
      type: 'Colorless',
      rarity: 'Common',
      set: 'Fusion Strike',
      condition: 'Mint',
      image: imageMap.blog_3,
      stock: 40,
    },
    // Sealed Products
    {
      name: 'Scarlet & Violet Elite Trainer Box',
      description: 'Complete Elite Trainer Box with 9 booster packs, sleeves, dice, and more!',
      price: 54.99,
      category: 'Sealed',
      type: 'Colorless',
      rarity: 'Common',
      set: 'Scarlet & Violet',
      condition: 'Mint',
      image: imageMap.blog_3,
      stock: 15,
      featured: true,
    },
    {
      name: 'Crown Zenith Booster Box',
      description: 'Factory sealed booster box with 36 packs. Perfect for collectors!',
      price: 189.99,
      category: 'Sealed',
      type: 'Colorless',
      rarity: 'Uncommon',
      set: 'Crown Zenith',
      condition: 'Mint',
      image: imageMap.blog_3,
      stock: 8,
    },
    // Binders
    {
      name: 'Premium 9-Pocket Binder - Pikachu Edition',
      description: 'High-quality binder with Pikachu artwork. Holds up to 360 cards.',
      price: 35.00,
      category: 'Binders',
      type: 'Colorless',
      rarity: 'Common',
      set: 'Accessories',
      condition: 'Mint',
      image: imageMap.electric_card,
      stock: 25,
    },
    {
      name: 'Ultra Pro Pokemon Binder',
      description: 'Durable binder with premium page protectors. Perfect for valuable cards.',
      price: 28.50,
      category: 'Binders',
      type: 'Colorless',
      rarity: 'Common',
      set: 'Accessories',
      condition: 'Mint',
      image: imageMap.electric_card,
      stock: 18,
    },
    // Mystery Boxes
    {
      name: 'Mystery Pokemon Card Bundle - Small',
      description: 'Surprise bundle with 10 random Pokemon cards. At least 1 Holo guaranteed!',
      price: 19.99,
      category: 'Mystery',
      type: 'Colorless',
      rarity: 'Common',
      set: 'Mystery',
      condition: 'Mint',
      image: imageMap.blog_1,
      stock: 30,
    },
    {
      name: 'Mystery Pokemon Card Bundle - Large',
      description: 'Premium mystery bundle with 25 cards including guaranteed rare cards!',
      price: 49.99,
      category: 'Mystery',
      type: 'Colorless',
      rarity: 'Rare',
      set: 'Mystery',
      condition: 'Mint',
      image: imageMap.blog_1,
      stock: 20,
      featured: true,
    },
  ]

  for (const product of products) {
    await prisma.product.create({ data: product })
  }
  console.log(`Created ${products.length} products`)

  // Create blog posts
  const blogPosts = [
    {
      title: 'Simple Morning Stretches for a Calm Start',
      slug: 'morning-stretches-calm-start',
      excerpt: 'Start your day right with these gentle stretches that promote wellness and prepare you for Pokemon card hunting.',
      content: `<p>As Pokemon collectors, we often spend long hours at trading events and examining cards. Taking care of our bodies is essential for staying energized and focused.</p>
      <h2>Morning Routine Benefits</h2>
      <p>Starting your day with gentle stretches can improve circulation, reduce tension, and help you feel more alert - perfect for those early morning card shop visits!</p>
      <h2>Simple Stretches to Try</h2>
      <ul>
        <li><strong>Neck Rolls:</strong> Gently roll your head in circles to release tension</li>
        <li><strong>Shoulder Shrugs:</strong> Lift and release your shoulders several times</li>
        <li><strong>Wrist Rotations:</strong> Important for card handling and sorting</li>
        <li><strong>Side Bends:</strong> Stretch your torso to wake up your core</li>
      </ul>
      <p>Remember, consistency is key. Just 10 minutes each morning can make a huge difference in how you feel throughout the day.</p>`,
      image: imageMap.blog_1,
    },
    {
      title: 'Trading Techniques: Building Your Collection Wisely',
      slug: 'trading-techniques-building-collection',
      excerpt: 'Master the art of Pokemon card trading with these essential tips for growing your collection while maintaining quality.',
      content: `<p>Trading is at the heart of the Pokemon TCG community. Whether you're at a local event or online, knowing how to trade effectively can help you build an incredible collection.</p>
      <h2>Know Your Card Values</h2>
      <p>Before any trade, research current market prices. Use tools like TCGPlayer and eBay sold listings to understand what cards are actually worth. Never trade based on emotion alone.</p>
      <h2>Quality Over Quantity</h2>
      <p>This is my personal motto: "Only Raw, No Damage, No Whitening and Only Pulled!" When trading, always inspect cards carefully:</p>
      <ul>
        <li>Check edges for whitening or wear</li>
        <li>Look for scratches on the holographic surface</li>
        <li>Examine centering and print quality</li>
        <li>Use proper lighting to spot imperfections</li>
      </ul>
      <h2>Build Trading Relationships</h2>
      <p>The best trades come from trusted relationships within the community. Be honest, fair, and respectful. Your reputation matters more than any single card.</p>
      <h2>Protection During Trades</h2>
      <p>Always use sleeves and toploaders when showing cards for trade. Protect both your cards and those you're considering. A damaged card loses significant value instantly.</p>`,
      image: imageMap.blog_2,
    },
    {
      title: 'Why Consistency in Pokemon Hunting Matters',
      slug: 'consistency-pokemon-hunting',
      excerpt: 'Learn why regular engagement with the Pokemon TCG community and consistent collecting habits lead to the best results.',
      content: `<p>Six years in Barcelona has taught me one crucial lesson: consistency beats luck every time in Pokemon card collecting.</p>
      <h2>Regular Store Visits</h2>
      <p>Visit your local card shops weekly. Build relationships with owners and staff. They'll remember you when rare products arrive and might even hold items for their regulars.</p>
      <h2>Attend Community Events</h2>
      <p>Monthly trading events, weekly league nights, and special tournaments aren't just about playing - they're networking opportunities. The more you show up, the more people know you're serious about collecting.</p>
      <h2>Stay Informed</h2>
      <p>Follow release schedules, read Pokemon TCG news, and join online communities. Knowledge is power in this hobby. When you know what's coming, you can plan and budget accordingly.</p>
      <h2>Set Collection Goals</h2>
      <p>Whether it's completing a specific set, collecting all Charizard cards, or focusing on a favorite type, having clear goals keeps you motivated and prevents impulsive purchases.</p>
      <h2>The Barcelona Pokemon Scene</h2>
      <p>Our community here in Barcelona has grown tremendously. Every week, we see new faces at events. Being consistent means you become part of this family, and that's where the real magic happens.</p>`,
      image: imageMap.blog_3,
    },
    {
      title: 'Grading Your Pokemon Cards: When and Why',
      slug: 'grading-pokemon-cards-guide',
      excerpt: 'A comprehensive guide to professional card grading, including when it makes sense and how to prepare your cards.',
      content: `<p>Professional grading can significantly increase a card's value, but it's not always the right choice. Here's what you need to know.</p>
      <h2>Understanding Card Grading</h2>
      <p>Companies like PSA, BGS, and CGC evaluate cards on multiple factors: centering, edges, corners, and surface. A perfect 10 (PSA) or Black Label (BGS) can multiply a card's value by 5-10x or more.</p>
      <h2>When to Grade</h2>
      <ul>
        <li>The card is worth at least €100 raw</li>
        <li>You pulled it fresh from a pack</li>
        <li>It appears to be in near-perfect condition</li>
        <li>You plan to hold it long-term</li>
      </ul>
      <h2>Preparation is Key</h2>
      <p>Handle potential grading candidates with extreme care. Use gloves, store in perfect-fit sleeves and toploaders immediately, and never let anyone else handle them.</p>
      <h2>Cost Considerations</h2>
      <p>Grading costs vary from €15 to €200+ depending on service level and turnaround time. Factor this into your decision - if a card won't gain enough value to justify the cost, keep it raw.</p>`,
      image: imageMap.blog_2,
    },
    {
      title: 'Building a Pokemon Community in Barcelona',
      slug: 'building-pokemon-community-barcelona',
      excerpt: 'My journey from solo collector to community builder in Barcelona, and how you can help grow the local Pokemon TCG scene.',
      content: `<p>When I moved to Barcelona six years ago, I didn't know a single Pokemon collector. Today, we have a thriving community with weekly events, hundreds of active members, and a reputation across Spain.</p>
      <h2>Starting Small</h2>
      <p>It began with just meeting up with two other collectors at a cafe. We'd trade cards, discuss the hobby, and share our passion. That small group planted the seed for everything that came after.</p>
      <h2>Organizing Events</h2>
      <p>I started organizing monthly trading events at local gaming stores. The first one had 8 people. The most recent? Over 60 attendees! Consistency and word-of-mouth grew these events naturally.</p>
      <h2>Social Media Power</h2>
      <p>Creating our Instagram and Discord communities allowed collectors across Barcelona to connect. Now, people can arrange trades, ask questions, and share pulls 24/7.</p>
      <h2>Welcoming New Collectors</h2>
      <p>Every new person who walks into an event nervous and unsure becomes part of our family. We help them learn, guide their collecting journey, and ensure they feel welcome. This is how communities grow.</p>
      <h2>Looking Forward</h2>
      <p>My dream is to establish Barcelona as the Pokemon TCG capital of Spain. With your help, by attending events, being welcoming, and sharing your passion, we can make it happen.</p>`,
      image: imageMap.blog_1,
    },
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.create({ data: post })
  }
  console.log(`Created ${blogPosts.length} blog posts`)

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
