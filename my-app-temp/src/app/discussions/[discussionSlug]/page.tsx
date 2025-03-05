'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Users, HelpCircle, MessageSquare, Eye, ThumbsUp } from "lucide-react";
import NewThreadButton from "@/components/ui/newThreadModal";
import Header from "@/components/ui/header";
import { Loader } from "@/components/ui/loader";
import GradientAvatar from "@/components/ui/gradientAvatar";
import { formatDistanceToNow as dateFnsFormatDistanceToNow } from "date-fns";

const forumCategories = {
  academic: {
    title: "Academic Discussions",
    description: "Engage in scholarly debates, share research insights, and explore academic topics.",
    icon: <BookOpen className="h-6 w-6" />,
    color: "bg-blue-50 text-blue-700",
  },
  general: {
    title: "General Discussions",
    description: "Connect with peers, discuss campus life, and share experiences.",
    icon: <Users className="h-6 w-6" />,
    color: "bg-green-50 text-green-700",
  },
  help: {
    title: "Help & Support",
    description: "Get assistance with technical issues, administrative questions, and general support.",
    icon: <HelpCircle className="h-6 w-6" />,
    color: "bg-amber-50 text-amber-700",
  },
};

interface Discussion {
  id: string;
  title: string;
  content: string;
  guestName: string;
  createdAt: string;
  replies: any[];
  likes: number;
}

interface Params {
  discussionSlug: keyof typeof forumCategories;
}

let backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export default function DiscussionCategoryPage({ params }: { params: Params }) {
  const { discussionSlug } = params;
  const category = forumCategories[discussionSlug];

  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [sortBy, setSortBy] = useState("latest");
  const [timeRange, setTimeRange] = useState("all-time");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDiscussions() {
      setIsLoading(true);
      const response = await fetch(`${backendUrl}/discussion/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: discussionSlug, sortBy, timeRange }),
      });
      if (response.ok) {
        const data = await response.json();
        setDiscussions(data);
      }
      setIsLoading(false);
    }
    fetchDiscussions();
  }, [discussionSlug, sortBy, timeRange]);

  if (!category) {
    notFound();
  }

  function formatDistanceToNow(date: Date, options: { addSuffix: boolean }): string {
    return dateFnsFormatDistanceToNow(date, options);
  }

  return (
    <>
      <Header type="Discussions" />
        
      <div className="w-full mt-14 max-w-5xl mx-auto py-12 px-4 md:px-6 lg:px-8 xl:px-12">
        <p className="mx-2 text-muted-foreground  text-sm mb-6 mx-auto w-full flex sm:hidden px-2 py-2 rounded">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/discussions" className=" hover:text-primary transition-colors">
            Discussions
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/discussions/${discussionSlug}`} className="text-primary hover:text-primary transition-colors">
            {discussionSlug.charAt(0).toUpperCase() + discussionSlug.slice(1)}
          </Link>
        </p>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center`}>
              {category.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{category.title}</h1>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
          </div>
          <NewThreadButton categorySlug={discussionSlug} />
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="unanswered">Unanswered</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-time">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">Showing {discussions.length} threads</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <Loader type="1" size="lg" />
          </div>
        ) : (
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <Link key={discussion.id} href={`/discussions/thread/${discussion.id}`} className="block">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="">
                    <CardTitle className="text-xl font-semibold">{discussion.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">{discussion.content}</p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-between items-center w-full text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <GradientAvatar username={discussion.guestName} size={20} className="" />
                          <span>{discussion.guestName}</span>
                        </div>
                        <time className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}
                        </time>
                      </div>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{discussion.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{discussion.replies.length}</span>
                        </div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}


// Mock data for discussions
const discussions = [
  {
    id: "1",
    title: "Research Methodology for Computer Science Projects",
    preview:
      "I'm starting my final year project and need advice on research methodology specific to computer science. What approaches have worked well for you?",
    author: "Alex Johnson",
    date: "2 hours ago",
    replies: 12,
    views: 145,
  },
  {
    id: "2",
    title: "Understanding Quantum Computing Fundamentals",
    preview:
      "Can someone explain quantum superposition in a way that's accessible to computer science students? I'm struggling with the basic concepts.",
    author: "Maria Chen",
    date: "Yesterday",
    replies: 8,
    views: 103,
  },
  {
    id: "3",
    title: "Literature Review Tips for AI Ethics Papers",
    preview:
      "I'm writing a paper on ethical considerations in AI development. Does anyone have advice on structuring the literature review section?",
    author: "Jamal Williams",
    date: "3 days ago",
    replies: 15,
    views: 210,
  },
  {
    id: "4",
    title: "Comparing Statistical Methods for Data Analysis",
    preview:
      "I'm trying to decide between ANOVA and regression analysis for my research. My dataset includes categorical and continuous variables.",
    author: "Sarah Miller",
    date: "1 week ago",
    replies: 7,
    views: 89,
  },
  {
    id: "5",
    title: "Best Practices for Writing Technical Documentation",
    preview:
      "I'm working on documenting a complex software project. What are some best practices for making the documentation clear and user-friendly?",
    author: "Chris Lee",
    date: "2 weeks ago",
    replies: 20,
    views: 278,
  },
]

