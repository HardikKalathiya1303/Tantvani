import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Tags, X, Upload } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

function CategoryModal({ category, onClose, onSave }) {
  const [form, setForm] = useState({
    name: category?.name || '',
    description: category?.description || '',
    sortOrder: category?.sortOrder ?? 0,
    isActive: category?.isActive ?? true,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const f = (key) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(p => ({ ...p, [key]: v }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Category name is required');

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);

      if (category?._id) {
        await api.put(`/categories/${category._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category updated successfully');
      } else {
        await api.post('/categories', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category created successfully');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
      />

      {/* Modal Box */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200"
      >
        {/* Header */}
        <div className="bg-[#FDFAF5] border-b border-[#DDD0BC]/70 px-6 py-4.5 flex items-center justify-between">
          <div>
            <span className="font-jost text-[10px] tracking-[0.25em] uppercase text-[#C99B4E] font-semibold">Tantvani Categories</span>
            <h2 className="font-cormorant text-2xl text-[#411B1E] font-medium mt-0.5">
              {category ? `Edit Category: ${category.name}` : 'Add New Category'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5">
          <div>
            <label className="label">Category Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={f('name')}
              placeholder="e.g. Banarasi, Kanjivaram, Chanderi"
              required
              className="input font-medium"
            />
          </div>

          <div>
            <label className="label">Description / Summary</label>
            <textarea
              value={form.description}
              onChange={f('description')}
              rows={3}
              placeholder="A short note on this saree collection..."
              className="input resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Sort Order (0 = top)</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={f('sortOrder')}
                className="input"
              />
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!!form.isActive}
                  onChange={f('isActive')}
                  className="w-4 h-4 accent-[#6B2732]"
                />
                <span className="font-jost text-sm text-gray-700 font-medium">Active (Visible in store)</span>
              </label>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="label">Category Cover Image</label>
            <div className="flex items-start gap-4 mt-1">
              <div className="w-24 h-28 bg-gray-100 border border-gray-200 rounded overflow-hidden shrink-0 flex items-center justify-center relative">
                {preview ? (
                  <img src={preview} alt="New Preview" className="w-full h-full object-cover" />
                ) : category?.image ? (
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                ) : (
                  <Tags className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-none file:border-0 file:bg-[#6B2732] file:text-white file:font-jost file:text-xs file:cursor-pointer hover:file:bg-[#7d3040]"
                />
                <p className="font-karla text-[11px] text-gray-400 mt-2">
                  Recommended size: 600x800px (Portrait 3:4)
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : category ? (
                'Save Changes'
              ) : (
                'Create Category'
              )}
            </button>
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

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: id => api.delete(`/categories/${id}`),
    onSuccess: () => {
      toast.success('Category deleted');
      qc.invalidateQueries(['admin-categories']);
    },
    onError: () => toast.error('Delete failed'),
  });

  const onSave = () => {
    setShowModal(false);
    setEditCat(null);
    qc.invalidateQueries(['admin-categories']);
  };

  return (
    <div className="p-6 sm:p-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-cormorant text-3xl sm:text-4xl text-[#411B1E] font-medium">Categories</h1>
          <p className="font-karla text-sm text-gray-500 mt-1">
            {data?.categories?.length || 0} active collections
          </p>
        </div>
        <button
          onClick={() => { setEditCat(null); setShowModal(true); }}
          className="btn-primary flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {isLoading ? (
          [...Array(6)].map((_, i) => <div key={i} className="card h-48 shimmer rounded-lg" />)
        ) : data?.categories?.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-400 card rounded-lg">
            <Tags className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-cormorant text-2xl text-gray-600">No categories yet</p>
            <button onClick={() => { setEditCat(null); setShowModal(true); }} className="btn-primary mt-4 inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add First Category
            </button>
          </div>
        ) : (
          data?.categories?.map(cat => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card rounded-lg overflow-hidden group border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="h-36 bg-gradient-to-br from-[#6B2732]/20 to-[#7A4A38]/20 relative overflow-hidden">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <Tags className="w-10 h-10 text-[#6B2732]/30 absolute inset-0 m-auto" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
              </div>
              <div className="p-4 flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-cormorant text-xl text-gray-900 font-medium">{cat.name}</h3>
                  <p className="font-karla text-xs text-gray-400 mt-0.5 line-clamp-1">{cat.description || 'No description'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`font-jost text-[9px] tracking-wide uppercase px-2 py-0.5 rounded ${cat.isActive ? 'bg-green-50 text-green-700 font-semibold' : 'bg-gray-100 text-gray-500'}`}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="font-jost text-[9px] text-gray-400 tracking-wider">
                      Order #{cat.sortOrder || 0}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => { setEditCat(cat); setShowModal(true); }}
                    className="p-1.5 text-gray-400 hover:text-[#6B2732] hover:bg-[#6B2732]/10 transition-colors rounded"
                    title="Edit category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { if (window.confirm(`Delete category "${cat.name}"?`)) deleteMutation.mutate(cat._id); }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Popup Modal */}
      <AnimatePresence>
        {showModal && (
          <CategoryModal
            category={editCat}
            onClose={() => { setShowModal(false); setEditCat(null); }}
            onSave={onSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

