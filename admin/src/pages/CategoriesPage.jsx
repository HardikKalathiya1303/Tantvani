import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Tags } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

function CategoryModal({ category, onClose, onSave }) {
  const [form, setForm] = useState({ name: category?.name || '', description: category?.description || '', sortOrder: category?.sortOrder || 0, isActive: category?.isActive ?? true });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const f = (key) => (e) => { const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value; setForm(p => ({ ...p, [key]: v })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      if (category?._id) {
        await api.put(`/categories/${category._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category updated');
      } else {
        await api.post('/categories', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category created');
      }
      onSave();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md bg-white shadow-2xl">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-cormorant text-2xl">{category ? 'Edit Category' : 'Add Category'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Name *</label>
            <input type="text" value={form.name} onChange={f('name')} required className="input" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={form.description} onChange={f('description')} rows={2} className="input resize-none" />
          </div>
          <div>
            <label className="label">Sort Order</label>
            <input type="number" value={form.sortOrder} onChange={f('sortOrder')} className="input" />
          </div>
          <div>
            <label className="label">Category Image</label>
            <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-wine file:text-white file:text-sm file:cursor-pointer" />
            {category?.image && <img src={category.image} alt="" className="w-20 h-24 object-cover mt-2 border border-gray-200" />}
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={!!form.isActive} onChange={f('isActive')} className="w-4 h-4 accent-wine" />
            <span className="font-jost text-sm text-gray-700">Active</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Saving...' : category ? 'Update' : 'Create'}</button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function CategoriesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['admin-categories'], queryFn: () => api.get('/categories').then(r => r.data) });

  const deleteMutation = useMutation({
    mutationFn: id => api.delete(`/categories/${id}`),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries(['admin-categories']); },
    onError: () => toast.error('Delete failed'),
  });

  const onSave = () => { setShowModal(false); setEditCat(null); qc.invalidateQueries(['admin-categories']); };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-cormorant text-3xl">Categories</h1>
          <p className="font-karla text-sm text-gray-500">{data?.categories?.length || 0} categories</p>
        </div>
        <button onClick={() => { setEditCat(null); setShowModal(true); }} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Category</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {isLoading ? [...Array(8)].map((_, i) => <div key={i} className="card h-48 shimmer" />) :
          data?.categories?.map(cat => (
            <motion.div key={cat._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card overflow-hidden group">
              <div className="h-32 bg-gradient-to-br from-wine/20 to-accent/20 relative overflow-hidden">
                {cat.image ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" /> : <Tags className="w-10 h-10 text-wine/30 absolute inset-0 m-auto" />}
                <div className="absolute inset-0 bg-wine/0 group-hover:bg-wine/20 transition-colors duration-300" />
              </div>
              <div className="p-4 flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-cormorant text-lg text-gray-900">{cat.name}</h3>
                  <p className="font-karla text-xs text-gray-400 mt-0.5 line-clamp-1">{cat.description || 'No description'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`font-jost text-[9px] tracking-wide uppercase px-2 py-0.5 ${cat.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => { setEditCat(cat); setShowModal(true); }} className="p-1.5 text-gray-400 hover:text-wine hover:bg-wine/5 transition-colors rounded"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { if (confirm(`Delete "${cat.name}"?`)) deleteMutation.mutate(cat._id); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </motion.div>
          ))
        }
      </div>

      <AnimatePresence>
        {showModal && <CategoryModal category={editCat} onClose={() => { setShowModal(false); setEditCat(null); }} onSave={onSave} />}
      </AnimatePresence>
    </div>
  );
}
