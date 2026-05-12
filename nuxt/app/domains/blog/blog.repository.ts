// 1. External imports

// 2. Internal imports
import { blogArticles } from './blog.data'
import type { BlogArticle } from './blog.types'

export function getBlogArticles(): readonly BlogArticle[] {
  return blogArticles
}

export function getBlogArticleBySlug(slug: string): BlogArticle | undefined {
  return blogArticles.find((article) => article.slug === slug)
}

export function getBlogRoutes(): string[] {
  return ['/blog', ...blogArticles.map((article) => `/blog/${article.slug}`)]
}
