'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="border-b border-gray-200">
      <nav className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          ArthurHost
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className={pathname === '/' ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'}
          >
            首頁
          </Link>
          <Link
            href="/blog"
            className={pathname.startsWith('/blog') ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'}
          >
            文章
          </Link>
        </div>
      </nav>
    </header>
  )
}
