import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Video, FileText, Users, Plus, Edit, Trash2, Eye, Upload, PenTool } from "lucide-react";
import { ExcoNavigation } from "@/components/navigation/ExcoNavigation";
import ContentBlockEditor from "@/components/ContentBlockEditor";
import { api } from "@/lib/api";

const AdminContent = () => {
  const [learningPaths, setLearningPaths] = useState([
    {
      id: 1,
      title: "Competent Communication",
      description: "Master the fundamentals of effective speaking",
      projects: 10,
      status: "active",
      category: "Communication"
    },
    {
      id: 2,
      title: "Competent Leadership",
      description: "Develop essential leadership skills",
      projects: 10,
      status: "active",
      category: "Leadership"
    }
  ]);

  const [resources, setResources] = useState([
    {
      id: 1,
      title: "Table Topics Techniques",
      type: "Video",
      category: "Speaking Skills",
      status: "published",
      duration: "15 min",
      uploads: 25
    },
    {
      id: 2,
      title: "Evaluation Best Practices",
      type: "PDF",
      category: "Evaluation",
      status: "published",
      duration: "10 min read",
      uploads: 40
    }
  ]);

  const [isAddPathDialogOpen, setIsAddPathDialogOpen] = useState(false);
  const [isAddResourceDialogOpen, setIsAddResourceDialogOpen] = useState(false);
  const [isContentEditorOpen, setIsContentEditorOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);

  const [newPath, setNewPath] = useState({
    title: "",
    description: "",
    category: "",
    projects: ""
  });

  const [newResource, setNewResource] = useState({
    title: "",
    type: "",
    category: "",
    duration: "",
    description: "",
    file: null as File | null
  });

  const [contentPages, setContentPages] = useState([]);

  const [newPageData, setNewPageData] = useState({
    title: "",
    slug: "",
    blocks: [],
    isPublished: false
  });

  useEffect(() => {
    loadContentPages();
  }, []);

  const loadContentPages = async () => {
    try {
      const pages = await api.getContentPages();
      setContentPages(pages);
    } catch (error) {
      console.error("Error loading content pages:", error);
    }
  };

  const handleAddPath = () => {
    const path = {
      id: learningPaths.length + 1,
      ...newPath,
      projects: parseInt(newPath.projects),
      status: "active"
    };
    setLearningPaths([...learningPaths, path]);
    setNewPath({ title: "", description: "", category: "", projects: "" });
    setIsAddPathDialogOpen(false);
  };

  const handleAddResource = () => {
    const resource = {
      id: resources.length + 1,
      ...newResource,
      status: "published",
      uploads: 0,
      file: undefined
    };
    setResources([...resources, resource]);
    setNewResource({
      title: "",
      type: "",
      category: "",
      duration: "",
      description: "",
      file: null
    });
    setIsAddResourceDialogOpen(false);
  };

  const handleCreateNewPage = () => {
    setEditingPage(null);
    setNewPageData({
      title: "",
      slug: "",
      blocks: [],
      isPublished: false
    });
    setIsContentEditorOpen(true);
  };

  const handleEditPage = (page: any) => {
    setEditingPage(page);
    setNewPageData({
      title: page.title,
      slug: page.slug,
      blocks: page.blocks || [],
      isPublished: page.status === 'published'
    });
    setIsContentEditorOpen(true);
  };

  const handleSavePage = async (blocks: any[]) => {
    const pageData = {
      ...newPageData,
      blocks,
      lastModified: new Date().toISOString().split('T')[0],
      status: newPageData.isPublished ? 'published' : 'draft'
    };

    try {
      if (editingPage) {
        // Update existing page
        await api.updateContentPage(editingPage.id, pageData);
        setContentPages(prev =>
          prev.map(page =>
            page.id === editingPage.id
              ? { ...page, ...pageData }
              : page
          )
        );
      } else {
        // Create new page
        const newPage = await api.createContentPage(pageData);
        setContentPages(prev => [...prev, newPage]);
      }

      setIsContentEditorOpen(false);
      setEditingPage(null);
      loadContentPages(); // Reload pages to reflect changes
    } catch (error) {
      console.error("Error saving content page:", error);
      // Optionally, display an error message to the user
    }
  };

  const handleDeletePage = async (pageId: string) => {
    try {
      await api.deleteContentPage(pageId);
      setContentPages(prev => prev.filter(page => page.id !== pageId));
    } catch (error) {
      console.error("Error deleting content page:", error);
      // Optionally, display an error message to the user
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video': return Video;
      case 'PDF': return FileText;
      case 'Workshop': return Users;
      default: return BookOpen;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ExcoNavigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
          <p className="text-gray-600">Manage learning paths, resources, and educational content</p>
        </div>

        <Tabs defaultValue="pages" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pages">Content Pages</TabsTrigger>
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Content Pages</h2>
              <Button onClick={handleCreateNewPage} className="flex items-center gap-2">
                <PenTool className="h-4 w-4" />
                Create New Page
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page Title</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contentPages.map((page) => (
                      <TableRow key={page.id}>
                        <TableCell>
                          <div className="font-medium">{page.title}</div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            /{page.slug}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(page.status)}>
                            {page.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{page.lastModified}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditPage(page)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeletePage(page.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Content Editor Dialog */}
            <Dialog open={isContentEditorOpen} onOpenChange={setIsContentEditorOpen}>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingPage ? `Edit: ${editingPage.title}` : 'Create New Page'}
                  </DialogTitle>
                  <DialogDescription>
                    Use the content editor to create rich, interactive pages with multiple content blocks.
                  </DialogDescription>
                </DialogHeader>

                <ContentBlockEditor
                  initialBlocks={newPageData.blocks}
                  onSave={handleSavePage}
                  pageTitle={newPageData.title}
                  onPageTitleChange={(title) => setNewPageData(prev => ({ ...prev, title, slug: title.toLowerCase().replace(/\s+/g, '-') }))}
                  isPublished={newPageData.isPublished}
                  onPublishChange={(published) => setNewPageData(prev => ({ ...prev, isPublished: published }))}
                />
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="paths" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Learning Paths</h2>
              <Dialog open={isAddPathDialogOpen} onOpenChange={setIsAddPathDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Learning Path
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Learning Path</DialogTitle>
                    <DialogDescription>
                      Add a new learning path for members
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="path-title">Title</Label>
                      <Input
                        id="path-title"
                        value={newPath.title}
                        onChange={(e) => setNewPath({...newPath, title: e.target.value})}
                        placeholder="Advanced Communication"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="path-description">Description</Label>
                      <Textarea
                        id="path-description"
                        value={newPath.description}
                        onChange={(e) => setNewPath({...newPath, description: e.target.value})}
                        placeholder="Develop advanced speaking and communication skills..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="path-category">Category</Label>
                        <Select onValueChange={(value) => setNewPath({...newPath, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Communication">Communication</SelectItem>
                            <SelectItem value="Leadership">Leadership</SelectItem>
                            <SelectItem value="Evaluation">Evaluation</SelectItem>
                            <SelectItem value="Special">Special Skills</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="path-projects">Number of Projects</Label>
                        <Input
                          id="path-projects"
                          type="number"
                          value={newPath.projects}
                          onChange={(e) => setNewPath({...newPath, projects: e.target.value})}
                          placeholder="10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsAddPathDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddPath}>
                      Create Path
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Learning Path</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Projects</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {learningPaths.map((path) => (
                      <TableRow key={path.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{path.title}</div>
                            <div className="text-sm text-gray-600">{path.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{path.category}</TableCell>
                        <TableCell>{path.projects}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(path.status)}>
                            {path.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Learning Resources</h2>
              <Dialog open={isAddResourceDialogOpen} onOpenChange={setIsAddResourceDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Resource
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Learning Resource</DialogTitle>
                    <DialogDescription>
                      Upload a new learning resource for members
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="resource-title">Title</Label>
                        <Input
                          id="resource-title"
                          value={newResource.title}
                          onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                          placeholder="Advanced Speaking Techniques"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="resource-type">Type</Label>
                        <Select onValueChange={(value) => setNewResource({...newResource, type: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Video">Video</SelectItem>
                            <SelectItem value="PDF">PDF Guide</SelectItem>
                            <SelectItem value="Workshop">Workshop</SelectItem>
                            <SelectItem value="Interactive">Interactive Course</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="resource-category">Category</Label>
                        <Select onValueChange={(value) => setNewResource({...newResource, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Speaking Skills">Speaking Skills</SelectItem>
                            <SelectItem value="Leadership">Leadership</SelectItem>
                            <SelectItem value="Evaluation">Evaluation</SelectItem>
                            <SelectItem value="Table Topics">Table Topics</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="resource-duration">Duration</Label>
                        <Input
                          id="resource-duration"
                          value={newResource.duration}
                          onChange={(e) => setNewResource({...newResource, duration: e.target.value})}
                          placeholder="20 min"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resource-description">Description</Label>
                      <Textarea
                        id="resource-description"
                        value={newResource.description}
                        onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                        placeholder="Detailed description of the resource..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resource-file">Upload File</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PDF, Video, or other educational content</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsAddResourceDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddResource}>
                      Add Resource
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resource</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources.map((resource) => {
                      const IconComponent = getTypeIcon(resource.type);
                      return (
                        <TableRow key={resource.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <IconComponent className="h-5 w-5 text-blue-600" />
                              <div className="font-medium">{resource.title}</div>
                            </div>
                          </TableCell>
                          <TableCell>{resource.type}</TableCell>
                          <TableCell>{resource.category}</TableCell>
                          <TableCell>{resource.duration}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(resource.status)}>
                              {resource.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{resource.uploads}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-semibold">Content Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{resources.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all categories
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {resources.reduce((sum, r) => sum + r.uploads, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Paths</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {learningPaths.filter(p => p.status === 'active').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Learning paths
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminContent;