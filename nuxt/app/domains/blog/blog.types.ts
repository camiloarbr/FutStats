export interface BlogArticleSection {
  heading: string
  body: string
}

export interface BlogArticle {
  category: string
  heroStat: string
  publishedAt: string
  readingMinutes: number
  sections: readonly BlogArticleSection[]
  slug: string
  summary: string
  title: string
}
