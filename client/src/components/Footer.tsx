import { Phone, Mail, MapPin, Linkedin, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-teal-600 to-purple-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/lovable-uploads/82b9e3d3-86d2-46b1-a35e-dfbd7219bcad.png" 
                alt="Meraki Gavel Club Logo" 
                className="h-12 w-12"
              />
              <div>
                <h3 className="text-xl font-bold">Meraki Gavel Club</h3>
                <p className="text-teal-200">Premier Gavel Club in Da Nang, Vietnam</p>
              </div>
            </div>
            <p className="text-teal-100 mb-4 leading-relaxed">
              Since 2019, we've been inspiring tomorrow's leaders today through structured learning, 
              speaking opportunities, and leadership development in a supportive community environment.
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
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/ex-comm" className="hover:text-white transition-colors">Executive Committee</a></li>
              <li><a href="/members" className="hover:text-white transition-colors">Members</a></li>
              <li><a href="/achievements" className="hover:text-white transition-colors">Achievements</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-teal-100">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5" />
                <span>+84 905 123 456</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5" />
                <span>info@merakigavel.club</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-1" />
                <span>Da Nang City, Vietnam</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-teal-500 mt-8 pt-8 text-center text-teal-200">
          <p>&copy; 2024 Meraki Gavel Club. All rights reserved. | Proudly serving since 2019</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;