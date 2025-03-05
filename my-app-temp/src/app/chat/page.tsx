"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { format, isToday, isYesterday, set } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import GradientAvatar from "@/components/ui/gradientAvatar"
import Header from "@/components/ui/header"
import { Send, RefreshCw } from "lucide-react"

interface Message {
  id: string
  sender: string
  content: string
  createdAt: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState(false)
  const [username, setUsername] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("username") || "Anonymous" : "Anonymous",
  )

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3114"

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch past messages
  const fetchPastMessages = async () => {
    try {
      const response = await axios.get(`${backendUrl}/chat/messages`)
      setMessages(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching past messages:", error)
      setLoading(false)
    }
  }

  const connectWebSocket = () => {
    setConnecting(true)
    setConnectionError(false)

    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WSS_URL}`)

    socket.onopen = () => {
      console.log("WebSocket connection established")
      setConnecting(false)
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "new_message") {
        setMessages((prev) => {
          // Check if the message already exists in our state
          const messageExists = prev.some((msg) => msg.id === data.message.id)
          if (messageExists) {
            return prev // Don't add duplicate message
          }
          return [...prev, data.message]
        })
      }
    }

    socket.onerror = (error) => {
      console.error("WebSocket error:", error)
      setConnectionError(true)
      setConnecting(false)
    }

    socket.onclose = () => {
      console.log("WebSocket connection closed")
      setConnectionError(true)
      setConnecting(false)
    }

    setWs(socket)

    return () => {
      socket.close()
    }
  }

  useEffect(() => {
    fetchPastMessages()
    connectWebSocket()

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [])

  const sendMessage = () => {
    if (input.trim() && ws && ws.readyState === WebSocket.OPEN) {
      const message = {
        type: "new_message",
        content: input.trim(),
        sender: username,
      }

      ws.send(JSON.stringify(message))
      setInput("")
    } else if (ws?.readyState !== WebSocket.OPEN) {
      setConnectionError(true)
      reconnect()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const reconnect = () => {
    if (ws) {
      ws.close()
    }
    connectWebSocket()
  }

  const isOwnMessage = (sender: string) => {
    return sender === username
  }

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}

    messages.forEach((message) => {
      const date = new Date(message.createdAt)
      let dateKey

      if (isToday(date)) {
        dateKey = "Today"
      } else if (isYesterday(date)) {
        dateKey = "Yesterday"
      } else {
        dateKey = format(date, "d MMMM yyyy")
      }

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }

      groups[dateKey].push(message)
    })

    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages,
    }))
  }

  return (
    <>
      <Header type="Chat" />
      <main className="w-full mt-12 max-w-4xl mx-auto py-8 px-4 md:px-6">
        <Card className="shadow-sm border-muted">
          <CardHeader className="pb-1">
            <CardTitle className="text-xl font-bold">Chat</CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-[60vh]">
                <Loader type="1" size="lg" />
              </div>
            ) : (
              <>
                <div className="h-[60vh] overflow-y-auto mb-4 p-2">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <p>No messages yet. Be the first to say hello!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {groupMessagesByDate(messages).map((group) => (
                        <div key={group.date} className="mb-6">
                          <div className="text-center mb-4">
                            <div className="inline-block px-3 py-1 bg-muted rounded-full text-xs font-medium">
                              {group.date}
                            </div>
                          </div>
                          <div className="space-y-4">
                            {group.messages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`flex ${isOwnMessage(msg.sender) ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`flex items-end max-w-[80%] ${isOwnMessage(msg.sender) ? "flex-row-reverse" : "flex-row"}`}
                                >
                                  <div className={`flex-shrink-0 ${isOwnMessage(msg.sender) ? "ml-2" : "mr-2"}`}>
                                    <GradientAvatar username={msg.sender} size={32} />
                                  </div>
                                  <div className="flex flex-col">
                                    <div
                                      className={`rounded-lg py-2 px-3 inline-block max-w-[300px] w-full break-words ${
                                        isOwnMessage(msg.sender) 
                                          ? "bg-blue-500 text-white" 
                                          : "bg-gray-200 text-black"
                                      }`}
                                    >
                                      {!isOwnMessage(msg.sender) && (
                                        <p className="text-xs font-medium mb-1 text-gray-700">{msg.sender}</p>
                                      )}
                                      <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                                    </div>
                                    {msg.createdAt && (
                                      <p
                                        className={`text-xs text-gray-500 mt-1 ${isOwnMessage(msg.sender) ? "text-right" : "text-left"}`}
                                      >
                                        {format(new Date(msg.createdAt), "hh:mm a")}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {connectionError && (
                  <div className="bg-destructive/10 text-destructive rounded-md p-3 mb-4 flex items-center justify-between">
                    <p className="text-sm">Connection lost. Please reconnect to continue chatting.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.reload()}
                      disabled={connecting}
                      className="ml-2"
                    >
                      {connecting ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-1" />
                      )}
                      {connecting ? "Connecting..." : "Reconnect"}
                    </Button>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-grow"
                    disabled={connectionError || connecting}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!input.trim() || connectionError || connecting}
                    className="rounded-full"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Send
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}