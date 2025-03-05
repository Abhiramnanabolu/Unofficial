"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, LogOut } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [username, setUsername] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("http://localhost:3114/admin/check", {
          credentials: "include",
        })
        const data = await res.json()
        if (data.loggedIn) {
          setIsAdmin(true)
          // Load username from localStorage or set a default
          const storedUsername = localStorage.getItem("adminUsername") || "Admin"
          setUsername(storedUsername)
        } else {
          router.push("/admin/")
        }
      } catch (error) {
        console.error("Error checking admin status:", error)
        router.push("/admin/")
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [router])

  const handleChangeUsername = () => {
    if (newUsername.trim()) {
      setUsername(newUsername.trim())
      localStorage.setItem("username", newUsername.trim())
      setNewUsername("")
    }
  }

  const handleLogout = async () => {
    await fetch("http://localhost:3114/admin/logout", { credentials: "include" })
    router.push("/admin/")
  }
  console.log(isAdmin)
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Admin Panel</span>
        </div>
        <button
          className={`w-full text-left py-2 px-4 rounded ${activeTab === "dashboard" ? "bg-primary text-white" : "hover:bg-gray-200"}`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`w-full text-left py-2 px-4 rounded ${activeTab === "changeUsername" ? "bg-primary text-white" : "hover:bg-gray-200"}`}
          onClick={() => setActiveTab("changeUsername")}
        >
          Change Username
        </button>
        <button
          className={`w-full text-left py-2 px-4 rounded ${activeTab === "settings" ? "bg-primary text-white" : "hover:bg-gray-200"}`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
        <Button className="w-full mt-auto" variant="destructive" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 mt-4">
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold">Welcome, {username}!</h1>
            <p className="mt-2 text-gray-600">You have successfully logged in.</p>
          </div>
        )}

        {activeTab === "changeUsername" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Change Username</h2>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="New username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="max-w-xs"
              />
              <Button onClick={handleChangeUsername}>Change</Button>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p>Settings options will be added here in the future.</p>
          </div>
        )}
      </div>
    </div>
  )
}

