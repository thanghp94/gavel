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
      achievements: ["CC", "ACB", "ALS"],
      speeches: 42,
      awards: ["Leadership Award", "Club Excellence"]
    },
    {
      name: "Vo Thi Mai",
      joinDate: "December 2020",
      role: "Advanced Communicator Bronze",
      profession: "Teacher",
      location: "Da Nang",
      achievements: ["CC", "ACB"],
      speeches: 30,
      awards: ["Educational Excellence", "Community Service"]
    },
    {
      name: "Dang Van Hung",
      joinDate: "February 2021",
      role: "Competent Leader",
      profession: "Project Manager",
      location: "Da Nang",
      achievements: ["CC", "CL"],
      speeches: 28,
      awards: ["Project Leadership", "Team Builder"]
    },
    {
      name: "Bui Thi Thao",
      joinDate: "May 2021",
      role: "Advanced Communicator Bronze",
      profession: "Content Writer",
      location: "Da Nang",
      achievements: ["CC", "ACB"],
      speeches: 32,
      awards: ["Creative Communication", "Writing Excellence"]
    },
    {
      name: "Hoang Van Nam",
      joinDate: "August 2021",
      role: "Competent Communicator",
      profession: "Data Scientist",
      location: "Da Nang",
      achievements: ["CC"],
      speeches: 22,
      awards: ["Technical Speaker", "Innovation Award"]
    },
    {
      name: "Cao Thi Linh",
      joinDate: "November 2021",
      role: "Advanced Leader Bronze",
      profession: "Financial Advisor",
      location: "Da Nang",
      achievements: ["CC", "ACB", "ALB"],
      speeches: 35,
      awards: ["Financial Literacy Speaker", "Mentorship Excellence"]
    },
    {
      name: "Do Van Khoa",
      joinDate: "January 2022",
      role: "Competent Leader",
      profession: "UX Designer",
      location: "Da Nang",
      achievements: ["CC", "CL"],
      speeches: 26,
      awards: ["Design Thinking Speaker", "User Experience Award"]
    },
    {
      name: "Ngo Thi Yen",
      joinDate: "April 2022",
      role: "Advanced Communicator Bronze",
      profession: "Doctor",
      location: "Da Nang",
      achievements: ["CC", "ACB"],
      speeches: 29,
      awards: ["Healthcare Communication", "Public Health Speaker"]
    },
    {
      name: "Ly Van Tan",
      joinDate: "July 2022",
      role: "Competent Communicator",
      profession: "Entrepreneur",
      location: "Da Nang",
      achievements: ["CC"],
      speeches: 20,
      awards: ["Startup Pitch Winner", "Business Innovation"]
    }
  ];

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.profession.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role.toLowerCase().includes(roleFilter.toLowerCase());
    return matchesSearch && matchesRole;
  });

  const memberStats = {
    total: members.length,
    dtm: members.filter(m => m.role.includes('Distinguished')).length,
    avg_speeches: Math.round(members.reduce((sum, m) => sum + m.speeches, 0) / members.length),
    total_awards: members.reduce((sum, m) => sum + m.awards.length, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="bg-gradient-to-br from-teal-600 via-orange-500 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6">Our Members</h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
              Meet the remarkable individuals who make Meraki Gavel Club a thriving community 
              of learners, speakers, and leaders.
            </p>
          </div>
          
          {/* Member Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{memberStats.total}</div>
              <div className="text-orange-200">Total Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{memberStats.dtm}</div>
              <div className="text-orange-200">Distinguished Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{memberStats.avg_speeches}</div>
              <div className="text-orange-200">Avg. Speeches</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{memberStats.total_awards}</div>
              <div className="text-orange-200">Total Awards</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search members by name or profession..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="distinguished">Distinguished</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="competent">Competent</SelectItem>
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
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{animationDelay: `${index * 0.05}s`}}>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl font-bold text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                    <p className="text-gray-600">{member.profession}</p>
                    <Badge className="mt-2 bg-teal-100 text-teal-800">{member.role}</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Joined {member.joinDate}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{member.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="h-4 w-4 mr-2" />
                      <span>{member.speeches} Speeches Delivered</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Achievements:</h4>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {member.achievements.map((achievement, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {member.awards.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Recent Awards:</h4>
                      <div className="space-y-1">
                        {member.awards.slice(0, 2).map((award, i) => (
                          <div key={i} className="text-sm text-gray-600 flex items-center">
                            <Award className="h-3 w-3 mr-2 text-yellow-500" />
                            {award}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">No members found matching your search criteria.</div>
              <Button onClick={() => { setSearchTerm(''); setRoleFilter('all'); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Join Our Growing Community</h2>
          <p className="text-xl text-teal-100 mb-8 leading-relaxed">
            Become part of our vibrant community of speakers and leaders. 
            Start your journey toward personal and professional growth today.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white px-8 py-3 text-lg">
            Become a Member
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Members;
