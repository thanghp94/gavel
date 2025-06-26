import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Award, Star, Calendar, Users, Target } from 'lucide-react';

const Achievements = () => {
  const clubAwards = [
    {
      title: "Distinguished Club",
      year: "2023-24",
      category: "Club Excellence",
      description: "Achieved Distinguished status for outstanding performance in membership, education, and leadership development.",
      icon: Trophy,
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      title: "Select Distinguished Club",
      year: "2022-23",
      category: "Club Excellence",
      description: "Recognized for exceptional club growth and member achievement across all program areas.",
      icon: Star,
      color: "bg-teal-100 text-teal-800"
    },
    {
      title: "Quality Club Award",
      year: "2021-22",
      category: "Operational Excellence",
      description: "Honored for maintaining high standards in meeting quality and member satisfaction.",
      icon: Award,
      color: "bg-orange-100 text-orange-800"
    },
    {
      title: "Membership Excellence",
      year: "2023-24",
      category: "Growth",
      description: "Outstanding achievement in member recruitment and retention programs.",
      icon: Users,
      color: "bg-purple-100 text-purple-800"
    }
  ];

  const memberAchievements = [
    {
      name: "Dr. Nguyen Thi Lan",
      achievement: "Distinguished Toastmaster (DTM)",
      year: "2024",
      description: "Highest level of achievement in Toastmasters education program",
      category: "Education"
    },
    {
      name: "Tran Van Duc",
      achievement: "Area Director's Award",
      year: "2023",
      description: "Excellence in area leadership and club development",
      category: "Leadership"
    },
    {
      name: "Le Thi Mai",
      achievement: "International Speech Contest - Division Winner",
      year: "2023",
      description: "Champion of Division-level International Speech Contest",
      category: "Speaking"
    },
    {
      name: "Pham Hoang Nam",
      achievement: "Evaluation Contest - Area Champion",
      year: "2024",
      description: "Winner of Area-level Speech Evaluation Contest",
      category: "Evaluation"
    },
    {
      name: "Vo Thi Lan",
      achievement: "Table Topics Contest - District Finalist",
      year: "2023",
      description: "Reached District finals in impromptu speaking competition",
      category: "Impromptu"
    },
    {
      name: "Dang Van Hieu",
      achievement: "Humorous Speech Contest - Area Winner",
      year: "2024",
      description: "Champion of Area-level Humorous Speech Contest",
      category: "Humor"
    }
  ];

  const milestones = [
    {
      year: "2019",
      title: "Club Charter",
      description: "Meraki Gavel Club officially chartered as a premier Gavel Club in Da Nang"
    },
    {
      year: "2020",
      title: "20 Members Milestone",
      description: "Reached our first major membership milestone with 20 active members"
    },
    {
      year: "2021",
      title: "First DTM Graduate",
      description: "Celebrated our first member achieving Distinguished Toastmaster status"
    },
    {
      year: "2022",
      title: "Quality Club Recognition",
      description: "Earned our first Quality Club award for excellence in all areas"
    },
    {
      year: "2023",
      title: "Contest Champions",
      description: "Multiple members advanced to Division and District level contests"
    },
    {
      year: "2024",
      title: "Distinguished Status",
      description: "Achieved Distinguished Club status for outstanding overall performance"
    }
  ];

  const statistics = [
    { number: "150+", label: "Educational Awards Earned", icon: Award },
    { number: "25+", label: "Contest Winners", icon: Trophy },
    { number: "5", label: "DTM Graduates", icon: Star },
    { number: "300+", label: "Speeches Delivered", icon: Target }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="bg-gradient-to-br from-purple-700 via-teal-600 to-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Our Achievements</h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed mb-8">
            Celebrating the remarkable accomplishments of our club and members who continue 
            to set new standards of excellence in communication and leadership.
          </p>
          
          {/* Achievement Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="bg-gradient-to-br from-teal-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.number}</div>
                <div className="text-orange-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="club" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="club" className="text-lg">Club Awards</TabsTrigger>
              <TabsTrigger value="members" className="text-lg">Member Achievements</TabsTrigger>
              <TabsTrigger value="milestones" className="text-lg">Milestones</TabsTrigger>
            </TabsList>

            {/* Club Awards Tab */}
            <TabsContent value="club" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Club Excellence Awards</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Recognition for our commitment to excellence and outstanding club performance
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {clubAwards.map((award, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-full ${award.color}`}>
                          <award.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{award.title}</h3>
                            <Badge variant="outline">{award.year}</Badge>
                          </div>
                          <Badge className="mb-3 bg-gray-100 text-gray-800">{award.category}</Badge>
                          <p className="text-gray-600 leading-relaxed">{award.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Member Achievements Tab */}
            <TabsContent value="members" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Individual Excellence</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Celebrating the outstanding achievements of our talented members
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {memberAchievements.map((achievement, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {achievement.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{achievement.name}</h3>
                            <Badge variant="outline">{achievement.year}</Badge>
                          </div>
                          <h4 className="text-teal-700 font-semibold mb-2">{achievement.achievement}</h4>
                          <Badge className="mb-3 bg-orange-100 text-orange-800">{achievement.category}</Badge>
                          <p className="text-gray-600 text-sm leading-relaxed">{achievement.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Milestones Tab */}
            <TabsContent value="milestones" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Journey of Excellence</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Key milestones in our club's remarkable journey since 2019
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-teal-200 transform md:-translate-x-1/2"></div>
                <div className="space-y-8">
                  {milestones.map((milestone, index) => (
                    <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} animate-fade-in`} style={{animationDelay: `${index * 0.2}s`}}>
                      <div className="flex-1 md:w-1/2">
                        <Card className="ml-12 md:ml-0 md:mr-8 hover:shadow-lg transition-shadow duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-3 mb-3">
                              <Calendar className="h-5 w-5 text-teal-700" />
                              <Badge className="bg-teal-100 text-teal-800">{milestone.year}</Badge>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-gradient-to-br from-teal-600 to-orange-500 rounded-full transform md:-translate-x-1/2 -translate-y-1/2 top-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Recognition CTA */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">Add Your Name to Our Success Story</h2>
          <p className="text-xl text-teal-100 mb-8 leading-relaxed">
            Join Meraki Gavel Club and become part of our legacy of excellence. 
            Achieve your personal and professional goals while contributing to our continued success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white px-8 py-3 text-lg rounded-lg font-semibold transition-colors">
              Join Our Club
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-teal-900 px-8 py-3 text-lg rounded-lg font-semibold transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Achievements;
