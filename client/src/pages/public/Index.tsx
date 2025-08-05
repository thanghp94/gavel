
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Shield, Users, Calendar, BookOpen, Settings } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">GF</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to GavelFlow
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Your comprehensive platform for managing Gavel Club activities, member progress, and meeting experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Member Portal */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Users className="h-8 w-8 text-blue-600" />
                Member Portal
              </CardTitle>
              <CardDescription className="text-lg">
                Access your learning paths, track progress, and participate in meetings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Member Login
                  </Button>
                </Link>
                <Link to="/member/meetings">
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Meetings
                  </Button>
                </Link>
                <Link to="/member/learning">
                  <Button variant="outline" className="w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Learning
                  </Button>
                </Link>
                <Link to="/member/progress">
                  <Button variant="outline" className="w-full">
                    Progress
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Admin Portal */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 hover:border-orange-200 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Shield className="h-8 w-8 text-orange-600" />
                ExCo Portal
              </CardTitle>
              <CardDescription className="text-lg">
                Manage club operations, meetings, and member content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    ExCo Login
                  </Button>
                </Link>
                <Link to="/exco/meetings">
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Meetings
                  </Button>
                </Link>
                <Link to="/exco/content">
                  <Button variant="outline" className="w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Content
                  </Button>
                </Link>
                <Link to="/exco/analytics">
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600">
            Choose your portal above to get started with GavelFlow
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
