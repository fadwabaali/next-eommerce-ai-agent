import { SanityLive } from '@/sanity/lib/live'

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>{children}</main>
      <SanityLive />
    </>
  )
}

export default AppLayout