import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";

const ExcoAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    status: "draft"
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await api.getAnnouncements();
        setAnnouncements(data);
        setFilteredAnnouncements(data);
      } catch (error) {
        console.error("Failed to fetch announcements", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filter = e.target.value.toLowerCase();
    setFilteredAnnouncements(
      announcements.filter(a =>
        a.title.toLowerCase().includes(filter) ||
        a.content.toLowerCase().includes(filter)
      )
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewAnnouncement(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewAnnouncement(prev => ({
      ...prev,
      status: e.target.value
    }));
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await api.updateAnnouncement(editingId, newAnnouncement);
      } else {
        await api.createAnnouncement(newAnnouncement);
      }
      const data = await api.getAnnouncements();
      setAnnouncements(data);
      setFilteredAnnouncements(data);
      setNewAnnouncement({ title: "", content: "", status: "draft" });
      setEditingId(null);
    } catch (error) {
      console.error("Failed to save announcement", error);
    }
  };

  const handleEdit = (announcement: any) => {
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content,
      status: announcement.status || "draft"
    });
    setEditingId(announcement.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Filter announcements..."
              onChange={handleFilterChange}
              className="mb-4"
            />
            {loading ? (
              <p>Loading announcements...</p>
            ) : filteredAnnouncements.length === 0 ? (
              <p>No announcements found.</p>
            ) : (
              filteredAnnouncements.map(a => (
                <div key={a.id} className="border rounded p-3 mb-3">
                  <h4 className="font-semibold">{a.title}</h4>
                  <p className="text-sm text-gray-700">{a.content}</p>
                  <p className="text-xs text-gray-500 mt-1">Status: {a.status}</p>
                  <Button size="sm" onClick={() => handleEdit(a)}>Edit</Button>
                </div>
              ))
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">{editingId ? "Edit Announcement" : "Add New Announcement"}</h3>
            <div className="mb-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={newAnnouncement.title}
                onChange={handleInputChange}
                placeholder="Announcement title"
              />
            </div>
            <div className="mb-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={newAnnouncement.content}
                onChange={handleInputChange}
                placeholder="Announcement content"
                rows={4}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={newAnnouncement.status}
                onChange={handleStatusChange}
                className="border rounded px-2 py-1"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <Button onClick={handleSave}>
              {editingId ? "Update Announcement" : "Add Announcement"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExcoAnnouncements;
