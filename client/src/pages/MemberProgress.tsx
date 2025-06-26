
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Award, Target, Calendar, CheckCircle, Star } from "lucide-react";
import { MemberNavigation } from "@/components/navigation/MemberNavigation";

const MemberProgress = () => {
  const [achievements] = useState([
    {
      id: 1,
      title: "First Speech",
      description: "Completed your ice breaker speech",
      date: "March 15, 2024",
      category: "Speaking"
    },
    {
      id: 2,
      title: "Evaluation Expert",
      description: "Provided 5 speech evaluations",
      date: "May 20, 2024",
      category: "Evaluation"
    },
    {
      id: 3,
      title: "Perfect Attendance",
      description: "Attended 10 consecutive meetings",
      date: "June 10, 2024",
      category: "Participation"
    }
  ]);

  const [goals] = useState([
    {
      id: 1,
      title: "Complete CC Manual",
      target: 10,
      current: 8,
      deadline: "July 30, 2024",
      status: "on-track"
    },
    {
      id: 2,
      title: "Leadership Roles",
      target: 5,
      current: 3,
      deadline: "August 15, 2024",
      status: "on-track"
    },
    {
      id: 3,
      title: "Table Topics Participation",
      target: 12,
      current: 7,
      deadline: "September 1, 2024",
      status: "behind"
    }
  ]);

  const [statistics] = useState({
    totalSpeeches: 8,
    totalEvaluations: 12,
    attendanceRate: 85,
    rolesPlayed: 15,
    averageRating: 4.2
  });

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800';
      case 'behind': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MemberNavigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h1>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">Speeches</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{statistics.totalSpeeches}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white cursor-pointer hover:from-green-600 hover:to-green-700 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">Evaluations</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{statistics.totalEvaluations}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white cursor-pointer hover:from-orange-600 hover:to-orange-700 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">Attendance</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{statistics.attendanceRate}%</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white cursor-pointer hover:from-purple-600 hover:to-purple-700 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">Roles Played</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{statistics.rolesPlayed}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white cursor-pointer hover:from-yellow-600 hover:to-yellow-700 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">Avg Rating</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{statistics.averageRating}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Goals */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-600" />
              Current Goals
            </h2>
            <div className="space-y-4">
              {goals.map((goal) => (
                <Card key={goal.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <Badge className={getGoalStatusColor(goal.status)}>
                        {goal.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Progress</span>
                          <span className="text-sm text-gray-600">{goal.current}/{goal.target}</span>
                        </div>
                        <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Target: {goal.deadline}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="h-6 w-6 text-yellow-600" />
              Recent Achievements
            </h2>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <Badge variant="outline" className="mt-1">{achievement.category}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">{achievement.date}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemberProgress;
