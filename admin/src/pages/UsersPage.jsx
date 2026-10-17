import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Search, Users, Mail, Phone, RotateCcw } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/admin/users').then(r => r.data)
  });

  const deleteMutation = useMutation({
    mutationFn: id => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      toast.success('Customer removed successfully');
      qc.invalidateQueries(['admin-users']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete user'),
  });

  // Filter & Sort users
  let users = (data?.users || []).filter(u => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q)
    );
  });

  if (sortBy === 'newest') {
    users = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === 'oldest') {
    users = [...users].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sortBy === 'name_asc') {
    users = [...users].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } else if (sortBy === 'name_desc') {
    users = [...users].sort((a, b) => (b.name || '').localeCompare(a.name || ''));
  }

  const isFiltered = Boolean(search.trim() || sortBy !== 'newest');

  return (
    <div className="p-6 sm:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-jost text-[10px] tracking-[0.25em] uppercase text-[#C99B4E] font-semibold">User Management</span>
          <h1 className="font-cormorant text-3xl sm:text-4xl text-[#411B1E] font-medium mt-0.5">Customers</h1>
          <p className="font-karla text-sm text-gray-500 mt-1">
            {data?.users?.length || 0} registered customer accounts
            {isFiltered && ` · Showing ${users.length} results`}
          </p>
        </div>

        {isFiltered && (
          <button
            onClick={() => { setSearch(''); setSortBy('newest'); }}
            className="self-start sm:self-auto text-xs font-jost text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded border border-rose-200 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="card p-4 border border-gray-200 bg-white shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search customers by name, email or phone..."
            className="input pl-10 w-full text-xs"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-gray-400 text-xs font-jost">Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="input text-xs py-1.5 px-3 w-auto"
          >
            <option value="newest">Recently Registered</option>
            <option value="oldest">Oldest Customers</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-[#FAF6EE] border-b border-[#DDD0BC]/60">
            <tr>
              {['Customer', 'Contact Information', 'Member Since', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3.5 text-left font-jost text-[10px] tracking-[0.15em] uppercase text-[#6B2732] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 font-karla">
            {isLoading ? (
              [...Array(8)].map((_, i) => (
                <tr key={i}><td colSpan={4} className="px-6 py-4"><div className="h-10 shimmer rounded" /></td></tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="font-karla text-gray-500 font-medium">
                    {search ? 'No customers match your search criteria' : 'No customers registered yet'}
                  </p>
                  {isFiltered && (
                    <button
                      onClick={() => { setSearch(''); setSortBy('newest'); }}
                      className="btn-secondary text-xs mt-3 inline-flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Clear Search
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              users.map(u => (
                <tr key={u._id} className="hover:bg-[#FBF4E9]/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#6B2732]/10 border border-[#6B2732]/20 rounded-full flex items-center justify-center shrink-0">
                        <span className="font-jost text-xs font-semibold text-[#6B2732]">
                          {u.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-sm text-gray-900 block leading-snug">{u.name || 'Unnamed Customer'}</span>
                        <span className="font-jost text-[10px] text-gray-400 uppercase tracking-wider">
                          ID: #{u._id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-karla text-xs text-gray-700 flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-gray-400" /> {u.email}
                    </p>
                    {u.phone && (
                      <p className="font-karla text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                        <Phone className="w-3 h-3 text-gray-400" /> {u.phone}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-karla text-xs text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        if (confirm(`Remove customer "${u.name}"? This cannot be undone.`)) {
                          deleteMutation.mutate(u._id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors rounded"
                      title="Remove customer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
