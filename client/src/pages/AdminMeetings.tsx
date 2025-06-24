import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2, Eye, UserPlus } from "lucide-react";
import { ExcoNavigation } from "@/components/navigation/ExcoNavigation";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const AdminMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddAttendeeDialogOpen, setIsAddAttendeeDialogOpen] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState("");
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    theme: "",
    description: ""
  });

  const [isNewUser, setIsNewUser] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: "",
    displayName: "",
    fullName: "",
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meetingsData, usersData, rolesData] = await Promise.all([
          api.getMeetings(),
          api.getUsers(),
          api.getRoles()
        ]);
        setMeetings(meetingsData);
        setUsers(usersData);
        setRoles(rolesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddMeeting = async () => {
    try {
      const meeting = await api.createMeeting(newMeeting);
      setMeetings([...meetings, meeting]);
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

  const handleViewMeeting = (meetingId: string) => {
    // Navigate to meeting details page
    console.log("View meeting:", meetingId);
    toast({
      title: "Info",
      description: "Meeting details view not implemented yet",
    });
  };

  const handleEditMeeting = (meetingId: string) => {
    // Open edit dialog or navigate to edit page
    console.log("Edit meeting:", meetingId);
    toast({
      title: "Info",
      description: "Meeting edit functionality not implemented yet",
    });
  };

  const handleAddAttendee = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setSelectedUserId("");
    setSelectedRoleId("");
    setIsAddAttendeeDialogOpen(true);
    setIsNewUser(false);
    setNewUserData({ email: "", displayName: "", fullName: "" });
  };

  const handleSubmitAttendee = async () => {
    if (isNewUser) {
      if (!newUserData.email || !newUserData.displayName) {
        toast({
          title: "Error",
          description: "Email and Display Name are required for new users",
          variant: "destructive",
        });
        return;
      }

      try {
        // Create the new user as a guest
        const newUser = await api.createUser({
          ...newUserData,
          role: "guest", // Assuming you have a "guest" role
        });

        // Add the new user as an attendee
        await api.addAttendee(selectedMeetingId, newUser.id, selectedRoleId || undefined);

        toast({
          title: "Success",
          description: "New user created and added as attendee successfully",
        });
        setIsAddAttendeeDialogOpen(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create and add attendee",
          variant: "destructive",
        });
      }
    } else {
      if (!selectedUserId) {
        toast({
          title: "Error",
          description: "Please select a user to add",
          variant: "destructive",
        });
        return;
      }

      try {
        await api.addAttendee(selectedMeetingId, selectedUserId, selectedRoleId || undefined);
        toast({
          title: "Success",
          description: "Attendee added successfully",
        });
        setIsAddAttendeeDialogOpen(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add attendee",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRegister = async (meetingId: string, roleId: string, speechTitle?: string, speechObjectives?: string) => {
    try {
      const finalRoleId = roleId === "no-role" ? undefined : roleId;
      await api.registerForMeeting(meetingId, finalRoleId, speechTitle, speechObjectives);
      setShowRegisterDialog(false);
      setSelectedRole("");
      setSpeechTitle("");
      setSpeechObjectives("");
      // Refresh meeting registrations
      loadMeetings();
      toast({
        title: "Success",
        description: "Successfully registered for meeting",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to register for meeting",
        variant: "destructive",
      });
    }
  };

  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [speechTitle, setSpeechTitle] = useState("");
  const [speechObjectives, setSpeechObjectives] = useState("");
  const [meetingRegistrations, setMeetingRegistrations] = useState([]);

  const loadMeetings = async () => {
    try {
      const meetingsData = await api.getMeetings();
      setMeetings(meetingsData);
      const registrationsData = await api.getMeetingRegistrations();
      setMeetingRegistrations(registrationsData);
    } catch (error) {
      console.error('Failed to fetch meetings:', error);
      toast({
        title: "Error",
        description: "Failed to load meetings",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ExcoNavigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meeting Management</h1>
            <p className="text-gray-600">Create and manage club meetings</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
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

        {/* Meetings Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{meetings.length}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {meetings.filter(m => m.status === 'upcoming').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Next 7 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">16</div>
              <p className="text-xs text-muted-foreground">
                Members per meeting
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Meetings Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Meetings</CardTitle>
            <CardDescription>
              Manage your club meetings and their details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Meeting</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Attendees</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{meeting.title}</div>
                        <div className="text-sm text-gray-600">{meeting.theme}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {new Date(meeting.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        {meeting.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        {meeting.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(meeting.status)}>
                        {meeting.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {meeting.attendees}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewMeeting(meeting.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditMeeting(meeting.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleAddAttendee(meeting.id)}
                          title="Add Attendee"
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add Attendee Dialog */}
        <Dialog open={isAddAttendeeDialogOpen} onOpenChange={setIsAddAttendeeDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Attendee</DialogTitle>
              <DialogDescription>
                Select an existing user or create a new guest user
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="new-user-checkbox"
                  checked={isNewUser}
                  onChange={(e) => setIsNewUser(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="new-user-checkbox">Create new guest user</Label>
              </div>

              {isNewUser ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-email">Email *</Label>
                    <Input
                      id="new-email"
                      type="email"
                      value={newUserData.email}
                      onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                      placeholder="user@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-display-name">Display Name *</Label>
                    <Input
                      id="new-display-name"
                      value={newUserData.displayName}
                      onChange={(e) => setNewUserData({...newUserData, displayName: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-full-name">Full Name</Label>
                    <Input
                      id="new-full-name"
                      value={newUserData.fullName}
                      onChange={(e) => setNewUserData({...newUserData, fullName: e.target.value})}
                      placeholder="John Michael Doe"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="user-select">Select User</Label>
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id || "no-user"}>
                          {user.displayName} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="role-select">Select Role (Optional)</Label>
                <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-role">No Role</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id || "no-role"}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddAttendeeDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitAttendee}>
                <UserPlus className="h-4 w-4 mr-2" />
                {isNewUser ? "Create & Add User" : "Add Attendee"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminMeetings;