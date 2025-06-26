import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Users, Award, Calendar, Target, ArrowRight, Star } from 'lucide-react';
import { useState } from 'react';

const Homepage = () => {
  const { toast } = useToast();
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newMember, setNewMember] = useState({
    email: '',
    displayName: '',
    fullName: '',
    phone: '',
    memberType: 'member',
    role: 'member'
  });

  const handleCreateMember = async () => {
    if (!newMember.email || !newMember.displayName) {
      toast({
        title: "Error",
        description: "Email and Display Name are required",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      await api.createUser({
        email: newMember.email,
        displayName: newMember.displayName,
        fullName: newMember.fullName,
        phone: newMember.phone,
        memberType: newMember.memberType,
        role: newMember.role,
      });

      toast({
        title: "Success",
        description: "Welcome to Meraki Gavel Club! We'll contact you soon.",
      });

      setIsJoinDialogOpen(false);
      setNewMember({
        email: '',
        displayName: '',
        fullName: '',
        phone: '',
        memberType: 'member',
        role: 'member'
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const features = [
    {
      icon: Users,
      title: "Leadership Development",
      description: "Build confidence and leadership skills through structured programs and mentorship."
    },
    {
      icon: Target,
      title: "Public Speaking",
      description: "Master the art of communication in a supportive, encouraging environment."
    },
    {
      icon: Award,
      title: "Recognition & Growth",
      description: "Achieve milestones and earn recognition for your personal and professional development."
    },
    {
      icon: Calendar,
      title: "Regular Meetings",
      description: "Consistent practice and learning through weekly meetings and special events."
    }
  ];

  const stats = [
    { number: "50+", label: "Active Members" },
    { number: "5", label: "Years of Excellence" },
    { number: "100+", label: "Speeches Delivered" },
    { number: "25+", label: "Awards Won" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-500 via-teal-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Meraki Gavel Club
              </h1>
              <p className="text-xl lg:text-2xl mb-4 text-teal-100 font-medium">
                Inspiring Tomorrow's Leaders, Today!
              </p>
              <p className="text-lg mb-8 text-teal-200 leading-relaxed">
                Join Da Nang's premier Gavel Club since 2019. Develop your speaking skills, 
                build leadership capabilities, and connect with like-minded individuals in 
                a supportive community environment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white px-8 py-3 text-lg">
                      Join Our Club
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Join Meraki Gavel Club</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email*</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newMember.email}
                          onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name*</Label>
                        <Input
                          id="displayName"
                          value={newMember.displayName}
                          onChange={(e) => setNewMember({ ...newMember, displayName: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={newMember.fullName}
                          onChange={(e) => setNewMember({ ...newMember, fullName: e.target.value })}
                          placeholder="John Michael Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={newMember.phone}
                          onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                          placeholder="+84 123 456 789"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="memberType">Membership Type</Label>
                        <Select value={newMember.memberType} onValueChange={(value) => setNewMember({ ...newMember, memberType: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Regular Member</SelectItem>
                            <SelectItem value="guest">Guest</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsJoinDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCreateMember}
                          disabled={isCreating}
                          className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500"
                        >
                          {isCreating ? "Submitting..." : "Join Club"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button size="lg" variant="outline" className="text-white border-white bg-transparent hover:bg-white hover:text-teal-600 px-8 py-3 text-lg">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/lovable-uploads/3644d1c0-f3a8-4177-8b39-117f31cb8620.png" 
                alt="Meraki Gavel Club Members"
                className="rounded-lg shadow-2xl animate-scale-in"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="text-4xl lg:text-5xl font-bold text-teal-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Meraki Gavel Club?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide a comprehensive platform for personal and professional development 
              through structured learning and community support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-to-r from-orange-100 to-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About Meraki Gavel Club</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Established in 2019, Meraki Gavel Club holds the distinction of being a premier 
                Gavel Club in Da Nang, Vietnam. We are committed to developing the next 
                generation of leaders through comprehensive training in communication, leadership, 
                and personal development.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our club provides a supportive environment where members can practice public speaking, 
                develop leadership skills, and build lasting professional relationships. Through 
                structured meetings, mentorship programs, and various speaking opportunities, we 
                help our members achieve their personal and professional goals.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">Rated excellent by our members</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-teal-100 to-orange-50 p-8 rounded-2xl">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-bold text-teal-600 mb-4">Our Mission</h3>
                  <p className="text-gray-700 leading-relaxed">
                    To provide a mutually supportive and positive learning environment in which 
                    every member has the opportunity to develop oral communication and leadership 
                    skills, which in turn foster self-confidence and personal growth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-500 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-xl text-teal-100 mb-8 leading-relaxed">
            Join Meraki Gavel Club today and start developing the leadership and communication 
            skills that will transform your personal and professional life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white px-8 py-3 text-lg">
                  Become a Member
                </Button>
              </DialogTrigger>
            </Dialog>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-teal-600 px-8 py-3 text-lg">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Homepage;