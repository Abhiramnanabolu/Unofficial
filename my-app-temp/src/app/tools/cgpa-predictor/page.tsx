"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, Trash2, Plus, Calculator } from "lucide-react"
import Header from "@/components/ui/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Semester {
  id: string
  name: string
  credits: number
  gpa: number
  isCompleted: boolean
}

export default function CGPAPredictorPage() {
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [newSemester, setNewSemester] = useState<Semester>({
    id: "",
    name: "Semester 1",
    credits: 20,
    gpa: 8.0,
    isCompleted: true,
  })
  const [currentCGPA, setCurrentCGPA] = useState<number | "">("")
  const [totalCredits, setTotalCredits] = useState<number | "">("")

  const [desiredCGPA, setDesiredCGPA] = useState<number | "">("")
  const [remainingSemesters, setRemainingSemesters] = useState<number | "">("")
  const [creditsPerSemester, setCreditsPerSemester] = useState<number | "">("")
  const [requiredGPA, setRequiredGPA] = useState<number | null>(null)
  const [showRequiredGPA, setShowRequiredGPA] = useState(false)

  const handleAddSemester = () => {
    if (newSemester.name.trim() === "") return

    setSemesters([
      ...semesters,
      {
        ...newSemester,
        id: Date.now().toString(),
      },
    ])

    setNewSemester({
      id: "",
      name: `Semester ${semesters.length + 2}`,
      credits: 20,
      gpa: 8.0,
      isCompleted: false,
    })
  }

  const handleDeleteSemester = (id: string) => {
    setSemesters(semesters.filter((semester) => semester.id !== id))
  }

  const calculatePredictedCGPA = () => {
    if (semesters.length === 0) {
      return typeof currentCGPA === "number" ? currentCGPA : 0
    }

    let totalCreditsValue = typeof totalCredits === "number" ? totalCredits : 0
    let totalGradePoints = totalCreditsValue * (typeof currentCGPA === "number" ? currentCGPA : 0)

    semesters.forEach((semester) => {
      totalCreditsValue += semester.credits
      totalGradePoints += semester.credits * semester.gpa
    })

    return totalGradePoints / totalCreditsValue
  }

  const predictedCGPA = calculatePredictedCGPA()

  const calculateRequiredGPA = () => {
    if (
      typeof currentCGPA === "number" &&
      typeof totalCredits === "number" &&
      typeof desiredCGPA === "number" &&
      typeof remainingSemesters === "number" &&
      typeof creditsPerSemester === "number"
    ) {
      const totalRemainingCredits = remainingSemesters * creditsPerSemester
      const totalFinalCredits = totalCredits + totalRemainingCredits

      // Calculate required GPA for remaining semesters
      // Formula: (Desired CGPA * Total Final Credits - Current CGPA * Current Credits) / Remaining Credits
      const required = (desiredCGPA * totalFinalCredits - currentCGPA * totalCredits) / totalRemainingCredits

      setRequiredGPA(required)
      setShowRequiredGPA(true)
    }
  }

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
          <Link href="/tools/cgpa-predictor" className="text-primary hover:text-primary transition-colors">
            CGPA-Predictor
          </Link>
        </p>

        <div className="flex items-center gap-4 mt-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">CGPA Predictor</h1>
            <p className="text-muted-foreground">
              Predict your Cumulative Grade Point Average based on current and expected grades.
            </p>
          </div>
        </div>

        <Tabs defaultValue="predict">
          <TabsList className="mb-6">
            <TabsTrigger value="predict">Predict CGPA</TabsTrigger>
            <TabsTrigger value="current">Current CGPA</TabsTrigger>
          </TabsList>

          <TabsContent value="predict">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Current Academic Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="current-cgpa">Current CGPA</Label>
                        <Input
                          id="current-cgpa"
                          type="number"
                          value={currentCGPA === "" ? "" : currentCGPA}
                          onChange={(e) => {
                            const value = e.target.value === "" ? "" : Number.parseFloat(e.target.value)
                            setCurrentCGPA(value)
                          }}
                          placeholder="e.g. 8.5"
                          step="0.01"
                          min="0"
                          max="10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="total-credits">Total Credits Completed</Label>
                        <Input
                          id="total-credits"
                          type="number"
                          value={totalCredits === "" ? "" : totalCredits}
                          onChange={(e) => {
                            const value = e.target.value === "" ? "" : Number.parseInt(e.target.value)
                            setTotalCredits(value)
                          }}
                          placeholder="e.g. 80"
                          min="0"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Target CGPA Calculator</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="desired-cgpa">Desired CGPA</Label>
                        <Input
                          id="desired-cgpa"
                          type="number"
                          value={desiredCGPA === "" ? "" : desiredCGPA}
                          onChange={(e) => {
                            const value = e.target.value === "" ? "" : Number.parseFloat(e.target.value)
                            setDesiredCGPA(value)
                          }}
                          placeholder="e.g. 9.0"
                          step="0.01"
                          min="0"
                          max="10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="remaining-semesters">Remaining Semesters</Label>
                        <Input
                          id="remaining-semesters"
                          type="number"
                          value={remainingSemesters === "" ? "" : remainingSemesters}
                          onChange={(e) => {
                            const value = e.target.value === "" ? "" : Number.parseInt(e.target.value)
                            setRemainingSemesters(value)
                          }}
                          placeholder="e.g. 4"
                          min="1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="credits-per-semester">Credits per Semester</Label>
                        <Input
                          id="credits-per-semester"
                          type="number"
                          value={creditsPerSemester === "" ? "" : creditsPerSemester}
                          onChange={(e) => {
                            const value = e.target.value === "" ? "" : Number.parseInt(e.target.value)
                            setCreditsPerSemester(value)
                          }}
                          placeholder="e.g. 20"
                          min="1"
                        />
                      </div>
                    </div>
                    <Button
                      className="mt-4"
                      onClick={calculateRequiredGPA}
                      disabled={
                        typeof currentCGPA !== "number" ||
                        typeof totalCredits !== "number" ||
                        typeof desiredCGPA !== "number" ||
                        typeof remainingSemesters !== "number" ||
                        typeof creditsPerSemester !== "number"
                      }
                    >
                      <Calculator className="mr-2 h-4 w-4" /> Calculate Required GPA
                    </Button>

                    {showRequiredGPA && requiredGPA !== null && (
                      <div
                        className={`mt-4 p-4 rounded-lg ${requiredGPA <= 10 ? "bg-green-50 border border-green-100" : "bg-amber-50 border border-amber-100"}`}
                      >
                        <h3 className="font-medium mb-2">Required GPA for Remaining Semesters:</h3>
                        <p className="text-xl font-bold">
                          {requiredGPA <= 10 ? (
                            <span className="text-green-600">{requiredGPA.toFixed(2)}</span>
                          ) : (
                            <span className="text-amber-600">Not achievable with current parameters</span>
                          )}
                        </p>
                        {requiredGPA > 10 && (
                          <p className="text-sm mt-2 text-amber-600">
                            The required GPA exceeds 10.0. Consider increasing the number of semesters or adjusting your
                            target CGPA.
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Add Semester</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="semester-name">Semester Name</Label>
                        <Input
                          id="semester-name"
                          value={newSemester.name}
                          onChange={(e) => setNewSemester({ ...newSemester, name: e.target.value })}
                          placeholder="e.g. Semester 3"
                        />
                      </div>
                      <div>
                        <Label htmlFor="semester-credits">Credits</Label>
                        <Input
                          id="semester-credits"
                          type="number"
                          value={newSemester.credits}
                          onChange={(e) =>
                            setNewSemester({ ...newSemester, credits: Number.parseInt(e.target.value) || 0 })
                          }
                          placeholder="e.g. 20"
                          min="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="semester-gpa">Expected GPA</Label>
                        <Input
                          id="semester-gpa"
                          type="number"
                          value={newSemester.gpa}
                          onChange={(e) =>
                            setNewSemester({ ...newSemester, gpa: Number.parseFloat(e.target.value) || 0 })
                          }
                          placeholder="e.g. 8.5"
                          step="0.01"
                          min="0"
                          max="10"
                        />
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        id="is-completed"
                        checked={newSemester.isCompleted}
                        onChange={(e) => setNewSemester({ ...newSemester, isCompleted: e.target.checked })}
                        className="mr-2"
                      />
                      <Label htmlFor="is-completed">Semester already completed</Label>
                    </div>
                    <Button className="mt-4" onClick={handleAddSemester}>
                      <Plus className="mr-2 h-4 w-4" /> Add Semester
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {semesters.length === 0 ? (
                    <div className="text-center py-8 border rounded-lg">
                      <p className="text-muted-foreground">No semesters added yet. Add a semester to predict CGPA.</p>
                    </div>
                  ) : (
                    semesters.map((semester) => (
                      <Card key={semester.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <h3 className="font-medium">{semester.name}</h3>
                              <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                                <span>{semester.credits} credits</span>
                                <span>GPA: {semester.gpa.toFixed(2)}</span>
                                <span>{semester.isCompleted ? "Completed" : "Planned"}</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteSemester(semester.id)}>
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
                    <CardTitle>Predicted CGPA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-5xl font-bold mb-2">{predictedCGPA.toFixed(2)}</div>
                      <p className="text-muted-foreground">
                        {semesters.length > 0
                          ? `Based on ${semesters.length} additional semester${semesters.length !== 1 ? "s" : ""}`
                          : "Add semesters to predict CGPA"}
                      </p>
                    </div>

                    {semesters.length > 0 && (
                      <div className="mt-6 border-t pt-4">
                        <h3 className="font-medium mb-2">Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Current Credits:</span>
                            <span>{typeof totalCredits === "number" ? totalCredits : 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Additional Credits:</span>
                            <span>{semesters.reduce((sum, sem) => sum + sem.credits, 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Credits:</span>
                            <span>
                              {(typeof totalCredits === "number" ? totalCredits : 0) +
                                semesters.reduce((sum, sem) => sum + sem.credits, 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {showRequiredGPA && requiredGPA !== null && requiredGPA <= 10 && (
                      <div className="mt-6 border-t pt-4">
                        <h3 className="font-medium mb-2">Target CGPA Plan</h3>
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                          <p className="text-sm">
                            To achieve a CGPA of <span className="font-bold">{desiredCGPA}</span>, you need to maintain
                            a GPA of <span className="font-bold text-blue-600">{requiredGPA.toFixed(2)}</span> for the
                            next <span className="font-bold">{remainingSemesters}</span> semesters.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="current">
            <Card>
              <CardHeader>
                <CardTitle>Calculate Current CGPA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Add all your completed semesters to calculate your current CGPA.</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Make sure to mark all semesters as "completed" and then switch back to the "Predict CGPA" tab to see
                  your current CGPA.
                </p>
                <Button
                  onClick={() => {
                    setNewSemester({
                      ...newSemester,
                      isCompleted: true,
                    })
                  }}
                >
                  Add Completed Semester
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

