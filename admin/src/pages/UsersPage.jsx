import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Shield } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['admin-users'], queryFn: () => api.get('/admin/users').then(r => r.data) });
  const deleteMutation = useMutation({ mutationFn: id => api.delete(`/admin/users/${id}`), onSuccess: () => { toast.success('User deleted'); qc.invalidateQueries(['admin-users']); } });
  const roleMutation = useMutation({ mutationFn: ({ id, role }) => api.put(`/admin/users/${id}/role`, { role }), onSuccess: () => { toast.success('Role updated'); qc.invalidateQueries(['admin-users']); } });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-cormorant text-3xl">Users</h1>
        <p className="font-karla text-sm text-gray-500">{data?.users?.length || 0} customers</p>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Name', 'Email', 'Phone', 'Role', 'Joined', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-left font-jost text-[10px] tracking-[0.15em] uppercase text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? [...Array(8)].map((_, i) => <tr key={i}><td colSpan={6} className="px-6 py-4"><div className="h-8 shimmer" /></td></tr>) :
              data?.users?.map(u => (
                <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-wine/20 rounded-full flex items-center justify-center shrink-0">
                        <span className="font-jost text-xs font-medium text-wine">{u.name?.charAt(0)}</span>
                      </div>
                      <span className="font-karla text-sm text-gray-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-karla text-sm text-gray-600">{u.email}</td>
                  <td className="px-6 py-4 font-karla text-sm text-gray-600">{u.phone || '—'}</td>
                  <td className="px-6 py-4">
                    <select value={u.role} onChange={e => roleMutation.mutate({ id: u._id, role: e.target.value })} className="font-jost text-xs border border-gray-200 px-2 py-1 focus:outline-none focus:border-wine">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 font-karla text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => { if (confirm(`Delete ${u.name}?`)) deleteMutation.mutate(u._id); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
