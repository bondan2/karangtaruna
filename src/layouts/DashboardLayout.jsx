import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Calendar, FileText, Settings, LogOut, 
  Wallet, Trophy, Menu, X, Newspaper, Briefcase, Archive, CheckSquare,
  Image as ImageIcon, Bell, Flag, Box, ClipboardList, ShieldCheck, Database, FileDigit, BarChart3, Activity
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import logo from '../assets/img/logo.png';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRole] = useState('Admin');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      // Fix common typos from database inputs
      if (savedRole === 'Sektretaris' || savedRole === 'Sekertaris') {
        setRole('Sekretaris');
      } else {
        setRole(savedRole);
      }
    }
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const allNavGroups = [
    // --- ADMIN (IT) ---
    {
      group: 'Monitoring',
      roles: ['Admin'],
      items: [
        { name: 'Dashboard Monitoring', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Monitoring Anggota', path: '/dashboard/anggota', icon: Users },
        { name: 'Monitoring Berita', path: '/dashboard/berita', icon: Newspaper },
        { name: 'Monitoring Pengumuman', path: '/dashboard/pengumuman', icon: Bell },
        { name: 'Monitoring Agenda', path: '/dashboard/agenda', icon: Calendar },
        { name: 'Monitoring Proker', path: '/dashboard/program-kerja', icon: Briefcase },
        { name: 'Monitoring Keuangan', path: '/dashboard/keuangan', icon: Wallet },
        { name: 'Monitoring Event', path: '/dashboard/event-17-agustus', icon: Flag },
        { name: 'Monitoring Absensi', path: '/dashboard/absensi', icon: ClipboardList },
        { name: 'Monitoring Inventaris', path: '/dashboard/inventaris', icon: Box },
        { name: 'Monitoring Dokumen', path: '/dashboard/surat-menyurat', icon: Archive },
      ]
    },
    {
      group: 'Master Data',
      roles: ['Admin'],
      items: [
        { name: 'Anggota', path: '/dashboard/anggota', icon: Users },
        { name: 'Kepengurusan', path: '/dashboard/kepengurusan', icon: Users },
        { name: 'Jabatan', path: '/dashboard/jabatan', icon: Users },
        { name: 'Periode', path: '/dashboard/periode', icon: Calendar },
      ]
    },
    {
      group: 'Website',
      roles: ['Admin'],
      items: [
        { name: 'Banner', path: '/dashboard/website-banner', icon: ImageIcon },
        { name: 'Profil Website', path: '/dashboard/website-profil', icon: Settings },
        { name: 'Kontak', path: '/dashboard/website-kontak', icon: FileText },
        { name: 'Media Sosial', path: '/dashboard/website-medsos', icon: Settings },
        { name: 'Footer', path: '/dashboard/website-footer', icon: Settings },
      ]
    },
    {
      group: 'Sistem',
      roles: ['Admin'],
      items: [
        { name: 'User', path: '/dashboard/sistem-user', icon: Users },
        { name: 'Role', path: '/dashboard/sistem-role', icon: ShieldCheck },
        { name: 'Permission', path: '/dashboard/sistem-permission', icon: ShieldCheck },
        { name: 'Activity Log', path: '/dashboard/sistem-activity-log', icon: Activity },
        { name: 'Backup Database', path: '/dashboard/sistem-backup', icon: Database },
        { name: 'Restore Database', path: '/dashboard/sistem-restore', icon: Database },
        { name: 'Audit Log', path: '/dashboard/sistem-audit-log', icon: FileDigit },
        { name: 'Pengaturan Sistem', path: '/dashboard/pengaturan', icon: Settings },
      ]
    },



    // --- SEKRETARIS ---
    {
      group: 'Menu Utama',
      roles: ['Sekretaris', 'Bendahara', 'Admin', 'Ketua'],
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      group: 'Konten',
      roles: ['Sekretaris', 'Admin', 'Ketua'],
      items: [
        { name: 'Berita', path: '/dashboard/berita', icon: Newspaper },
        { name: 'Pengumuman', path: '/dashboard/pengumuman', icon: Bell },
        { name: 'Agenda', path: '/dashboard/agenda', icon: Calendar },
        { name: 'Galeri', path: '/dashboard/galeri', icon: ImageIcon },
      ]
    },
    {
      group: 'Administrasi Sekretariat',
      roles: ['Sekretaris', 'Admin', 'Ketua'],
      items: [
        { name: 'Surat Masuk', path: '/dashboard/surat-masuk', icon: FileText },
        { name: 'Surat Keluar', path: '/dashboard/surat-keluar', icon: FileText },
        { name: 'Nomor Surat', path: '/dashboard/nomor-surat', icon: FileDigit },
        { name: 'Notulen Rapat', path: '/dashboard/notulen-rapat', icon: CheckSquare },
        { name: 'Arsip Dokumen', path: '/dashboard/dokumen', icon: Archive },
      ]
    },
    {
      group: 'Dokumen Sekretariat',
      roles: ['Sekretaris', 'Admin', 'Ketua'],
      items: [
        { name: 'Proposal', path: '/dashboard/proposal', icon: FileText },
        { name: 'LPJ', path: '/dashboard/lpj', icon: FileText },
        { name: 'SK', path: '/dashboard/sk', icon: FileText },
        { name: 'AD/ART', path: '/dashboard/ad-art', icon: FileText },
        { name: 'Laporan Kegiatan', path: '/dashboard/laporan-kegiatan', icon: FileText },
      ]
    },
    {
      group: 'Organisasi Kepengurusan',
      roles: ['Sekretaris', 'Admin', 'Ketua'],
      items: [
        { name: 'Anggota', path: '/dashboard/anggota', icon: Users },
        { name: 'Kepengurusan', path: '/dashboard/kepengurusan', icon: Users, roles: ['Admin', 'Ketua'] },
        { name: 'Program Kerja', path: '/dashboard/program-kerja', icon: Briefcase },
        { name: 'Inventaris', path: '/dashboard/inventaris', icon: Box, roles: ['Admin', 'Ketua'] },
      ]
    },
    {
      group: 'Event Lomba',
      roles: ['Sekretaris', 'Admin', 'Ketua', 'Anggota'],
      items: [
        { name: 'Event', path: '/dashboard/event', icon: Flag },
        { name: 'Lomba', path: '/dashboard/lomba', icon: Trophy },
        { name: 'Peserta', path: '/dashboard/peserta', icon: Users },
        { name: 'Penilaian', path: '/dashboard/penilaian', icon: CheckSquare, roles: ['Ketua', 'Admin'] },
        { name: 'Hasil Lomba', path: '/dashboard/hasil-lomba', icon: Trophy },
        { name: 'Dokumentasi', path: '/dashboard/dokumentasi', icon: ImageIcon },
      ]
    },

    // --- BENDAHARA ---
    {
      group: 'Pemasukan',
      roles: ['Bendahara', 'Admin', 'Ketua'],
      items: [
        { name: 'Iuran Anggota', path: '/dashboard/iuran', icon: Wallet },
        { name: 'Donasi', path: '/dashboard/donasi', icon: Wallet },
        { name: 'Sponsor', path: '/dashboard/pemasukan-sponsor', icon: Wallet },
        { name: 'Pendapatan Event', path: '/dashboard/pendapatan-event', icon: Wallet },
      ]
    },
    {
      group: 'Pengeluaran',
      roles: ['Bendahara', 'Admin', 'Ketua'],
      items: [
        { name: 'Operasional', path: '/dashboard/operasional', icon: Wallet },
        { name: 'Kegiatan', path: '/dashboard/pengeluaran-kegiatan', icon: Wallet },
        { name: 'Inventaris', path: '/dashboard/pengeluaran-inventaris', icon: Wallet },
        { name: 'Lainnya', path: '/dashboard/pengeluaran-lainnya', icon: Wallet },
      ]
    },
    {
      group: 'Anggaran',
      roles: ['Bendahara', 'Admin', 'Ketua'],
      items: [
        { name: 'Program Kerja', path: '/dashboard/anggaran-proker', icon: Briefcase },
        { name: 'Event', path: '/dashboard/anggaran-event', icon: Flag },
        { name: 'Proposal', path: '/dashboard/anggaran-proposal', icon: FileText },
      ]
    },
    {
      group: 'Laporan & Keuangan',
      roles: ['Bendahara', 'Admin', 'Ketua'],
      items: [
        { name: 'Persetujuan Dana', path: '/dashboard/persetujuan', icon: CheckSquare, roles: ['Ketua', 'Admin'] },
        { name: 'Harian', path: '/dashboard/laporan-harian', icon: BarChart3 },
        { name: 'Bulanan', path: '/dashboard/laporan-bulanan', icon: BarChart3 },
        { name: 'Tahunan', path: '/dashboard/laporan-tahunan', icon: BarChart3 },
        { name: 'Rekap Kas', path: '/dashboard/rekap-kas', icon: BarChart3 },
      ]
    },
    {
      group: 'Sponsor',
      roles: ['Bendahara', 'Admin', 'Ketua'],
      items: [
        { name: 'Kelola Sponsor', path: '/dashboard/sponsor', icon: Users },
      ]
    },

    // --- ANGGOTA ---
    {
      group: 'Menu Anggota',
      roles: ['Anggota', 'Admin'],
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Absensi', path: '/dashboard/absensi', icon: ClipboardList },
        { name: 'Galeri', path: '/dashboard/galeri', icon: ImageIcon },
        { name: 'Dokumen Publik', path: '/dashboard/dokumen-publik', icon: Archive },
      ]
    }
  ];

  // Filter groups and items based on role
  const navGroups = allNavGroups
    .filter(group => group.roles.includes(role))
    .map(group => ({
      ...group,
      items: group.items.filter(item => !item.roles || item.roles.includes(role))
    }));

  return (
    <div className="h-screen w-full bg-gray-100 flex relative overflow-hidden">
      
      {/* Overlay untuk mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside className={`bg-primary-900 text-white w-72 flex-shrink-0 flex flex-col transition-transform duration-300 fixed inset-y-0 left-0 z-50 md:static md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
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

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              <h3 className="px-4 text-xs font-black text-primary-400 uppercase tracking-widest mb-2">
                {group.group}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/dashboard');
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center px-4 py-2.5 rounded-xl transition-all ${
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
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-primary-800 bg-primary-900">
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
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
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
