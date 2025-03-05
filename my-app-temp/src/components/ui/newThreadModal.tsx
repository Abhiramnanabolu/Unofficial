"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

export default function NewThreadButton({ categorySlug }: { categorySlug: string }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  let storedUsername = localStorage.getItem("username");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    console.log({ title, content, categorySlug })

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/discussion/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, category: categorySlug , guestName: storedUsername}),
    })
    const data = await response.json()

    setTitle("")
    setContent("")
    setIsSubmitting(false)
    setOpen(false)

    // You might want to refresh the discussions list or redirect to the new thread
    window.location.href = `/discussions/thread/${data.id}`
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> New Thread
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create New Thread</DialogTitle>
              <DialogDescription>
                Start a new discussion thread. Be clear and specific with your title to attract relevant responses.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className="font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter a descriptive title for your thread"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content" className="font-medium">
                  Content
                </Label>
                <Textarea
                  id="content"
                  placeholder="Describe your topic or question in detail"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="min-h-[150px] w-full"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Thread"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

