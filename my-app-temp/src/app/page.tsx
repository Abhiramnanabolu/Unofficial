"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, MessageSquare, Users, BarChart3, Shield, Clock, Filter, ThumbsUp, Sparkles } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/ui/header"

// Fun facts/memes for the rotating element
const funFacts = [
  "The average student spends 1,200 hours studying per year",
  "Taking a 10-minute break every hour improves retention by 30%",
  "Students who participate in discussions are 50% more likely to remember the material",
  "The word 'student' comes from the Latin 'studere', meaning 'to be eager'",
  "The most productive study time for most students is between 10am and 2pm"
]

export default function LandingPage() {
  const [currentFact, setCurrentFact] = useState(0)
  
  // Rotate through fun facts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % funFacts.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Header type="Home"/>
      <div className="min-h-screen mt-24 bg-gradient-to-b from-white to-gray-50">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center">
              <motion.h1 
                className="text-3xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Connect. Discuss. Thrive.
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-gray-600 max-w-3xl mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                A student-driven platform for open discussions, real-time chat, and essential academic tools.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-5 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link href="/discussions" className="inline-flex">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all px-6 py-6 text-base font-medium">
                    <span className="flex items-center">
                      Join the Discussion <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </Button>
                </Link>

                <Link href="/chat" className="inline-flex">
                  <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all px-6 py-6 text-base font-medium">
                    <span className="flex items-center">
                      Start a Chat <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </Button>
                </Link>

                <Link href="/tools" className="inline-flex">
                  <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 shadow-sm hover:shadow-md transition-all px-6 py-6 text-base font-medium">
                    <span className="flex items-center">
                      Explore Tools
                    </span>
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>


        {/* Main Sections */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl text-gray-800 font-bold text-center mb-8">Explore The Platform</h2>
            
            <Tabs defaultValue="discussions" className="w-full max-w-5xl mx-auto">
              <TabsList className="grid h-full grid-cols-3 mb-12">
                <TabsTrigger value="discussions" className="text-base py-2">Discussions</TabsTrigger>
                <TabsTrigger value="chat" className="text-base py-2">Chat</TabsTrigger>
                <TabsTrigger value="tools" className="text-base py-2">Tools</TabsTrigger>
              </TabsList>
              
              <TabsContent value="discussions" className="mt-0">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-blue-600">Engage in Topic-Based Conversations</h3>
                    <p className="text-gray-600 mb-6">
                      Join discussions on various academic topics, share your insights, and learn from peers. Our platform makes it easy to find relevant conversations and contribute meaningfully.
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start">
                        <Shield className="h-5 w-5 text-blue-500 mr-2 mt-1" />
                        <span>Post anonymously when you want privacy</span>
                      </li>
                      <li className="flex items-start">
                        <Filter className="h-5 w-5 text-blue-500 mr-2 mt-1" />
                        <span>Sort and filter to find exactly what you need</span>
                      </li>
                      <li className="flex items-start">
                        <ThumbsUp className="h-5 w-5 text-blue-500 mr-2 mt-1" />
                        <span>Like and reply to engage with other students</span>
                      </li>
                    </ul>
                    <Link href="/discussions">
                      <Button>
                        Browse Discussions <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-6 shadow-inner">
                    <Image 
                      src="/dis2.png" 
                      alt="Discussions interface preview" 
                      width={1200} 
                      height={1200} 
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="chat" className="mt-0">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="order-2 md:order-1 bg-gray-100 rounded-xl p-6 shadow-inner">
                    <Image 
                      src="/chat1.png" 
                      alt="Chat interface preview" 
                      width={800} 
                      height={600} 
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="order-1 md:order-2">
                    <h3 className="text-2xl font-bold mb-4 text-blue-600">Real-Time Messaging</h3>
                    <p className="text-gray-600 mb-6">
                      Connect instantly with fellow students in our real-time chat. Ask quick questions, share updates, or just hang out in a casual environment.
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start">
                        <Clock className="h-5 w-5 text-blue-500 mr-2 mt-1" />
                        <span>Instant messaging with no delays</span>
                      </li>
                      <li className="flex items-start">
                        <Users className="h-5 w-5 text-blue-500 mr-2 mt-1" />
                        <span>One shared space for all campus students</span>
                      </li>
                      <li className="flex items-start">
                        <Sparkles className="h-5 w-5 text-blue-500 mr-2 mt-1" />
                        <span>Express yourself with reactions and emojis</span>
                      </li>
                    </ul>
                    <Link href="/chat">
                      <Button>
                        Join the Chat <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tools" className="mt-0">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-blue-600">Helpful Student Utilities</h3>
                    <p className="text-gray-600 mb-6">
                      Access a suite of tools designed specifically for students. Calculate your GPA, predict your CGPA, and manage your attendance with ease.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="border-blue-100 border-1  p-3 shadow-sm rounded-sm">
                        <div className="">
                          <h4 className="font-bold mb-2">Bunk Manager</h4>
                          <p className="text-sm text-gray-500">Calculate how many classes you can skip while maintaining attendance requirements</p>
                        </div>
                      </div>
                      <div className="border-blue-100 border-1  p-3 shadow-sm rounded-sm">
                        <div className="">
                          <h4 className="font-bold mb-2">GPA Calculator</h4>
                          <p className="text-sm text-gray-500">Easily calculate your semester GPA based on course credits and grades</p>
                        </div>
                      </div>
                      <div className="border-blue-100 border-1  p-3 shadow-sm rounded-sm">
                        <div className="">
                          <h4 className="font-bold mb-2">CGPA Predictor</h4>
                          <p className="text-sm text-gray-500">Predict your cumulative GPA based on current and expected performance</p>
                        </div>
                      </div>
                    </div>
                    <Link href="/tools">
                      <Button>
                        Explore Tools <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-6 shadow-inner">
                    <Image 
                      src="/tools2.png" 
                      alt="Student tools preview" 
                      width={1200} 
                      height={1000} 
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Key Features</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Anonymous Posting</h3>
                <p className="text-gray-600">
                  Share your thoughts freely without revealing your identity. Perfect for sensitive topics or when you just want privacy.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Category-Based Discussions</h3>
                <p className="text-gray-600">
                  Find conversations organized by subject, course, or topic. Navigate easily to discussions that matter to you.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Real-Time Chatroom</h3>
                <p className="text-gray-600">
                  Connect instantly with the entire student community in one shared space for quick interactions.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Filter className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Sorting & Filtering</h3>
                <p className="text-gray-600">
                  Find exactly what you're looking for with powerful sorting and filtering options across all platform sections.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <ThumbsUp className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Like & Reply System</h3>
                <p className="text-gray-600">
                  Engage meaningfully with posts through likes and threaded replies. Show appreciation and continue conversations.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Student Tools</h3>
                <p className="text-gray-600">
                  Access specialized tools like Bunk Manager, GPA Calculator, and CGPA Predictor to help manage your academic life.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Fun Element */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Did You Know?</h2>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <p className="text-xl italic">"{funFacts[currentFact]}"</p>
              </div>
              <div className="mt-6 flex justify-center space-x-2">
                {funFacts.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentFact ? "bg-white" : "bg-white/30"
                    }`}
                    onClick={() => setCurrentFact(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Connect?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
              Join MGITUnofficial and connect with students to discuss, collaborate, and enhance your college experience.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/discussions">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <MessageSquare className="mr-2 h-5 w-5" /> Join Discussions
                </Button>
              </Link>
              <Link href="/chat">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                  <Users className="mr-2 h-5 w-5" /> Enter Chat
                </Button>
              </Link>
              <Link href="/tools">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <BarChart3 className="mr-2 h-5 w-5" /> Use Tools
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 items-center justify-center">
              <div>
                <h3 className="text-xl font-bold mb-4">Campus Connect</h3>
                <p className="text-gray-400">
                  Your all-in-one platform for student discussions, real-time chat, and essential academic tools.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Platform</h4>
                <ul className="space-y-2">
                  <li><Link href="/discussions" className="text-gray-400 hover:text-white">Discussions</Link></li>
                  <li><Link href="/chat" className="text-gray-400 hover:text-white">Chat</Link></li>
                  <li><Link href="/tools" className="text-gray-400 hover:text-white">Tools</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>© {new Date().getFullYear()} Campus Connect. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
