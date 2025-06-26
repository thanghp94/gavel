import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  Calendar, 
  Settings, 
  TrendingUp, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Clock,
  BookOpen,
  Globe,
  Eye,
  Plus
} from "lucide-react";
import { ExcoNavigation } from "@/components/navigation/ExcoNavigation";
import { MeetingDetailsDialog } from "@/components/MeetingDetailsDialog";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const ExcoDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalMembers: 0,
    activeMeetings: 0,
    pendingTasks: 0,
    completedReflections: 0
  });

  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    theme: "",
    description: ""
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch essential data first
        const [meetingsData, usersData] = await Promise.all([
          api.getMeetings(),
          api.getUsers()
        ]);

        // Sort meetings by date and limit to 5 most recent
        const sortedMeetings = meetingsData
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
        setMeetings(sortedMeetings);

        // Calculate active meetings (upcoming meetings)
        const today = new Date();
        const activeMeetings = meetingsData.filter(meeting => {
          const meetingDate = new Date(meeting.date);
          return meetingDate >= today && meeting.status === 'upcoming';
        }).length;

        // Fetch optional data with individual error handling
        let tasksData = [];
        let reflectionsData = [];

        try {
          tasksData = await api.getTasks();
        } catch (error) {
          console.warn('Failed to fetch tasks:', error);
        }

        try {
          reflectionsData = await api.getReflections();
        } catch (error) {
          console.warn('Failed to fetch reflections:', error);
        }

        // Calculate pending tasks
        const pendingTasks = tasksData.filter(task => 
          task.status === 'pending' || task.status === 'in_progress'
        ).length;

        // Update dashboard stats
        setDashboardStats({
          totalMembers: usersData.length,
          activeMeetings: activeMeetings,
          pendingTasks: pendingTasks,
          completedReflections: reflectionsData.length
        });

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleViewMeeting = (meeting: any) => {
    console.log('View meeting:', meeting.id);
    setSelectedMeeting(meeting);
    setSelectedMeetingId(meeting.id);
    setIsDetailsDialogOpen(true);
  };

  const handleAddMeeting = async () => {
    try {
      const meeting = await api.createMeeting(newMeeting);
      // Add to the beginning of meetings array and limit to 5
      const updatedMeetings = [meeting, ...meetings]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      setMeetings(updatedMeetings);
      setNewMeeting({
        title: "",
        date: "",
        time: "",
        location: "",
        theme: "",
        description: ""
      });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Meeting created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create meeting",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const recentActivities = [
    {
      id: 1,
      type: "meeting",
      title: "Weekly Meeting #24 scheduled",
      description: "Meeting scheduled for June 25, 2024",
      time: "2 hours ago",
      status: "success"
    },
    {
      id: 2,
      type: "user",
      title: "New member registration",
      description: "Sarah Johnson joined the club",
      time: "4 hours ago",
      status: "info"
    },
    {
      id: 3,
      type: "reflection",
      title: "Meeting reflection submitted",
      description: "5 members submitted reflections for Meeting #23",
      time: "1 day ago",
      status: "success"
    }
  ];

  const pendingTasks = [
    {
      id: 1,
      title: "Update club website content",
      assignee: "Mike Chen",
      dueDate: "June 28, 2024",
      priority: "high"
    },
    {
      id: 2,
      title: "Prepare evaluation forms",
      assignee: "Lisa Park",
      dueDate: "June 30, 2024",
      priority: "medium"
    },
    {
      id: 3,
      title: "Review member feedback",
      assignee: "John Smith",
      dueDate: "July 2, 2024",
      priority: "low"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'info': return <AlertCircle className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ExcoNavigation />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ExCo Dashboard
          </h1>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">Total Members</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{dashboardStats.totalMembers}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white cursor-pointer hover:from-green-600 hover:to-green-700 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">Active Meetings</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{dashboardStats.activeMeetings}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white cursor-pointer hover:from-orange-600 hover:to-orange-700 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">Pending Tasks</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{dashboardStats.pendingTasks}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white cursor-pointer hover:from-purple-600 hover:to-purple-700 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">Reflections</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{dashboardStats.completedReflections}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Meetings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Recent Meetings
                  </CardTitle>
                  <CardDescription>
                    Click on any meeting to view details
                  </CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Meeting
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Meeting</DialogTitle>
                      <DialogDescription>
                        Add a new meeting to the schedule
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Meeting Title</Label>
                          <Input
                            id="title"
                            value={newMeeting.title}
                            onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                            placeholder="Weekly Meeting #25"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="theme">Theme</Label>
                          <Input
                            id="theme"
                            value={newMeeting.theme}
                            onChange={(e) => setNewMeeting({...newMeeting, theme: e.target.value})}
                            placeholder="Leadership Excellence"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={newMeeting.date}
                            onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time">Time</Label>
                          <Input
                            id="time"
                            type="time"
                            value={newMeeting.time}
                            onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={newMeeting.location}
                            onChange={(e) => setNewMeeting({...newMeeting, location: e.target.value})}
                            placeholder="Conference Room A"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newMeeting.description}
                          onChange={(e) => setNewMeeting({...newMeeting, description: e.target.value})}
                          placeholder="Meeting description and agenda notes..."
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddMeeting}>
                        Create Meeting
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="text-center text-gray-500">Loading meetings...</div>
              ) : meetings.length === 0 ? (
                <div className="text-center text-gray-500">No meetings found</div>
              ) : (
                meetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    onClick={() => handleViewMeeting(meeting)}
                    className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors border"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 text-sm truncate">{meeting.title}</h4>
                          <Badge className={getStatusColor(meeting.status)} variant="secondary" size="sm">
                            {meeting.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span>{meeting.theme}</span>
                          <span>•</span>
                          <span>
                            {new Date(meeting.date).toLocaleDateString('en-GB')}
                          </span>
                        </div>
                      </div>
                      <Eye className="h-4 w-4 text-gray-400 ml-2" />
                    </div>
                  </div>
                ))
              )}
              <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                <Calendar className="h-4 w-4 mr-2" />
                View All Meetings
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Recent Activities
              </CardTitle>
              <CardDescription>
                Latest club activities and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  {getStatusIcon(activity.status)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm">{activity.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                    <span className="text-xs text-gray-500 mt-2 block">{activity.time}</span>
                  </div>
                </div>
              ))}
              <Button className="w-full" variant="outline" size="sm">
                View All Activities
              </Button>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                Pending Tasks
              </CardTitle>
              <CardDescription>
                Tasks assigned to ExCo members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <Badge className={getPriorityColor(task.priority)} variant="secondary">
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Assigned to: {task.assignee}</span>
                        <span>Due: {task.dueDate}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <Button className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Create New Task
                </Button>
                <Button variant="outline" className="flex-1">
                  View All Tasks
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Meeting Details Dialog */}
      {selectedMeeting && (
        <MeetingDetailsDialog
          meeting={selectedMeeting}
          meetingId={selectedMeetingId}
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false);
            setSelectedMeeting(null);
            setSelectedMeetingId(null);
          }}
        />
      )}
    </div>
  );
};

export default ExcoDashboard;