import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Calendar, Plus, Eye, Edit } from "lucide-react";
import { MemberNavigation } from "@/components/navigation/MemberNavigation";

const MemberReflections = () => {
  const [reflections] = useState([
    {
      id: 1,
      meetingTitle: "Weekly Meeting #23",
      date: "June 18, 2024",
      status: "completed",
      role: "Timer",
      keyLearnings: "Learned the importance of precise timing and clear signals...",
      rating: 4
    },
    {
      id: 2,
      meetingTitle: "Weekly Meeting #22",
      date: "June 11, 2024",
      status: "pending",
      role: "General Evaluator",
      keyLearnings: "",
      rating: null
    },
    {
      id: 3,
      meetingTitle: "Weekly Meeting #21",
      date: "June 4, 2024",
      status: "completed",
      role: "Ah Counter",
      keyLearnings: "Developed better listening skills and attention to detail...",
      rating: 5
    },
    {
      id: 4,
      meetingTitle: "Weekly Meeting #20",
      date: "May 28, 2024",
      status: "completed",
      role: "Table Topics Master",
      keyLearnings: "Gained confidence in facilitating impromptu speaking sessions...",
      rating: 4
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingStars = (rating: number | null) => {
    if (!rating) return null;
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MemberNavigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Meeting Reflections</h1>
              <p className="text-gray-600">Review your thoughts and learnings from past meetings</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Reflection
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {reflections.filter(r => r.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed Reflections</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {reflections.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending Reflections</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {(reflections
                  .filter(r => r.rating)
                  .reduce((sum, r) => sum + (r.rating || 0), 0) / 
                  reflections.filter(r => r.rating).length).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Reflections List */}
        <div className="space-y-4">
          {reflections.map((reflection) => (
              <Card key={reflection.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{reflection.meetingTitle}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          {reflection.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={reflection.status === 'completed' ? 'default' : 'secondary'}
                        className={reflection.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {reflection.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        {reflection.status === 'pending' && (
                          <Button size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </main>
    </div>
  );
};

export default MemberReflections;