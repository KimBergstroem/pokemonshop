'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ShoppingCart,
  Truck,
  User,
  Package,
  HelpCircle,
  MessageSquare,
  Search,
  Shield,
  Eye,
  Mail,
  Globe,
  Book,
  Instagram,
  MessageCircle,
  Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/contexts/language-context'
import { useToast } from '@/hooks/use-toast'

interface SupportCard {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  onClick?: () => void
}

export function SupportClient() {
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

  const topCategories: SupportCard[] = [
    {
      id: 'buying-payments',
      title: t.support.buyingPayments,
      icon: ShoppingCart,
      href: '/support/buying',
    },
    {
      id: 'shipments',
      title: t.support.shipments,
      icon: Truck,
      href: '/support/shipments',
    },
    {
      id: 'user-account',
      title: t.support.userAccount,
      icon: User,
      href: '/support/account',
    },
    {
      id: 'packaging',
      title: t.support.packaging,
      icon: Package,
      href: '/support/packaging',
    },
    {
      id: 'other',
      title: t.support.other,
      icon: HelpCircle,
      href: '/support/other',
    },
  ]

  const mostFrequented: SupportCard[] = [
    {
      id: 'faq',
      title: t.support.faq,
      icon: MessageSquare,
      href: '/support/faq',
    },
    {
      id: 'support-tickets',
      title: t.support.supportTickets,
      icon: User,
      href: '/contact',
    },
    {
      id: 'shipment-not-arrived',
      title: t.support.shipmentNotArrived,
      icon: Search,
      href: '/support/shipment-not-arrived',
    },
    {
      id: 'card-condition',
      title: t.support.cardCondition,
      icon: Eye,
      href: '/support/card-condition',
    },
  ]

  const buyingTopics: SupportCard[] = [
    {
      id: 'shipment-not-arrived-buying',
      title: t.support.shipmentNotArrived,
      icon: Search,
      href: '/support/shipment-not-arrived',
    },
    {
      id: 'shipment-problem',
      title: t.support.shipmentProblem,
      icon: Mail,
      href: '/support/shipment-problem',
    },
    {
      id: 'trustee-service',
      title: t.support.trusteeService,
      icon: Globe,
      href: '/support/trustee',
    },
  ]

  const legalTopics: SupportCard[] = [
    {
      id: 'privacy-policy',
      title: t.support.privacyPolicy,
      icon: Shield,
      href: '/support/privacy-policy',
    },
    {
      id: 'cookie-policy',
      title: t.support.cookiePolicy,
      icon: HelpCircle,
      href: '/support/cookie-policy',
    },
    {
      id: 'return-policy',
      title: t.support.returnPolicy,
      icon: Package,
      href: '/support/return-policy',
    },
    {
      id: 'buying-policy',
      title: t.support.buyingPolicy,
      icon: ShoppingCart,
      href: '/support/buying-policy',
    },
    {
      id: 'terms-of-service',
      title: t.support.termsOfService,
      icon: Book,
      href: '/support/terms',
    },
  ]


  const SupportCardComponent = ({ card }: { card: SupportCard }) => {
    const Icon = card.icon
    const content = (
      <div className="flex flex-col items-center justify-center p-4 h-full border border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-all duration-200 cursor-pointer group">
        <Icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
        <span className="text-sm font-medium text-center text-foreground group-hover:text-primary transition-colors">
          {card.title}
        </span>
      </div>
    )

    if (card.href) {
      return <Link href={card.href}>{content}</Link>
    }

    return (
      <div onClick={card.onClick} className="cursor-pointer">
        {content}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-12"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">
            {t.support.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t.support.subtitle}
          </p>
        </div>

        {/* Top Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {topCategories.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <SupportCardComponent card={card} />
            </motion.div>
          ))}
        </div>

        <div className="border-t border-border pt-8" />

        {/* Buying Section - same grid as top (2 per row on mobile) */}
        <div className="space-y-6">
          <h2 className="text-2xl font-heading font-bold">{t.support.buying}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {buyingTopics.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <SupportCardComponent card={card} />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-8" />

        {/* Most Frequented Pages - same grid as top (2 per row on mobile) */}
        <div className="space-y-6">
          <h2 className="text-2xl font-heading font-bold">{t.support.mostFrequented}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mostFrequented.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <SupportCardComponent card={card} />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-8" />

        {/* Legal & Policies - same grid as top (2 per row on mobile) */}
        <div className="space-y-6">
          <h2 className="text-2xl font-heading font-bold">{t.support.legalPolicies}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {legalTopics.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <SupportCardComponent card={card} />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-8" />

        {/* Contact Form Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-heading font-bold">{t.contact.formTitle}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-card rounded-lg p-6 shadow-lg"
            >
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
                <h3 className="text-2xl font-heading font-semibold mb-6">
                  {t.contact.connectTitle}
                </h3>
                <div className="space-y-4">
                  <a
                    href="mailto:contact@akknerds.com"
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
        </div>
      </motion.div>
    </div>
  )
}
