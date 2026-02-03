# AI Chatbot Integration Guide

## Overview
This integration adds an AI-powered chatbot to your Pokemon marketplace using **Vercel AI SDK** and **Vercel AI Gateway** with **free xAI Grok models**. The chatbot can access your database to answer questions about products, orders, and blog posts.

## ✅ Key Benefits

- **FREE** - Uses xAI Grok models via Vercel AI Gateway (no OpenAI costs!)
- **Automatic Authentication** - On Vercel, authentication is handled automatically via OIDC tokens
- **No API Keys Needed** - For Vercel deployments, no API keys required!
- **Database Access** - Chatbot can query your products, orders, and blog posts

## Setup Instructions

### 1. Environment Variables

**For Vercel Deployments (Recommended):**
- ✅ **No API key needed!** Authentication is automatic via OIDC tokens
- The chatbot uses **free xAI Grok models** via Vercel AI Gateway
- Just ensure your project is deployed on Vercel

**For Local Development (REQUIRED):**
⚠️ **You MUST set `AI_GATEWAY_API_KEY` for local development!**

Add to `.env.local`:

```env
# AI Gateway API Key (REQUIRED for local development)
AI_GATEWAY_API_KEY=your_ai_gateway_api_key_here

# Database URL (already configured)
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_url
```

**To get AI Gateway API Key:**
1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your team/project
3. Go to **AI Gateway** → **API Keys**
4. Click **Create API Key**
5. Copy the key and add to `.env.local`
6. Restart your dev server (`npm run dev`)

**Note:** On Vercel production, authentication is automatic - no API key needed!

### 2. Database Migration

Run the Prisma migration to add Chat and Message models:

```bash
# Generate Prisma client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name add_chat_models

# Or if deploying to production:
npx prisma migrate deploy
```

### 3. Model Configuration

**Default Model:** `xai/grok-3-mini` (free via Vercel AI Gateway)

**Available Models:**
- `xai/grok-3-mini` - Fast, free model (default)
- `xai/grok-4` - More powerful model
- `xai/grok-4.1-fast-reasoning` - Fast reasoning model
- `xai/grok-code-fast-1` - Code-focused model

**To change model:** Edit `app/api/chat/route.ts`:
```typescript
model: gateway('xai/grok-4') // Change model here
```

**Note:** No OpenAI API key needed! The chatbot uses free xAI models via Vercel AI Gateway.

## Features

### Database Access Tools

The chatbot has access to these database tools:

1. **searchProducts** - Search for Pokemon cards by name, category, type, rarity, set, condition, or language
2. **getProductById** - Get detailed information about a specific product
3. **getFeaturedProducts** - Get featured products from the marketplace
4. **getProductsByCategory** - Filter products by category
5. **searchBlogPosts** - Search for blog posts and articles
6. **getUserOrders** - Get order history for authenticated users

### Chat Features

- Real-time AI responses using **xAI Grok models** (free via Vercel AI Gateway)
- Chat history saved to database
- Quick question buttons for common queries
- Mobile-responsive design
- Streaming responses for better UX
- **No API costs** - uses free models through Vercel AI Gateway

## API Routes

### `/api/chat`
Main chat endpoint that handles AI conversations with database access.

### `/api/chat/chat`
- `POST` - Create a new chat
- `GET` - Get all chats for the authenticated user

### `/api/chat/messages`
- `POST` - Save a message to the database

## Usage

The chatbot is automatically available on all pages via the `<Chatbot />` component in `app/layout.tsx`.

Users can:
1. Click the chat button (bottom right)
2. Ask questions about products, orders, shipping, etc.
3. Use quick question buttons for common queries
4. View chat history (if authenticated)

## Customization

### System Prompt
Edit the `systemPrompt` in `app/api/chat/route.ts` to customize the AI's behavior and knowledge.

### Model Selection
Change the model in `app/api/chat/route.ts`:
```typescript
model: gateway('xai/grok-3-mini') // Change to 'xai/grok-4', etc.
```

Available models:
- `xai/grok-3-mini` - Default, fast and free
- `xai/grok-4` - More powerful
- `xai/grok-4.1-fast-reasoning` - Fast reasoning
- `xai/grok-code-fast-1` - Code-focused

### Adding New Tools
Add new database access tools in `app/api/chat/route.ts`:
```typescript
const tools = {
  // ... existing tools
  yourNewTool: tool({
    description: 'What your tool does',
    parameters: z.object({ /* ... */ }),
    execute: async ({ /* ... */ }) => { /* ... */ },
  }),
}
```

## Troubleshooting

### Chat not responding
- **On Vercel:** Should work automatically - no API keys needed!
- **Locally:** If testing locally, you may need `AI_GATEWAY_API_KEY` (optional)
- Verify database connection is working
- Check browser console for errors
- Check Vercel deployment logs for any errors

### Database errors
- Ensure Prisma migration has been run
- Check database connection string
- Verify Chat and Message models exist in schema

### Messages not saving
- Check that chatId is being created correctly
- Verify database write permissions
- Check API route logs for errors

## Cost Considerations

- ✅ **FREE** - Uses xAI Grok models via Vercel AI Gateway
- No OpenAI API costs
- No API key needed for Vercel deployments
- Zero markup on tokens through AI Gateway
- Consider rate limiting for production use if needed

## Security

- User authentication is handled via NextAuth
- Database queries are scoped to user permissions
- API routes validate input
- Sensitive data is not exposed in responses
