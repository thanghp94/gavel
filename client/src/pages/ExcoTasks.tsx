
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExcoNavigation } from "@/components/navigation/ExcoNavigation";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { 
  Plus, 
  Calendar, 
  User, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  MoreVertical,
  X
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigneeId?: string;
  teamId?: string;
  assignee?: { id: string; displayName: string };
  team?: { id: string; name: string; type: string };
  dueDate: string;
  labels: string[];
  createdAt?: string;
  updatedAt?: string;
}

const ExcoTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    teamId: '',
    assigneeId: '',
    labels: [] as string[]
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
    fetchTeams();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const data = await api.getTeams();
      setTeams(data);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: 'todo' as const,
        dueDate: newTask.dueDate || null,
        teamId: newTask.teamId && newTask.teamId !== 'none' ? newTask.teamId : null,
        assigneeId: newTask.assigneeId && newTask.assigneeId !== 'none' ? newTask.assigneeId : null,
        labels: newTask.labels
      };

      await api.createTask(taskData);
      
      // Reset form
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        teamId: '',
        assigneeId: '',
        labels: []
      });
      setIsCreateTaskOpen(false);
      
      // Refresh tasks
      await fetchTasks();
      
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  };

  const columns = [
    { id: 'todo', title: 'To Do', icon: AlertCircle, color: 'text-orange-600' },
    { id: 'in-progress', title: 'In Progress', icon: Clock, color: 'text-blue-600' },
    { id: 'done', title: 'Done', icon: CheckCircle2, color: 'text-green-600' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dateString: string) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    return dueDate < today;
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    try {
      await api.updateTask(draggedTask.id, { status: newStatus as 'todo' | 'in-progress' | 'done' });
      await fetchTasks();
      
      toast({
        title: "Success",
        description: `Task moved to ${newStatus.replace('-', ' ')}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
    
    setDraggedTask(null);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      await api.updateTask(taskId, updates);
      await fetchTasks();
      
      // Update selected task if it's the one being updated
      if (selectedTask?.id === taskId) {
        setSelectedTask(prev => prev ? { ...prev, ...updates } : null);
      }
      
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ExcoNavigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Task Management
            </h1>
            <p className="text-gray-600">
              Organize and track ExCo tasks across different stages
            </p>
          </div>
          <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Add a new task to track progress
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="task-title">Title</Label>
                  <Input
                    id="task-title"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Task title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-description">Description</Label>
                  <Textarea
                    id="task-description"
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Task description..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-priority">Priority</Label>
                    <Select value={newTask.priority} onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-due">Due Date</Label>
                    <Input
                      id="task-due"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-team">Team</Label>
                    <Select value={newTask.teamId} onValueChange={(value) => setNewTask(prev => ({ ...prev, teamId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Team</SelectItem>
                        {teams.map(team => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-assignee">Assignee</Label>
                    <Select value={newTask.assigneeId} onValueChange={(value) => setNewTask(prev => ({ ...prev, assigneeId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Assignee</SelectItem>
                        {users.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateTaskOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTask}>
                  Create Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p className="text-sm text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">To Do</p>
                  <p className="text-2xl font-bold text-orange-600">{getTasksByStatus('todo').length}</p>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{getTasksByStatus('in-progress').length}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{getTasksByStatus('done').length}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);
            return (
              <div 
                key={column.id} 
                className="bg-white rounded-lg border"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <column.icon className={`h-5 w-5 ${column.color}`} />
                      <h3 className="font-semibold text-gray-900">{column.title}</h3>
                      <Badge variant="secondary" className="ml-2">
                        {columnTasks.length}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 space-y-3 min-h-[400px]">
                  {columnTasks.map((task) => (
                    <Card 
                      key={task.id} 
                      className={`hover:shadow-md transition-shadow cursor-pointer ${
                        draggedTask?.id === task.id ? 'opacity-50' : ''
                      }`}
                      draggable
                      onDragStart={() => handleDragStart(task)}
                      onClick={() => handleTaskClick(task)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm leading-tight">
                            {task.title}
                          </h4>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {task.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {task.labels.map((label) => (
                            <Badge 
                              key={label} 
                              variant="outline" 
                              className="text-xs px-2 py-0.5"
                            >
                              {label}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge 
                              className={`text-xs px-2 py-1 ${getPriorityColor(task.priority)}`}
                              variant="outline"
                            >
                              {task.priority}
                            </Badge>
                            <div className={`flex items-center gap-1 text-xs ${
                              isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-500'
                            }`}>
                              <Calendar className="h-3 w-3" />
                              {formatDate(task.dueDate)}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <User className="h-3 w-3" />
                            <span className="truncate max-w-[80px]">
                              {task.assignee?.displayName?.split(' ')[0] || 'Unassigned'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No tasks in this column</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Task Detail Dialog */}
        <Dialog open={isTaskDetailOpen} onOpenChange={setIsTaskDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedTask?.title}</span>
                <Badge className={`${getPriorityColor(selectedTask?.priority || 'medium')}`}>
                  {selectedTask?.priority}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            
            {selectedTask && (
              <div className="space-y-6">
                {/* Task Status */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={selectedTask.status} 
                    onValueChange={(value) => handleUpdateTask(selectedTask.id, { status: value as 'todo' | 'in-progress' | 'done' })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Task Description */}
                <div className="space-y-2">
                  <Label>Description</Label>
                  <div className="p-3 bg-gray-50 rounded-md min-h-[80px]">
                    <p className="text-sm text-gray-700">
                      {selectedTask.description || 'No description provided'}
                    </p>
                  </div>
                </div>

                {/* Task Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Assignee</Label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {selectedTask.assignee?.displayName || 'Unassigned'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Team</Label>
                    <div className="text-sm">
                      {selectedTask.team?.name || 'No team assigned'}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className={`text-sm ${
                        isOverdue(selectedTask.dueDate) ? 'text-red-600' : 'text-gray-700'
                      }`}>
                        {formatDate(selectedTask.dueDate)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select 
                      value={selectedTask.priority} 
                      onValueChange={(value) => handleUpdateTask(selectedTask.id, { priority: value as 'low' | 'medium' | 'high' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Labels */}
                {selectedTask.labels.length > 0 && (
                  <div className="space-y-2">
                    <Label>Labels</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedTask.labels.map((label) => (
                        <Badge key={label} variant="outline" className="text-xs">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Created/Updated dates */}
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div>
                    <Label className="text-xs">Created</Label>
                    <p>{selectedTask.createdAt ? new Date(selectedTask.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Updated</Label>
                    <p>{selectedTask.updatedAt ? new Date(selectedTask.updatedAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default ExcoTasks;
