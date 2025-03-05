'use client';

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, BookOpen, Calendar, ArrowRight } from 'lucide-react';
import Header from "@/components/ui/header";

const toolsCategories = {
  bunkmanager: {
    id: "bunkmanager",
    title: "Bunk Manager",
    description: "Track and manage your attendance to maintain the required percentage.",
    icon: <Calendar className="h-6 w-6" />,
    color: "bg-blue-50 text-blue-700",
    path: "/tools/bunkmanager"
  },
  gpaCalculator: {
    id: "gpa-calculator",
    title: "GPA Calculator",
    description: "Calculate your Grade Point Average for the current semester.",
    icon: <Calculator className="h-6 w-6" />,
    color: "bg-green-50 text-green-700",
    path: "/tools/gpa-calculator"
  },
  cgpaPredictor: {
    id: "cgpa-predictor",
    title: "CGPA Predictor",
    description: "Predict your Cumulative Grade Point Average based on current and expected grades.",
    icon: <BookOpen className="h-6 w-6" />,
    color: "bg-amber-50 text-amber-700",
    path: "/tools/cgpa-predictor"
  },
};

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredTools = Object.values(toolsCategories).filter(tool => 
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header type="Tools" />
      <div className="w-full mt-14 max-w-5xl mx-auto py-12 px-4 md:px-6 lg:px-8 xl:px-12">
        
        <p className="mx-2 text-muted-foreground  text-sm mb-4 mt-0 mx-auto w-full flex sm:hidden px-3 py-2 rounded">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/tools" className="text-primary hover:text-primary transition-colors">
            Tools
          </Link>
        </p>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Academic Tools</h1>
          <p className="text-muted-foreground">Useful tools to help you manage your academic life.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(toolsCategories).map((tool) => (
            <Link key={tool.id} href={tool.path} className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`w-12 h-12 rounded-full ${tool.color} flex items-center justify-center`}>
                      {tool.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold">{tool.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{tool.description}</p>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center text-sm text-primary mt-2">
                    <span>Open tool</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
