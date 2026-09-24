import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Star, Package, X, Upload, Sparkles, Check, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const FABRICS = ['Silk', 'Banarasi', 'Kanjivaram', 'Chanderi', 'Cotton', 'Linen', 'Georgette', 'Tussar', 'Organza', 'Crepe'];
const QUICK_OCCASIONS = ['Wedding', 'Festive', 'Bridal', 'Party', 'Casual', 'Office'];
const QUICK_COLORS = ['Red', 'Gold', 'Maroon', 'Green', 'Pink', 'Blue', 'Yellow', 'Purple', 'White', 'Black'];

function ProductModal({ product, categories, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    name: product?.name || '',
    shortDescription: product?.shortDescription || '',
    price: product?.price ?? '',
    discountPrice: product?.discountPrice ?? '',
    stock: product?.stock ?? '',
    sku: product?.sku || '',
    category: product?.category?._id || product?.category || '',
    fabric: product?.fabric || '',
    work: product?.work || '',
    length: product?.length ?? 5.5,
    origin: product?.origin || 'India',
    blouseIncluded: product?.blouseIncluded ?? true,
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    isNewArrival: product?.isNewArrival ?? false,
    isBestseller: product?.isBestseller ?? false,
  }));

  const [description, setDescription] = useState(product?.description || '');
  const [care, setCare] = useState(product?.care || 'Dry clean only. Store wrapped in soft muslin cloth.');
  
  const parseArrayField = (val) => {
    if (!val) return '';
    if (Array.isArray(val)) return val.filter(v => v && v !== '[]').join(', ');
    return String(val);
  };

  const [occasion, setOccasion] = useState(() => parseArrayField(product?.occasion));
  const [color, setColor] = useState(() => parseArrayField(product?.color));

  const [existingImages, setExistingImages] = useState(product?.images || []);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Close on ESC key and lock body scroll
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
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(p => ({ ...p, [key]: val }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const combined = [...newImageFiles, ...files];
    setNewImageFiles(combined);
    
    // Generate previews
    const previews = files.map(file => URL.createObjectURL(file));
    setNewImagePreviews(prev => [...prev, ...previews]);
  };

  const removeNewImage = (idx) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== idx));
    setNewImagePreviews(prev => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const removeExistingImage = (publicId, imgId) => {
    setExistingImages(prev => prev.filter(img => img.publicId !== publicId && img._id !== imgId));
    if (publicId) {
      setRemovedImageIds(prev => [...prev, publicId]);
    }
  };

  const toggleOccasion = (tag) => {
    const arr = occasion.split(',').map(s => s.trim()).filter(Boolean);
    if (arr.includes(tag)) {
      setOccasion(arr.filter(t => t !== tag).join(', '));
    } else {
      setOccasion([...arr, tag].join(', '));
    }
  };

  const toggleColor = (col) => {
    const arr = color.split(',').map(s => s.trim()).filter(Boolean);
    if (arr.includes(col)) {
      setColor(arr.filter(t => t !== col).join(', '));
    } else {
      setColor([...arr, col].join(', '));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Product name is required');
    if (!form.price || Number(form.price) < 0) return toast.error('Valid price is required');
    if (!form.category) return toast.error('Please select a category');
    if (!description.trim()) return toast.error('Product description is required');
    if (existingImages.length === 0 && newImageFiles.length === 0) {
      return toast.error('Please upload at least one product image');
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== undefined && v !== null) fd.append(k, v);
      });

      fd.set('description', description);
      fd.set('care', care);

      const occasionArr = occasion.split(',').map(s => s.trim()).filter(Boolean);
      const colorArr = color.split(',').map(s => s.trim()).filter(Boolean);
      fd.set('occasion', JSON.stringify(occasionArr));
      fd.set('color', JSON.stringify(colorArr));

      if (removedImageIds.length > 0) {
        fd.set('removeImages', JSON.stringify(removedImageIds));
      }

      newImageFiles.forEach(file => {
        fd.append('images', file);
      });

      if (product?._id) {
        await api.put(`/products/${product._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created successfully');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#FDFAF5] border-b border-[#DDD0BC]/70 px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between z-20">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6B2732]" />
              <p className="font-jost text-[10px] tracking-[0.25em] uppercase text-[#C99B4E] font-semibold">Tantvani Inventory</p>
            </div>
            <h2 className="font-cormorant text-2xl sm:text-3xl text-[#411B1E] font-medium mt-0.5">
              {product ? `Edit Product: ${product.name}` : 'Add New Saree / Product'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-7">
          
          {/* Section 1: General Info */}
          <div className="bg-gray-50/70 p-5 rounded-md border border-gray-100 space-y-4">
            <h3 className="font-jost text-xs tracking-[0.18em] uppercase font-semibold text-[#6B2732] flex items-center gap-2">
              <span>1. Basic Details</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label">Product Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={f('name')}
                  placeholder="e.g. Royal Maroon Kanjivaram Pure Silk Saree"
                  required
                  className="input font-medium"
                />
              </div>

              <div>
                <label className="label">Category *</label>
                <select
                  value={form.category}
                  onChange={f('category')}
                  required
                  className="input cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {categories?.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">SKU (Stock Keeping Unit)</label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={f('sku')}
                  placeholder="e.g. TV-KAN-001"
                  className="input font-mono text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="label">Short Subtitle / Description</label>
                <input
                  type="text"
                  value={form.shortDescription}
                  onChange={f('shortDescription')}
                  placeholder="e.g. Handwoven with pure gold zari and temple borders"
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Inventory */}
          <div className="bg-gray-50/70 p-5 rounded-md border border-gray-100 space-y-4">
            <h3 className="font-jost text-xs tracking-[0.18em] uppercase font-semibold text-[#6B2732]">
              2. Pricing & Stock
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Regular Price (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-karla text-sm">₹</span>
                  <input
                    type="number"
                    value={form.price}
                    onChange={f('price')}
                    placeholder="25000"
                    required
                    min="0"
                    className="input pl-7 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="label">Discounted Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-karla text-sm">₹</span>
                  <input
                    type="number"
                    value={form.discountPrice}
                    onChange={f('discountPrice')}
                    placeholder="21999"
                    min="0"
                    className="input pl-7 text-[#6B2732] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="label">Stock Quantity *</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={f('stock')}
                  placeholder="5"
                  required
                  min="0"
                  className="input font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Saree Specifications */}
          <div className="bg-gray-50/70 p-5 rounded-md border border-gray-100 space-y-4">
            <h3 className="font-jost text-xs tracking-[0.18em] uppercase font-semibold text-[#6B2732]">
              3. Handloom & Saree Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Fabric</label>
                <input
                  type="text"
                  list="fabrics-list"
                  value={form.fabric}
                  onChange={f('fabric')}
                  placeholder="e.g. Pure Katan Silk"
                  className="input"
                />
                <datalist id="fabrics-list">
                  {FABRICS.map(f => <option key={f} value={f} />)}
                </datalist>
              </div>

              <div>
                <label className="label">Embroidery / Zari Work</label>
                <input
                  type="text"
                  value={form.work}
                  onChange={f('work')}
                  placeholder="e.g. Real Gold Zari, Kadwa Weave"
                  className="input"
                />
              </div>

              <div>
                <label className="label">Length (Metres)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.length}
                  onChange={f('length')}
                  placeholder="5.5"
                  className="input"
                />
              </div>

              <div>
                <label className="label">Weaving Origin</label>
                <input
                  type="text"
                  value={form.origin}
                  onChange={f('origin')}
                  placeholder="e.g. Varanasi, Tamil Nadu"
                  className="input"
                />
              </div>

              <div className="sm:col-span-2 flex items-center pt-6">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={!!form.blouseIncluded}
                    onChange={f('blouseIncluded')}
                    className="w-4 h-4 accent-[#6B2732]"
                  />
                  <span className="font-jost text-sm text-gray-700 font-medium">Matching Blouse Piece Included (0.8m)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 4: Occasions & Colors */}
          <div className="bg-gray-50/70 p-5 rounded-md border border-gray-100 space-y-4">
            <h3 className="font-jost text-xs tracking-[0.18em] uppercase font-semibold text-[#6B2732]">
              4. Occasion & Color Tags
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Occasions (comma-separated)</label>
                <input
                  type="text"
                  value={occasion}
                  onChange={e => setOccasion(e.target.value)}
                  placeholder="Wedding, Bridal, Reception"
                  className="input mb-2"
                />
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_OCCASIONS.map(tag => {
                    const active = occasion.split(',').map(s => s.trim().toLowerCase()).includes(tag.toLowerCase());
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleOccasion(tag)}
                        className={`text-[10px] font-jost tracking-wider px-2 py-1 border transition-colors ${active ? 'bg-[#6B2732] text-white border-[#6B2732]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                      >
                        {active ? `✓ ${tag}` : `+ ${tag}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="label">Colors (comma-separated)</label>
                <input
                  type="text"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  placeholder="Crimson Red, Gold, Mustard"
                  className="input mb-2"
                />
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_COLORS.map(col => {
                    const active = color.split(',').map(s => s.trim().toLowerCase()).includes(col.toLowerCase());
                    return (
                      <button
                        type="button"
                        key={col}
                        onClick={() => toggleColor(col)}
                        className={`text-[10px] font-jost tracking-wider px-2 py-1 border transition-colors ${active ? 'bg-[#6B2732] text-white border-[#6B2732]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                      >
                        {active ? `✓ ${col}` : `+ ${col}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Description & Care */}
          <div className="bg-gray-50/70 p-5 rounded-md border border-gray-100 space-y-4">
            <h3 className="font-jost text-xs tracking-[0.18em] uppercase font-semibold text-[#6B2732]">
              5. Story & Care Instructions
            </h3>

            <div>
              <label className="label">Full Product Description *</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                required
                placeholder="Describe the weave, the motifs, the pallu detailing, and heritage..."
                className="input resize-none"
              />
            </div>

            <div>
              <label className="label">Care Instructions</label>
              <textarea
                value={care}
                onChange={e => setCare(e.target.value)}
                rows={2}
                placeholder="Dry clean only. Store wrapped in soft muslin cloth..."
                className="input resize-none"
              />
            </div>
          </div>

          {/* Section 6: Visibility & Status */}
          <div className="bg-gray-50/70 p-5 rounded-md border border-gray-100 space-y-3">
            <h3 className="font-jost text-xs tracking-[0.18em] uppercase font-semibold text-[#6B2732]">
              6. Display & Highlights
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                ['isActive', 'Active (In Store)'],
                ['isFeatured', 'Featured on Home'],
                ['isNewArrival', 'New Arrival Tag'],
                ['isBestseller', 'Bestseller Tag'],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-2.5 p-2 bg-white border border-gray-200 rounded cursor-pointer hover:border-gray-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={!!form[key]}
                    onChange={f(key)}
                    className="w-4 h-4 accent-[#6B2732]"
                  />
                  <span className="font-jost text-xs font-medium text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 7: Images Upload & Gallery */}
          <div className="bg-gray-50/70 p-5 rounded-md border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-jost text-xs tracking-[0.18em] uppercase font-semibold text-[#6B2732]">
                7. Saree Photography & Images
              </h3>
              <span className="text-xs text-gray-400 font-karla">High-resolution JPEG/PNG</span>
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <p className="font-jost text-[10px] tracking-wider uppercase text-gray-500 mb-2">Current Photos:</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {existingImages.map((img, i) => (
                    <div key={img.publicId || i} className="relative group aspect-[3/4] bg-gray-100 border border-gray-200 overflow-hidden rounded">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img.publicId, img._id)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        title="Delete photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[8px] font-jost uppercase px-1.5 py-0.5 rounded">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Previews */}
            {newImagePreviews.length > 0 && (
              <div>
                <p className="font-jost text-[10px] tracking-wider uppercase text-green-700 font-medium mb-2">New Photos To Upload:</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {newImagePreviews.map((url, i) => (
                    <div key={i} className="relative group aspect-[3/4] bg-gray-100 border-2 border-green-500/40 overflow-hidden rounded">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        title="Remove selection"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Drop Area */}
            <div className="border-2 border-dashed border-gray-300 hover:border-[#6B2732] transition-colors rounded-lg p-6 text-center bg-white cursor-pointer relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="font-jost text-xs tracking-wider uppercase text-[#6B2732] font-semibold">Click or drag & drop to upload images</p>
              <p className="font-karla text-xs text-gray-400 mt-1">Select multiple high quality product photos</p>
            </div>
          </div>

        </form>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-[#FDFAF5] border-t border-[#DDD0BC]/70 px-6 sm:px-8 py-4 flex items-center justify-end gap-3 z-20">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn-secondary px-6 py-2.5"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={loading}
            className="btn-primary px-8 py-2.5 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Saree...</span>
              </>
            ) : product ? (
              'Save Changes'
            ) : (
              'Create Product'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [modalProduct, setModalProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', debouncedSearch, page],
    queryFn: () => api.get('/products', { params: { search: debouncedSearch, page, limit: 15 } }).then(r => r.data),
  });

  const { data: catsData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: id => api.delete(`/products/${id}`),
    onSuccess: () => {
      toast.success('Product deleted successfully');
      qc.invalidateQueries(['admin-products']);
    },
    onError: () => toast.error('Delete failed'),
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  const openCreate = () => {
    setModalProduct(null);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setModalProduct(p);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalProduct(null);
  };

  const onSave = () => {
    closeModal();
    qc.invalidateQueries(['admin-products']);
  };

  return (
    <div className="p-6 sm:p-8 max-w-[1400px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-cormorant text-3xl sm:text-4xl text-[#411B1E] font-medium">Products</h1>
          <p className="font-karla text-sm text-gray-500 mt-1">
            {data?.total || 0} luxury sarees in inventory
          </p>
        </div>
        <button
          onClick={openCreate}
          className="btn-primary flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search sarees by name, SKU, fabric..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="input pl-10 bg-white"
        />
      </div>

      {/* Table */}
      <div className="card overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-[#FAF6EE] border-b border-[#DDD0BC]/60">
            <tr>
              {['Product', 'Category', 'Price', 'Stock', 'Status', 'Rating', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3.5 font-jost text-[10px] tracking-[0.18em] uppercase text-[#6B2732] font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-karla">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i}>
                  <td colSpan={7} className="px-6 py-4"><div className="h-12 shimmer rounded" /></td>
                </tr>
              ))
            ) : data?.products?.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-gray-400">
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-cormorant text-2xl text-gray-600">No products found</p>
                  <button onClick={openCreate} className="btn-primary mt-4 inline-flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add First Product
                  </button>
                </td>
              </tr>
            ) : (
              data?.products?.map(p => (
                <tr key={p._id} className="hover:bg-[#FBF4E9]/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-14 bg-gray-100 overflow-hidden rounded shrink-0 border border-gray-200">
                        {p.images?.[0] ? (
                          <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-gray-300 m-auto mt-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 max-w-[220px] truncate leading-snug">{p.name}</p>
                        <p className="font-jost text-[10px] text-gray-400 mt-0.5 tracking-wider uppercase">{p.sku || 'SKU —'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {p.category?.name || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-jost text-sm font-semibold text-[#6B2732]">
                      ₹{(p.discountPrice || p.price).toLocaleString('en-IN')}
                    </p>
                    {p.discountPrice && (
                      <p className="font-karla text-xs text-gray-400 line-through">
                        ₹{p.price.toLocaleString('en-IN')}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-jost text-xs font-semibold ${p.stock > 10 ? 'text-green-600' : p.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[160px]">
                      {p.isActive ? (
                        <span className="inline-block bg-green-50 text-green-700 font-jost text-[9px] tracking-wide uppercase px-2 py-0.5 rounded">
                          Active
                        </span>
                      ) : (
                        <span className="inline-block bg-gray-100 text-gray-500 font-jost text-[9px] tracking-wide uppercase px-2 py-0.5 rounded">
                          Inactive
                        </span>
                      )}
                      {p.isFeatured && (
                        <span className="inline-block bg-amber-50 text-amber-700 font-jost text-[9px] tracking-wide uppercase px-2 py-0.5 rounded">
                          Featured
                        </span>
                      )}
                      {p.isNewArrival && (
                        <span className="inline-block bg-purple-50 text-purple-700 font-jost text-[9px] tracking-wide uppercase px-2 py-0.5 rounded">
                          New
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {p.numReviews > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#C99B4E] text-[#C99B4E]" />
                        <span className="font-jost text-xs font-medium">{p.rating.toFixed(1)}</span>
                        <span className="font-karla text-xs text-gray-400">({p.numReviews})</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-2 text-gray-500 hover:text-[#6B2732] hover:bg-[#6B2732]/10 transition-colors rounded"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id, p.name)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {data?.pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            {[...Array(data.pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 text-sm font-jost border transition-colors rounded ${page === i + 1 ? 'bg-wine border-wine text-white' : 'border-gray-200 text-gray-600 hover:border-wine'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Popup Modal */}
      <AnimatePresence>
        {showModal && (
          <ProductModal
            product={modalProduct}
            categories={catsData?.categories}
            onClose={closeModal}
            onSave={onSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

