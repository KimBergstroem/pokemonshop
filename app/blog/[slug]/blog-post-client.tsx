'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, ArrowLeft, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BlogPost } from '@prisma/client'

interface BlogPostClientProps {
  post: BlogPost
}

export function BlogPostClient({ post }: BlogPostClientProps) {
  const handleShare = async () => {
    if (navigator?.share) {
      try {
        await navigator.share({
          title: post?.title ?? '',
          text: post?.excerpt ?? '',
          url: window?.location?.href ?? '',
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Back button */}
        <Link href="/blog">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>
        </Link>

        {/* Hero Image */}
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
          <Image
            src={post?.image ?? ''}
            alt={post?.title ?? 'Blog post'}
            fill
            className="object-cover"
          />
        </div>

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">
            {post?.title}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>By {post?.author}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(post?.createdAt ?? '').toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post?.content ?? '' }} />
        </div>
      </motion.div>
    </div>
  )
}
