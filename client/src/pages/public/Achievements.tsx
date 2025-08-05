import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Star, Target, Users, Calendar } from 'lucide-react';

const Achievements = () => {
  const clubAchievements = [
    {
      year: "2024",
      title: "Distinguished Club Award",
      description: "Achieved Distinguished Club status for exceptional performance and member satisfaction.",
      icon: Trophy,
      color: "text-yellow-600 bg-yellow-100"
    },
    {
      year: "2023",
      title: "President's Distinguished Club",
      description: "Recognized as one of the top-performing clubs in the district for outstanding leadership.",
      icon: Star,
      color: "text-purple-600 bg-purple-100"
    },
    {
      year: "2023",
      title: "Excellence in Education Award",
      description: "Outstanding commitment to member education and development programs.",
      icon: Target,
      color: "text-blue-600 bg-blue-100"
    },
    {
      year: "2022",
      title: "Community Impact Recognition",
      description: "Significant contributions to the local community through outreach programs.",
      icon: Users,
      color: "text-green-600 bg-green-100"
    }
  ];

  const memberAchievements = [
    {
      name: "Dr. Nguyen Thi Lan",
      achievement: "Distinguished Toastmaster (DTM)",
      year: "2024",
      description: "Completed the highest level of achievement in the Toastmasters program."
    },
    {
      name: "Tran Van Minh",
      achievement: "Area Director Excellence",
      year: "2023",
      description: "Outstanding leadership as Area Director, supporting multiple clubs in the region."
    },
    {
      name: "Le Thi Hoa",
      achievement: "International Speech Contest Finalist",
      year: "2024",
      description: "Reached the district finals in the International Speech Contest."
    },
    {
      name: "Pham Van Duc",
      achievement: "Mentor of the Year",
      year: "2023",
      description: "Exceptional dedication to mentoring new members and fostering their growth."
    },
    {
      name: "Vu Thi Mai",
      achievement: "Table Topics Champion",
      year: "2024",
      description: "Won the district-level Table Topics speaking contest."
    },
    {
      name: "Hoang Van Nam",
      achievement: "Leadership Excellence Award",
      year: "2023",
      description: "Outstanding leadership in club officer roles and special projects."
    }
  ];

  const contestWins = [
    {
      contest: "International Speech Contest",
      level: "Area Level",
      winner: "Le Thi Hoa",
      year: "2024",
      speech: "Breaking Barriers"
    },
    {
      contest: "Table Topics Contest",
      level: "District Level",
      winner: "Vu Thi Mai",
      year: "2024",
      speech: "Impromptu Excellence"
    },
    {
      contest: "Evaluation Contest",
      level: "Division Level",
      winner: "Tran Van Minh",
      year: "2023",
      speech: "Constructive Feedback Mastery"
    },
    {
      contest: "Humorous Speech Contest",
      level: "Area Level",
      winner: "Dao Van Minh",
      year: "2023",
      speech: "Laughter is the Best Medicine"
    }
  ];

  const milestones = [
    { year: "2019", event: "Club Charter", description: "Meraki Gavel Club officially chartered" },
    { year: "2020", event: "50th Member", description: "Reached 50 active members milestone" },
    { year: "2021", event: "100th Speech", description: "Celebrated our 100th club speech" },
    { year: "2022", event: "First DTM", description: "Our first member achieved DTM status" },
    { year: "2023", event: "Distinguished Club", description: "Achieved Distinguished Club award" },
    { year: "2024", event: "5th Anniversary", description: "Celebrating 5 years of excellence" }
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
              Our Achievements
            </h1>
            <p className="text-xl lg:text-2xl mb-4 text-teal-100 font-medium animate-fade-in">
              Celebrating Excellence and Growth
            </p>
            <p className="text-lg text-teal-200 leading-relaxed max-w-3xl mx-auto animate-fade-in">
              Discover the remarkable accomplishments of our club and members throughout our journey of leadership and communication excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Club Achievements */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Club Achievements</h2>
            <p className="text-xl text-gray-600">
              Recognition and awards that showcase our commitment to excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {clubAchievements.map((achievement, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${achievement.color}`}>
                      <achievement.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{achievement.title}</h3>
                        <Badge variant="outline" className="text-sm">
                          {achievement.year}
                        </Badge>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Member Achievements */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Member Achievements</h2>
            <p className="text-xl text-gray-600">
              Celebrating the individual successes of our outstanding members
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memberAchievements.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                    <Badge className="bg-teal-100 text-teal-800 mb-2">
                      {member.achievement}
                    </Badge>
                    <p className="text-sm text-gray-500">{member.year}</p>
                  </div>
                  <p className="text-gray-600 text-sm text-center leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contest Wins */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contest Victories</h2>
            <p className="text-xl text-gray-600">
              Our members' outstanding performances in speaking competitions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contestWins.map((contest, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{contest.contest}</h3>
                    <Badge variant="secondary">{contest.level}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Winner:</span>
                      <span className="font-semibold text-gray-900">{contest.winner}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Speech:</span>
                      <span className="font-medium text-gray-800">"{contest.speech}"</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Year:</span>
                      <span className="text-gray-800">{contest.year}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline of Milestones */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Club Milestones</h2>
            <p className="text-xl text-gray-600">
              Key moments in our journey of growth and achievement
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-teal-200"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} animate-fade-in`} style={{animationDelay: `${index * 0.2}s`}}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="h-4 w-4 text-teal-600" />
                          <Badge variant="outline">{milestone.year}</Badge>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{milestone.event}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="w-2/12 flex justify-center">
                    <div className="w-4 h-4 bg-teal-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  
                  <div className="w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Achievements;