import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, BookOpen, TrendingUp, MessageSquare, User, Clock, Award, Edit } from "lucide-react";
import { MemberNavigation } from "@/components/navigation/MemberNavigation";
import { MeetingRegistrationDialog } from "@/components/MeetingRegistrationDialog";
import { api } from "@/lib/api";

interface Registration {
  id: string;
  roleId?: string;
  attendanceStatus: string;
  speechTitle?: string;
  speechObjectives?: string;
}

interface MeetingWithRegistration {
  id: string;
  title: string;
  date: string;
  time: string;
  theme: string;
  status: string;
  registration: Registration | null;
  role: string | null;
  isRegistered: boolean;
}

interface Reflection {
  id: number;
  meetingTitle: string;
  date: string;
  status: string;
}

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
  attendanceRate?: number;
}

const MemberDashboard = () => {
  const [memberData, setMemberData] = useState<User | null>(null);
  const [upcomingMeetings, setUpcomingMeetings] = useState<MeetingWithRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [registrationDialog, setRegistrationDialog] = useState<{
    isOpen: boolean;
    meeting: MeetingWithRegistration | null;
    isEditing: boolean;
  }>({
    isOpen: false,
    meeting: null,
    isEditing: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [user, meetings, rolesData] = await Promise.all([
          api.getCurrentUser(),
          api.getMeetings(),
          api.getRoles()
        ]);

        setMemberData(user);
        setRoles(rolesData);
        
        // Filter upcoming meetings and limit to 2
        const upcoming = meetings
          .filter(m => m.status === 'upcoming')
          .slice(0, 2);

        // Fetch registration status for each upcoming meeting
        const meetingsWithRegistration = await Promise.all(
          upcoming.map(async (meeting) => {
            try {
              const registration = await api.getMyMeetingRegistration(meeting.id) as Registration;
              const role = registration?.roleId 
                ? rolesData.find(r => r.id === registration.roleId)
                : null;
              
              return {
                ...meeting,
                registration,
                role: role?.name || null,
                isRegistered: !!registration
              };
            } catch (error) {
              return {
                ...meeting,
                registration: null,
                role: null,
                isRegistered: false
              };
            }
          })
        );

        setUpcomingMeetings(meetingsWithRegistration);
        
        // Set some sample reflections since the API method doesn't exist yet
        setReflections([
          { id: 1, meetingTitle: "Sample Meeting", date: "2024-01-15", status: "Completed" }
        ]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshMeetingsData = async () => {
    try {
      const meetings = await api.getMeetings();
      const upcoming = meetings
        .filter((m: any) => m.status === 'upcoming')
        .slice(0, 2);

      const meetingsWithRegistration = await Promise.all(
        upcoming.map(async (meeting: any) => {
          try {
            const registration = await api.getMyMeetingRegistration(meeting.id) as Registration;
            const role = registration?.roleId 
              ? roles.find(r => r.id === registration.roleId)
              : null;
            
            return {
              ...meeting,
              registration,
              role: role?.name || null,
              isRegistered: !!registration
            };
          } catch (error) {
            return {
              ...meeting,
              registration: null,
              role: null,
              isRegistered: false
            };
          }
        })
      );

      setUpcomingMeetings(meetingsWithRegistration);
    } catch (error) {
      console.error('Failed to refresh meetings data:', error);
    }
  };

  const handleOpenRegistrationDialog = (meeting: MeetingWithRegistration, isEditing: boolean = false) => {
    setRegistrationDialog({
      isOpen: true,
      meeting,
      isEditing,
    });
  };

  const handleCloseRegistrationDialog = () => {
    setRegistrationDialog({
      isOpen: false,
      meeting: null,
      isEditing: false,
    });
  };

  const handleRegistrationSuccess = () => {
    refreshMeetingsData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MemberNavigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading dashboard...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MemberNavigation />

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">Speeches Completed</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white cursor-pointer hover:from-green-600 hover:to-green-700 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">Roles Played</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white cursor-pointer hover:from-orange-600 hover:to-orange-700 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">Attendance Rate</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{memberData?.attendanceRate || 0}%</p>
              </div>
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
                    {meeting.isRegistered && meeting.role ? (
                      <Badge variant="default">{meeting.role}</Badge>
                    ) : (
                      <Badge variant="secondary">Not Registered</Badge>
                    )}
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
                  
                  {meeting.isRegistered ? (
                    <div className="space-y-2">
                      {meeting.role && meeting.role !== "Guest" && meeting.role !== "No Role" ? (
                        <Button size="sm" variant="outline" className="w-full">
                          <BookOpen className="h-4 w-4 mr-2" />
                          View Role Guidelines
                        </Button>
                      ) : (
                        <div className="text-sm text-gray-600 text-center py-2">
                          {meeting.role === "Guest" ? "Registered as Guest" : "No specific role assigned"}
                        </div>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleOpenRegistrationDialog(meeting, true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Change Role
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleOpenRegistrationDialog(meeting, false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Register for Meeting
                    </Button>
                  )}
                </div>
              ))}
              
              {upcomingMeetings.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No upcoming meetings scheduled</p>
                </div>
              )}
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
              {reflections?.slice(0, 3).map((reflection) => (
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

      {/* Meeting Registration Dialog */}
      <MeetingRegistrationDialog
        isOpen={registrationDialog.isOpen}
        onClose={handleCloseRegistrationDialog}
        meeting={registrationDialog.meeting}
        roles={roles}
        onRegistrationSuccess={handleRegistrationSuccess}
        isEditing={registrationDialog.isEditing}
        currentRegistration={registrationDialog.meeting?.registration ? {
          roleId: registrationDialog.meeting.registration.roleId,
          speechTitle: undefined, // We'll need to add these fields to the registration interface
          speechObjectives: undefined
        } : undefined}
      />
    </div>
  );
};

export default MemberDashboard;