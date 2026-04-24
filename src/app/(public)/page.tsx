import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Post } from '@/lib/types'

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, published_at, profiles(name)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(10)

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3">ArthurHost Blog</h1>
        <p className="text-gray-500 text-lg">團隊分享技術、思考與日常。</p>
      </div>

      {!posts || posts.length === 0 ? (
        <p className="text-gray-400">目前還沒有文章。</p>
      ) : (
        <div className="space-y-8">
          {posts.map((post: any) => (
            <article key={post.id} className="border-b border-gray-100 pb-8">
              <Link href={`/blog/${post.slug}`} className="group">
                <h2 className="text-2xl font-semibold group-hover:text-blue-600 transition-colors mb-2">
                  {post.title}
                </h2>
              </Link>
              {post.excerpt && (
                <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
              )}
              <div className="flex items-center gap-3 text-sm text-gray-400">
                {post.profiles?.name && <span>{post.profiles.name}</span>}
                {post.published_at && (
                  <span>{new Date(post.published_at).toLocaleDateString('zh-TW')}</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
