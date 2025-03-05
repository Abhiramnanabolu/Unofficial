"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calculator, RotateCcw, Calendar } from "lucide-react"
import Header from "@/components/ui/header"

export default function BunkManagerPage() {
  const [classesTotal, setClassesTotal] = useState<number | "">("")
  const [classesAttended, setClassesAttended] = useState<number | "">("")
  const [desiredPercentage, setDesiredPercentage] = useState<number | "">(75)
  const [currentPercentage, setCurrentPercentage] = useState<number | null>(null)
  const [classesToAttend, setClassesToAttend] = useState<number | null>(null)
  const [classesToBunk, setClassesToBunk] = useState<number | null>(null)
  const [calculated, setCalculated] = useState(false)

  const calculateAttendance = () => {
    if (classesTotal && classesAttended && desiredPercentage) {
      const total = Number(classesTotal)
      const attended = Number(classesAttended)
      const desired = Number(desiredPercentage)

      // Calculate current percentage
      const current = Math.round((attended / total) * 100)
      setCurrentPercentage(current)

      // Calculate classes needed to reach desired percentage
      let classesToAttend = 0
      if (desired > current) {
        // Solve for x in (attended + x) / (total + x) = desired / 100
        classesToAttend = Math.ceil((desired * total - 100 * attended) / (100 - desired))
      }
      setClassesToAttend(classesToAttend > 0 ? classesToAttend : 0)

      // Calculate how many more classes can be bunked
      let classesToBunk = 0
      if (desired < current) {
        // Solve for x in (attended) / (total + x) = desired / 100
        classesToBunk = Math.floor((100 * attended - desired * total) / desired)
      }
      setClassesToBunk(classesToBunk > 0 ? classesToBunk : 0)

      setCalculated(true)
    }
  }

  const resetForm = () => {
    setClassesTotal("")
    setClassesAttended("")
    setDesiredPercentage(75)
    setCurrentPercentage(null)
    setClassesToAttend(null)
    setClassesToBunk(null)
    setCalculated(false)
  }

  // Calculate the stroke dash offset for the circular progress
  const calculateStrokeDashOffset = (percentage: number) => {
    const circumference = 2 * Math.PI * 45 // radius is 45
    return circumference - (percentage / 100) * circumference
  }

  return (
    <>
      <Header type="Tools" />
      <div className="w-full mt-14 max-w-5xl mx-auto py-10 px-4 md:px-6 lg:px-8 xl:px-12">
        <p className="mx-2 text-muted-foreground  text-sm mb-2 mt-0 mx-auto w-full flex sm:hidden px-3 py-2 rounded">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/tools" className=" hover:text-primary transition-colors">
            Tools
          </Link>
          <span className="mx-2">/</span>
          <Link href="/tools/bunkmanager" className="text-primary hover:text-primary transition-colors">
            Bunk Manager
          </Link>
        </p>
        
        <Card className="shadow-md border-1 overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Bunk Manager</h1>
                <p className="text-muted-foreground">
                  Calculate and manage your attendance to maintain the required percentage.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left column - Input form */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="classesTotal" className="text-base font-medium mb-2 block">
                    Number of Classes Conducted
                  </Label>
                  <Input
                    id="classesTotal"
                    type="number"
                    min="1"
                    value={classesTotal}
                    onChange={(e) => setClassesTotal(e.target.value ? Number(e.target.value) : "")}
                    className="h-12 text-base"
                    placeholder="Enter total number of classes"
                  />
                </div>

                <div>
                  <Label htmlFor="classesAttended" className="text-base font-medium mb-2 block">
                    Number of Classes Attended
                  </Label>
                  <Input
                    id="classesAttended"
                    type="number"
                    min="0"
                    max={classesTotal || undefined}
                    value={classesAttended}
                    onChange={(e) => setClassesAttended(e.target.value ? Number(e.target.value) : "")}
                    className="h-12 text-base"
                    placeholder="Enter classes you've attended"
                  />
                </div>

                <div>
                  <Label htmlFor="desiredPercentage" className="text-base font-medium mb-2 block">
                    Desired Percentage %
                  </Label>
                  <Input
                    id="desiredPercentage"
                    type="number"
                    min="1"
                    max="100"
                    value={desiredPercentage}
                    onChange={(e) => setDesiredPercentage(e.target.value ? Number(e.target.value) : "")}
                    className="h-12 text-base"
                    placeholder="Enter desired attendance percentage"
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <Button
                    onClick={calculateAttendance}
                    className="h-12 px-6 text-base"
                    disabled={!classesTotal || !classesAttended || !desiredPercentage}
                  >
                    <Calculator className="mr-2 h-5 w-5" />
                    Compute
                  </Button>

                  {calculated && (
                    <Button onClick={resetForm} variant="outline" className="h-12 px-6 text-base">
                      <RotateCcw className="mr-2 h-5 w-5" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              {/* Right column - Results */}
              <div className={`${calculated ? "block" : "hidden lg:flex lg:items-center lg:justify-center"}`}>
                {calculated && currentPercentage !== null ? (
                  <div className="space-y-8 w-full">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="relative w-48 h-48 mx-auto md:mx-0">
                        {/* Circular progress indicator */}
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          {/* Background circle */}
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                          {/* Progress circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={currentPercentage >= Number(desiredPercentage) ? "#3b82f6" : "#ef4444"}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 45}
                            strokeDashoffset={calculateStrokeDashOffset(currentPercentage)}
                            transform="rotate(-90 50 50)"
                          />
                          {/* Target indicator */}
                          <circle
                            cx={50 + 45 * Math.cos(2 * Math.PI * (Number(desiredPercentage) / 100) - Math.PI / 2)}
                            cy={50 + 45 * Math.sin(2 * Math.PI * (Number(desiredPercentage) / 100) - Math.PI / 2)}
                            r="4"
                            fill="#6366f1"
                          />
                          <line
                            x1="50"
                            y1="50"
                            x2={50 + 45 * Math.cos(2 * Math.PI * (Number(desiredPercentage) / 100) - Math.PI / 2)}
                            y2={50 + 45 * Math.sin(2 * Math.PI * (Number(desiredPercentage) / 100) - Math.PI / 2)}
                            stroke="#6366f1"
                            strokeWidth="2"
                            strokeDasharray="2 2"
                          />
                        </svg>
                        {/* Percentage text in the middle */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-bold">{currentPercentage}%</span>
                          <span className="text-sm text-muted-foreground">Current</span>
                        </div>
                      </div>

                      <div className="flex-1 space-y-6 w-full text-center md:text-left">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Your Current Attendance:</h3>
                          <p
                            className={`text-3xl font-bold ${
                              currentPercentage >= Number(desiredPercentage) ? "text-blue-500" : "text-red-500"
                            }`}
                          >
                            {currentPercentage}%
                          </p>
                        </div>

                        {classesToAttend !== null && classesToAttend > 0 && (
                          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <p className="text-lg">
                              You need to attend{" "}
                              <span className="text-blue-600 font-bold text-xl">{classesToAttend}</span> more classes
                              for <span className="text-blue-600 font-bold">{desiredPercentage}%</span> attendance.
                            </p>
                          </div>
                        )}

                        {classesToBunk !== null && classesToBunk > 0 && (
                          <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                            <p className="text-lg">
                              You can bunk <span className="text-green-600 font-bold text-xl">{classesToBunk}</span>{" "}
                              more classes while maintaining{" "}
                              <span className="text-green-600 font-bold">{desiredPercentage}%</span> attendance.
                            </p>
                          </div>
                        )}

                        {currentPercentage < Number(desiredPercentage) && classesToAttend === 0 && (
                          <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
                            <p className="text-lg">
                              It's not possible to reach{" "}
                              <span className="text-amber-600 font-bold">{desiredPercentage}%</span> attendance with the
                              remaining classes.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground p-8 border-2 border-dashed border-gray-200 rounded-lg w-full">
                    <p className="text-lg">Enter your attendance details and click Compute to see results</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

