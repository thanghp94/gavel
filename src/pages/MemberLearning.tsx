
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, CheckCircle, Clock, Award, Download } from "lucide-react";
import { MemberNavigation } from "@/components/navigation/MemberNavigation";

const MemberLearning = () => {
  const [learningPaths] = useState([
    {
      id: 1,
      title: "Competent Communication",
      description: "Master the fundamentals of effective speaking",
      progress: 75,
      completed: 8,
      total: 10,
      status: "in-progress"
    },
    {
      id: 2,
      title: "Competent Leadership",
      description: "Develop essential leadership skills",
      progress: 30,
      completed: 3,
      total: 10,
      status: "in-progress"
    },
    {
      id: 3,
      title: "Advanced Communication",
      description: "Refine your speaking abilities",
      progress: 0,
      completed: 0,
      total: 12,
      status: "not-started"
    }
  ]);

  const [resources] = useState([
    {
      id: 1,
      title: "Table Topics Techniques",
      type: "Video",
      duration: "15 min",
      category: "Speaking Skills"
    },
    {
      id: 2,
      title: "Evaluation Best Practices",
      type: "PDF Guide",
      duration: "10 min read",
      category: "Evaluation"
    },
    {
      id: 3,
      title: "Leadership Fundamentals",
      type: "Interactive Course",
      duration: "45 min",
      category: "Leadership"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'not-started': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MemberNavigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Center</h1>
          <p className="text-gray-600">Track your progress and access learning resources</p>
        </div>

        {/* Learning Paths */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Learning Paths</h2>
          <div className="grid gap-6">
            {learningPaths.map((path) => (
              <Card key={path.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{path.title}</CardTitle>
                      <CardDescription className="text-base mt-2">{path.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(path.status)}>
                      {path.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-600">{path.completed}/{path.total} completed</span>
                      </div>
                      <Progress value={path.progress} className="h-2" />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Play className="h-4 w-4 mr-2" />
                        Continue Learning
                      </Button>
                      <Button variant="outline">
                        <BookOpen className="h-4 w-4 mr-2" />
                        View Curriculum
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Learning Resources */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Learning Resources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="outline">{resource.type}</Badge>
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                    <span>{resource.duration}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-4">{resource.category}</p>
                  <Button className="w-full" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Access Resource
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemberLearning;
