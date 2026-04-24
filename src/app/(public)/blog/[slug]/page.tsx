import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*, profiles(name, bio, avatar_url), post_tags(tags(name, slug))')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) notFound()

  return (
    <article className="max-w-2xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          {post.profiles?.name && <span>{post.profiles.name}</span>}
          {post.published_at && (
            <span>{new Date(post.published_at).toLocaleDateString('zh-TW')}</span>
          )}
        </div>
        {post.post_tags?.length > 0 && (
          <div className="flex gap-2 mt-4">
            {post.post_tags.map((pt: any) => (
              <span
                key={pt.tags.slug}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {pt.tags.name}
              </span>
            ))}
          </div>
        )}
      </header>

      <div
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content || '' }}
      />
    </article>
  )
}
