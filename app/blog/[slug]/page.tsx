import { BlogPostClient } from "./blog-post-client";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getBlogPost(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });
    return post;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  // Decode the slug from URL
  const decodedSlug = decodeURIComponent(params.slug);
  const post = await getBlogPost(decodedSlug);

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} />;
}
