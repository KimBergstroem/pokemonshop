"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { Calendar, ArrowRight } from "lucide-react";
import type { BlogPost } from "@prisma/client";

export function BlogPreview() {
  const { t } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res?.json())
      .then((data) => setPosts(data?.slice(0, 3) ?? []))
      .catch((err) => console.error("Error fetching blog posts:", err));
  }, []);

  return (
    <section ref={ref} className="py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold">
            {t.blog.previewTitle}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.blog.previewSubtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts?.map((post, index) => (
            <motion.article
              key={post?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
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
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-heading font-semibold line-clamp-2 hover:text-primary transition-colors">
                    {post?.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post?.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
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
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12">
          <Link href="/blog">
            <Button variant="outline" className="gap-2">
              {t.blog.viewAll}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
