import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExcoNavigation } from "@/components/navigation/ExcoNavigation";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Users, UserPlus, Search } from "lucide-react";

interface User {
  id: string;
  email: string;
  displayName: string;
  fullName: string;
  dateOfBirth: string;
  school: string;
  gender: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

const ExcoUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    displayName: "",
    fullName: "",
    dateOfBirth: "",
    school: "",
    gender: "",
    phone: '',
    role: "member",
  });
  
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData = await api.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.updateUserRole(userId, newRole);
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Failed to update user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await api.updateUserStatus(userId, isActive);
      toast({
        title: "Success",
        description: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      });
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Failed to update user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const createUser = async () => {
    if (!newUser.email || !newUser.displayName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const data = await api.createUser(newUser);
      toast({
        title: "User Created",
        description: `User created successfully. Temporary password: ${data.tempPassword}`,
      });
      setIsAddDialogOpen(false);
      setNewUser({ email: "", displayName: "", fullName: "", dateOfBirth: "", school: "", gender: "", phone: '', role: "member" });
      fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error('Failed to create user:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'exco':
        return 'destructive';
      case 'member':
        return 'default';
      default:
        return 'secondary';
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <ExcoNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/90">Total Users</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{users.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white cursor-pointer hover:from-green-600 hover:to-green-700 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Badge className="h-4 w-4 text-white bg-transparent border-none p-0">M</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-white/90">Active Members</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {users.filter(u => u.isActive && u.role === 'member').length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white cursor-pointer hover:from-red-600 hover:to-red-700 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Badge className="h-4 w-4 text-white bg-transparent border-none p-0">E</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-white/90">ExCo Members</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {users.filter(u => u.role === 'exco').length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>All Users</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            placeholder="user@example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="displayName">Display Name</Label>
                          <Input
                            id="displayName"
                            value={newUser.displayName}
                            onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
                            placeholder="John Doe"
                          />
                        </div>
                         <div>
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            value={newUser.fullName}
                            onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={newUser.dateOfBirth}
                            onChange={(e) => setNewUser({ ...newUser, dateOfBirth: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="school">School</Label>
                          <Input
                            id="school"
                            value={newUser.school}
                            onChange={(e) => setNewUser({ ...newUser, school: e.target.value })}
                            placeholder="University Name"
                          />
                        </div>
                         <div>
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input
                            value={newUser.phone || ''}
                            onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                            placeholder="Phone Number"
                          />
                        </div>
                        <div>
                          <Label htmlFor="gender">Gender</Label>
                          <Select value={newUser.gender} onValueChange={(value) => setNewUser({ ...newUser, gender: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="member">Member</SelectItem>
                              <SelectItem value="exco">ExCo</SelectItem>
                              <SelectItem value="guest">Guest</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={createUser}
                            disabled={isCreating}
                          >
                            {isCreating ? "Creating..." : "Create User"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading users...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Display Name</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="h-12">
                        <TableCell className="font-medium py-2 px-3 max-w-32 truncate">{user.displayName}</TableCell>
                        <TableCell className="py-2 px-3 max-w-32 truncate">{user.fullName}</TableCell>
                        <TableCell className="py-2 px-3 max-w-48 truncate text-sm">{user.email}</TableCell>
                        <TableCell className="py-2 px-3 max-w-32 truncate">{user.school || '-'}</TableCell>
                        <TableCell className="py-2 px-3 max-w-20 truncate">{user.gender || '-'}</TableCell>
                         <TableCell className="py-2 px-3 max-w-28 truncate">{user.phone || '-'}</TableCell>
                        <TableCell className="py-2 px-3">
                          <Select 
                            value={user.role} 
                            onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                          >
                            <SelectTrigger className="w-20 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="member">Member</SelectItem>
                              <SelectItem value="exco">ExCo</SelectItem>
                              <SelectItem value="guest">Guest</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="py-2 px-3">
                          <Badge variant={user.isActive ? 'default' : 'destructive'} className="text-xs">
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 px-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>User Details</DialogTitle>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Display Name</Label>
                                  <p className="text-sm">{user.displayName}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Full Name</Label>
                                  <p className="text-sm">{user.fullName || '-'}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                                  <p className="text-sm">{user.email}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Phone</Label>
                                  <p className="text-sm">{user.phone || '-'}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">School</Label>
                                  <p className="text-sm">{user.school || '-'}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Gender</Label>
                                  <p className="text-sm">{user.gender || '-'}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Date of Birth</Label>
                                  <p className="text-sm">{user.dateOfBirth || '-'}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Role</Label>
                                  <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                                  <Badge variant={user.isActive ? 'default' : 'destructive'}>
                                    {user.isActive ? 'Active' : 'Inactive'}
                                  </Badge>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Created At</Label>
                                  <p className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Last Login</Label>
                                  <p className="text-sm">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</p>
                                </div>
                              </div>
                              <div className="flex justify-end space-x-2 mt-6">
                                <Button
                                  variant="outline"
                                  onClick={() => toggleUserStatus(user.id, !user.isActive)}
                                >
                                  {user.isActive ? 'Deactivate' : 'Activate'} User
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExcoUsers;