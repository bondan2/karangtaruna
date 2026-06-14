import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Newspaper, Bell, Calendar, Users, 
  UserCheck, Briefcase, Mail, FileText, DollarSign, 
  Box, Folder, Flag, Image as ImageIcon, Settings, 
  LogOut, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import logo from '../assets/img/logo.png';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Berita', href: '/dashboard/berita', icon: Newspaper },
    { name: 'Pengumuman', href: '/dashboard/pengumuman', icon: Bell },
    { name: 'Agenda', href: '/dashboard/agenda', icon: Calendar },
    { name: 'Anggota', href: '/dashboard/anggota', icon: Users },
    { name: 'Absensi', href: '/dashboard/absensi', icon: UserCheck },
    { name: 'Program Kerja', href: '/dashboard/program-kerja', icon: Briefcase },
    { name: 'Surat Menyurat', href: '/dashboard/surat-menyurat', icon: Mail },
    { name: 'Notulen Rapat', href: '/dashboard/notulen-rapat', icon: FileText },
    { name: 'Keuangan', href: '/dashboard/keuangan', icon: DollarSign },
    { name: 'Inventaris', href: '/dashboard/inventaris', icon: Box },
    { name: 'Dokumen', href: '/dashboard/dokumen', icon: Folder },
    { name: 'Event 17 Agustus', href: '/dashboard/event-17-agustus', icon: Flag },
    { name: 'Galeri Internal', href: '/dashboard/galeri', icon: ImageIcon },
    { name: 'Pengaturan', href: '/dashboard/pengaturan', icon: Settings },
  ];

  const handleLogout = () => {
    // Implement logout logic here
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname !== '/dashboard') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-900 bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <img src={logo} alt="Logo Karang Taruna" className="w-8 h-8 object-contain" />
              <span className="text-lg font-bold text-gray-900">Sistem Internal</span>
            </Link>
            <button 
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    isActive(item.href) ? 'text-primary-700' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="mr-3 flex-shrink-0 h-5 w-5" />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm lg:hidden">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <span className="text-lg font-semibold text-gray-900">Karang Taruna</span>
            </div>
          </div>
        </header>

        {/* Main section */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
