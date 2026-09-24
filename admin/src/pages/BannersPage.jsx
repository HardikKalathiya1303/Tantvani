import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Image, X, Upload } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

function BannerModal({ banner, onClose, onSave }) {
  const [form, setForm] = useState({
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    buttonText: banner?.buttonText || '',
    buttonLink: banner?.buttonLink || '',
    placement: banner?.placement || 'hero',
    sortOrder: banner?.sortOrder ?? 0,
    isActive: banner?.isActive ?? true,
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

  const f = k => e => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(p => ({ ...p, [k]: v }));
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
    if (!form.title.trim()) return toast.error('Banner title is required');
    if (!banner && !image) return toast.error('Please select a banner image');

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);

      if (banner?._id) {
        await api.put(`/banners/${banner._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Banner updated successfully');
      } else {
        await api.post('/banners', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Banner created successfully');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving banner');
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
        className="relative z-10 bg-white w-full max-w-xl rounded-lg shadow-2xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-200"
      >
        {/* Header */}
        <div className="bg-[#FDFAF5] border-b border-[#DDD0BC]/70 px-6 py-4.5 flex items-center justify-between">
          <div>
            <span className="font-jost text-[10px] tracking-[0.25em] uppercase text-[#C99B4E] font-semibold">Tantvani Banners</span>
            <h2 className="font-cormorant text-2xl text-[#411B1E] font-medium mt-0.5">
              {banner ? `Edit Banner: ${banner.title}` : 'Add New Promotional Banner'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="label">Banner Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={f('title')}
              placeholder="e.g. Pure Zari Bridal Sarees"
              required
              className="input font-medium"
            />
          </div>

          <div>
            <label className="label">Subtitle / Description</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={f('subtitle')}
              placeholder="e.g. Crafted for your most sacred moments"
              className="input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Call to Action (Button Text)</label>
              <input
                type="text"
                value={form.buttonText}
                onChange={f('buttonText')}
                placeholder="e.g. Explore Collection"
                className="input"
              />
            </div>
            <div>
              <label className="label">Target Link (URL / Route)</label>
              <input
                type="text"
                value={form.buttonLink}
                onChange={f('buttonLink')}
                placeholder="e.g. /collections?occasion=wedding"
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Banner Placement</label>
              <select
                value={form.placement}
                onChange={f('placement')}
                className="input cursor-pointer"
              >
                <option value="hero">Hero (Homepage Top Slider)</option>
                <option value="mid">Mid Page (Heritage / Spotlight)</option>
                <option value="bottom">Bottom Promotional Banner</option>
              </select>
            </div>
            <div>
              <label className="label">Display Sort Order</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={f('sortOrder')}
                className="input"
              />
            </div>
          </div>

          {/* Banner Image */}
          <div>
            <label className="label">Banner Image {!banner && '*'}</label>
            <div className="space-y-3 mt-1">
              <div className="w-full h-36 bg-gray-100 border border-gray-200 rounded overflow-hidden flex items-center justify-center relative">
                {preview ? (
                  <img src={preview} alt="New Banner Preview" className="w-full h-full object-cover" />
                ) : banner?.image ? (
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-400">
                    <Image className="w-8 h-8 mx-auto mb-1 text-gray-300" />
                    <span className="text-xs font-karla">No image selected</span>
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-none file:border-0 file:bg-[#6B2732] file:text-white file:font-jost file:text-xs file:cursor-pointer hover:file:bg-[#7d3040]"
              />
              <p className="font-karla text-[11px] text-gray-400">
                Recommended: 1920x800px for Hero Banners, 1200x500px for Mid Banners
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer select-none pt-2">
            <input
              type="checkbox"
              checked={!!form.isActive}
              onChange={f('isActive')}
              className="w-4 h-4 accent-[#6B2732]"
            />
            <span className="font-jost text-sm text-gray-700 font-medium">Active (Visible on website)</span>
          </label>

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
              ) : banner ? (
                'Save Changes'
              ) : (
                'Create Banner'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function BannersPage() {
  const [showModal, setShowModal] = useState(false);
  const [editBanner, setEditBanner] = useState(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: () => api.get('/banners/admin/all').then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: id => api.delete(`/banners/${id}`),
    onSuccess: () => {
      toast.success('Banner deleted');
      qc.invalidateQueries(['admin-banners']);
    },
    onError: () => toast.error('Delete failed'),
  });

  const onSave = () => {
    setShowModal(false);
    setEditBanner(null);
    qc.invalidateQueries(['admin-banners']);
  };

  return (
    <div className="p-6 sm:p-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-cormorant text-3xl sm:text-4xl text-[#411B1E] font-medium">Banners</h1>
          <p className="font-karla text-sm text-gray-500 mt-1">
            {data?.banners?.length || 0} active showcase banners
          </p>
        </div>
        <button
          onClick={() => { setEditBanner(null); setShowModal(true); }}
          className="btn-primary flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          [...Array(3)].map((_, i) => <div key={i} className="card h-48 shimmer rounded-lg" />)
        ) : data?.banners?.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-400 card rounded-lg">
            <Image className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-cormorant text-2xl text-gray-600">No banners yet</p>
            <button onClick={() => { setEditBanner(null); setShowModal(true); }} className="btn-primary mt-4 inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add First Banner
            </button>
          </div>
        ) : (
          data?.banners?.map(b => (
            <div key={b._id} className="card rounded-lg overflow-hidden group border border-gray-200 hover:shadow-md transition-shadow">
              <div className="h-44 bg-gray-100 relative overflow-hidden">
                {b.image ? (
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <Image className="w-10 h-10 text-gray-300 absolute inset-0 m-auto" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="font-cormorant text-xl text-white font-medium drop-shadow truncate">{b.title}</p>
                  {b.subtitle && <p className="font-karla text-xs text-white/85 truncate mt-0.5">{b.subtitle}</p>}
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`font-jost text-[9px] tracking-wide uppercase px-2 py-0.5 rounded ${b.isActive ? 'bg-green-50 text-green-700 font-semibold' : 'bg-gray-100 text-gray-500'}`}>
                    {b.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="font-jost text-[9px] tracking-wide uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    {b.placement}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditBanner(b); setShowModal(true); }}
                    className="p-1.5 text-gray-400 hover:text-[#6B2732] hover:bg-[#6B2732]/10 transition-colors rounded"
                    title="Edit banner"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { if (window.confirm('Delete this banner?')) deleteMutation.mutate(b._id); }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded"
                    title="Delete banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Popup Modal */}
      <AnimatePresence>
        {showModal && (
          <BannerModal
            banner={editBanner}
            onClose={() => { setShowModal(false); setEditBanner(null); }}
            onSave={onSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

