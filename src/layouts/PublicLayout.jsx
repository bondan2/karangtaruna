import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, Lock, User } from 'lucide-react';
import { FaInstagram, FaYoutube } from 'react-icons/fa';
import { useState } from 'react';
import logo from '../assets/img/logo.png';

export default function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'BERANDA', href: '/' },
    { name: 'TENTANG KAMI', href: '/tentang' },
    { name: 'PROGRAM', href: '/program' },
    { name: 'LOMBA', href: '/lomba' },
    { name: 'BERITA', href: '/berita' },
    { name: 'AGENDA', href: '/agenda' },
    { name: 'GALERI', href: '/galeri' },
    { name: 'KEUANGAN', href: '/keuangan' },
    { name: 'KONTAK', href: '/kontak' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative">
      {/* Top Bar */}
      <div className="bg-primary-700 text-white py-2 text-xs font-light hidden md:block z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Jl. Raya Pondok Betung, Rt.001/05, Kel. Pondok Betung, Kec. Pondok Aren, Kota Tangerang Selatan, Banten</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-primary-200 transition-colors"><FaInstagram className="w-4 h-4" /></a>
            <a href="#" className="hover:text-primary-200 transition-colors"><FaYoutube className="w-4 h-4" /></a>
            <Link to="/login" className="flex items-center font-bold hover:text-primary-200 transition-colors ml-4 border-l border-white/20 pl-4">
              <Lock className="w-3 h-3 mr-1.5" /> LOGIN CMS
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="z-50 sticky top-0 w-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 min-h-[90px]">
            {/* Logo Area */}
            <div className="flex items-center min-w-0 flex-shrink-0">
              <Link to="/" className="flex items-center space-x-3 md:space-x-4 overflow-hidden group">
                <img src={logo} alt="Logo Karang Taruna" className="transition-transform duration-300 group-hover:scale-105 object-contain flex-shrink-0 h-14 w-14 md:h-[72px] md:w-[72px]" />
                <div className="truncate flex flex-col justify-center">
                  <span className="block font-black leading-tight uppercase text-gray-900 text-lg md:text-[22px] tracking-tight">Karang Taruna</span>
                  <span className="block font-black leading-tight uppercase text-gray-900 text-lg md:text-[22px] tracking-tight">Bina Pemuda</span>
                  <span className="block text-[8px] md:text-[10px] font-bold tracking-widest uppercase text-gray-500 mt-0.5">Pondok Betung - Pondok Aren</span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden xl:flex xl:items-center xl:space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`py-6 text-[12px] font-black tracking-wide uppercase transition-colors relative ${
                    isActive(item.href)
                      ? 'text-primary-600'
                      : 'text-gray-900 hover:text-primary-600'
                  }`}
                >
                  {item.name}
                  {/* Red Bottom Border for Active State */}
                  {isActive(item.href) && (
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-primary-600"></span>
                  )}
                </Link>
              ))}
            </div>

            {/* Login Button (Desktop) */}
            <div className="hidden lg:flex items-center ml-8">
              <Link to="/login" className="flex items-center justify-center px-6 py-2.5 bg-primary-700 text-white rounded-lg font-bold text-sm shadow-md hover:bg-primary-800 transition-colors">
                <User className="w-4 h-4 mr-2" /> LOGIN
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center xl:hidden ml-4 flex-shrink-0">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none text-gray-900 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 animate-in slide-in-from-top-2">
            <div className="px-4 pt-4 pb-6 space-y-2 max-h-[70vh] overflow-y-auto">
              <div className="text-xs font-bold text-gray-400 mb-2 pb-2 border-b">MENU UTAMA</div>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 bg-primary-700 text-white rounded-xl font-bold shadow-md"
                >
                  <User className="w-5 h-5 mr-2" /> LOGIN
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] text-gray-400 mt-auto pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <h5 className="text-white text-lg font-bold mb-6 uppercase tracking-wider">Tentang Kami</h5>
              <p className="max-w-md leading-relaxed">
                Karang Taruna Bina Pemuda adalah wadah pembinaan dan pengembangan generasi muda yang tumbuh berbasis pada kesadaran dan tanggung jawab sosial.
              </p>
            </div>
            <div>
              <h5 className="text-white text-lg font-bold mb-6 uppercase tracking-wider">Alamat & Kontak</h5>
              <p className="mb-4">Jl. Raya Pondok Betung, Rt.001/05, Kel. Pondok Betung, Kec. Pondok Aren, Kota Tangerang Selatan, Banten</p>
              <div className="flex space-x-3 mt-6">
                <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-primary-600 hover:border-primary-600 hover:text-white transition-all">
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-primary-600 hover:border-primary-600 hover:text-white transition-all">
                  <FaYoutube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            &copy; {new Date().getFullYear()} Karang Taruna Bina Pemuda. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
