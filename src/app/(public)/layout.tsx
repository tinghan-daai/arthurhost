import Navbar from '@/components/Navbar'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        {children}
      </main>
      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} ArthurHost
      </footer>
    </>
  )
}
