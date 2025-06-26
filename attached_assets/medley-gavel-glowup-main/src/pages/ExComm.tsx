
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
      name: "Dang Van Hieu",
      position: "Treasurer",
      term: "2024-2025",
      bio: "Financial steward committed to transparency and responsible resource management.",
      achievements: ["Financial Management Excellence", "Budget Planning Award", "Audit Commendation"],
      contact: { email: "treasurer@merakigavel.club", phone: "+84 905 123 461" }
    },
    {
      name: "Bui Thi Huong",
      position: "Sergeant at Arms",
      term: "2024-2025",
      bio: "Creating a welcoming environment and ensuring meetings run smoothly for all members.",
      achievements: ["Hospitality Excellence", "Meeting Management Pro", "Member Support Award"],
      contact: { email: "saa@merakigavel.club", phone: "+84 905 123 462" }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="bg-gradient-to-br from-teal-600 via-teal-700 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Executive Committee</h1>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto leading-relaxed">
            Meet the dedicated leaders who guide Meraki Gavel Club toward excellence, 
            supporting every member's journey in communication and leadership development.
          </p>
          <div className="mt-8">
            <Badge variant="secondary" className="bg-orange-500 text-white text-lg px-4 py-2">
              Term: 2024-2025
            </Badge>
          </div>
        </div>
      </section>

      {/* Executive Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {executives.map((exec, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-teal-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">
                        {exec.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{exec.name}</h3>
                    <Badge className="bg-teal-100 text-teal-800 mb-4">{exec.position}</Badge>
                  </div>
                  
                  <p className="text-gray-600 text-center mb-4 leading-relaxed">{exec.bio}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Key Achievements:</h4>
                    <div className="flex flex-wrap gap-1">
                      {exec.achievements.map((achievement, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <a href={`mailto:${exec.contact.email}`} className="hover:text-teal-700 transition-colors">
                        {exec.contact.email}
                      </a>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{exec.contact.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Philosophy */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Leadership Philosophy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="animate-fade-in">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-700">S</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Serve</h3>
              <p className="text-gray-600">We lead by serving our members and community first</p>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-700">I</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Inspire</h3>
              <p className="text-gray-600">We motivate others to reach their full potential</p>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-700">G</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Grow</h3>
              <p className="text-gray-600">We foster continuous learning and development</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ExComm;
