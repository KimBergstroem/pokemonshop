'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Instagram, MessageCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/contexts/language-context'
import { useToast } from '@/hooks/use-toast'

export function ContactClient() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response?.ok) {
        toast({
          title: t.contact.successTitle,
          description: t.contact.successMessage,
        })
        setFormData({ name: '', email: '', message: '' })
      } else {
        throw new Error('Failed to submit')
      }
    } catch (error) {
      toast({
        title: t.contact.errorTitle,
        description: t.contact.errorMessage,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-12"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">
            {t.contact.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.contact.subtitle}
          </p>
          <p className="text-sm text-muted-foreground italic">
            {t.contact.noPhysical}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-card rounded-lg p-6 shadow-lg"
          >
            <h2 className="text-2xl font-heading font-semibold mb-6">
              {t.contact.formTitle}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder={t.contact.namePlaceholder}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder={t.contact.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder={t.contact.messagePlaceholder}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                <Send className="w-4 h-4" />
                {loading ? t.contact.sending : t.contact.send}
              </Button>
            </form>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-heading font-semibold mb-6">
                {t.contact.connectTitle}
              </h2>
              <div className="space-y-4">
                <a
                  href="mailto:contact@pokemonbarcelona.com"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <Mail className="w-5 h-5 text-primary" />
                  <span>contact@akknerds.com</span>
                </a>
                <div className="flex items-center gap-3 p-3 rounded-lg">
                  <Instagram className="w-5 h-5 text-primary" />
                  <span>@akknerds.com</span>
                </div>
                <a
                  href="https://discord.gg/uH43WkCFyP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <span>Discord Community</span>
                </a>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-2">{t.contact.hoursTitle}</h3>
              <p className="text-muted-foreground">
                {t.contact.hoursDescription}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
