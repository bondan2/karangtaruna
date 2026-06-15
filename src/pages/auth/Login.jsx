import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import logo from '../../assets/img/logo.png';
import heroImage from '../../assets/hero.png';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isRegistering) {
        // Mode Daftar (Register)
        const { data: regData, error: regError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (regError) throw regError;
        alert('Registrasi Berhasil! Silakan login sekarang. (Jika email confirmation aktif, cek inbox Anda).');
        setIsRegistering(false); // Switch back to login
      } else {
        // Mode Masuk (Login)
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;

        // Ambil role asli dari tabel profiles
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile Error:", profileError);
          alert("Gagal mengambil data profil. RLS mungkin masih aktif atau tabel profil bermasalah: " + profileError.message);
        }

        let userRole = profile?.role;
        
        if (!userRole) {
          // Jika tabel profile kosong atau diblokir RLS, tebak dari email
          const emailLower = email.toLowerCase();
          if (emailLower.startsWith('admin') || emailLower.startsWith('ketua')) {
            userRole = 'Ketua';
          } else if (emailLower.startsWith('bendahara')) {
            userRole = 'Bendahara';
          } else if (emailLower.startsWith('sekretaris')) {
            userRole = 'Sekretaris';
          } else {
            userRole = 'Anggota';
          }
        } else {
          // Pastikan Huruf Kapital di Awal (Bendahara, bukan bendahara)
          userRole = userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase();
        }
        
        const userName = profile?.full_name || email;

        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userName', userName);
        navigate('/dashboard');
      }
    } catch (error) {
      alert((isRegistering ? 'Registrasi Gagal: ' : 'Login Gagal: ') + error.message);
    } finally {
      setLoading(false);
    }
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
            
            {/* Header Login/Register */}
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-gray-900 mb-2">{isRegistering ? 'Daftar Akun Baru' : 'Selamat Datang Kembali'}</h2>
              <p className="text-gray-500 font-medium">
                {isRegistering 
                  ? 'Silakan masukkan email dan password untuk mendaftar.' 
                  : 'Silakan masukkan kredensial Anda untuk mengakses sistem.'}
              </p>
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
                  className="w-full bg-primary-700 hover:bg-primary-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-700/30 transition-all flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  {loading ? 'Memproses...' : (isRegistering ? 'DAFTAR SEKARANG' : 'MASUK KE DASHBOARD')}
                  {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </form>

            {/* Toggle Register */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                {isRegistering ? 'Sudah punya akun?' : 'Belum memiliki akun?'} 
                <button 
                  onClick={() => setIsRegistering(!isRegistering)} 
                  className="ml-2 font-bold text-primary-600 hover:text-primary-800 transition-colors"
                >
                  {isRegistering ? 'Masuk di sini' : 'Daftar Akun'}
                </button>
              </p>
            </div>
            
            <div className="mt-10 text-center text-xs font-bold text-gray-400">
              <p>&copy; 2026 Karang Taruna Bina Pemuda.<br/>Sistem Informasi Manajemen Terpadu.</p>
            </div>
            
          </div>
        </div>
      </div>
      
    </div>
  );
}
