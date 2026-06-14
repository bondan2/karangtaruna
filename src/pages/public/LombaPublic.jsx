import { useState, useEffect } from 'react';
import { Trophy, Flag, Calendar, MapPin, Search } from 'lucide-react';
import heroImage from '../../assets/hero.png';
import { supabase } from '../../lib/supabase';

export default function LombaPublic() {
  const [lomba, setLomba] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('berjalan');

  useEffect(() => {
    fetchLomba();
  }, []);

  const fetchLomba = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('lomba').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setLomba(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="relative h-[300px] md:h-[400px] bg-primary-900 flex items-center justify-center overflow-hidden pt-20">
        <img src={heroImage} alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/50 to-transparent"></div>
        <div className="relative z-10 text-center px-4">
          <h6 className="text-yellow-400 font-bold tracking-widest uppercase mb-2">Ajang Kreativitas Warga</h6>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">Portal Perlombaan</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 space-y-8">
        
        {/* Navigasi Tab */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex space-x-2 w-full max-w-md mx-auto">
          <button 
            onClick={() => setActiveTab('berjalan')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex justify-center items-center ${activeTab === 'berjalan' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Flag className="w-4 h-4 mr-2" /> SEDANG DIBUKA
          </button>
          <button 
            onClick={() => setActiveTab('selesai')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex justify-center items-center ${activeTab === 'selesai' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Trophy className="w-4 h-4 mr-2" /> TELAH SELESAI
          </button>
        </div>

        {/* Konten Lomba */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 min-h-[500px]">
          {activeTab === 'berjalan' && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-black text-gray-900 uppercase">Daftar Lomba Aktif</h2>
                <p className="text-gray-500 text-sm mt-2 md:mt-0">Daftar lomba yang dapat diikuti warga saat ini.</p>
              </div>
              
              {loading ? (
                <div className="py-12 text-center text-gray-500 font-bold">Memuat data lomba...</div>
              ) : lomba.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <Flag className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Tidak Ada Lomba Saat Ini</h3>
                  <p className="text-gray-500 max-w-md">Belum ada kegiatan perlombaan yang sedang membuka pendaftaran. Tunggu informasi seru selanjutnya!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {lomba.map((item) => (
                    <div key={item.id} className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-primary-100 text-primary-700 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full">
                          {item.kategori}
                        </span>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                          {item.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">{item.nama_lomba}</h3>
                      <div className="flex items-center text-gray-500 text-sm font-medium mb-6">
                        <Calendar className="w-4 h-4 mr-2" /> {item.tanggal_pelaksanaan}
                      </div>
                      <button className="w-full bg-gray-50 hover:bg-primary-600 hover:text-white text-gray-900 font-black uppercase tracking-widest py-3 rounded-xl transition-colors">
                        Daftar Sekarang
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'selesai' && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-black text-gray-900 uppercase">Papan Pengumuman Pemenang</h2>
                <p className="text-gray-500 text-sm mt-2 md:mt-0">Daftar para juara lomba sebelumnya.</p>
              </div>
              
              <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mb-6">
                    <Trophy className="w-10 h-10 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Belum Ada Pengumuman</h3>
                  <p className="text-gray-500 max-w-md">Belum ada daftar juara lomba yang diterbitkan saat ini.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
