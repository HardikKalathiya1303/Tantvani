import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Image } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

function BannerModal({ banner, onClose, onSave }) {
  const [form, setForm] = useState({ title: banner?.title || '', subtitle: banner?.subtitle || '', buttonText: banner?.buttonText || '', buttonLink: banner?.buttonLink || '', placement: banner?.placement || 'hero', sortOrder: banner?.sortOrder || 0, isActive: banner?.isActive ?? true });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const f = k => e => { const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value; setForm(p => ({ ...p, [k]: v })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      if (banner?._id) await api.put(`/banners/${banner._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.post('/banners', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(banner ? 'Banner updated' : 'Banner created');
      onSave();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between">
          <h2 className="font-cormorant text-2xl">{banner ? 'Edit Banner' : 'Add Banner'}</h2>
          <button onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[['title', 'Title *', 'text'], ['subtitle', 'Subtitle', 'text'], ['buttonText', 'Button Text', 'text'], ['buttonLink', 'Button Link (URL)', 'text']].map(([k, label]) => (
            <div key={k}><label className="label">{label}</label><input type="text" value={form[k]} onChange={f(k)} className="input" /></div>
          ))}
          <div>
            <label className="label">Placement</label>
            <select value={form.placement} onChange={f('placement')} className="input">
              <option value="hero">Hero (Homepage top)</option>
              <option value="mid">Mid Page</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
          <div><label className="label">Sort Order</label><input type="number" value={form.sortOrder} onChange={f('sortOrder')} className="input" /></div>
          <div>
            <label className="label">Banner Image {!banner && '*'}</label>
            <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-wine file:text-white file:text-sm file:cursor-pointer" />
            {banner?.image && <img src={banner.image} alt="" className="w-full h-32 object-cover mt-2 border border-gray-200" />}
          </div>
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={!!form.isActive} onChange={f('isActive')} className="w-4 h-4 accent-wine" /><span className="font-jost text-sm text-gray-700">Active</span></label>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Saving...' : banner ? 'Update' : 'Create'}</button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
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
  const { data, isLoading } = useQuery({ queryKey: ['admin-banners'], queryFn: () => api.get('/banners/admin/all').then(r => r.data) });
  const deleteMutation = useMutation({ mutationFn: id => api.delete(`/banners/${id}`), onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries(['admin-banners']); } });
  const onSave = () => { setShowModal(false); setEditBanner(null); qc.invalidateQueries(['admin-banners']); };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="font-cormorant text-3xl">Banners</h1><p className="font-karla text-sm text-gray-500">{data?.banners?.length || 0} banners</p></div>
        <button onClick={() => { setEditBanner(null); setShowModal(true); }} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Banner</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? [...Array(3)].map((_, i) => <div key={i} className="card h-48 shimmer" />) :
          data?.banners?.map(b => (
            <div key={b._id} className="card overflow-hidden group">
              <div className="h-40 bg-gray-100 relative overflow-hidden">
                {b.image ? <img src={b.image} alt={b.title} className="w-full h-full object-cover" /> : <Image className="w-10 h-10 text-gray-300 absolute inset-0 m-auto" />}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="font-cormorant text-lg text-white drop-shadow truncate">{b.title}</p>
                  {b.subtitle && <p className="font-karla text-xs text-white/80 truncate">{b.subtitle}</p>}
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`font-jost text-[9px] tracking-wide uppercase px-2 py-0.5 ${b.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{b.isActive ? 'Active' : 'Inactive'}</span>
                  <span className="font-jost text-[9px] tracking-wide uppercase px-2 py-0.5 bg-blue-50 text-blue-600">{b.placement}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditBanner(b); setShowModal(true); }} className="p-1.5 text-gray-400 hover:text-wine hover:bg-wine/5 rounded"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { if (confirm('Delete this banner?')) deleteMutation.mutate(b._id); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))
        }
      </div>

      <AnimatePresence>
        {showModal && <BannerModal banner={editBanner} onClose={() => { setShowModal(false); setEditBanner(null); }} onSave={onSave} />}
      </AnimatePresence>
    </div>
  );
}
