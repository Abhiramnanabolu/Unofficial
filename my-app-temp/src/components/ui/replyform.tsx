"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Smile, ImageIcon, Link2 } from "lucide-react"

export default function ReplyForm({ onCancel }: { onCancel: () => void }) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Here you would typically send the data to your API
    // await fetch('/api/discussions/reply', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ content }),
    // })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setContent("")
    setIsSubmitting(false)
    onCancel() // Close the reply form after submission
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 mb-4">
      <div className="border rounded-md">
        <Textarea
          placeholder="What are your thoughts?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="min-h-[100px] border-0 focus-visible:ring-0 resize-none"
        />
        <div className="flex items-center justify-between p-2 border-t">
          <div className="flex items-center gap-2">
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
              <Smile className="h-4 w-4" />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
              <Link2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" onClick={onCancel} className="h-8">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !content.trim()} className="h-8">
              Comment
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

