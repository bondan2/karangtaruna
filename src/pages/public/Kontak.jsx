import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { FaInstagram, FaYoutube } from 'react-icons/fa';
import heroImage from '../../assets/hero.png';

export default function Kontak() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="relative h-[300px] md:h-[400px] bg-primary-900 flex items-center justify-center overflow-hidden pt-20">
        <img src={heroImage} alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/50 to-transparent"></div>
        <div className="relative z-10 text-center px-4">
          <h6 className="text-yellow-400 font-bold tracking-widest uppercase mb-2">Tetap Terhubung</h6>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">Hubungi Kami</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid lg:grid-cols-5 gap-8">
          
          {/* Informasi Kontak */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 uppercase mb-6">Sekretariat</h2>
              
              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <MapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Alamat Lengkap</h4>
                    <p className="text-gray-600 text-sm mt-1">Jl. Raya Pondok Betung, Rt.001/05, Kel. Pondok Betung, Kec. Pondok Aren, Kota Tangerang Selatan, Banten</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <Phone className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Telepon / WhatsApp</h4>
                    <p className="text-gray-600 text-sm mt-1">0812-XXXX-XXXX</p>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <Mail className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Email</h4>
                    <p className="text-gray-600 text-sm mt-1">info@katarpondokbetung.org</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Sosial Media */}
            <div className="bg-primary-900 rounded-3xl p-8 shadow-xl text-white">
              <h2 className="text-xl font-black uppercase mb-4 text-yellow-400">Ikuti Sosial Media Kami</h2>
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <FaInstagram className="w-6 h-6 text-white" />
                </a>
                <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <FaYoutube className="w-6 h-6 text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Form Kontak */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100 h-full">
              <h2 className="text-2xl font-black text-gray-900 uppercase mb-2">Kirim Pesan</h2>
              <p className="text-gray-500 mb-8">Punya pertanyaan, saran, atau ajakan kerja sama? Silakan tinggalkan pesan melalui formulir di bawah ini.</p>
              
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" placeholder="Masukkan nama..." />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email / No. HP</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" placeholder="Email atau nomor yang bisa dihubungi..." />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subjek / Keperluan</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" placeholder="Contoh: Undangan Kegiatan..." />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Isi Pesan</label>
                  <textarea rows="5" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none" placeholder="Tuliskan pesan Anda secara lengkap di sini..."></textarea>
                </div>

                <button className="w-full py-4 bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-700/30 flex items-center justify-center hover:bg-primary-800 transition-colors">
                  <Send className="w-5 h-5 mr-2" /> KIRIM PESAN SEKARANG
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
