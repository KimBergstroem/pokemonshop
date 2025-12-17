"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import type { BlogPost } from "@prisma/client";

interface BlogClientProps {
  posts: BlogPost[];
}

export function BlogClient({ posts }: BlogClientProps) {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold">
          {t.blog.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t.blog.subtitle}
        </p>
      </motion.div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts?.map((post, index) => (
          <motion.article
            key={post?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Link href={`/blog/${encodeURIComponent(post?.slug ?? "")}`}>
              <div className="relative aspect-video bg-muted">
                <Image
                  src={post?.image ?? ""}
                  alt={post?.title ?? "Blog post"}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-heading font-semibold line-clamp-2 hover:text-primary transition-colors">
                  {post?.title}
                </h2>
                <p className="text-muted-foreground line-clamp-3">
                  {post?.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(post?.createdAt ?? "").toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>5 min read</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
