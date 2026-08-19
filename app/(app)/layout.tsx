import { Header } from '@/components/shared/header'
import { ChatPanel } from '@/components/assistant/chat-panel'
import { Toaster } from '@/components/ui/sonner'
import { SanityLive } from '@/sanity/lib/live'
import { Footer } from '@/components/shared/footer'

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <ChatPanel />
      <Toaster />
      <SanityLive />
    </>
  )
}

export default AppLayout