
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, BookOpen, TrendingUp, MessageSquare, User, Clock, Award } from "lucide-react";
import { MemberNavigation } from "@/components/navigation/MemberNavigation";

const MemberDashboard = () => {
  const [memberData] = useState({
    name: "John Doe",
    role: "Active Member",
    joinDate: "March 2024",
    speechesCompleted: 5,
    rolesPlayed: 12,
    attendanceRate: 85
  });

  const upcomingMeetings = [
    {
      id: 1,
      title: "Weekly Meeting #24",
      date: "June 25, 2024",
      time: "7:00 PM",
      role: "Table Topics Master",
      theme: "Innovation in Communication"
    },
    {
      id: 2,
      title: "Monthly Evaluation",
      date: "June 30, 2024",
      time: "6:30 PM",
      role: "General Evaluator",
      theme: "Constructive Feedback"
    }
  ];

  const recentReflections = [
    {
      id: 1,
      meetingTitle: "Weekly Meeting #23",
      date: "June 18, 2024",
      status: "Completed"
    },
    {
      id: 2,
      meetingTitle: "Weekly Meeting #22",
      date: "June 11, 2024",
      status: "Pending"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MemberNavigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {memberData.name}!
          </h1>
          <p className="text-gray-600">
            Here's your progress and upcoming activities in the club.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Speeches Completed</CardTitle>
              <Award className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{memberData.speechesCompleted}</div>
              <p className="text-xs text-blue-100">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Roles Played</CardTitle>
              <User className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{memberData.rolesPlayed}</div>
              <p className="text-xs text-green-100">
                Diverse experience
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{memberData.attendanceRate}%</div>
              <p className="text-xs text-orange-100">
                Excellent participation
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Meetings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Upcoming Meetings
              </CardTitle>
              <CardDescription>
                Your assigned roles and meeting details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{meeting.title}</h4>
                    <Badge variant="secondary">{meeting.role}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {meeting.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {meeting.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Theme: {meeting.theme}</p>
                  <Button size="sm" variant="outline" className="w-full">
                    View Role Guidelines
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Progress & Learning */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                Learning Progress
              </CardTitle>
              <CardDescription>
                Your development journey in public speaking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Speaking Skills</span>
                  <span className="text-sm text-gray-600">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Leadership Experience</span>
                  <span className="text-sm text-gray-600">60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Evaluation Skills</span>
                  <span className="text-sm text-gray-600">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>

              <div className="pt-4 space-y-2">
                <Button className="w-full" variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Access Learning Materials
                </Button>
                <Button className="w-full" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Detailed Progress
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reflections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                Recent Reflections
              </CardTitle>
              <CardDescription>
                Your meeting feedback and thoughts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReflections.map((reflection) => (
                <div key={reflection.id} className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">{reflection.meetingTitle}</h4>
                    <p className="text-sm text-gray-600">{reflection.date}</p>
                  </div>
                  <Badge variant={reflection.status === 'Completed' ? 'default' : 'secondary'}>
                    {reflection.status}
                  </Badge>
                </div>
              ))}
              <Button className="w-full" variant="outline">
                View All Reflections
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Submit Meeting Reflection
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                View Meeting Schedule
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Access Role Scripts
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <User className="h-4 w-4 mr-2" />
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MemberDashboard;
