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
            sizes="(max-width: 768px) 100vw, 896px"
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
        <article className="prose prose-lg dark:prose-invert max-w-none
          prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground
          prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:leading-tight prose-h2:border-b prose-h2:border-border prose-h2:pb-4
          prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-6 prose-h3:leading-tight
          prose-p:text-base prose-p:leading-8 prose-p:mb-8 prose-p:text-left
          prose-ul:my-8 prose-ul:space-y-4 prose-ul:pl-6
          prose-ol:my-8 prose-ol:space-y-4 prose-ol:pl-6
          prose-li:text-base prose-li:leading-8 prose-li:my-3
          prose-strong:text-foreground prose-strong:font-semibold
          [&>*:first-child]:mt-0
          [&_p]:text-left
          [&_h2]:text-left
          [&_h3]:text-left
          [&_p+_p]:mt-8
          [&_h2+_p]:mt-8">
          <div 
            className="[&>p]:mb-8 [&>p]:leading-8
                       [&>h2]:mt-16 [&>h2]:mb-8 [&>h2]:pt-4
                       [&>h3]:mt-10 [&>h3]:mb-6
                       [&>ul]:my-8 [&>ul]:space-y-4
                       [&>ol]:my-8 [&>ol]:space-y-4
                       [&>li]:my-3 [&>li]:leading-8"
            dangerouslySetInnerHTML={{ __html: post?.content ?? '' }} 
          />
        </article>
      </motion.div>
    </div>
  )
}
