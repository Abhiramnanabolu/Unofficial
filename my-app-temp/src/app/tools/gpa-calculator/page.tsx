"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Trash2, Plus } from "lucide-react"
import Header from "@/components/ui/header"
import Link from "next/link"

interface Course {
  id: string
  name: string
  credits: number
  grade: string
}

const gradePoints: Record<string, number> = {
  "O":10,
  "A+": 9,
  "A": 8,
  "B+": 7,
  "B": 6,
  "C": 5,
  "F": 0,
}

export default function GPACalculatorPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [newCourse, setNewCourse] = useState<Course>({
    id: "",
    name: "",
    credits: 3,
    grade: "A",
  })

  const handleAddCourse = () => {
    if (newCourse.name.trim() === "") return

    setCourses([
      ...courses,
      {
        ...newCourse,
        id: Date.now().toString(),
      },
    ])

    setNewCourse({
      id: "",
      name: "",
      credits: 3,
      grade: "A",
    })
  }

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id))
  }

  const calculateGPA = () => {
    if (courses.length === 0) return 0

    let totalCredits = 0
    let totalGradePoints = 0

    courses.forEach((course) => {
      totalCredits += course.credits
      totalGradePoints += course.credits * gradePoints[course.grade]
    })

    return totalGradePoints / totalCredits | 0
  }

  const gpa = calculateGPA()

  return (
    <>
      <Header type="Tools" />
      <div className="w-full mt-14 max-w-5xl mx-auto py-12 px-4 md:px-6 lg:px-8 xl:px-12">
      <p className="mx-2 text-muted-foreground  text-sm mb-2 mt-0 mx-auto w-full flex sm:hidden px-3 py-2 rounded">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/tools" className=" hover:text-primary transition-colors">
            Tools
          </Link>
          <span className="mx-2">/</span>
          <Link href="/tools/gpa-calculator" className="text-primary hover:text-primary transition-colors">
            GPA-Calculator
          </Link>
        </p>
        
        <div className="flex items-center gap-4 mt-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-700 flex items-center justify-center">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">GPA Calculator</h1>
            <p className="text-muted-foreground">Calculate your Grade Point Average for the current semester.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Add Course</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="course-name">Course Name</Label>
                    <Input
                      id="course-name"
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                      placeholder="e.g. Data Structures"
                    />
                  </div>
                  <div>
                    <Label htmlFor="credits">Credits</Label>
                    <Select
                      value={newCourse.credits.toString()}
                      onValueChange={(value) => setNewCourse({ ...newCourse, credits: Number.parseInt(value) })}
                    >
                      <SelectTrigger id="credits">
                        <SelectValue placeholder="Credits" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="0">0</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="grade">Grade</Label>
                    <Select
                      value={newCourse.grade}
                      onValueChange={(value) => setNewCourse({ ...newCourse, grade: value })}
                    >
                      <SelectTrigger id="grade">
                        <SelectValue placeholder="Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="O">O</SelectItem>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="F">F</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="mt-4" onClick={handleAddCourse}>
                  <Plus className="mr-2 h-4 w-4" /> Add Course
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {courses.length === 0 ? (
                <div className="text-center py-8 border rounded-lg">
                  <p className="text-muted-foreground">No courses added yet. Add a course to calculate GPA.</p>
                </div>
              ) : (
                courses.map((course) => (
                  <Card key={course.id}>
                    <CardContent className="m-0 ">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="font-medium">{course.name}</h3>
                          <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                            <span>
                              {course.credits} credit{course.credits !== 1 ? "s" : ""}
                            </span>
                            <span>Grade: {course.grade}</span>
                            <span>Points: {gradePoints[course.grade]}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCourse(course.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>GPA Result</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-5xl font-bold mb-2">{gpa.toFixed(2)}</div>
                  <p className="text-muted-foreground">
                    {courses.length > 0
                      ? `Based on ${courses.length} course${courses.length !== 1 ? "s" : ""}`
                      : "Add courses to calculate GPA"}
                  </p>
                </div>

                {courses.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <h3 className="font-medium mb-2">Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Courses:</span>
                        <span>{courses.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Credits:</span>
                        <span>{courses.reduce((sum, course) => sum + course.credits, 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Grade Points:</span>
                        <span>
                          {courses.reduce((sum, course) => sum + course.credits * gradePoints[course.grade], 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

