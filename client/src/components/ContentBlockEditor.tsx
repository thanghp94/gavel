
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Type, 
  Image, 
  FileText, 
  Paperclip, 
  Video,
  GripVertical,
  Eye,
  Save
} from "lucide-react";

interface ContentBlock {
  id: string;
  type: 'title' | 'text' | 'image' | 'video' | 'attachment';
  content: {
    title?: string;
    text?: string;
    imageUrl?: string;
    imageAlt?: string;
    videoUrl?: string;
    videoTitle?: string;
    attachmentUrl?: string;
    attachmentName?: string;
    attachmentSize?: string;
  };
}

interface ContentBlockEditorProps {
  initialBlocks?: ContentBlock[];
  onSave: (blocks: ContentBlock[]) => void;
  pageTitle: string;
  onPageTitleChange: (title: string) => void;
  isPublished: boolean;
  onPublishChange: (published: boolean) => void;
}

const ContentBlockEditor = ({ 
  initialBlocks = [], 
  onSave, 
  pageTitle, 
  onPageTitleChange,
  isPublished,
  onPublishChange
}: ContentBlockEditorProps) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedBlockType, setSelectedBlockType] = useState<ContentBlock['type']>('title');

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addBlock = useCallback((type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: generateId(),
      type,
      content: {}
    };
    setBlocks(prev => [...prev, newBlock]);
  }, []);

  const updateBlock = useCallback((id: string, content: ContentBlock['content']) => {
    setBlocks(prev => 
      prev.map(block => 
        block.id === id ? { ...block, content: { ...block.content, ...content } } : block
      )
    );
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setBlocks(prev => prev.filter(block => block.id !== id));
  }, []);

  const moveBlock = useCallback((id: string, direction: 'up' | 'down') => {
    setBlocks(prev => {
      const index = prev.findIndex(block => block.id === id);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const newBlocks = [...prev];
      [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
      return newBlocks;
    });
  }, []);

  const renderBlockEditor = (block: ContentBlock, index: number) => {
    const isFirst = index === 0;
    const isLast = index === blocks.length - 1;

    return (
      <Card key={block.id} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-gray-400" />
              <div className="flex items-center gap-2">
                {block.type === 'title' && <Type className="h-4 w-4" />}
                {block.type === 'text' && <FileText className="h-4 w-4" />}
                {block.type === 'image' && <Image className="h-4 w-4" />}
                {block.type === 'video' && <Video className="h-4 w-4" />}
                {block.type === 'attachment' && <Paperclip className="h-4 w-4" />}
                <span className="font-medium capitalize">{block.type} Block</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => moveBlock(block.id, 'up')}
                disabled={isFirst}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => moveBlock(block.id, 'down')}
                disabled={isLast}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteBlock(block.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {block.type === 'title' && (
            <div className="space-y-2">
              <Label>Title Text</Label>
              <Input
                value={block.content.title || ''}
                onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                placeholder="Enter title text"
              />
            </div>
          )}
          
          {block.type === 'text' && (
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={block.content.text || ''}
                onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                placeholder="Enter content text"
                rows={6}
              />
            </div>
          )}
          
          {block.type === 'image' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={block.content.imageUrl || ''}
                  onChange={(e) => updateBlock(block.id, { imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label>Alt Text</Label>
                <Input
                  value={block.content.imageAlt || ''}
                  onChange={(e) => updateBlock(block.id, { imageAlt: e.target.value })}
                  placeholder="Describe the image"
                />
              </div>
              {block.content.imageUrl && (
                <div className="border rounded-lg p-4">
                  <img 
                    src={block.content.imageUrl} 
                    alt={block.content.imageAlt}
                    className="max-w-full h-auto max-h-48 object-contain"
                  />
                </div>
              )}
            </div>
          )}
          
          {block.type === 'video' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Video URL</Label>
                <Input
                  value={block.content.videoUrl || ''}
                  onChange={(e) => updateBlock(block.id, { videoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              <div className="space-y-2">
                <Label>Video Title</Label>
                <Input
                  value={block.content.videoTitle || ''}
                  onChange={(e) => updateBlock(block.id, { videoTitle: e.target.value })}
                  placeholder="Video title"
                />
              </div>
            </div>
          )}
          
          {block.type === 'attachment' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Attachment URL</Label>
                <Input
                  value={block.content.attachmentUrl || ''}
                  onChange={(e) => updateBlock(block.id, { attachmentUrl: e.target.value })}
                  placeholder="https://example.com/document.pdf"
                />
              </div>
              <div className="space-y-2">
                <Label>File Name</Label>
                <Input
                  value={block.content.attachmentName || ''}
                  onChange={(e) => updateBlock(block.id, { attachmentName: e.target.value })}
                  placeholder="document.pdf"
                />
              </div>
              <div className="space-y-2">
                <Label>File Size</Label>
                <Input
                  value={block.content.attachmentSize || ''}
                  onChange={(e) => updateBlock(block.id, { attachmentSize: e.target.value })}
                  placeholder="2.5 MB"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderPreviewBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'title':
        return <h2 className="text-2xl font-bold mb-4">{block.content.title}</h2>;
      
      case 'text':
        return <div className="mb-6 whitespace-pre-wrap">{block.content.text}</div>;
      
      case 'image':
        return (
          <div className="mb-6">
            {block.content.imageUrl && (
              <img 
                src={block.content.imageUrl} 
                alt={block.content.imageAlt}
                className="max-w-full h-auto rounded-lg"
              />
            )}
          </div>
        );
      
      case 'video':
        return (
          <div className="mb-6">
            {block.content.videoUrl ? (
              <div className="space-y-2">
                {block.content.videoTitle && (
                  <h4 className="font-medium">{block.content.videoTitle}</h4>
                )}
                {block.content.videoUrl.includes('youtube.com') || block.content.videoUrl.includes('youtu.be') ? (
                  <div className="aspect-video">
                    <iframe
                      src={block.content.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                      title={block.content.videoTitle || 'Video'}
                    />
                  </div>
                ) : (
                  <video 
                    controls 
                    className="w-full rounded-lg"
                    src={block.content.videoUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ) : (
              <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed">
                <Video className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                <p className="text-center text-gray-600">{block.content.videoTitle || 'Video Content'}</p>
                <p className="text-center text-sm text-gray-500">No video URL provided</p>
              </div>
            )}
          </div>
        );
      
      case 'attachment':
        return (
          <div className="mb-6">
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
              <Paperclip className="h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <p className="font-medium">{block.content.attachmentName}</p>
                <p className="text-sm text-gray-500">{block.content.attachmentSize}</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <Card>
        <CardHeader>
          <CardTitle>Page Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Page Title</Label>
            <Input
              value={pageTitle}
              onChange={(e) => onPageTitleChange(e.target.value)}
              placeholder="Enter page title"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Label>Publish Status</Label>
            <Select 
              value={isPublished ? 'published' : 'draft'} 
              onValueChange={(value) => onPublishChange(value === 'published')}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Add Block Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Add Content Block</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => addBlock('title')}
              className="flex items-center gap-2"
            >
              <Type className="h-4 w-4" />
              Title
            </Button>
            <Button
              variant="outline"
              onClick={() => addBlock('text')}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Text
            </Button>
            <Button
              variant="outline"
              onClick={() => addBlock('image')}
              className="flex items-center gap-2"
            >
              <Image className="h-4 w-4" />
              Image
            </Button>
            <Button
              variant="outline"
              onClick={() => addBlock('video')}
              className="flex items-center gap-2"
            >
              <Video className="h-4 w-4" />
              Video
            </Button>
            <Button
              variant="outline"
              onClick={() => addBlock('attachment')}
              className="flex items-center gap-2"
            >
              <Paperclip className="h-4 w-4" />
              Attachment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Blocks */}
      <div className="space-y-4">
        {blocks.map((block, index) => renderBlockEditor(block, index))}
        
        {blocks.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center text-gray-500">
                <Plus className="h-8 w-8 mx-auto mb-2" />
                <p>No content blocks yet. Add your first block above.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button onClick={() => onSave(blocks)} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Page
        </Button>
        
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Page Preview</DialogTitle>
              <DialogDescription>
                Preview how your page will look to visitors
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-6">
              <h1 className="text-3xl font-bold mb-6">{pageTitle}</h1>
              {blocks.map(block => (
                <div key={block.id}>
                  {renderPreviewBlock(block)}
                </div>
              ))}
              
              {blocks.length === 0 && (
                <p className="text-gray-500 italic">No content blocks to preview</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ContentBlockEditor;
