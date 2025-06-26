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
import { MeetingDetailsDialog } from "@/components/MeetingDetailsDialog";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const AdminMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddAttendeeDialogOpen, setIsAddAttendeeDialogOpen] = useState(false);
  const [isMeetingDetailsOpen, setIsMeetingDetailsOpen] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("none");
  const [selectedRoleId, setSelectedRoleId] = useState("no-role");

  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    theme: "",
    description: ""
  });

  const [editMeeting, setEditMeeting] = useState({
    id: "",
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
    const meeting = meetings.find(m => m.id === meetingId);
    setSelectedMeeting(meeting);
    setSelectedMeetingId(meetingId);
    setIsMeetingDetailsOpen(true);
  };

  const handleEditMeeting = (meetingId: string) => {
    const meeting = meetings.find(m => m.id === meetingId);
    if (meeting) {
      setEditMeeting({
        id: meeting.id,
        title: meeting.title,
        date: meeting.date,
        time: meeting.time,
        location: meeting.location,
        theme: meeting.theme,
        description: meeting.description || ""
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdateMeeting = async () => {
    try {
      const updatedMeeting = await api.updateMeeting(editMeeting.id, {
        title: editMeeting.title,
        date: editMeeting.date,
        time: editMeeting.time,
        location: editMeeting.location,
        theme: editMeeting.theme,
        description: editMeeting.description
      });
      
      setMeetings(meetings.map(m => m.id === editMeeting.id ? updatedMeeting : m));
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Meeting updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update meeting",
        variant: "destructive",
      });
    }
  };

  const handleAddAttendee = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setSelectedUserId("none");
    setSelectedRoleId("no-role");
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
        const finalRoleId = selectedRoleId === "no-role" ? undefined : selectedRoleId;
        await api.addAttendee(selectedMeetingId, newUser.id, finalRoleId);

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
      if (!selectedUserId || selectedUserId === "none") {
        toast({
          title: "Error",
          description: "Please select a user to add",
          variant: "destructive",
        });
        return;
      }

      try {
        const finalRoleId = selectedRoleId === "no-role" ? undefined : selectedRoleId;
        await api.addAttendee(selectedMeetingId, selectedUserId, finalRoleId);
        toast({
          title: "Success",
          description: "Attendee added successfully",
        });
        setIsAddAttendeeDialogOpen(false);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to add attendee",
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
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">Total Meetings</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{meetings.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">Upcoming</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">
                  {meetings.filter(m => m.status === 'upcoming').length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">Average Attendance</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">16</p>
              </div>
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

        {/* Edit Meeting Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Meeting</DialogTitle>
              <DialogDescription>
                Update the meeting details
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Meeting Title</Label>
                  <Input
                    id="edit-title"
                    value={editMeeting.title}
                    onChange={(e) => setEditMeeting({...editMeeting, title: e.target.value})}
                    placeholder="Weekly Meeting #25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-theme">Theme</Label>
                  <Input
                    id="edit-theme"
                    value={editMeeting.theme}
                    onChange={(e) => setEditMeeting({...editMeeting, theme: e.target.value})}
                    placeholder="Leadership Excellence"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editMeeting.date}
                    onChange={(e) => setEditMeeting({...editMeeting, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-time">Time</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={editMeeting.time}
                    onChange={(e) => setEditMeeting({...editMeeting, time: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={editMeeting.location}
                    onChange={(e) => setEditMeeting({...editMeeting, location: e.target.value})}
                    placeholder="Conference Room A"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editMeeting.description}
                  onChange={(e) => setEditMeeting({...editMeeting, description: e.target.value})}
                  placeholder="Meeting description and agenda notes..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateMeeting}>
                Update Meeting
              </Button>
            </div>
          </DialogContent>
        </Dialog>

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
                      <SelectItem value="none">Please select a user</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
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
                      <SelectItem key={role.id} value={role.id}>
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

        {/* Meeting Details Dialog */}
        <MeetingDetailsDialog
          isOpen={isMeetingDetailsOpen}
          onClose={() => setIsMeetingDetailsOpen(false)}
          meetingId={selectedMeetingId}
          meeting={selectedMeeting}
        />
      </main>
    </div>
  );
};

export default AdminMeetings;