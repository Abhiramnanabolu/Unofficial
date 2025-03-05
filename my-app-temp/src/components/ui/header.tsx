'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import GradientAvatar from "./gradientAvatar"

interface HeaderProps {
  type: string
}

export function Header({ type }: HeaderProps) {
  
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("username") : null
  );
  

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = localStorage.getItem("username");
  
        if (storedUsername) {
          setUsername(storedUsername); 
          return;
        }
  
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/getusername`, {
          credentials: "include",
        });
  
        const data = await res.json();
  
        if (data.username) {
          localStorage.setItem("username", data.username);
          setUsername(data.username);
        }
      } catch (err) {
        console.error("Error fetching username:", err);
      }
    };
  
    if (typeof window !== "undefined") {
      fetchUsername();
    }
  }, []);
  

  if (type === "Home") {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="border shadow-sm ">
          <div className="container flex h-16 items-center px-6 justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold">MGIT<span className="text-black/65 text-lg">Unofficial</span></span>
              </Link>
              <nav className="hidden md:flex gap-6 text-gray-500">
                <Link href="/discussions" className="text-sm font-medium transition-colors hover:text-primary">
                  Discussions
                </Link>
                <Link href="/chat" className="text-sm font-medium transition-colors hover:text-primary">
                  Chat
                </Link>
                <Link href="/tools" className="text-sm font-medium transition-colors hover:text-primary">
                  Tools
                </Link>
              </nav>
            </div>
            <div className="flex gap-4 items-center">
              <p className="text-sm font-medium text-black/70">{username}</p>
              <GradientAvatar username={username || ""} size={32} />
            </div>
          </div>
        </div>
      </header>
    )
  }
  else if (type === "Chat") {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="border shadow-sm ">
          <div className="container flex h-16 items-center px-6 justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold">MGIT<span className="text-black/65 text-lg">Unofficial</span></span>
              </Link>
              <nav className="hidden md:flex gap-6 text-gray-500">
                <Link href="/discussions" className="text-sm font-medium transition-colors hover:text-primary">
                  Discussions
                </Link>
                <Link href="/chat" className="text-sm font-medium transition-colors hover:text-primary">
                  Chat
                </Link>
                <Link href="/tools" className="text-sm font-medium transition-colors hover:text-primary">
                  Tools
                </Link>
              </nav>
            </div>
            <div className="flex gap-4 items-center">
              <p className="text-sm font-medium text-black/70">{username}</p>
              <GradientAvatar username={username || ""} size={32} />
            </div>
          </div>
        </div>
      </header>
    )}
  else if (type === "Discussions") {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="border shadow-sm ">
          <div className="container flex h-16 items-center px-6 justify-between">
            <div className="flex items-center gap-16">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold">MGIT<span className="text-black/65 text-lg">Unofficial</span></span>
              </Link>
              <nav className="hidden md:flex gap-6 text-gray-500">
                <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                  Home
                </Link>
                <Link href="/discussions/academic" className="text-sm font-medium transition-colors hover:text-primary">
                  Academic
                </Link>
                <Link href="/discussions/general" className="text-sm font-medium transition-colors hover:text-primary">
                  General
                </Link>
                <Link href="/discussions/help" className="text-sm font-medium transition-colors hover:text-primary">
                  Help
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex gap-4 items-center">
                <p className="text-sm font-medium text-black/70">{username}</p>
                <GradientAvatar username={username || ""} size={32} />
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }
  else if (type === "Tools") {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="border shadow-sm ">
        <div className="container flex h-16 items-center px-6 justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold">MGIT<span className="text-black/65 text-lg">Unofficial</span></span>
            </Link>
            <nav className="hidden md:flex gap-6 text-gray-500">
              <Link href="/discussions" className="text-sm font-medium transition-colors hover:text-primary">
                Discussions
              </Link>
              <Link href="/chat" className="text-sm font-medium transition-colors hover:text-primary">
                Chat
              </Link>
              <Link href="/tools" className="text-sm font-medium transition-colors hover:text-primary"> 
                Tools
              </Link>
            </nav>
          </div>
          <div className="flex gap-4 items-center">
            <p className="text-sm font-medium text-black/70">{username}</p>
            <GradientAvatar username={username || ""} size={32} />
          </div>
        </div>
      </div>
    </header>
    )
  }
  else {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="border shadow-sm ">
        <div className="container flex h-16 items-center px-6 justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold">MGIT<span className="text-black/65 text-lg">Unofficial</span></span>
            </Link>
            <nav className="hidden md:flex gap-6 text-gray-500">
              <Link href="/discussions" className="text-sm font-medium transition-colors hover:text-primary">
                Discussions
              </Link>
              <Link href="/chat" className="text-sm font-medium transition-colors hover:text-primary">
                Chat
              </Link>
              <Link href="/tools" className="text-sm font-medium transition-colors hover:text-primary"> 
                Tools
              </Link>
            </nav>
          </div>
          <div className="flex gap-4 items-center">
            <p className="text-sm font-medium text-black/70">{username}</p>
            <GradientAvatar username={username || ""} size={32} />
          </div>
        </div>
      </div>
    </header>
    )
  }
}

export default Header