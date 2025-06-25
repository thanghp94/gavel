
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, MapPin, Users, Edit, CheckSquare, User } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface MeetingDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: string | null;
  meeting: any;
}

export const MeetingDetailsDialog = ({ isOpen, onClose, meetingId, meeting }: MeetingDetailsDialogProps) => {
  const [participants, setParticipants] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && meetingId) {
      fetchParticipants();
      fetchRoles();
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

  const handleEditRole = (participant) => {
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

  const handleAttendanceCheck = async (participantId, currentStatus) => {
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
          <DialogDescription className="text-base">{meeting.theme}</DialogDescription>
        </DialogHeader>

        {/* Meeting Details */}
        <div className="grid md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{new Date(meeting.date).toLocaleDateString('en-GB', { 
                day: '2-digit', 
                month: '2-digit', 
                year: '2-digit' 
              })}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{meeting.time}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{meeting.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-4 w-4" />
              <span>{participants.length} participants</span>
            </div>
          </div>
        </div>

        {/* Participants Table */}
        <div className="space-y-2">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <User className="h-4 w-4" />
            Participants
          </h3>
          
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
                      <Badge className={getAttendanceColor(participant.attendanceStatus)} size="sm">
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
    </Dialog>
  );
};
