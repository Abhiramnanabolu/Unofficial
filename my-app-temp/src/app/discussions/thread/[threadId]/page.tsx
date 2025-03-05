"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, ThumbsUp, Eye, Share2, Send, Copy, MessageCircle, ChevronUp, ChevronDown } from "lucide-react"
import Header from "@/components/ui/header"
import { formatDistanceToNow } from "date-fns"
import GradientAvatar from "@/components/ui/gradientAvatar"
import { Loader } from "@/components/ui/loader"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export interface Discussion {
  id: string
  title: string
  content: string
  category: string
  guestName: string
  createdAt: string
  updatedAt: string
  replies: Reply[]
  likes: number
  views: number
}

export interface Reply {
  id: string
  content: string
  guestName: string
  createdAt: string
  likes: number
  discussionId: string
  parentReplyId?: string
  childReplies?: Reply[]
}

const forumCategories = {
  academic: {
    title: "Academic Discussions",
    description: "Engage in scholarly debates, share research insights, and explore academic topics.",
    color: "bg-blue-50 text-blue-700",
  },
  general: {
    title: "General Discussions",
    description: "Connect with peers, discuss campus life, and share experiences.",
    color: "bg-green-50 text-green-700",
  },
  help: {
    title: "Help & Support",
    description: "Get assistance with technical issues, administrative questions, and general support.",
    color: "bg-amber-50 text-amber-700",
  },
}

function getCategoryColor(category: string) {
  switch (category.toLowerCase()) {
    case "academic":
      return "bg-blue-100 text-blue-800"
    case "general":
      return "bg-green-100 text-green-800"
    case "help":
      return "bg-amber-100 text-amber-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function organizeRepliesIntoTree(replies: Reply[]) {
  // Create a map of all replies by their ID for quick lookup
  const replyMap = new Map<string, Reply & { childReplies: Reply[] }>()

  // Initialize each reply with an empty childReplies array
  replies.forEach((reply) => {
    replyMap.set(reply.id, { ...reply, childReplies: [] })
  })

  // Create the tree structure
  const rootReplies: (Reply & { childReplies: Reply[] })[] = []

  // Organize replies into a tree structure
  replies.forEach((reply) => {
    const replyWithChildren = replyMap.get(reply.id)!

    if (reply.parentReplyId) {
      // This is a child reply, add it to its parent's childReplies
      const parent = replyMap.get(reply.parentReplyId)
      if (parent) {
        parent.childReplies.push(replyWithChildren)
      } else {
        // If parent doesn't exist (shouldn't happen), add to root
        rootReplies.push(replyWithChildren)
      }
    } else {
      // This is a root reply
      rootReplies.push(replyWithChildren)
    }
  })

  return rootReplies
}

function ReplyForm({
  onCancel,
  parentId,
  discussionId,
  onReplySubmitted,
  title = "Add a comment",
}: {
  onCancel: () => void
  parentId?: string
  discussionId: string
  onReplySubmitted?: () => void
  title?: string
}) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`${backendUrl}/discussion/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discussionId,
          content: content.trim(),
          parentReplyId: parentId,
          guestName: localStorage.getItem("username") || "Anonymous",
        }),
      })

      if (!response.ok) {
        throw new Error(`Error submitting reply: ${response.status}`)
      }

      console.log("Reply submitted successfully")
      setContent("") // Clear the input after successful submission
      if (onReplySubmitted) {
        onReplySubmitted()
      }
    } catch (error) {
      console.error("Failed to submit reply:", error)
      alert("Failed to submit your comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 mb-4">
      <div className="border rounded-lg shadow-sm overflow-hidden">
        {/* {title && <div className="px-3 py-2 bg-muted/10 border-b">{title}</div>} */}
        <Textarea
          placeholder="What are your thoughts?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px] border-0 focus-visible:ring-0 resize-none p-3"
        />
        <div className="flex justify-end items-center p-2 bg-muted/20 gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!content.trim() || isSubmitting} className="rounded-full">
            {isSubmitting ? "Submitting..." : "Comment"}
          </Button>
        </div>
      </div>
    </form>
  )
}

function Reply({ reply, depth = 0, refreshDiscussion }: { reply: any; depth?: number; refreshDiscussion: () => void }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3114"
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [votes, setVotes] = useState(reply.likes || 0)
  const [isVoted, setIsVoted] = useState<"up" | "down" | null>(() => {
    // Check if this reply is in the liked replies list
    const likedReplies = JSON.parse(localStorage.getItem("likedReplies") || "[]")
    return likedReplies.includes(reply.id) ? "up" : null
  })

  const handleVote = async (direction: "up" | "down") => {
    if (!reply) return

    // Store previous state to revert if API call fails
    const previousIsVoted = isVoted
    const previousVotes = votes

    // Update UI immediately for better user experience
    const newIsVoted = isVoted === direction ? null : direction
    setIsVoted(newIsVoted)

    if (direction === "up") {
      if (isVoted === "up") {
        // Removing upvote
        setVotes(votes - 1)
      } else if (isVoted === "down") {
        // Changing from downvote to upvote
        setVotes(votes + 2)
      } else {
        // Adding new upvote
        setVotes(votes + 1)
      }
    } else {
      if (isVoted === "down") {
        // Removing downvote
        setVotes(votes + 1)
      } else if (isVoted === "up") {
        // Changing from upvote to downvote
        setVotes(votes - 2)
      } else {
        // Adding new downvote
        setVotes(votes - 1)
      }
    }

    // Update local storage for upvotes only (similar to thread likes)
    const likedReplies = JSON.parse(localStorage.getItem("likedReplies") || "[]")
    let updatedLikedReplies

    if (newIsVoted === "up") {
      // Add reply ID to liked replies if not already present
      updatedLikedReplies = [...likedReplies, reply.id]
    } else {
      // Remove reply ID from liked replies
      updatedLikedReplies = likedReplies.filter((id: string) => id !== reply.id)
    }

    // Save updated list to local storage
    localStorage.setItem("likedReplies", JSON.stringify(updatedLikedReplies))

    try {
      const response = await fetch(`${backendUrl}/reply/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: reply.id,
          event: newIsVoted === "up" ? "like" : newIsVoted === "down" ? "dislike" : "neutral",
        }),
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Error updating reply like: ${response.status}`)
      }

      // If successful, we could update with the server response if needed
      // const data = await response.json()
      // setVotes(data.likes)
    } catch (error) {
      console.error("Failed to update reply like:", error)

      // Revert UI state if API call fails
      setIsVoted(previousIsVoted)
      setVotes(previousVotes)

      // Also revert local storage if API call fails
      localStorage.setItem("likedReplies", JSON.stringify(likedReplies))
    }
  }

  return (
    <div className={`${depth > 0 ? "border-l-2 border-mutedd ml-2 pl-4" : ""} ${depth === 0 ? "mt-8" : "mt-4"}`}>
      <div className="flex items-center mb-2">
        <GradientAvatar username={reply.guestName} size={20} className="mr-2" />
        <span className="font-medium text-sm">{reply.guestName}</span>
        <span className="mx-2 text-muted-foreground">•</span>
        <time className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
        </time>
      </div>
      <p className="text-sm mb-3">{reply.content}</p>
      <div className="flex items-center text-xs text-muted-foreground mb-2 gap-4">
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 rounded-full ${isVoted === "up" ? "text-primary bg-primary/10" : ""}`}
                  onClick={() => handleVote("up")}
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upvote</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <span className="mx-1 min-w-6 text-center">{votes}</span>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 rounded-full ${isVoted === "down" ? "text-destructive bg-destructive/10" : ""}`}
                  onClick={() => handleVote("down")}
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Downvote</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-8 gap-1.5 text-xs"
          onClick={() => setShowReplyForm(!showReplyForm)}
        >
          <MessageCircle className="w-4 h-4" />
          Reply
        </Button>

        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem>
              <Copy className="w-4 h-4 mr-2" />
              Copy text
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LinkIcon className="w-4 h-4 mr-2" />
              Copy link to comment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>

      {showReplyForm && (
        <ReplyForm
          onCancel={() => setShowReplyForm(false)}
          parentId={reply.id}
          discussionId={reply.discussionId}
          onReplySubmitted={() => {
            refreshDiscussion()
            setShowReplyForm(false)
          }}
        />
      )}

      {reply.childReplies && reply.childReplies.length > 0 && (
        <div className="mt-2">
          {reply.childReplies.map((childReply: any) => (
            <Reply key={childReply.id} reply={childReply} depth={depth + 1} refreshDiscussion={refreshDiscussion} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function DiscussionThreadPage({ params }: any) {
  const [showMainReplyForm, setShowMainReplyForm] = useState(false)
  const [discussion, setDiscussion] = useState<Discussion | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3114"

  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        const response = await fetch(`${backendUrl}/discussion/details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: params.threadId }),
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error(`Error fetching discussion: ${response.status}`)
        }

        const data = await response.json()
        setDiscussion(data)
        setLikesCount(data.likes)

        // Check if this thread is in the liked threads list
        const likedThreads = JSON.parse(localStorage.getItem("likedThreads") || "[]")
        setIsLiked(likedThreads.includes(params.threadId))
      } catch (error) {
        console.error("Failed to fetch discussion:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDiscussion()
  }, [params.threadId, backendUrl]) // Added backendUrl to dependencies

  const handleLike = async () => {
    if (!discussion) return

    const newIsLiked = !isLiked
    setIsLiked(newIsLiked)
    setLikesCount((prev) => prev + (newIsLiked ? 1 : -1))

    // Update local storage
    const likedThreads = JSON.parse(localStorage.getItem("likedThreads") || "[]")
    let updatedLikedThreads

    if (newIsLiked) {
      // Add thread ID to liked threads if not already present
      updatedLikedThreads = [...likedThreads, discussion.id]
    } else {
      // Remove thread ID from liked threads
      updatedLikedThreads = likedThreads.filter((id: string) => id !== discussion.id)
    }

    // Save updated list to local storage
    localStorage.setItem("likedThreads", JSON.stringify(updatedLikedThreads))

    try {
      const response = await fetch(`${backendUrl}/discussion/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: discussion.id, event: newIsLiked ? "like" : "unlike" }),
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Error fetching discussion: ${response.status}`)
      }

      const data = await response.json()
      setDiscussion(data)
      setLikesCount(data.likes)
    } catch (error) {
      console.error(error)
      // Revert UI state if API call fails
      setIsLiked(!newIsLiked)
      setLikesCount((prev) => prev + (newIsLiked ? -1 : 1))

      // Also revert local storage if API call fails
      localStorage.setItem("likedThreads", JSON.stringify(likedThreads))
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: discussion?.title || "Discussion",
          url: window.location.href,
        })
        .catch((error) => console.error("Error sharing:", error))
    } else {
      // Fallback to copy
      handleCopyLink()
    }
  }

  const refreshDiscussion = async () => {
    if (!discussion) return

    try {
      const response = await fetch(`${backendUrl}/discussion/details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: params.threadId }),
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Error fetching discussion: ${response.status}`)
      }

      const data = await response.json()
      setDiscussion(data)
      setLikesCount(data.likes)
    } catch (error) {
      console.error("Failed to refresh discussion:", error)
    }
  }

  if (loading) {
    return (
      <>
        <Header type="Discussions" />
        <main className="w-full h-full items-center justify-center mt-14 max-w-4xl mx-auto py-12 px-4 md:px-6">
          <Loader type="1" size="lg" />
        </main>
      </>
    )
  }

  if (!discussion) {
    return (
      <>
        <Header type="Discussions" />
        <main className="w-full mt-14 max-w-4xl mx-auto py-12 px-4 md:px-6">
          <p>Discussion not found</p>
        </main>
      </>
    )
  }

  return (
    <>
      <Header type="Discussions" />
      <main className="w-full mt-8 max-w-4xl mx-auto py-12 px-4 md:px-6">
        <p className="mx-2 text-muted-foreground  text-sm mb-2 mx-auto w-full flex sm:hidden px-2 pt-2 pb-0 rounded">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/discussions" className=" hover:text-primary transition-colors">
            Discussions
          </Link>
        </p>
        <Card className="mb-6 shadow-md border-muted py-0 ">
          <CardHeader>
            <div className="mb-2 mt-4">
              <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(discussion.category)}`}>
                {discussion.category.charAt(0).toUpperCase() + discussion.category.slice(1)}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl font-bold">{discussion.title}</CardTitle>
            </div>

            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <GradientAvatar username={discussion.guestName} size={20} className="mr-2" />
              <span className="text-xs">{discussion.guestName}</span>
              <span className="mx-2 text-xs">•</span>
              <time className="text-xs" dateTime={new Date(discussion.createdAt).toISOString()}>
                {formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}
              </time>
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-sm" dangerouslySetInnerHTML={{ __html: discussion.content.replace(/\n/g, "<br/>") }} />
          </CardContent>

          <div className="flex items-center justify-between px-6 py-3 border-t">
            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLike}
                      className={`rounded-full flex items-center gap-1.5 ${isLiked ? "text-primary" : ""}`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                      <span>{likesCount}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isLiked ? "Unlike" : "Like"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full flex items-center gap-1.5"
                      onClick={() => setShowMainReplyForm(true) 
                        
                      }
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{discussion.replies.length}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Comments</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
{/* 
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="rounded-full flex items-center gap-1.5" disabled>
                      <Eye className="w-4 h-4" />
                      <span>{discussion.views}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Views</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
            </div>

            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="rounded-full flex items-center gap-1.5">
                        <Share2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Share</span>
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                  <Copy className="w-4 h-4 mr-2" />
                  <span>Copy link</span>
                </DropdownMenuItem>
                {typeof navigator.share === "function" && (
                  <DropdownMenuItem onClick={handleNativeShare} className="cursor-pointer">
                    <Send className="w-4 h-4 mr-2" />
                    <span>Share to app</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>

        <div className="mt-2 mb-6">
          {!showMainReplyForm ? (
            <div
              className="border-2 rounded-full py-2 px-4 text-sm text-muted-foreground cursor-pointer hover:bg-muted/10 transition-colors"
              onClick={() => setShowMainReplyForm(true)}
            >
              Add a comment
            </div>
          ) : (
            <ReplyForm
              onCancel={() => setShowMainReplyForm(false)}
              discussionId={discussion.id}
              onReplySubmitted={() => {
                refreshDiscussion()
                setShowMainReplyForm(false)
              }}
              title="Add a comment"
            />
          )}
        </div>

        <div className="space-y-6 px-4" id="replies">
          {organizeRepliesIntoTree(discussion.replies).map((reply) => (
            <Reply key={reply.id} reply={reply} refreshDiscussion={refreshDiscussion} />
          ))}
        </div>
      </main>
    </>
  )
}

