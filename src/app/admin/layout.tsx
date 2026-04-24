import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminLogout from '@/components/AdminLogout'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-gray-900 text-white flex flex-col">
        <div className="p-5 border-b border-gray-700">
          <Link href="/" className="text-lg font-bold">ArthurHost</Link>
          <p className="text-xs text-gray-400 mt-1">後台管理</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 text-sm">
          <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/posts" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            文章管理
          </Link>
          <Link href="/admin/posts/new" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            新增文章
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 mb-3 truncate">{user.email}</p>
          <AdminLogout />
        </div>
      </aside>
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  )
}
