import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Award, Calendar, Target, ArrowRight, Star, Menu, X, Phone, Mail, MapPin, Linkedin, Twitter, Instagram, Youtube } from 'lucide-react';

const Homepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/members-public', label: 'Members' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top contact bar */}
          <div className="border-b border-gray-100 py-2 hidden md:block">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+84 905 123 456</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@gavelflow.club</span>
                </div>
              </div>
              <div className="text-teal-600 font-medium">
                Premier Gavel Club Management Platform - Since 2024
              </div>
            </div>
          </div>

          {/* Main navigation */}
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-br from-teal-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-teal-600">GavelFlow</h1>
                <p className="text-sm text-purple-600">Inspiring Tomorrow's Leaders</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="font-medium transition-colors duration-300 hover:text-teal-600 text-gray-700"
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/login">
                <Button className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white px-6">
                  Member Login
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="font-medium transition-colors duration-300 hover:text-teal-600 text-gray-700"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link to="/login">
                  <Button className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white w-fit">
                    Member Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-500 via-teal-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                GavelFlow
              </h1>
              <p className="text-xl lg:text-2xl mb-4 text-teal-100 font-medium">
                Inspiring Tomorrow's Leaders, Today!
              </p>
              <p className="text-lg mb-8 text-teal-200 leading-relaxed">
                Your comprehensive Toastmasters club management platform. Streamline meetings, 
                track progress, and build leadership capabilities in a supportive digital 
                environment designed for modern Gavel Clubs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white px-8 py-3 text-lg">
                    Join Our Club
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-teal-600 px-8 py-3 text-lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <h3 className="text-2xl font-bold mb-4">Platform Features</h3>
                <ul className="space-y-3 text-teal-100">
                  <li className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Meeting Management
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Member Progress Tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Role Assignment System
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Achievement Recognition
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose GavelFlow?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide a comprehensive platform for personal and professional development 
              through structured learning and community support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
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
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About GavelFlow</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                GavelFlow is a modern, comprehensive club management platform designed specifically 
                for Toastmasters and Gavel Clubs. We understand the unique needs of leadership 
                development organizations and provide tools that streamline operations while 
                enhancing the member experience.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our platform enables clubs to manage meetings efficiently, track member progress, 
                facilitate role assignments, and celebrate achievements. With user-friendly 
                interfaces for both members and executive committees, GavelFlow transforms 
                traditional club management into a seamless digital experience.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">Trusted by clubs worldwide</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-teal-100 to-orange-50 p-8 rounded-2xl">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-bold text-teal-600 mb-4">Our Mission</h3>
                  <p className="text-gray-700 leading-relaxed">
                    To empower Gavel Clubs with innovative technology that enhances member 
                    engagement, streamlines club operations, and accelerates leadership 
                    development in a digital-first world.
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
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Club?</h2>
          <p className="text-xl text-teal-100 mb-8 leading-relaxed">
            Join GavelFlow today and experience the future of club management. 
            Streamline your operations and focus on what matters most - developing leaders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white px-8 py-3 text-lg">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-teal-600 px-8 py-3 text-lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-teal-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-12 w-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">GavelFlow</h3>
                  <p className="text-teal-200">Modern Club Management Platform</p>
                </div>
              </div>
              <p className="text-teal-100 mb-4 leading-relaxed">
                Empowering Toastmasters and Gavel Clubs worldwide with innovative technology 
                for enhanced member engagement and streamlined club operations.
              </p>
              <div className="flex space-x-4">
                <Linkedin className="h-6 w-6 text-teal-200 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="h-6 w-6 text-teal-200 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="h-6 w-6 text-teal-200 hover:text-white cursor-pointer transition-colors" />
                <Youtube className="h-6 w-6 text-teal-200 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-teal-100">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <div className="space-y-3 text-teal-100">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5" />
                  <span>support@gavelflow.com</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 mt-1" />
                  <span>Global Platform<br />Serving Clubs Worldwide</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-teal-500 mt-8 pt-8 text-center text-teal-200">
            <p>&copy; 2024 GavelFlow. All rights reserved. | Empowering clubs since 2024</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;