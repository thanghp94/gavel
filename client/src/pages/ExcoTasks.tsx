
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExcoNavigation } from "@/components/navigation/ExcoNavigation";
import { 
  Plus, 
  Calendar, 
  User, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  MoreVertical
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  labels: string[];
}

const ExcoTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Update club website content',
      description: 'Review and update the main page content with latest club information',
      assignee: 'Mike Chen',
      dueDate: '2024-06-28',
      priority: 'high',
      status: 'todo',
      labels: ['Website', 'Content']
    },
    {
      id: '2',
      title: 'Prepare evaluation forms',
      description: 'Create forms for member speech evaluations',
      assignee: 'Lisa Park',
      dueDate: '2024-06-30',
      priority: 'medium',
      status: 'in-progress',
      labels: ['Forms', 'Evaluation']
    },
    {
      id: '3',
      title: 'Review member feedback',
      description: 'Analyze feedback from last meeting and prepare summary',
      assignee: 'John Smith',
      dueDate: '2024-07-02',
      priority: 'low',
      status: 'todo',
      labels: ['Feedback', 'Analysis']
    },
    {
      id: '4',
      title: 'Schedule guest speaker',
      description: 'Contact and confirm guest speaker for next month',
      assignee: 'Sarah Johnson',
      dueDate: '2024-06-25',
      priority: 'high',
      status: 'done',
      labels: ['Speaker', 'Event']
    },
    {
      id: '5',
      title: 'Update meeting minutes template',
      description: 'Revise the template based on recent feedback',
      assignee: 'Mike Chen',
      dueDate: '2024-06-29',
      priority: 'medium',
      status: 'in-progress',
      labels: ['Template', 'Minutes']
    }
  ]);

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
          <Button className="bg-orange-600 hover:bg-orange-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
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
              <div key={column.id} className="bg-white rounded-lg border">
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
                    <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium text-gray-900 text-sm leading-tight">
                            {task.title}
                          </h4>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                          {task.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
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
                              {task.assignee.split(' ')[0]}
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
      </main>
    </div>
  );
};

export default ExcoTasks;
