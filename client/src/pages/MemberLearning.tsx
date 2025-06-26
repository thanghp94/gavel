import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Play, CheckCircle, Clock, Award, Download, Video, FileText, Users } from "lucide-react";
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
      status: "in-progress",
      nextProject: "Speech #9: Persuasive Speaking"
    },
    {
      id: 2,
      title: "Competent Leadership",
      description: "Develop essential leadership skills",
      progress: 30,
      completed: 3,
      total: 10,
      status: "in-progress",
      nextProject: "Project #4: Team Leadership"
    },
    {
      id: 3,
      title: "Advanced Communication",
      description: "Refine your speaking abilities",
      progress: 0,
      completed: 0,
      total: 12,
      status: "not-started",
      nextProject: "Introduction to Advanced Communication"
    }
  ]);

  const [resources] = useState([
    {
      id: 1,
      title: "Table Topics Techniques",
      type: "Video",
      duration: "15 min",
      category: "Speaking Skills",
      thumbnail: "/placeholder.svg",
      completed: false
    },
    {
      id: 2,
      title: "Evaluation Best Practices",
      type: "PDF Guide",
      duration: "10 min read",
      category: "Evaluation",
      thumbnail: "/placeholder.svg",
      completed: true
    },
    {
      id: 3,
      title: "Leadership Fundamentals",
      type: "Interactive Course",
      duration: "45 min",
      category: "Leadership",
      thumbnail: "/placeholder.svg",
      completed: false
    },
    {
      id: 4,
      title: "Advanced Public Speaking",
      type: "Workshop",
      duration: "2 hours",
      category: "Speaking Skills",
      thumbnail: "/placeholder.svg",
      completed: false
    }
  ]);

  const [achievements] = useState([
    {
      id: 1,
      title: "First Speech",
      description: "Completed your first prepared speech",
      earned: true,
      date: "March 15, 2024"
    },
    {
      id: 2,
      title: "Evaluation Expert",
      description: "Completed 5 speech evaluations",
      earned: true,
      date: "April 2, 2024"
    },
    {
      id: 3,
      title: "Leadership Role",
      description: "Served as meeting role 10 times",
      earned: false,
      date: null
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

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'Video': return Video;
      case 'PDF Guide': return FileText;
      case 'Interactive Course': return BookOpen;
      case 'Workshop': return Users;
      default: return FileText;
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

        <Tabs defaultValue="paths" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="progress">My Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="paths" className="space-y-6">
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

                      {path.nextProject && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-sm font-medium text-blue-900">Next Project:</div>
                          <div className="text-sm text-blue-700">{path.nextProject}</div>
                        </div>
                      )}

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
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((resource) => {
                const IconComponent = getResourceIcon(resource.type);
                return (
                  <Card key={resource.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3 mb-2">
                        <IconComponent className="h-8 w-8 text-blue-600" />
                        <div className="flex-1">
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                          {resource.completed && (
                            <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Badge variant="outline">{resource.type}</Badge>
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        <span>{resource.duration}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-4">{resource.category}</p>
                      <Button 
                        className="w-full" 
                        size="sm"
                        variant={resource.completed ? "outline" : "default"}
                      >
                        {resource.completed ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Access Resource
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`hover:shadow-md transition-shadow ${
                  achievement.earned ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gray-50'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <Award className={`h-8 w-8 ${
                        achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                      }`} />
                      <div>
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {achievement.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {achievement.earned ? (
                      <div className="text-sm text-green-700 font-medium">
                        Earned on {achievement.date}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Not yet earned
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Speaking Skills</span>
                      <span className="text-sm text-gray-600">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Leadership</span>
                      <span className="text-sm text-gray-600">60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Evaluation</span>
                      <span className="text-sm text-gray-600">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <div className="text-sm">
                        <div className="font-medium">Completed Speech #8</div>
                        <div className="text-gray-600">June 18, 2024</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      <div className="text-sm">
                        <div className="font-medium">Started Leadership Module</div>
                        <div className="text-gray-600">June 15, 2024</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MemberLearning;