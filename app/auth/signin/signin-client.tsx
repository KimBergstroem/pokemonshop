'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/language-context'
import { useToast } from '@/hooks/use-toast'

export function SignInClient() {
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        toast({
          title: t.auth.errorTitle,
          description: t.auth.invalidCredentials,
          variant: 'destructive',
        })
      } else if (result?.ok) {
        toast({
          title: t.auth.successTitle,
          description: t.auth.signInSuccess,
        })
        router.push('/')
        router.refresh()
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
          <LogIn className="w-12 h-12 mx-auto text-primary" />
          <h1 className="text-3xl font-heading font-bold">{t.auth.signIn}</h1>
          <p className="text-muted-foreground">{t.auth.signInDescription}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t.auth.signingIn : t.auth.signIn}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          {t.auth.noAccount}{' '}
          <Link href="/auth/signup" className="text-primary hover:underline">
            {t.auth.signUp}
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
