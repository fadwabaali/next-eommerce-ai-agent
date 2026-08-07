// app/(app)/layout.tsx
import { Header } from '@/components/shared/header'
import { ChatPanel } from '@/components/assistant/chat-panel'
import { Toaster } from '@/components/ui/sonner'
import { SanityLive } from '@/sanity/lib/live'

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <ChatPanel />
      <Toaster />
      <SanityLive />
    </>
  )
}

export default AppLayout