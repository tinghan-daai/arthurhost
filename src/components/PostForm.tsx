'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Post } from '@/lib/types'

const Editor = dynamic(() => import('./Editor'), { ssr: false })

interface PostFormProps {
  post?: Partial<Post>
  onSave: (data: PostFormData) => Promise<{ error?: string }>
}

export interface PostFormData {
  title: string
  slug: string
  excerpt: string
  content: string
  status: 'draft' | 'published'
}

function toSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/[\s一-鿿]+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function PostForm({ post, onSave }: PostFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [status, setStatus] = useState<'draft' | 'published'>(post?.status ?? 'draft')
  const [error, setError] = useState('')

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!post?.slug) setSlug(toSlug(value))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const result = await onSave({ title, slug, excerpt, content, status })
      if (result.error) {
        setError(result.error)
      } else {
        router.push('/admin/posts')
        router.refresh()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">標題</label>
          <input
            type="text"
            value={title}
            onChange={e => handleTitleChange(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug（網址）</label>
          <input
            type="text"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">摘要</label>
        <textarea
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">內容</label>
        <Editor content={content} onChange={setContent} />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex items-center gap-4">
        <select
          value={status}
          onChange={e => setStatus(e.target.value as 'draft' | 'published')}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="draft">草稿</option>
          <option value="published">發布</option>
        </select>
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? '儲存中...' : '儲存'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          取消
        </button>
      </div>
    </form>
  )
}
