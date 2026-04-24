import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PostForm, { PostFormData } from '@/components/PostForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (!post) notFound()

  async function updatePost(data: PostFormData) {
    'use server'
    const supabase = await createClient()

    const updates: Record<string, any> = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: data.content,
      status: data.status,
    }

    if (data.status === 'published' && !post.published_at) {
      updates.published_at = new Date().toISOString()
    }

    const { error } = await supabase.from('posts').update(updates).eq('id', id)
    if (error) return { error: error.message }
    return {}
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">編輯文章</h1>
      <PostForm post={post} onSave={updatePost} />
    </div>
  )
}
