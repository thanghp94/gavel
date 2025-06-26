
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { 
  Menu, 
  Home, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  MessageSquare, 
  User, 
  LogOut,
  Bell
} from "lucide-react";

export const MemberNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    api.logout();
    navigate('/');
  };

  const navigationItems = [
    { icon: Home, label: "Dashboard", href: "/member/dashboard", active: true },
    { icon: Calendar, label: "Meetings", href: "/member/meetings" },
    { icon: BookOpen, label: "Learning", href: "/member/learning" },
    { icon: TrendingUp, label: "Progress", href: "/member/progress" },
    { icon: MessageSquare, label: "Reflections", href: "/member/reflections" },
    { icon: User, label: "Profile", href: "/member/profile" }
  ];

  const NavItems = ({ mobile = false }) => (
    <div className={`${mobile ? 'space-y-2' : 'hidden md:flex md:space-x-8'}`}>
      {navigationItems.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            item.active
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          } ${mobile ? 'w-full' : ''}`}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
          {item.active && <Badge variant="secondary" className="ml-auto">Active</Badge>}
        </a>
      ))}
    </div>
  );

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GF</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">GavelFlow</h1>
              <p className="text-xs text-gray-500">Member Portal</p>
            </div>
          </div>

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
                <div className="text-sm font-medium text-gray-900">John Doe</div>
                <div className="text-xs text-gray-500">Active Member</div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
            </div>

            <Button variant="ghost" size="sm" className="hidden md:flex" onClick={handleLogout}>
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
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">JD</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">John Doe</div>
                        <div className="text-sm text-gray-500">Active Member</div>
                      </div>
                    </div>
                  </div>
                  
                  <nav className="flex-1">
                    <NavItems mobile={true} />
                  </nav>
                  
                  <div className="pt-4 border-t">
                    <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
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
