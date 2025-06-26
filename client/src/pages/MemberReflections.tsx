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
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Reflection
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">Completed Reflections</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{reflections.filter(r => r.status === 'completed').length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white cursor-pointer hover:from-yellow-600 hover:to-yellow-700 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">Pending Reflections</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{reflections.filter(r => r.status === 'pending').length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white cursor-pointer hover:from-green-600 hover:to-green-700 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90">Average Rating</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">
                  {(reflections
                    .filter(r => r.rating)
                    .reduce((sum, r) => sum + (r.rating || 0), 0) / 
                    reflections.filter(r => r.rating).length).toFixed(1)}
                </p>
              </div>
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