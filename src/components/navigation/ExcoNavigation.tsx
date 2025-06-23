
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  Home, 
  Users, 
  Calendar, 
  Settings, 
  FileText, 
  BookOpen,
  TrendingUp,
  Globe,
  LogOut,
  Bell,
  Shield
} from "lucide-react";

export const ExcoNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { icon: Home, label: "Dashboard", href: "/exco/dashboard" },
    { icon: Users, label: "Members", href: "/exco/users" },
    { icon: Calendar, label: "Meetings", href: "/exco/meetings" },
    { icon: BookOpen, label: "Content", href: "/exco/content" },
    { icon: Globe, label: "Public Pages", href: "/exco/cms" },
    { icon: FileText, label: "Tasks", href: "/exco/tasks" },
    { icon: TrendingUp, label: "Analytics", href: "/exco/analytics" }
  ];

  const NavItems = ({ mobile = false }) => (
    <div className={`${mobile ? 'space-y-2' : 'hidden md:flex md:space-x-6'}`}>
      {navigationItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.label}
            to={item.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-orange-100 text-orange-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            } ${mobile ? 'w-full' : ''}`}
            onClick={() => mobile && setIsOpen(false)}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
            {isActive && <Badge variant="secondary" className="ml-auto">Active</Badge>}
          </Link>
        );
      })}
    </div>
  );

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/exco/dashboard" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GF</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">GavelFlow</h1>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-orange-600" />
                <p className="text-xs text-orange-600 font-medium">ExCo Portal</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavItems />

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Admin User</div>
                <div className="text-xs text-orange-600 font-medium">ExCo Member</div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">AU</span>
              </div>
            </div>

            <Button variant="ghost" size="sm" className="hidden md:flex">
              <LogOut className="h-4 w-4" />
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">AU</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Admin User</div>
                        <div className="text-sm text-orange-600 font-medium flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          ExCo Member
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <nav className="flex-1">
                    <NavItems mobile={true} />
                  </nav>
                  
                  <div className="pt-4 border-t">
                    <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
