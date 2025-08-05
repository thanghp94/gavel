
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";

const ContentPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPage = async () => {
      try {
        if (slug) {
          console.log('Loading page with slug:', slug);
          console.log('Auth token exists:', !!localStorage.getItem('authToken'));
          const pageData = await api.getContentPageBySlug(slug);
          console.log('Page data loaded:', pageData);
          setPage(pageData);
        }
      } catch (error) {
        console.error("Error loading page:", error);
        setError("Page not found");
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [slug]);

  const renderContentBlock = (block: any, index: number) => {
    switch (block.type) {
      case 'title':
        return (
          <h1 key={index} className="text-3xl font-bold mb-6">
            {block.content.title}
          </h1>
        );
      
      case 'text':
        return (
          <div key={index} className="mb-6">
            <pre className="whitespace-pre-wrap font-sans">{block.content.text}</pre>
          </div>
        );
      
      case 'image':
        return (
          <div key={index} className="mb-6">
            {block.content.imageUrl && (
              <div className="space-y-2">
                <img 
                  src={block.content.imageUrl} 
                  alt={block.content.altText || 'Content image'}
                  className="max-w-full h-auto rounded-lg"
                />
                {block.content.caption && (
                  <p className="text-sm text-gray-600 italic">{block.content.caption}</p>
                )}
              </div>
            )}
          </div>
        );
      
      case 'video':
        return (
          <div key={index} className="mb-6">
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
            ) : null}
          </div>
        );
      
      case 'attachment':
        return (
          <div key={index} className="mb-6">
            {block.content.fileUrl && (
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded">
                    📎
                  </div>
                  <div>
                    <a 
                      href={block.content.fileUrl}
                      className="text-blue-600 hover:underline font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {block.content.fileName || 'Download File'}
                    </a>
                    {block.content.description && (
                      <p className="text-sm text-gray-600">{block.content.description}</p>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          <p className="text-gray-600">The page you're looking for doesn't exist or is not published.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-8">
          <CardContent>
            <div className="prose max-w-none">
              {page.blocks && page.blocks.map((block: any, index: number) => 
                renderContentBlock(block, index)
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ContentPage;
