
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, BookOpen, TrendingUp, Shield, Globe } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const features = [
    {
      icon: Users,
      title: "Member Management",
      description: "Comprehensive member profiles, role assignments, and progress tracking"
    },
    {
      icon: Calendar,
      title: "Meeting Organization",
      description: "Schedule meetings, assign roles, and generate agendas automatically"
    },
    {
      icon: BookOpen,
      title: "Learning Materials",
      description: "Access role scripts, guidelines, and educational content"
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description: "Visual charts and reports to track member development"
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Secure member and ExCo dashboards with appropriate permissions"
    },
    {
      icon: Globe,
      title: "Public Information",
      description: "Dynamic CMS for club information and frequently asked questions"
    }
  ];

  if (showLogin) {
    return <LoginForm onBack={() => setShowLogin(false)} onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }} />;
  }

  if (showRegister) {
    return <RegisterForm onBack={() => setShowRegister(false)} onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GF</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              GavelFlow
            </h1>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowLogin(true)}>
              Login
            </Button>
            <Button onClick={() => setShowRegister(true)} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700">
          Comprehensive Club Management
        </Badge>
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
          Streamline Your Gavel Club Operations
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          GavelFlow is the complete solution for managing your Gavel Club. From member progress tracking 
          to meeting organization, empower your club with modern tools designed for growth and engagement.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => setShowRegister(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8"
          >
            Start Your Journey
          </Button>
          <Button size="lg" variant="outline" className="px-8">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Everything You Need to Manage Your Club</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Built specifically for Gavel Clubs with features that matter most to your members and leadership team
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Members Managed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Meetings Organized</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Clubs Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-4xl mx-auto border-0 shadow-xl bg-gradient-to-r from-orange-50 to-blue-50">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl mb-4">Ready to Transform Your Club?</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Join clubs worldwide who have streamlined their operations with GavelFlow
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              size="lg" 
              onClick={() => setShowRegister(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8"
            >
              Get Started Today
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GF</span>
              </div>
              <h4 className="text-xl font-bold">GavelFlow</h4>
            </div>
            <p className="text-gray-400 mb-4">Empowering Gavel Clubs worldwide</p>
            <div className="text-sm text-gray-500">
              © 2024 GavelFlow. Built for Gavel Club excellence.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
