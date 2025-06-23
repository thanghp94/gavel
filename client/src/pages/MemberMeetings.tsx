
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, MessageSquare, Download } from "lucide-react";
import { MemberNavigation } from "@/components/navigation/MemberNavigation";
import { api } from "@/lib/api";

const MemberMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await api.getMeetings();
        setMeetings(data);
      } catch (error) {
        console.error('Failed to fetch meetings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MemberNavigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading meetings...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MemberNavigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meeting Schedule</h1>
          <p className="text-gray-600">View your upcoming meetings and past attendance</p>
        </div>

        <div className="grid gap-6">
          {meetings.map((meeting) => (
            <Card key={meeting.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{meeting.title}</CardTitle>
                    <CardDescription className="text-base mt-2">{meeting.theme}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(meeting.status)}>
                    {meeting.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(meeting.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{meeting.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{meeting.location}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>Club Meeting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Theme:</span>
                      <Badge variant="secondary">{meeting.role}</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  {meeting.status === 'upcoming' && (
                    <>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Role Guidelines
                      </Button>
                      <Button variant="outline" size="sm">
                        View Agenda
                      </Button>
                    </>
                  )}
                  {meeting.status === 'completed' && (
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      View Reflection
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MemberMeetings;
