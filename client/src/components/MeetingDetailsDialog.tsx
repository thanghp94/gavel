import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, Users, Edit, CheckSquare, User, UserPlus, FileText } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface MeetingDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: string | null;
  meeting: any;
}

export const MeetingDetailsDialog = ({ isOpen, onClose, meetingId, meeting }: MeetingDetailsDialogProps) => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<any>(null);
  const [selectedRoleId, setSelectedRoleId] = useState("no-role");
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("none");
  const [addParticipantRoleId, setAddParticipantRoleId] = useState("no-role");
  const [isNewUser, setIsNewUser] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: "",
    displayName: "",
    fullName: "",
    school: "",
    gender: "",
    phone: ""
  });

  // Report dialog state
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [reportData, setReportData] = useState({
    roleId: '',
    comment1: '',
    timeUsed: '',
    comment2: '',
    qualified: false
  });

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && meetingId) {
      fetchParticipants();
      fetchRoles();
      fetchUsers();
    }
  }, [isOpen, meetingId]);

  const fetchParticipants = async () => {
    if (!meetingId) return;

    setLoading(true);
    try {
      const data = await api.getMeetingRegistrations(meetingId);
      setParticipants(data);
    } catch (error) {
      console.error('Failed to fetch participants:', error);
      toast({
        title: "Error",
        description: "Failed to load participants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await api.getRoles();
      setRoles(data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleEditRole = (participant: any) => {
    setEditingParticipant(participant);
    setSelectedRoleId(participant.roleId || "no-role");
  };

  const handleSaveRole = async () => {
    if (!editingParticipant) return;

    try {
      const finalRoleId = selectedRoleId === "no-role" ? null : selectedRoleId;
      await api.updateParticipantRole(editingParticipant.id, finalRoleId);

      // Update the participants list
      setParticipants(prev => prev.map(p => 
        p.id === editingParticipant.id 
          ? { 
              ...p, 
              roleId: finalRoleId, 
              roleName: finalRoleId ? roles.find(r => r.id === finalRoleId)?.name : null 
            }
          : p
      ));

      setEditingParticipant(null);
      toast({
        title: "Success",
        description: "Role updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const handleAttendanceCheck = async (participantId: any, currentStatus: any) => {
    const newStatus = currentStatus === 'present' ? 'absent' : 'present';

    try {
      await api.updateAttendanceStatus(participantId, newStatus);

      // Update the participants list
      setParticipants(prev => prev.map(p => 
        p.id === participantId 
          ? { ...p, attendanceStatus: newStatus }
          : p
      ));

      toast({
        title: "Success",
        description: `Attendance marked as ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update attendance",
        variant: "destructive",
      });
    }
  };

  const handleCreateReport = (participant: any) => {
    setSelectedParticipant(participant);
    setReportData({
      roleId: '',
      comment1: '',
      timeUsed: '',
      comment2: '',
      qualified: false
    });
    setIsReportDialogOpen(true);
  };

  const handleSubmitReport = async () => {
    if (!selectedParticipant || !reportData.roleId) {
      toast({
        title: "Error",
        description: "Please select an evaluator role",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.createMeetingReport(meetingId, {
        meetingRegistrationId: selectedParticipant.id,
        ...reportData
      });

      setIsReportDialogOpen(false);
      toast({
        title: "Success",
        description: "Meeting report created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create meeting report",
        variant: "destructive",
      });
    }
  };

  const handleAddParticipant = async () => {
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
          role: "guest",
        });

        // Add the new user as an attendee
        const finalRoleId = addParticipantRoleId === "no-role" ? undefined : addParticipantRoleId;
        await api.addAttendee(meetingId, newUser.user.id, finalRoleId);

        // Refresh participants list
        await fetchParticipants();

        // Reset form and close dialog
        setSelectedUserId("");
        setAddParticipantRoleId("");
        setIsNewUser(false);
        setNewUserData({
          email: "",
          displayName: "",
          fullName: "",
          school: "",
          gender: "",
          phone: ""
        });
        setIsAddParticipantOpen(false);

        toast({
          title: "Success",
          description: "New guest user created and added as participant successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create and add participant",
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
        const finalRoleId = addParticipantRoleId === "no-role" ? undefined : addParticipantRoleId;
        await api.addAttendee(meetingId, selectedUserId, finalRoleId);

        // Refresh participants list
        await fetchParticipants();

        // Reset form and close dialog
        setSelectedUserId("");
        setAddParticipantRoleId("");
        setIsAddParticipantOpen(false);

        toast({
          title: "Success",
          description: "Participant added successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to add participant",
          variant: "destructive",
        });
      }
    }
  };

  const getAttendanceColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'registered': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!meeting) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{meeting.title}</DialogTitle>
          <DialogDescription>
            <span className="block text-base text-gray-700 mb-2">{meeting.theme}</span>
            <span className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(meeting.date).toLocaleDateString('en-GB', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: '2-digit' 
                })}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{meeting.time}</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{meeting.location}</span>
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{participants.length} participants</span>
              </span>
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Participants Table */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Participants
            </h3>
            <Button 
              size="sm" 
              onClick={() => setIsAddParticipantOpen(true)}
              className="h-8 px-3 text-xs"
            >
              <UserPlus className="h-3 w-3 mr-1" />
              Add New Participant
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-4">Loading participants...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="h-8">
                  <TableHead className="py-2 text-xs">Name</TableHead>
                  <TableHead className="py-2 text-xs">Role</TableHead>
                  <TableHead className="py-2 text-xs">Speech Title</TableHead>
                  <TableHead className="py-2 text-xs">Attendance</TableHead>
                  <TableHead className="py-2 text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((participant) => (
                  <TableRow key={participant.id} className="h-10">
                    <TableCell className="py-1">
                      <div className="font-medium text-sm">{participant.userDisplayName}</div>
                    </TableCell>
                    <TableCell className="py-1">
                      {editingParticipant?.id === participant.id ? (
                        <div className="flex items-center gap-1">
                          <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                            <SelectTrigger className="w-36 h-7 text-xs">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="no-role">No Role</SelectItem>
                              {roles.filter(role => role.id && role.id.trim() !== '').map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button size="sm" onClick={handleSaveRole} className="h-7 px-2 text-xs">
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setEditingParticipant(null)}
                            className="h-7 px-2 text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          {participant.roleName || 'No Role'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-1">
                      <span className="text-xs">
                        {participant.speechTitle || '-'}
                      </span>
                    </TableCell>
                    <TableCell className="py-1">
                      <Badge className={getAttendanceColor(participant.attendanceStatus)}>
                        {participant.attendanceStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-1">
                      <div className="flex items-center gap-1">
                        {editingParticipant?.id !== participant.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRole(participant)}
                            title="Edit Role"
                            className="h-6 w-6 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAttendanceCheck(participant.id, participant.attendanceStatus)}
                          title="Toggle Attendance"
                          className="h-6 w-6 p-0"
                        >
                          <CheckSquare className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCreateReport(participant)}
                          title="Create Report"
                          className="h-6 w-6 p-0"
                        >
                          <FileText className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {participants.length === 0 && !loading && (
            <div className="text-center py-4 text-gray-500 text-sm">
              No participants registered for this meeting
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>

      {/* Add Participant Dialog */}
      <Dialog open={isAddParticipantOpen} onOpenChange={setIsAddParticipantOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Participant</DialogTitle>
            <DialogDescription>
              Add an existing user to this meeting
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUserData.email}
                      onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name *</Label>
                    <Input
                      id="displayName"
                      value={newUserData.displayName}
                      onChange={(e) => setNewUserData({...newUserData, displayName: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={newUserData.fullName}
                      onChange={(e) => setNewUserData({...newUserData, fullName: e.target.value})}
                      placeholder="John Michael Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newUserData.phone}
                      onChange={(e) => setNewUserData({...newUserData, phone: e.target.value})}
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school">School</Label>
                  <Input
                    id="school"
                    value={newUserData.school}
                    onChange={(e) => setNewUserData({...newUserData, school: e.target.value})}
                    placeholder="University of Technology"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={newUserData.gender} onValueChange={(value) => setNewUserData({...newUserData, gender: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <SelectItem value="none">Select a user...</SelectItem>
                    {users
                      .filter(user => !participants.some(p => p.userId === user.id))
                      .map((user) => (
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
              <Select value={addParticipantRoleId} onValueChange={setAddParticipantRoleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-role">No Role</SelectItem>
                  {roles.filter(role => role.id && role.id.trim() !== '').map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsAddParticipantOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddParticipant}>
              <UserPlus className="h-4 w-4 mr-2" />
              {isNewUser ? "Create & Add User" : "Add Participant"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Meeting Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Meeting Report</DialogTitle>
            <DialogDescription>
              Create an evaluation report for {selectedParticipant?.userDisplayName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="evaluator-role">Evaluator Role *</Label>
              <Select value={reportData.roleId} onValueChange={(value) => setReportData({...reportData, roleId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your evaluation role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.filter(role => ['Timer', 'Ah Counter', 'Grammarian', 'General Evaluator'].includes(role.name)).map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>


            <div className="space-y-2">
              <Label htmlFor="comment1">Strengths & Positives</Label>
              <Textarea
                id="comment1"
                value={reportData.comment1}
                onChange={(e) => setReportData({...reportData, comment1: e.target.value})}
                placeholder="What did the speaker do well?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeUsed">Time Used (HH:MM:SS)</Label>
              <Input
                id="timeUsed"
                type="time"
                step="1"
                value={reportData.timeUsed}
                onChange={(e) => setReportData({...reportData, timeUsed: e.target.value})}
                placeholder="00:00:00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment2">Areas for Improvement</Label>
              <Textarea
                id="comment2"
                value={reportData.comment2}
                onChange={(e) => setReportData({...reportData, comment2: e.target.value})}
                placeholder="What could be improved for next time?"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="qualified"
                checked={reportData.qualified}
                onChange={(e) => setReportData({...reportData, qualified: e.target.checked})}
                className="rounded"
              />
              <Label htmlFor="qualified">Met speech objectives / Qualified</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReport}>
              <FileText className="h-4 w-4 mr-2" />
              Create Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};