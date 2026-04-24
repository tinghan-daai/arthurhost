import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PostForm, { PostFormData } from '@/components/PostForm'

export default function NewPostPage() {
  async function createPost(data: PostFormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('posts').insert({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: data.content,
      status: data.status,
      author_id: user?.id,
      published_at: data.status === 'published' ? new Date().toISOString() : null,
    })

    if (error) return { error: error.message }
    return {}
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">新增文章</h1>
      <PostForm onSave={createPost} />
    </div>
  )
}
