import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { exhibitsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Exhibit {
  _id: string;
  name: string;
  description: string;
  image?: string;
  location?: string;
  category?: string;
}

const AdminExhibits = () => {
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExhibit, setEditingExhibit] = useState<Exhibit | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', location: '', category: '' });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchExhibits();
  }, []);

  const fetchExhibits = async () => {
    try {
      const response = await exhibitsAPI.getAll();
      setExhibits(response.data?.exhibits || []);
    } catch (error) {
      setExhibits([
        { _id: '1', name: 'Ancient Egypt', description: 'Egyptian artifacts', location: 'Wing A', category: 'History' },
        { _id: '2', name: 'Renaissance Art', description: 'Italian masterpieces', location: 'Wing B', category: 'Art' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('location', formData.location);
      submitData.append('category', formData.category);
      
      if (editingExhibit) {
        await exhibitsAPI.update(editingExhibit._id, submitData);
        toast({ title: 'Exhibit Updated', description: 'Exhibit has been updated successfully.' });
      } else {
        await exhibitsAPI.create(submitData);
        toast({ title: 'Exhibit Created', description: 'New exhibit has been created successfully.' });
      }
      fetchExhibits();
      setIsModalOpen(false);
      setFormData({ name: '', description: '', location: '', category: '' });
      setEditingExhibit(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exhibit?')) return;
    try {
      await exhibitsAPI.delete(id);
      toast({ title: 'Exhibit Deleted', description: 'Exhibit has been deleted.' });
      fetchExhibits();
    } catch (error) {
      toast({ title: 'Error', description: 'Could not delete exhibit.', variant: 'destructive' });
    }
  };

  const openEdit = (exhibit: Exhibit) => {
    setEditingExhibit(exhibit);
    setFormData({
      name: exhibit.name,
      description: exhibit.description,
      location: exhibit.location || '',
      category: exhibit.category || '',
    });
    setIsModalOpen(true);
  };

  const filteredExhibits = exhibits.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Exhibits</h1>
          <p className="text-muted-foreground">Manage museum exhibits</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gold" onClick={() => { setEditingExhibit(null); setFormData({ name: '', description: '', location: '', category: '' }); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Exhibit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingExhibit ? 'Edit Exhibit' : 'Add New Exhibit'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
              </div>
              <div>
                <Label>Location</Label>
                <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
              </div>
              <Button type="submit" className="w-full btn-gold" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingExhibit ? 'Update' : 'Create'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search exhibits..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left px-6 py-4 font-medium">Name</th>
                  <th className="text-left px-6 py-4 font-medium hidden md:table-cell">Category</th>
                  <th className="text-left px-6 py-4 font-medium hidden lg:table-cell">Location</th>
                  <th className="text-right px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExhibits.map((exhibit, i) => (
                  <motion.tr
                    key={exhibit._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-t border-border"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{exhibit.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{exhibit.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="px-2 py-1 bg-accent/10 text-accent text-sm rounded">{exhibit.category || '—'}</span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-muted-foreground">{exhibit.location || '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(exhibit)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(exhibit._id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExhibits;
