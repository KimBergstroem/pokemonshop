import { streamText, tool } from 'ai'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { createHash } from 'crypto'

// Simple in-memory cache for responses
// In production, consider using Redis or Vercel KV for distributed caching
const responseCache = new Map<string, { text: string; expiresAt: number }>()

// Clean up expired cache entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of responseCache.entries()) {
    if (value.expiresAt < now) {
      responseCache.delete(key)
    }
  }
}, 5 * 60 * 1000)

export const maxDuration = 30

// For Vercel deployments: Authentication is automatic via OIDC tokens
// Models are accessed via Vercel AI Gateway using format: 'provider/model-name'
// For local development: Set AI_GATEWAY_API_KEY in .env.local (optional)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages, chatId } = body
    console.log('=== CHAT API CALLED ===')
    console.log('Messages received:', messages?.length || 0)
    console.log('ChatId:', chatId)
    const lastMessage = messages?.[messages.length - 1]
    console.log('Last message:', lastMessage)
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
    
    // Extract potential search terms from user's last message for better tool calls
    const userQuery = lastMessage?.content || ''
    console.log('👤 User query:', userQuery)

    // System prompt with database context
    const systemPrompt = `You are a helpful AI assistant for a Pokemon card marketplace called "akkNERDS TRADING CO."

Your role is to help customers with:
- Finding Pokemon cards and products
- Answering questions about orders and shipping
- Providing information about products, prices, and availability
- Helping with account and support questions
- Sharing blog posts and news

You have access to the database through tools. IMPORTANT: When you use a tool to search for products, you MUST present the actual results to the user. Don't just say "I'll search" - actually show them what you found!

When users ask about products, you MUST:
1. Extract the key search term from their question (e.g., "Ultra Rare" from "Do you have Ultra Rare cards?")
2. Call the searchProducts tool with that exact term as the query parameter
3. Present the actual results you get back from the tool

When presenting product search results:
- List the products you found with their names, prices, and key details (rarity, set, condition)
- If products are found, present them in a clear, organized way
- If no products are found, tell the user clearly
- Always include prices in euros (€)
- Be specific about what you found - don't be vague

Example: User asks "Do you have any Ultra Rare pokemon card in stock?"
- Extract search term: "Ultra Rare"
- Call searchProducts with query: "Ultra Rare"
- Present results: "I found 3 Ultra Rare Pokemon cards in stock:
  1. Charizard VMAX - €45.99 (Scarlet & Violet, Near Mint)
  2. Pikachu VMAX - €32.50 (Sword & Shield, Mint)
  3. Mewtwo GX - €28.00 (Sun & Moon, Excellent)"

Example of bad response:
"I'll search for Ultra Rare cards for you." (Don't do this - actually show results!)

Always be friendly, helpful, and accurate. If you don't know something, admit it and suggest contacting support.

Current date: ${new Date().toLocaleDateString()}`

    // Database access tools
    // Capture userQuery in closure for fallback extraction
    const userQueryForFallback = userQuery
    const tools = {
      searchProducts: tool({
        description: `Search for Pokemon cards and products in the marketplace. 
        
CRITICAL: When calling this tool, you MUST provide a "query" parameter with a search term extracted from the user's question.

Examples:
- User asks "Do you have Ultra Rare cards?" → Call with query: "Ultra Rare"
- User asks "Show me Charizard cards" → Call with query: "Charizard"  
- User asks "Any Fire type cards?" → Call with query: "Fire"
- User asks "What Pikachu cards do you have?" → Call with query: "Pikachu"

IMPORTANT: The query parameter is REQUIRED. You MUST extract the search term from the user's question and pass it as the "query" parameter. Never call this tool without a query parameter.

Returns an array of products with name, price, rarity, set, condition, stock, and other details.`,
        parameters: z.object({
          query: z.string().describe('REQUIRED: The search term extracted from user question'),
          limit: z.number().optional().default(10).describe('Maximum number of results'),
        }),
        // @ts-expect-error - AI SDK v6 type inference issue with complex return types
        execute: async ({ query, limit }: { query: string; limit?: number }) => {
          const actualLimit = limit ?? 10
          // Log what we actually receive
          console.log('🔍 Tool execute called with params:', JSON.stringify({ query, limit }, null, 2))
          console.log('🔍 Query type:', typeof query, 'Value:', query)
          console.log('🔍 Limit:', limit, 'Actual limit:', actualLimit)
          
          let actualQuery: string = query || ''
          
          // Validate query parameter - if missing, try to extract from user message
          if (!actualQuery || actualQuery === 'undefined' || actualQuery.trim() === '') {
            console.error('❌ Invalid query parameter:', actualQuery)
            
            // Try to extract from user's last message as fallback
            const lastUserMessage = userQueryForFallback || ''
            console.log('🔄 Attempting fallback extraction from:', lastUserMessage)
            
            // Simple extraction: look for common Pokemon-related terms
            // Check for rarity first (longer terms first to avoid partial matches)
            const fallbackTerms = [
              'Ultra Rare', 'Illustration Rare', 'Special Illustration Rare', 'Hyper Rare',
              'Double Rare', 'Rare', 'Uncommon', 'Common', 'Promo',
              'Charizard', 'Pikachu', 'Mewtwo', 'Blastoise', 'Venusaur',
              'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Fighting', 
              'Darkness', 'Metal', 'Fairy', 'Dragon', 'Normal', 'Colorless',
              'Scarlet & Violet', 'Sword & Shield', 'Sun & Moon'
            ]
            // Sort by length descending to match longer terms first
            const sortedTerms = fallbackTerms.sort((a, b) => b.length - a.length)
            const foundTerm = sortedTerms.find(term => 
              lastUserMessage.toLowerCase().includes(term.toLowerCase())
            )
            
            if (foundTerm) {
              console.log('✅ Using fallback term:', foundTerm)
              actualQuery = foundTerm
            } else {
              console.error('❌ No fallback term found, returning empty')
              return []
            }
          }
          
          console.log(`🔍 Searching products with query: "${actualQuery}", limit: ${actualLimit}`)
          
          try {
            const products = await prisma.product.findMany({
              where: {
                OR: [
                  { name: { contains: actualQuery, mode: 'insensitive' } },
                  { description: { contains: actualQuery, mode: 'insensitive' } },
                  { category: { contains: actualQuery, mode: 'insensitive' } },
                  { type: { contains: actualQuery, mode: 'insensitive' } },
                  { rarity: { contains: actualQuery, mode: 'insensitive' } },
                  { set: { contains: actualQuery, mode: 'insensitive' } },
                  { condition: { contains: actualQuery, mode: 'insensitive' } },
                  { language: { contains: actualQuery, mode: 'insensitive' } },
                ],
              },
              take: actualLimit,
              orderBy: { createdAt: 'desc' },
            })
            
            console.log(`✅ Found ${products.length} products`)
            if (products.length > 0) {
              console.log(`📦 First product: ${products[0].name} - €${products[0].price}`)
            }
            
            // Serialize Prisma objects to plain JSON - AI SDK needs serializable data
            // Convert Date objects and other non-serializable values
            const serializedProducts: Array<{
              id: string
              name: string
              description: string | null
              price: number
              image: string
              stock: number
              category: string
              type: string | null
              rarity: string | null
              set: string | null
              condition: string | null
              language: string | null
              featured: boolean
              createdAt: string | undefined
              updatedAt: string | undefined
            }> = products.map(product => ({
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              image: product.image,
              stock: product.stock,
              category: product.category,
              type: product.type,
              rarity: product.rarity,
              set: product.set,
              condition: product.condition,
              language: product.language,
              featured: product.featured,
              // Convert dates to ISO strings
              createdAt: product.createdAt?.toISOString(),
              updatedAt: product.updatedAt?.toISOString(),
            }))
            
            console.log(`📤 Returning ${serializedProducts.length} serialized products to AI`)
            console.log(`📤 First product preview:`, JSON.stringify(serializedProducts[0] || {}).substring(0, 200))
            
            return serializedProducts
          } catch (error) {
            console.error('❌ Error searching products:', error)
            // Return empty array instead of error object - AI SDK expects array
            return []
          }
        },
      }),

      getProductById: tool({
        description: 'Get detailed information about a specific product by ID',
        parameters: z.object({
          productId: z.string().describe('The product ID'),
        }),
        // @ts-expect-error - AI SDK v6 type inference issue with complex return types
        execute: async ({ productId }) => {
          const product = await prisma.product.findUnique({
            where: { id: productId },
          })
          return product
        },
      }),

      getFeaturedProducts: tool({
        description: 'Get featured products from the marketplace',
        parameters: z.object({
          limit: z.number().optional().default(5).describe('Maximum number of featured products to return'),
        }),
        // @ts-expect-error - AI SDK v6 type inference issue with complex return types
        execute: async ({ limit }) => {
          const products = await prisma.product.findMany({
            where: { featured: true },
            take: limit,
            orderBy: { createdAt: 'desc' },
          })
          return products
        },
      }),

      getProductsByCategory: tool({
        description: 'Get products filtered by category',
        parameters: z.object({
          category: z.string().describe('Product category'),
          limit: z.number().optional().default(10).describe('Maximum number of results'),
        }),
        // @ts-expect-error - AI SDK v6 type inference issue with complex return types
        execute: async ({ category, limit }) => {
          const products = await prisma.product.findMany({
            where: { category: { contains: category, mode: 'insensitive' } },
            take: limit,
            orderBy: { createdAt: 'desc' },
          })
          return products
        },
      }),

      searchBlogPosts: tool({
        description: 'Search for blog posts and articles',
        parameters: z.object({
          query: z.string().describe('Search query for blog posts'),
          limit: z.number().optional().default(5).describe('Maximum number of results'),
        }),
        // @ts-expect-error - AI SDK v6 type inference issue with complex return types
        execute: async ({ query, limit }) => {
          const posts = await prisma.blogPost.findMany({
            where: {
              published: true,
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { excerpt: { contains: query, mode: 'insensitive' } },
                { content: { contains: query, mode: 'insensitive' } },
              ],
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
          })
          return posts
        },
      }),

      getUserOrders: tool({
        description: 'Get order history for the authenticated user',
        parameters: z.object({
          limit: z.number().optional().default(10).describe('Maximum number of orders to return'),
        }),
        // @ts-expect-error - AI SDK v6 type inference issue with complex return types
        execute: async ({ limit }) => {
          if (!userId) {
            return { error: 'User not authenticated' }
          }
          const orders = await prisma.order.findMany({
            where: { userId },
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          })
          return orders
        },
      }),
    }

    // Stream the AI response using Vercel AI Gateway with xAI Grok models
    // On Vercel: Authentication is automatic via OIDC tokens
    // Default: grok-3-mini (free via AI Gateway)
    // Alternative models: 'xai/grok-4', 'xai/grok-4.1-fast-reasoning', 'xai/grok-code-fast-1'
    // Format: 'provider/model-name' - AI SDK automatically routes through AI Gateway
    console.log('Starting streamText with model: xai/grok-3-mini')
    console.log('Messages being sent to AI:', messages.map((m: any) => ({ role: m.role, content: m.content?.substring(0, 50) })))
    console.log('AI_GATEWAY_API_KEY exists:', !!process.env.AI_GATEWAY_API_KEY)
    console.log('NODE_ENV:', process.env.NODE_ENV)
    
    // Check if we're in local development without API key
    if (!process.env.AI_GATEWAY_API_KEY && process.env.NODE_ENV !== 'production') {
      console.warn('⚠️ AI_GATEWAY_API_KEY not set for local development')
      console.warn('Get your API key from: https://vercel.com/dashboard/[team]/~/ai-gateway/api-keys')
      console.warn('Add to .env.local: AI_GATEWAY_API_KEY=your_key_here')
    }
    
    // Create cache key based on messages and system prompt
    // This allows identical queries to be cached and served without calling the AI
    // Note: We only cache simple queries without tool usage for now
    const isSimpleQuery = lastMessage?.role === 'user' && messages.length <= 2
    
    const cacheKey = createHash('sha256')
      .update(JSON.stringify({
        messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
        systemPrompt: systemPrompt.replace(/Current date:.*/, ''), // Remove date from cache key
        model: 'xai/grok-3-mini',
      }))
      .digest('hex')
    
    console.log('Cache key:', cacheKey.substring(0, 16) + '...')
    console.log('Is simple query (cacheable):', isSimpleQuery)
    
    // Check cache first - only for simple queries without tool usage
    // Complex queries with tools need fresh responses
    if (isSimpleQuery) {
      const cachedResponse = responseCache.get(cacheKey)
      if (cachedResponse && cachedResponse.expiresAt > Date.now()) {
        console.log('✅ Returning cached response (saving AI costs!)')
        // Return cached response as plain text stream
        // For simplicity, we'll just return the text directly
        const text = cachedResponse.text
        const stream = new ReadableStream({
          start(controller) {
            // Stream the cached text in chunks to simulate real streaming
            const chunkSize = 20 // characters per chunk
            let index = 0
            const streamChunk = () => {
              if (index < text.length) {
                const chunk = text.slice(index, index + chunkSize)
                controller.enqueue(new TextEncoder().encode(chunk))
                index += chunkSize
                // Small delay to simulate streaming
                setTimeout(streamChunk, 10)
              } else {
                controller.close()
              }
            }
            streamChunk()
          },
        })
        
        return new Response(stream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'X-Cache': 'HIT',
          },
        })
      }
    }
    
    console.log('🔄 Cache miss - calling AI model')
    
    let responseText = ''
    const result = await streamText({
      model: 'xai/grok-3-mini', // Free model via Vercel AI Gateway (automatic auth on Vercel)
      system: systemPrompt,
      messages,
      tools,
      // @ts-expect-error - maxSteps exists at runtime but may be missing from AI SDK types
      maxSteps: 5, // Allow up to 5 steps (tool call + response)
      onStepFinish: async ({ toolCalls, toolResults, text }) => {
        console.log('🔄 Step finished')
        if (toolCalls && toolCalls.length > 0) {
          console.log('🔧 Tool calls in step:', toolCalls.map(tc => ({
            toolName: tc.toolName,
            input: 'input' in tc ? tc.input : undefined,
          })))
        }
        if (toolResults && toolResults.length > 0) {
          toolResults.forEach((tr, idx) => {
            const out = 'output' in tr ? tr.output : (tr as any).result
            console.log(`📊 Tool result ${idx + 1} in step:`, {
              toolCallId: tr.toolCallId,
              hasResult: !!out,
              resultType: typeof out,
              isArray: Array.isArray(out),
              arrayLength: Array.isArray(out) ? out.length : null,
              resultPreview: out ? JSON.stringify(out).substring(0, 300) : 'null/undefined',
            })
          })
        }
        if (text) {
          console.log('📝 Step text so far:', text.substring(0, 200))
        }
      },
      // Cache the response when generation completes (only for simple queries)
      onFinish: async ({ text, toolCalls, toolResults }) => {
        responseText = text
        console.log('📝 Final response text length:', text?.length || 0)
        console.log('🔧 Tool calls made:', toolCalls?.length || 0)
        console.log('📊 Tool results received:', toolResults?.length || 0)
        
        if (toolResults && toolResults.length > 0) {
          toolResults.forEach((res, index) => {
            const out = 'output' in res ? res.output : (res as any).result
            console.log(`Tool result ${index + 1}:`, {
              toolCallId: res.toolCallId,
              resultType: typeof out,
              resultLength: Array.isArray(out) ? out.length : 'not array',
              resultPreview: out ? JSON.stringify(out).substring(0, 200) : 'null/undefined',
            })
          })
        }
        
        // Log the actual response text to see what bot is saying
        if (text) {
          console.log('📄 Response text preview:', text.substring(0, 200))
        }
        
        // Only cache if no tools were used (simple queries)
        if (isSimpleQuery && (!toolCalls || toolCalls.length === 0)) {
          // Cache for 1 hour (3600 seconds)
          responseCache.set(cacheKey, {
            text,
            expiresAt: Date.now() + 3600 * 1000,
          })
          console.log('💾 Response cached for 1 hour')
        } else {
          console.log('⚠️ Not caching - tools were used or complex query')
        }
      },
    })
    
    console.log('streamText result created')
    console.log('Result type:', typeof result)
    console.log('Result methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(result)))

    // User message is saved by the frontend via POST /api/chat/messages (avoids duplicate rows)

    // Return streaming response using toTextStreamResponse (AI SDK v6)
    // This handles both simple text responses and tool-based responses
    const response = result.toTextStreamResponse()
    
    // Log response headers for debugging
    console.log('📤 Response headers:', Object.fromEntries(response.headers.entries()))
    
    return response
  } catch (error: any) {
    console.error('Chat API error:', error)
    
    // Check if it's an authentication error
    if (error?.message?.includes('Unauthenticated') || error?.name === 'GatewayAuthenticationError') {
      return NextResponse.json(
        { 
          error: 'AI Gateway authentication required',
          message: 'For local development, you need to set AI_GATEWAY_API_KEY in your .env.local file.',
          instructions: 'Get your API key from: https://vercel.com/dashboard/[team]/~/ai-gateway/api-keys'
        },
        { status: 401 }
      )
    }
    
    // Check if credit card is required
    if (error?.message?.includes('credit card') || error?.statusCode === 403) {
      return NextResponse.json(
        { 
          error: 'AI Gateway requires credit card',
          message: 'Vercel AI Gateway requires a credit card on file (even for free models).',
          instructions: 'Add a credit card at: https://vercel.com/dashboard/[team]/~/ai?modal=add-credit-card',
          alternative: 'Alternatively, test the chatbot on Vercel production where authentication is automatic.'
        },
        { status: 403 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to process chat request',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
