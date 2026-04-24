export interface Profile {
  id: string
  name: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface Post {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  cover_image: string | null
  status: 'draft' | 'published'
  author_id: string | null
  published_at: string | null
  created_at: string
  updated_at: string
  author?: Profile
  tags?: Tag[]
}
