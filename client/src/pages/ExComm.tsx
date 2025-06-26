import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Linkedin, Phone } from 'lucide-react';

const ExComm = () => {
  const executives = [
    {
      name: "Nguyen Minh Anh",
      position: "President",
      term: "2024-2025",
      bio: "Leading with vision and dedication to foster growth and excellence in our club community.",
      achievements: ["Distinguished Toastmaster", "Area Director 2023", "Club Coach"],
      contact: { email: "president@merakigavel.club", phone: "+84 905 123 456" }
    },
    {
      name: "Tran Van Duc",
      position: "Vice President Education",
      term: "2024-2025",
      bio: "Passionate about developing educational programs and mentoring new speakers.",
      achievements: ["Advanced Communicator Gold", "Advanced Leader Silver", "Mentor Award"],
      contact: { email: "vpe@merakigavel.club", phone: "+84 905 123 457" }
    },
    {
      name: "Le Thi Mai",
      position: "Vice President Membership",
      term: "2024-2025",
      bio: "Dedicated to building our community and ensuring every member feels valued and engaged.",
      achievements: ["Excellence in Leadership", "Talk Up Toastmasters Winner", "Membership Builder"],
      contact: { email: "vpm@merakigavel.club", phone: "+84 905 123 458" }
    },
    {
      name: "Pham Hoang Nam",
      position: "Vice President Public Relations",
      term: "2024-2025",
      bio: "Creative communicator focused on sharing our club's story and building community connections.",
      achievements: ["Social Media Excellence", "PR Campaign Award", "Community Outreach Leader"],
      contact: { email: "vppr@merakigavel.club", phone: "+84 905 123 459" }
    },
    {
      name: "Vo Thi Lan",
      position: "Secretary",
      term: "2024-2025",
      bio: "Organized and detail-oriented, ensuring smooth operations and accurate record-keeping.",
      achievements: ["Secretary of the Year", "Organizational Excellence", "Digital Innovation Award"],
      contact: { email: "secretary@merakigavel.club", phone: "+84 905 123 460" }
    },
    {
      name: "Dao Van Minh",
      position: "Treasurer",
      term: "2024-2025",
      bio: "Financial steward committed to transparency and responsible resource management.",
      achievements: ["Financial Leadership Award", "Budget Management Excellence", "Club Growth Supporter"],
      contact: { email: "treasurer@merakigavel.club", phone: "+84 905 123 461" }
    },
    {
      name: "Hoang Thi Thu",
      position: "Sergeant at Arms",
      term: "2024-2025",
      bio: "Ensuring our meetings run smoothly and creating a welcoming environment for all members.",
      achievements: ["Hospitality Excellence", "Event Coordination Award", "Member Engagement Champion"],
      contact: { email: "saa@merakigavel.club", phone: "+84 905 123 462" }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-teal-500 via-teal-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              Executive Committee
            </h1>
            <p className="text-xl lg:text-2xl mb-4 text-teal-100 font-medium animate-fade-in">
              Meet Our Dedicated Leadership Team
            </p>
            <p className="text-lg text-teal-200 leading-relaxed max-w-3xl mx-auto animate-fade-in">
              Our executive committee consists of passionate leaders committed to fostering growth, 
              excellence, and community within Meraki Gavel Club.
            </p>
          </div>
        </div>
      </section>

      {/* Executive Committee Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {executives.map((executive, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    {executive.userImage ? (
                      <img
                        src={executive.userImage}
                        alt={executive.name}
                        className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-orange-600">
                          {executive.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{executive.name}</h3>
                    <Badge variant="secondary" className="mb-2 bg-teal-100 text-teal-800">
                      {executive.position}
                    </Badge>
                    <p className="text-sm text-gray-500 mb-3">Term: {executive.term}</p>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {executive.bio}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Achievements:</h4>
                    <div className="flex flex-wrap gap-1">
                      {executive.achievements.map((achievement, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{executive.contact.email}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Phone className="h-4 w-4 text-teal-600 cursor-pointer hover:text-teal-800" />
                        <Linkedin className="h-4 w-4 text-teal-600 cursor-pointer hover:text-teal-800" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Philosophy Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Leadership Philosophy</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe in servant leadership, collaborative decision-making, and creating 
              opportunities for every member to grow and succeed.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Vision-Driven</h3>
                <p className="text-gray-600">
                  We lead with a clear vision for the future, inspiring our members to achieve 
                  their personal and professional goals.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Collaborative</h3>
                <p className="text-gray-600">
                  Every decision is made with input from our community, ensuring that all voices 
                  are heard and valued.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Growth-Focused</h3>
                <p className="text-gray-600">
                  We are committed to continuous improvement and creating opportunities for 
                  leadership development at every level.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ExComm;