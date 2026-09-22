import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, ShoppingCart, Users, Image, LogOut, BarChart3 } from 'lucide-react';
import { useAdminStore } from '../store/useAdminStore';

const navItems = [
  { href: '/', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/products', label: 'Products', Icon: Package },
  { href: '/categories', label: 'Categories', Icon: Tags },
  { href: '/orders', label: 'Orders', Icon: ShoppingCart },
  { href: '/banners', label: 'Banners', Icon: Image },
  { href: '/users', label: 'Users', Icon: Users },
  { href: '/analytics', label: 'Analytics', Icon: BarChart3 },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { admin, logout } = useAdminStore();

  return (
    <aside className="w-64 bg-sidebar text-white h-screen flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h1 className="font-cormorant text-2xl tracking-[0.3em] text-cream">Tantvani</h1>
        <p className="font-jost text-[9px] tracking-[0.4em] uppercase text-white/30 mt-0.5">Admin Panel</p>
      </div>

      {/* Admin info */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-wine rounded-full flex items-center justify-center">
            <span className="font-jost text-xs text-white">{admin?.name?.charAt(0)}</span>
          </div>
          <div>
            <p className="font-jost text-xs font-medium text-white/90">{admin?.name}</p>
            <p className="font-karla text-[10px] text-white/40">Administrator</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(({ href, label, Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link key={href} to={href} className={`sidebar-link ${active ? 'bg-wine text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button onClick={logout} className="sidebar-link w-full text-white/40 hover:text-white hover:bg-white/5 rounded">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
