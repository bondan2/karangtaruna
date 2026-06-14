import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Calendar, FileText, Settings, LogOut, 
  Wallet, Trophy, Menu, X, Newspaper, Briefcase, Archive, CheckSquare
} from 'lucide-react';
import logo from '../assets/img/logo.png';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRole] = useState('Admin');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Cek sesi login
    const savedRole = localStorage.getItem('userRole');
    if (!savedRole) {
      // Jika belum login, paksa ke halaman login
      // navigate('/login'); // Diaktifkan nanti agar tidak menyusahkan pengembangan
    } else {
      setRole(savedRole);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const navItems = [
    { name: 'Ringkasan Dasbor', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Anggota & Absensi', path: '/dashboard/anggota', icon: Users },
    { name: 'Program Kerja', path: '/dashboard/program-kerja', icon: Briefcase },
    { name: 'Manajemen Lomba', path: '/dashboard/lomba', icon: Trophy },
    { name: 'Kas & Keuangan', path: '/dashboard/keuangan', icon: Wallet },
    { name: 'Surat & Dokumen', path: '/dashboard/dokumen', icon: Archive },
    { name: 'Notulen Rapat', path: '/dashboard/notulen-rapat', icon: CheckSquare },
    { name: 'Berita Publikasi', path: '/dashboard/berita', icon: Newspaper },
    { name: 'Agenda Acara', path: '/dashboard/agenda', icon: Calendar },
    { name: 'Pengaturan Sistem', path: '/dashboard/pengaturan', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex relative overflow-hidden">
      
      {/* Overlay untuk mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside className={`bg-primary-900 text-white w-64 flex-shrink-0 flex flex-col transition-transform duration-300 fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:-ml-64'
      }`}>
        <div className="p-6 flex items-center justify-between md:justify-center border-b border-primary-800">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="w-12 h-12 mr-3 bg-white rounded-full p-1" />
            <div>
              <h2 className="font-black text-lg leading-tight uppercase">Admin<br/><span className="text-yellow-400">Panel</span></h2>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 bg-primary-950/30">
          <p className="text-xs text-primary-300 font-bold uppercase tracking-wider mb-1">Masuk Sebagai</p>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-yellow-400 text-primary-900 flex items-center justify-center font-bold mr-3">{role[0]}</div>
            <span className="font-bold">{role} Sistem</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/dashboard');
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary-700 text-white font-bold shadow-md' 
                    : 'text-primary-100 hover:bg-primary-800 hover:text-white font-medium'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-yellow-400' : 'text-primary-300'}`} />
                <span className="text-sm">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-primary-800">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-sm font-bold text-red-200 hover:bg-red-900/50 hover:text-white rounded-xl transition-colors">
            <LogOut className="w-5 h-5 mr-3" /> Keluar Sistem
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 z-10">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="ml-2 sm:ml-4">
              <h1 className="text-lg md:text-xl font-black text-gray-800 uppercase tracking-tight truncate max-w-[150px] sm:max-w-xs md:max-w-full">SIM Karang Taruna</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-xs md:text-sm font-bold text-primary-600 hover:text-primary-800 bg-primary-50 px-3 py-1.5 md:px-4 md:py-2 rounded-full transition-colors whitespace-nowrap">
              Web Publik
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
