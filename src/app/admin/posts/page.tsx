import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Post } from '@/lib/types'

export default async function AdminPostsPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, status, published_at, created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Link
          href="/admin/posts/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          新增文章
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {!posts || posts.length === 0 ? (
          <div className="p-8 text-center text-gray-400">還沒有文章，點擊「新增文章」開始吧！</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-600">標題</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">狀態</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">建立時間</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post: any) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{post.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {post.status === 'published' ? '已發布' : '草稿'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(post.created_at).toLocaleDateString('zh-TW')}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      編輯
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
