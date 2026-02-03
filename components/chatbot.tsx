'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [chatId, setChatId] = useState<string | null>(null)
  const [localInput, setLocalInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Create a new chat when opening the chatbot
  useEffect(() => {
    if (isOpen && !chatId) {
      const createChat = async () => {
        try {
          const response = await fetch('/api/chat/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'New Chat' }),
          })
          const data = await response.json()
          setChatId(data.id)
        } catch (error) {
          console.error('Failed to create chat:', error)
        }
      }
      createChat()
    }
  }, [isOpen, chatId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleQuickQuestion = (question: string) => {
    setLocalInput(question)
    // Trigger form submit
    setTimeout(() => {
      const form = document.querySelector('form')
      if (form) {
        form.requestSubmit()
      }
    }, 50)
  }

  return (
    <>
      {/* Chatbot Toggle Button - Hidden when modal is open on mobile */}
      <div className={`fixed bottom-6 right-6 z-50 ${isOpen ? 'hidden md:block' : ''}`}>
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 md:inset-auto md:bottom-24 md:right-6 z-50 w-full h-full md:w-[400px] md:max-h-[600px] md:rounded-lg shadow-2xl border border-border overflow-hidden flex flex-col bg-card"
            >
              {/* Purple Header */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-5 md:rounded-t-lg relative">
                {/* Close button for mobile - shown in header */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 md:hidden p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <h3 className="text-lg font-heading font-bold text-white mb-2 pr-10 md:pr-0">
                  {t.chatbot.title}
                </h3>
                <p className="text-sm text-white/90">
                  {t.chatbot.welcome}
                </p>
              </div>

              {/* Messages Area */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 bg-background"
              >
                {messages.length === 0 ? (
                  <>
                    <h4 className="text-sm font-semibold text-foreground mb-3 text-center">
                      {t.chatbot.immediateAnswers}
                    </h4>
                    <div className="space-y-2">
                      <motion.button
                        onClick={() => handleQuickQuestion(t.chatbot.questions.shipping)}
                        className="w-full text-left p-3 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-colors"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <p className="text-sm text-foreground font-medium">
                          {t.chatbot.questions.shipping}
                        </p>
                      </motion.button>

                      <motion.button
                        onClick={() => handleQuickQuestion(t.chatbot.questions.cancel)}
                        className="w-full text-left p-3 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-colors"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <p className="text-sm text-foreground font-medium">
                          {t.chatbot.questions.cancel}
                        </p>
                      </motion.button>

                      <motion.button
                        onClick={() => handleQuickQuestion(t.chatbot.questions.complaint)}
                        className="w-full text-left p-3 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-colors"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <p className="text-sm text-foreground font-medium">
                          {t.chatbot.questions.complaint}
                        </p>
                      </motion.button>

                      <motion.button
                        onClick={() => handleQuickQuestion(t.chatbot.questions.priceGuarantee)}
                        className="w-full text-left p-3 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-colors"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <p className="text-sm text-foreground font-medium">
                          {t.chatbot.questions.priceGuarantee}
                        </p>
                      </motion.button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-sm text-muted-foreground py-8">
                        No messages yet. Start a conversation!
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-foreground'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">
                              {message.content || '(Empty message)'}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg p-3">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                      </div>
                    )}
                    {error && (
                      <div className="text-sm text-destructive p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                        <p className="font-semibold mb-1">Error: {error.message || 'Unknown error'}</p>
                        {error.message?.includes('credit card') && (
                          <p className="text-xs text-muted-foreground mt-2">
                            💡 Tip: The chatbot works automatically on Vercel production without a credit card!
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Chat Input Area */}
              <div className="p-4 bg-background border-t border-border">
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const messageToSend = localInput.trim()
                    
                    if (!messageToSend || isLoading) return
                    
                    // Add user message to UI immediately
                    const userMessage: ChatMessage = {
                      id: Date.now().toString(),
                      role: 'user',
                      content: messageToSend,
                    }
                    setMessages(prev => [...prev, userMessage])
                    setLocalInput('')
                    setIsLoading(true)
                    setError(null)
                    
                    try {
                      // Save user message to database
                      if (chatId) {
                        await fetch('/api/chat/messages', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            chatId,
                            role: 'user',
                            content: messageToSend,
                          }),
                        })
                      }
                      
                    // Send to API and stream response
                    const response = await fetch('/api/chat', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        messages: [
                          ...messages,
                          { role: 'user', content: messageToSend }
                        ],
                        chatId,
                      }),
                    })
                    
                    if (!response.ok) {
                      // Try to parse error response
                      let errorData
                      try {
                        errorData = await response.json()
                      } catch (e) {
                        errorData = { error: `API error: ${response.status}` }
                      }
                      
                      const error = new Error(errorData.message || errorData.error || `API error: ${response.status}`)
                      ;(error as any).response = response
                      ;(error as any).errorData = errorData
                      throw error
                    }
                    
                    // Handle streaming response
                    const reader = response.body?.getReader()
                    const decoder = new TextDecoder()
                    let assistantMessage = ''
                    const assistantId = `assistant-${Date.now()}`
                    
                    // Add placeholder assistant message
                    setMessages(prev => [...prev, {
                      id: assistantId,
                      role: 'assistant',
                      content: '',
                    }])
                    
                    if (reader) {
                      try {
                        while (true) {
                          const { done, value } = await reader.read()
                          if (done) break
                          
                          const chunk = decoder.decode(value, { stream: true })
                          
                          // Debug logging
                          if (chunk) {
                            console.log('📥 Received chunk:', chunk.substring(0, 100))
                          }
                          
                          // Handle text stream - chunks come as plain text directly
                          // Process each line separately
                          const lines = chunk.split('\n')
                          
                          for (const line of lines) {
                            let textToAdd = ''
                            
                            // Handle text stream format (0:text content)
                            if (line.startsWith('0:')) {
                              textToAdd = line.substring(2)
                            }
                            // Handle data stream format (0:{"type":"text-delta","textDelta":"..."})
                            else if (line.startsWith('0:{')) {
                              try {
                                const data = JSON.parse(line.substring(2))
                                if (data.type === 'text-delta' && data.textDelta) {
                                  textToAdd = data.textDelta
                                }
                              } catch (e) {
                                // Ignore parse errors
                              }
                            }
                            // Handle plain text chunks (no prefix) - this is what we're getting!
                            // Chunks come directly as text: "Hello! Welcome to", " akk", etc.
                            // Accept any non-empty line that's not JSON or array
                            else if (line && line !== '' && !line.startsWith('[') && !line.startsWith('{')) {
                              textToAdd = line
                            }
                            
                            // Update message if we have text
                            if (textToAdd) {
                              console.log('➕ Adding text:', textToAdd.substring(0, 50))
                              assistantMessage += textToAdd
                              // Update assistant message in real-time
                              setMessages(prev => prev.map(msg => 
                                msg.id === assistantId 
                                  ? { ...msg, content: assistantMessage }
                                  : msg
                              ))
                            } else if (line) {
                              // Log lines that didn't match any pattern
                              console.log('⚠️ Unmatched line:', line.substring(0, 100))
                            }
                          }
                        }
                        
                        // Ensure final message is saved to state
                        if (assistantMessage) {
                          setMessages(prev => prev.map(msg => 
                            msg.id === assistantId 
                              ? { ...msg, content: assistantMessage }
                              : msg
                          ))
                        }
                        
                        // Save assistant message to database
                        if (chatId && assistantMessage) {
                          await fetch('/api/chat/messages', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              chatId,
                              role: 'assistant',
                              content: assistantMessage,
                            }),
                          })
                        }
                      } catch (streamErr) {
                        // Error during streaming - remove placeholder
                        setMessages(prev => prev.filter(msg => msg.id !== assistantId))
                        throw streamErr
                      }
                    }
                    
                    } catch (err: any) {
                      console.error('Error sending message:', err)
                      
                      // Parse error response
                      let errorMessage = 'Failed to send message'
                      try {
                        if (err?.response) {
                          const errorData = await err.response.json()
                          if (errorData.error === 'AI Gateway requires credit card') {
                            errorMessage = 'AI Gateway requires a credit card on file. Add one in Vercel Dashboard, or test on production where it works automatically.'
                          } else if (errorData.message) {
                            errorMessage = errorData.message
                          }
                        } else if (err?.message) {
                          errorMessage = err.message
                        }
                      } catch (parseErr) {
                        // If response parsing fails, use original message
                        if (err?.message) {
                          errorMessage = err.message
                        }
                      }
                      
                      setError(new Error(errorMessage))
                      // Remove any assistant message placeholder on error
                      setMessages(prev => prev.filter(msg => msg.role !== 'assistant' || msg.content !== ''))
                    } finally {
                      setIsLoading(false)
                    }
                  }} 
                  className="flex items-center gap-2"
                >
                  <Input
                    name="prompt"
                    value={localInput}
                    onChange={(e) => {
                      setLocalInput(e.target.value)
                    }}
                    placeholder={t.chatbot.placeholder}
                    className="flex-1 bg-background border-border"
                    disabled={isLoading}
                    autoFocus
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !localInput || localInput.trim().length === 0}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
