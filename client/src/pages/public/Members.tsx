import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Search, Calendar, Award, MapPin } from 'lucide-react';

const Members = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const members = [
    {
      name: "Dr. Nguyen Thi Lan",
      joinDate: "January 2020",
      role: "Distinguished Toastmaster",
      profession: "Software Engineer",
      location: "Da Nang",
      achievements: ["CC", "CL", "DTM"],
      speeches: 45,
      awards: ["Best Speaker 2023", "Leadership Excellence"]
    },
    {
      name: "Tran Van Minh",
      joinDate: "March 2020",
      role: "Advanced Communicator Gold",
      profession: "Marketing Manager",
      location: "Da Nang",
      achievements: ["CC", "ACG", "CL"],
      speeches: 38,
      awards: ["Table Topics Winner", "Evaluation Contest Winner"]
    },
    {
      name: "Le Thi Hoa",
      joinDate: "June 2020",
      role: "Competent Communicator",
      profession: "HR Specialist",
      location: "Da Nang",
      achievements: ["CC", "CL"],
      speeches: 25,
      awards: ["New Member Award", "Mentor Recognition"]
    },
    {
      name: "Pham Van Duc",
      joinDate: "September 2020",
      role: "Advanced Leader Silver",
      profession: "Business Analyst",
      location: "Da Nang",
      achievements: ["CC", "ALS", "CL"],
      speeches: 32,
      awards: ["Leadership Award", "Mentor of the Year"]
    },
    {
      name: "Vu Thi Mai",
      joinDate: "November 2020",
      role: "Advanced Communicator Bronze",
      profession: "Graphic Designer",
      location: "Da Nang",
      achievements: ["CC", "ACB"],
      speeches: 28,
      awards: ["Creative Excellence", "Visual Communication Award"]
    },
    {
      name: "Hoang Van Nam",
      joinDate: "February 2021",
      role: "Competent Leader",
      profession: "Project Manager",
      location: "Da Nang",
      achievements: ["CC", "CL"],
      speeches: 22,
      awards: ["Organizational Leadership", "Team Building Champion"]
    },
    {
      name: "Cao Thi Linh",
      joinDate: "April 2021",
      role: "Advanced Communicator Silver",
      profession: "Teacher",
      location: "Da Nang",
      achievements: ["CC", "ACS", "CL"],
      speeches: 35,
      awards: ["Educational Excellence", "Community Impact Award"]
    },
    {
      name: "Dang Van Hung",
      joinDate: "July 2021",
      role: "Competent Communicator",
      profession: "Sales Director",
      location: "Da Nang",
      achievements: ["CC"],
      speeches: 18,
      awards: ["Sales Communication Excellence", "Persuasive Speaking"]
    },
    {
      name: "Bui Thi Thao",
      joinDate: "October 2021",
      role: "Advanced Leader Bronze",
      profession: "Data Scientist",
      location: "Da Nang",
      achievements: ["CC", "ALB", "CL"],
      speeches: 29,
      awards: ["Innovation in Leadership", "Analytical Excellence"]
    }
  ];

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.profession.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role.toLowerCase().includes(roleFilter.toLowerCase());
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    if (role.includes('Distinguished')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (role.includes('Advanced')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (role.includes('Competent')) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-teal-500 via-teal-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              Our Members
            </h1>
            <p className="text-xl lg:text-2xl mb-4 text-teal-100 font-medium animate-fade-in">
              Meet Our Amazing Community
            </p>
            <p className="text-lg text-teal-200 leading-relaxed max-w-3xl mx-auto animate-fade-in">
              Discover the diverse group of passionate individuals who make up our vibrant Gavel Club community.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search members by name or profession..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="distinguished">Distinguished Toastmaster</SelectItem>
                  <SelectItem value="advanced">Advanced Level</SelectItem>
                  <SelectItem value="competent">Competent Level</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                Export List
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Members Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    {member.userImage ? (
                      <img
                        src={member.userImage}
                        alt={member.name}
                        className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl font-bold text-orange-600">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{member.profession}</p>
                    <Badge className={`text-xs ${getRoleBadgeColor(member.role)}`}>
                      {member.role}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {member.joinDate}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{member.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Award className="h-4 w-4" />
                        <span>{member.speeches} speeches</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Achievements</h4>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {member.achievements.map((achievement, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Recent Awards</h4>
                    <div className="space-y-1">
                      {member.awards.slice(0, 2).map((award, i) => (
                        <div key={i} className="text-xs text-gray-600 flex items-center">
                          <Award className="h-3 w-3 mr-1 text-yellow-500" />
                          {award}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No members found matching your search criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Membership Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Community Statistics</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600 mb-2">{members.length}</div>
              <div className="text-gray-600">Total Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600 mb-2">
                {members.reduce((sum, member) => sum + member.speeches, 0)}
              </div>
              <div className="text-gray-600">Total Speeches</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600 mb-2">
                {members.filter(m => m.role.includes('Advanced') || m.role.includes('Distinguished')).length}
              </div>
              <div className="text-gray-600">Advanced Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600 mb-2">
                {members.reduce((sum, member) => sum + member.awards.length, 0)}
              </div>
              <div className="text-gray-600">Awards Earned</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Members;