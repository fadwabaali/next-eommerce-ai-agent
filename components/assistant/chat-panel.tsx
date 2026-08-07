// components/assistant/chat-panel.tsx
"use client"

import { useState, Fragment } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import Image from "next/image"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation"
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message"
import { PromptInput, type PromptInputMessage, PromptInputTextarea, PromptInputSubmit } from "@/components/ai-elements/prompt-input"

type ToolProduct = { id: string; name: string; slug: string | null; price: number; image: string | null }
type TrackOrderResult = { error?: string; orderNumber?: string; status?: string; total?: number; itemCount?: number }

export function ChatPanel() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text?.trim()) return
    sendMessage({ text: message.text })
    setInput("")
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            size="icon"
            className="fixed bottom-6 right-6 z-50 size-12 rounded-full shadow-lg"
            aria-label="Open shopping assistant"
          />
        }
      >
        <Sparkles className="size-5" />
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Shopping Assistant</SheetTitle>
        </SheetHeader>

        <Conversation className="flex-1 px-4">
          <ConversationContent>
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Ask me to find something, get recommendations, or check on an order.
              </p>
            )}
            {messages.map((message) => (
              <Fragment key={message.id}>
                {message.parts.map((part, index) => {
                  const key = `${message.id}-${index}`

                  if (part.type === "text") {
                    return (
                      <Message key={key} from={message.role}>
                        <MessageContent>
                          <MessageResponse>{part.text}</MessageResponse>
                        </MessageContent>
                      </Message>
                    )
                  }

                  if (
                    (part.type === "tool-searchProducts" || part.type === "tool-recommendProducts") &&
                    part.state === "output-available"
                  ) {
                    const products = part.output as ToolProduct[]
                    return (
                      <Message key={key} from={message.role}>
                        <MessageContent>
                          {products.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No matching products found.</p>
                          ) : (
                            <div className="grid grid-cols-2 gap-3">
                              {products.map((product) => (
                                <Link
                                  key={product.id}
                                  href={`/product/${product.slug}`}
                                  onClick={() => setOpen(false)}
                                  className="block overflow-hidden rounded-md border border-border"
                                >
                                  {product.image && (
                                    <div className="relative aspect-square w-full">
                                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                                    </div>
                                  )}
                                  <div className="p-2">
                                    <p className="truncate text-xs font-medium">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">${product.price}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}
                        </MessageContent>
                      </Message>
                    )
                  }

                  if (part.type === "tool-trackOrder" && part.state === "output-available") {
                    const result = part.output as TrackOrderResult
                    return (
                      <Message key={key} from={message.role}>
                        <MessageContent>
                          {result.error ? (
                            <p className="text-sm text-destructive">{result.error}</p>
                          ) : (
                            <div className="rounded-md border border-border p-3 text-sm">
                              <p className="font-medium">{result.orderNumber}</p>
                              <p className="capitalize text-muted-foreground">
                                {result.status} · {result.itemCount} item{result.itemCount === 1 ? "" : "s"} · $
                                {result.total}
                              </p>
                            </div>
                          )}
                        </MessageContent>
                      </Message>
                    )
                  }

                  return null
                })}
              </Fragment>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="border-t border-border p-4">
          <PromptInputTextarea
            value={input}
            onChange={(event) => setInput(event.currentTarget.value)}
            placeholder="Ask about products or an order..."
          />
          <PromptInputSubmit status={status} disabled={!input.trim()} />
        </PromptInput>
      </SheetContent>
    </Sheet>
  )
}