import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import logo from '../../assets/img/logo.png';
import heroImage from '../../assets/hero.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulasi proses login lokal
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('userRole', 'Admin');
      localStorage.setItem('userName', 'Administrator');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row overflow-hidden">
      
      {/* Kiri - Banner Visual */}
      <div className="hidden md:flex md:w-5/12 bg-primary-900 relative flex-col justify-between p-12 text-white overflow-hidden shadow-2xl z-10">
        <img src={heroImage} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800/80 to-[#5a0000]/90"></div>
        <div className="absolute top-[-20%] -left-[20%] w-[150%] h-[150%] bg-[#b30000] rounded-full opacity-30 blur-3xl"></div>
        
        <div className="relative z-20">
          <Link to="/" className="inline-flex items-center text-white/80 hover:text-white transition-colors text-sm font-bold tracking-wider">
            <ArrowLeft className="w-4 h-4 mr-2" /> KEMBALI KE BERANDA
          </Link>
        </div>

        <div className="relative z-20 mt-20 mb-auto">
          <div className="bg-white p-4 rounded-[2rem] inline-block mb-8 shadow-2xl border-4 border-white/20">
            <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.1] mb-6 text-white drop-shadow-lg">
            Sistem<br />
            Informasi<br />
            <span className="text-yellow-400">Terpadu</span>
          </h1>
          <div className="w-20 h-2 bg-yellow-400 mb-8 rounded-full shadow-lg"></div>
          <p className="text-white/90 text-lg leading-relaxed max-w-md font-medium">
            Portal akses aman khusus jajaran pengurus untuk mengelola data keanggotaan, program kerja, transparansi keuangan, dan manajemen dokumen digital.
          </p>
        </div>

        <div className="relative z-20 flex items-center space-x-3 text-white/70 text-sm font-bold uppercase tracking-widest bg-black/20 p-4 rounded-xl border border-white/10 w-fit backdrop-blur-sm">
          <ShieldCheck className="w-5 h-5 text-yellow-400" />
          <span>Akses Terenkripsi & Terlindungi</span>
        </div>
      </div>

      {/* Kanan - Form Login */}
      <div className="w-full md:w-7/12 flex items-center justify-center p-6 sm:p-12 relative bg-white md:bg-gray-50">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="md:hidden absolute top-0 left-0 w-full h-[300px] bg-primary-900 overflow-hidden">
          <img src={heroImage} alt="Bg" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-multiply" />
          <div className="absolute top-4 left-4 z-20">
            <Link to="/" className="inline-flex items-center text-white/80 hover:text-white text-xs font-bold bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <ArrowLeft className="w-3 h-3 mr-1" /> BERANDA
            </Link>
          </div>
        </div>

        <div className="w-full max-w-md relative z-20 mt-20 md:mt-0">
          <div className="bg-white rounded-[2rem] md:shadow-[0_8px_30px_rgb(0,0,0,0.06)] md:border border-gray-100 p-8 sm:p-10 relative">
            
            <div className="md:hidden flex justify-center mb-8 relative">
              <div className="bg-white p-3 rounded-full shadow-2xl absolute -top-24 border-8 border-gray-50">
                <img src={logo} alt="Logo" className="w-20 h-20 object-contain" />
              </div>
            </div>

            <div className="text-center md:text-left mb-10 pt-4 md:pt-0">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase tracking-tight mb-3">Selamat Datang</h2>
              <p className="text-gray-500 font-medium">Silakan masuk menggunakan kredensial pengurus Anda untuk mengelola sistem.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Alamat Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none font-bold"
                    placeholder="admin@karangtaruna.org"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest">Kata Sandi</label>
                  <a href="#" className="text-xs font-bold text-primary-600 hover:text-primary-800 transition-colors">Lupa sandi?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none font-bold tracking-widest"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-2xl text-sm font-black tracking-widest uppercase text-white bg-primary-700 hover:bg-primary-800 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-primary-500/20 shadow-xl shadow-primary-700/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      MEMPROSES...
                    </span>
                  ) : (
                    <span className="flex items-center justify-between w-full px-2">
                      <span>MASUK KE DASHBOARD</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-10 text-center text-xs font-bold text-gray-400">
              <p>&copy; 2026 Karang Taruna Bina Pemuda.<br/>Sistem Informasi Manajemen Terpadu.</p>
            </div>
            
          </div>
        </div>
      </div>
      
    </div>
  );
}
