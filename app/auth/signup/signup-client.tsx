'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/language-context'
import { useToast } from '@/hooks/use-toast'

export function SignUpClient() {
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response?.ok) {
        // Auto sign in after successful signup
        const result = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
        })

        if (result?.ok) {
          toast({
            title: t.auth.successTitle,
            description: t.auth.signUpSuccess,
          })
          router.push('/')
          router.refresh()
        }
      } else {
        const data = await response.json()
        toast({
          title: t.auth.errorTitle,
          description: data?.message ?? t.auth.errorMessage,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: t.auth.errorTitle,
        description: t.auth.errorMessage,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-card rounded-lg p-8 shadow-lg space-y-6"
      >
        <div className="text-center space-y-2">
          <UserPlus className="w-12 h-12 mx-auto text-primary" />
          <h1 className="text-3xl font-heading font-bold">{t.auth.signUp}</h1>
          <p className="text-muted-foreground">{t.auth.signUpDescription}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder={t.auth.namePlaceholder}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder={t.auth.emailPlaceholder}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder={t.auth.passwordPlaceholder}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t.auth.signingUp : t.auth.signUp}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          {t.auth.haveAccount}{' '}
          <Link href="/auth/signin" className="text-primary hover:underline">
            {t.auth.signIn}
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
