// app/(app)/layout.tsx
import { Header } from '@/components/shared/header'
import { SanityLive } from '@/sanity/lib/live'

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <SanityLive />
    </>
  )
}

export default AppLayout