import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Star, Package } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const FIELDS = [
  ['name', 'Product Name *', 'text', 'required'],
  ['shortDescription', 'Short Description', 'text', ''],
  ['price', 'Price (₹) *', 'number', 'required'],
  ['discountPrice', 'Discount Price (₹)', 'number', ''],
  ['stock', 'Stock *', 'number', 'required'],
  ['sku', 'SKU', 'text', ''],
  ['fabric', 'Fabric', 'text', ''],
  ['work', 'Embroidery / Work', 'text', ''],
  ['length', 'Length (metres)', 'number', ''],
  ['origin', 'Origin', 'text', ''],
];

function ProductModal({ product, categories, onClose, onSave }) {
  const [form, setForm] = useState(product || { name: '', price: '', stock: '', isActive: true, isFeatured: false, isNewArrival: false, isBestseller: false, blouseIncluded: false });
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState(product?.description || '');
  const [care, setCare] = useState(product?.care || '');
  const [occasion, setOccasion] = useState(product?.occasion?.join(', ') || '');
  const [color, setColor] = useState(product?.color?.join(', ') || '');
  const [loading, setLoading] = useState(false);

  const f = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(p => ({ ...p, [key]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.set('description', description);
      fd.set('care', care);
      fd.set('occasion', JSON.stringify(occasion.split(',').map(s => s.trim()).filter(Boolean)));
      fd.set('color', JSON.stringify(color.split(',').map(s => s.trim()).filter(Boolean)));
      images.forEach(img => fd.append('images', img));

      if (product?._id) {
        await api.put(`/products/${product._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated');
      } else {
        await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative ml-auto w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl"
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between z-10">
          <h2 className="font-cormorant text-2xl">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {FIELDS.map(([key, label, type]) => (
              <div key={key} className={key === 'name' || key === 'shortDescription' ? 'col-span-2' : ''}>
                <label className="label">{label}</label>
                <input type={type} value={form[key] || ''} onChange={f(key)} className="input" step={type === 'number' ? 'any' : undefined} />
              </div>
            ))}
          </div>

          <div>
            <label className="label">Category</label>
            <select value={form.category || ''} onChange={f('category')} className="input">
              <option value="">Select category</option>
              {categories?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Description *</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="input resize-none" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Occasions (comma-separated)</label>
              <input type="text" value={occasion} onChange={e => setOccasion(e.target.value)} className="input" placeholder="Wedding, Festive" />
            </div>
            <div>
              <label className="label">Colors (comma-separated)</label>
              <input type="text" value={color} onChange={e => setColor(e.target.value)} className="input" placeholder="Red, Gold" />
            </div>
          </div>

          <div>
            <label className="label">Care Instructions</label>
            <textarea value={care} onChange={e => setCare(e.target.value)} rows={2} className="input resize-none" />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-3">
            {[['isActive', 'Active'], ['isFeatured', 'Featured'], ['isNewArrival', 'New Arrival'], ['isBestseller', 'Bestseller'], ['blouseIncluded', 'Blouse Included']].map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={!!form[key]} onChange={f(key)} className="w-4 h-4 accent-wine" />
                <span className="font-jost text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>

          {/* Image Upload */}
          <div>
            <label className="label">Product Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={e => setImages([...e.target.files])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-wine file:text-white file:text-sm file:font-jost file:cursor-pointer"
            />
            {product?.images?.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {product.images.map((img, i) => (
                  <img key={i} src={img.url} alt="" className="w-16 h-20 object-cover border border-gray-200" />
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [modalProduct, setModalProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', search, page],
    queryFn: () => api.get('/products', { params: { search, page, limit: 15 } }).then(r => r.data),
  });

  const { data: catsData } = useQuery({ queryKey: ['categories'], queryFn: () => api.get('/categories').then(r => r.data) });

  const deleteMutation = useMutation({
    mutationFn: id => api.delete(`/products/${id}`),
    onSuccess: () => { toast.success('Product deleted'); qc.invalidateQueries(['admin-products']); },
    onError: () => toast.error('Delete failed'),
  });

  const handleDelete = (id, name) => {
    if (confirm(`Delete "${name}"? This cannot be undone.`)) deleteMutation.mutate(id);
  };

  const openCreate = () => { setModalProduct(null); setShowModal(true); };
  const openEdit = (p) => { setModalProduct(p); setShowModal(true); };
  const closeModal = () => setShowModal(false);
  const onSave = () => { closeModal(); qc.invalidateQueries(['admin-products']); };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-cormorant text-3xl text-gray-900">Products</h1>
          <p className="font-karla text-sm text-gray-500">{data?.total || 0} products total</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Product</button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search products..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="input pl-10" />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Product', 'Category', 'Price', 'Stock', 'Status', 'Rating', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-left font-jost text-[10px] tracking-[0.15em] uppercase text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? [...Array(10)].map((_, i) => (
              <tr key={i}><td colSpan={7} className="px-6 py-4"><div className="h-10 shimmer" /></td></tr>
            )) : data?.products?.map(p => (
              <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-12 bg-gray-100 overflow-hidden shrink-0">
                      {p.images?.[0] ? <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-gray-300 m-auto mt-3" />}
                    </div>
                    <div>
                      <p className="font-karla text-sm font-medium text-gray-800 max-w-[200px] truncate">{p.name}</p>
                      <p className="font-jost text-xs text-gray-400">{p.sku || '—'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-karla text-sm text-gray-600">{p.category?.name || '—'}</td>
                <td className="px-6 py-4">
                  <p className="font-jost text-sm font-medium">₹{(p.discountPrice || p.price).toLocaleString('en-IN')}</p>
                  {p.discountPrice && <p className="font-karla text-xs text-gray-400 line-through">₹{p.price.toLocaleString('en-IN')}</p>}
                </td>
                <td className="px-6 py-4">
                  <span className={`font-jost text-xs font-medium ${p.stock > 10 ? 'text-green-600' : p.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>{p.stock}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {p.isActive ? <span className="inline-block bg-green-50 text-green-700 font-jost text-[9px] tracking-wide uppercase px-2 py-0.5">Active</span> : <span className="inline-block bg-gray-100 text-gray-500 font-jost text-[9px] tracking-wide uppercase px-2 py-0.5">Inactive</span>}
                    {p.isFeatured && <span className="inline-block bg-blue-50 text-blue-600 font-jost text-[9px] tracking-wide uppercase px-2 py-0.5">Featured</span>}
                    {p.isNewArrival && <span className="inline-block bg-purple-50 text-purple-600 font-jost text-[9px] tracking-wide uppercase px-2 py-0.5">New</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {p.numReviews > 0 ? (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="font-jost text-xs">{p.rating.toFixed(1)}</span>
                      <span className="font-karla text-xs text-gray-400">({p.numReviews})</span>
                    </div>
                  ) : <span className="font-karla text-xs text-gray-400">—</span>}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-wine hover:bg-wine/5 transition-colors rounded">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p._id, p.name)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data?.pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            {[...Array(data.pages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 text-sm font-jost border transition-colors ${page === i + 1 ? 'bg-wine border-wine text-white' : 'border-gray-200 text-gray-600 hover:border-wine'}`}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && <ProductModal product={modalProduct} categories={catsData?.categories} onClose={closeModal} onSave={onSave} />}
      </AnimatePresence>
    </div>
  );
}
