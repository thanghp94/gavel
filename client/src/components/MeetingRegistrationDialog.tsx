import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Calendar, Clock, Users } from "lucide-react";

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  theme: string;
}

interface MeetingRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting | null;
  roles: Role[];
  onRegistrationSuccess: () => void;
  isEditing?: boolean;
  currentRegistration?: {
    roleId?: string;
    speechTitle?: string;
    speechObjectives?: string;
  };
}

export const MeetingRegistrationDialog = ({ 
  isOpen, 
  onClose, 
  meeting, 
  roles, 
  onRegistrationSuccess,
  isEditing = false,
  currentRegistration
}: MeetingRegistrationDialogProps) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(currentRegistration?.roleId || "no-role");
  const [speechTitle, setSpeechTitle] = useState(currentRegistration?.speechTitle || "");
  const [speechObjectives, setSpeechObjectives] = useState(currentRegistration?.speechObjectives || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Calculate if selected role is a speaker role
  const selectedRole = roles.find(role => role.id === selectedRoleId);
  const isSpeakerRole = selectedRole?.name?.toLowerCase().includes('speaker');

  // Reset form when dialog opens or currentRegistration changes
  useEffect(() => {
    if (isOpen) {
      setSelectedRoleId(currentRegistration?.roleId || "no-role");
      setSpeechTitle(currentRegistration?.speechTitle || "");
      setSpeechObjectives(currentRegistration?.speechObjectives || "");
    }
  }, [isOpen, currentRegistration]);

  // Clear speech fields when role changes away from Speaker
  useEffect(() => {
    if (!isSpeakerRole) {
      setSpeechTitle("");
      setSpeechObjectives("");
    }
  }, [isSpeakerRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meeting) return;

    setIsLoading(true);

    try {
      // Only pass speech data if the role is Speaker
      const speechTitleToSend = isSpeakerRole ? speechTitle || undefined : undefined;
      const speechObjectivesToSend = isSpeakerRole ? speechObjectives || undefined : undefined;
      
      // Convert "no-role" to undefined for API
      const roleIdToSend = selectedRoleId === "no-role" ? undefined : selectedRoleId || undefined;

      if (isEditing) {
        // Update existing registration
        await api.updateMeetingRegistration(
          meeting.id,
          roleIdToSend,
          speechTitleToSend,
          speechObjectivesToSend
        );
        
        toast({
          title: "Registration Updated",
          description: `Your registration for ${meeting.title} has been updated`,
        });
      } else {
        // Create new registration
        await api.registerForMeeting(
          meeting.id, 
          roleIdToSend, 
          speechTitleToSend, 
          speechObjectivesToSend
        );

        toast({
          title: "Registration Successful",
          description: `You have been registered for ${meeting.title}`,
        });
      }

      onRegistrationSuccess();
      onClose();
      
      // Reset form
      setSelectedRoleId("no-role");
      setSpeechTitle("");
      setSpeechObjectives("");
    } catch (error) {
      toast({
        title: isEditing ? "Update Failed" : "Registration Failed",
        description: error instanceof Error ? error.message : `Failed to ${isEditing ? 'update' : 'register for'} meeting`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Update Meeting Registration" : "Register for Meeting"}
          </DialogTitle>
          <DialogDescription>
            {meeting && (
              <div className="space-y-2 mt-2">
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {meeting.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {meeting.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Theme:</span> {meeting.theme}
                  </p>
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Select Role</Label>
            <Select value={selectedRoleId || undefined} onValueChange={setSelectedRoleId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a role (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-role">No specific role</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {role.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedRole?.description && (
              <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                <span className="font-medium">Role Description:</span> {selectedRole.description}
              </p>
            )}
          </div>

          {isSpeakerRole && (
            <>
              <div className="space-y-2">
                <Label htmlFor="speechTitle">Speech Title</Label>
                <Input
                  id="speechTitle"
                  type="text"
                  placeholder="Enter your speech title"
                  value={speechTitle}
                  onChange={(e) => setSpeechTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="speechObjectives">Speech Objectives</Label>
                <Textarea
                  id="speechObjectives"
                  placeholder="Describe your speech objectives and what you hope to achieve"
                  value={speechObjectives}
                  onChange={(e) => setSpeechObjectives(e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading 
                ? (isEditing ? "Updating..." : "Registering...") 
                : (isEditing ? "Update Registration" : "Register")
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
