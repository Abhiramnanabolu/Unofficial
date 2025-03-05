'use client';

import type React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, HelpCircle, ArrowRight, MessageSquare } from "lucide-react"
import  Header  from "@/components/ui/header"
import { useState , useEffect } from "react"
import {Loader} from "@/components/ui/loader"
import { formatDistanceToNow } from "date-fns"
import GradientAvatar from "@/components/ui/gradientAvatar";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export default function DiscussionsPage() {
  const [recentDiscussions, setRecentDiscussions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [ categoryStats, setCategoryStats] = useState({
    academic: {
      threads: 0,
      messages: 0,
    },
    general: {
      threads: 0,
      messages: 0,
    },
    help: {
      threads: 0,
      messages: 0,
    },
    })

  useEffect(() => {
    const fetchDiscussions = async () => {
      const response = await fetch(`${backendUrl}/discussions/recent`)
      const data = await response.json()
      setRecentDiscussions(data)
      setIsLoading(false)
    }
    const fetchCategoryStats = async () => {
      const response = await fetch(`${backendUrl}/discussion/category-stats`)
      const data = await response.json()
      setCategoryStats(data)
    }
    fetchDiscussions()
    fetchCategoryStats()
  },[])

  return (
    <>
       <Header type="Discussions"/>
       <div className="container mx-auto py-8 px-4 mt-16">
        <p className="mx-2 text-muted-foreground  text-sm mb-6 mx-auto w-full flex sm:hidden px-3 py-2 rounded">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/discussions" className="text-primary hover:text-primary transition-colors">
            Discussions
          </Link>
        </p>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3">Discussion Forums</h1>
          {/* <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join our community discussions to ask questions, share knowledge, and connect with others.
          </p> */}
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join MGIT community discussions to ask questions, share knowledge, and connect with others.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Academic Forum Card */}
          <ForumCard
            title="Academic"
            description="Discuss course materials, and academic topics."
            slug="academic"
            icon={<BookOpen className="h-8 w-8" />}
            color="bg-blue-50 text-blue-700"
            stats={{
              threads: categoryStats.academic.threads,
              messages: categoryStats.academic.messages,
            }}
          />

          {/* General Forum Card */}
          <ForumCard
            title="General"
            description="Chat about campus life, events, recommendations, and other general topics."
            slug="general"
            icon={<Users className="h-8 w-8" />}
            color="bg-green-50 text-green-700"
            stats={{
              threads: categoryStats.general.threads,
              messages: categoryStats.general.messages,
            }}
          />

          {/* Help Forum Card */}
          <ForumCard
            title="Help"
            description="Get assistance with technical issues, administrative questions, and support."
            slug="help"
            icon={<HelpCircle className="h-8 w-8" />}
            color="bg-amber-50 text-amber-700"
            stats={{
              threads: categoryStats.help.threads,
              messages: categoryStats.help.messages,
            }}
          />
        </div>

        {isLoading || !recentDiscussions ? (
          <div className="w-full flex items-center justify-center mt-16">
            <Loader type="1" size="lg" />
          </div>
        ) :  (
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {recentDiscussions.map((discussion) => (
              <Link key={discussion.id} href={`/discussions/thread/${discussion.id}`} className="block">
                <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base font-medium line-clamp-2">{discussion.title}</CardTitle>
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(discussion.category)}`}>
                          {discussion.category.charAt(0).toUpperCase() + discussion.category.slice(1)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">{discussion.content}</p>
                    </CardContent>
                  <CardFooter className="text-xs text-muted-foreground">
                    <div className="flex justify-between w-full">
                      <div className="flex items-center gap-2">
                        <GradientAvatar username={discussion.guestName} size={20} />
                        <span>{discussion.guestName}</span>
                      </div>
                      <time className="text-xs" dateTime={new Date(discussion.createdAt).toISOString()}>
                        {formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}
                      </time>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
          )}
      </div>
    </>
  )
}

function ForumCard({
  title,
  description,
  slug,
  icon,
  color,
  stats,
}: {
  title: string
  description: string
  slug: string
  icon: React.ReactNode
  color: string
  stats: { threads: number; messages: number }
}) {
  return (
    <Link href={`/discussions/${slug}`} className="block h-full">
      <Card className="h-full hover:shadow-md transition-all hover:translate-y-[-4px]">
        <CardHeader>
          <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center mb-4`}>{icon}</div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{stats.threads} threads</span>
            </div>
            <div>{stats.messages} messages</div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-medium">Browse forum</span>
            <ArrowRight className="h-5 w-5" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
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

// Mock data for recent discussions
// const recentDiscussions = [
//   {
//     id: "1",
//     title: "Research Methodology for Computer Science Projects",
//     preview: "I'm starting my final year project and need advice on research methodology specific to computer science.",
//     author: "Alex Johnson",
//     date: "2 hours ago",
//     category: "Academic",
//   },
//   {
//     id: "5",
//     title: "Campus Coffee Shop Recommendations",
//     preview: "What's your favorite place to grab coffee while studying? I'm looking for spots with good wifi.",
//     author: "Tyler Smith",
//     date: "5 hours ago",
//     category: "General",
//   },
//   {
//     id: "9",
//     title: "How to Access the Online Library Resources Remotely?",
//     preview: "I'm trying to access journal articles from home but keep getting an error.",
//     author: "David Kim",
//     date: "3 hours ago",
//     category: "Help",
//   },
//   {
//     id: "2",
//     title: "Understanding Quantum Computing Fundamentals",
//     preview: "Can someone explain quantum superposition in a way that's accessible to computer science students?",
//     author: "Maria Chen",
//     date: "Yesterday",
//     category: "Academic",
//   },
//   {
//     id: "6",
//     title: "Best Productivity Apps for Students",
//     preview: "I'm trying to get more organized this semester. What apps do you use to manage your schedule?",
//     author: "Emma Davis",
//     date: "2 days ago",
//     category: "General",
//   },
//   {
//     id: "10",
//     title: "Course Registration System Error",
//     preview: "I'm getting a 'server timeout' error when trying to register for next semester's classes.",
//     author: "Olivia Brown",
//     date: "Yesterday",
//     category: "Help",
//   },
// ]

