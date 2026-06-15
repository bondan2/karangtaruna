import { useState, useEffect } from 'react';
import { Trophy, Flag, Calendar, MapPin, Search } from 'lucide-react';
import heroImage from '../../assets/hero.png';
import { supabase } from '../../lib/supabase';

export default function LombaPublic() {
  const [lomba, setLomba] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLomba, setSelectedLomba] = useState(null);
  const [formData, setFormData] = useState({ nama_lengkap: '', asal_rt_rw: '', nomor_telepon: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('berjalan');
  
  // State for viewing peserta
  const [showPesertaModal, setShowPesertaModal] = useState(false);
  const [pesertaList, setPesertaList] = useState([]);
  const [selectedLombaPeserta, setSelectedLombaPeserta] = useState(null);

  // State for pemenang
  const [pemenang, setPemenang] = useState([]);

  useEffect(() => {
    fetchLomba();
    fetchPemenang();
  }, []);

  const fetchPemenang = async () => {
    try {
      const { data, error } = await supabase
        .from('peserta_lomba')
        .select('*, lomba(nama_lomba)')
        .not('status_juara', 'is', null)
        .neq('status_juara', '');
      
      if (error) throw error;
      setPemenang(data || []);
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleDaftar = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const { error } = await supabase.from('peserta_lomba').insert([{
        lomba_id: selectedLomba.id,
        nama_peserta: formData.nama_lengkap,
        kontak: formData.nomor_telepon,
        asal_rt_rw: formData.asal_rt_rw
      }]);
      if (error) throw error;
      
      alert('Pendaftaran berhasil! Anda telah terdaftar sebagai peserta lomba.');
      setSelectedLomba(null);
      setFormData({ nama_lengkap: '', asal_rt_rw: '', nomor_telepon: '' });
    } catch (err) {
      alert('Terjadi kesalahan saat mendaftar: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewPeserta = async (lomba) => {
    try {
      setSelectedLombaPeserta(lomba);
      setShowPesertaModal(true);
      const { data, error } = await supabase.from('peserta_lomba').select('nama_peserta, asal_rt_rw').eq('lomba_id', lomba.id);
      if (error) throw error;
      setPesertaList(data || []);
    } catch (err) {
      alert('Gagal memuat daftar peserta: ' + err.message);
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
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewPeserta(item)}
                          className="flex-1 bg-white border-2 border-gray-100 hover:border-primary-100 hover:bg-primary-50 text-gray-700 font-bold uppercase tracking-wider py-3 rounded-xl transition-colors text-xs"
                        >
                          Lihat Pendaftar
                        </button>
                        <button 
                          onClick={() => setSelectedLomba(item)}
                          className="flex-1 bg-gray-50 hover:bg-primary-600 hover:text-white text-gray-900 font-black uppercase tracking-wider py-3 rounded-xl transition-colors text-xs"
                        >
                          Daftar Sekarang
                        </button>
                      </div>
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
              
              {pemenang.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mb-6">
                      <Trophy className="w-10 h-10 text-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Belum Ada Pengumuman</h3>
                    <p className="text-gray-500 max-w-md">Belum ada daftar juara lomba yang diterbitkan saat ini.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pemenang.map(item => (
                    <div key={item.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200 shadow-sm flex items-start">
                      <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4 flex-shrink-0 text-yellow-900 shadow-inner">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="inline-block px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-black uppercase rounded mb-2 border border-yellow-300">
                          {item.status_juara}
                        </span>
                        <h4 className="font-black text-gray-900 text-lg leading-tight mb-1">{item.nama_peserta}</h4>
                        <p className="text-sm text-gray-600 font-medium mb-1">{item.asal_rt_rw}</p>
                        <p className="text-xs font-bold text-primary-600 uppercase tracking-wide">{item.lomba?.nama_lomba}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Registration Modal */}
        {selectedLomba && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95">
              <div className="p-6 sm:p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mr-4">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 leading-tight">Formulir Pendaftaran</h2>
                    <p className="text-sm font-bold text-gray-500">{selectedLomba.nama_lomba}</p>
                  </div>
                </div>
                
                <form onSubmit={handleDaftar} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Nama Lengkap</label>
                    <input required type="text" value={formData.nama_lengkap} onChange={e => setFormData({...formData, nama_lengkap: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 rounded-xl outline-none transition-all" placeholder="Masukkan nama lengkap Anda..." />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Asal RT/RW</label>
                      <input required type="text" value={formData.asal_rt_rw} onChange={e => setFormData({...formData, asal_rt_rw: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 rounded-xl outline-none transition-all" placeholder="Contoh: RT.01/RW.05" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">No. WhatsApp</label>
                      <input required type="tel" value={formData.nomor_telepon} onChange={e => setFormData({...formData, nomor_telepon: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 rounded-xl outline-none transition-all" placeholder="08..." />
                    </div>
                  </div>
                  
                  <div className="pt-6 flex gap-3">
                    <button type="button" onClick={() => setSelectedLomba(null)} className="flex-1 px-4 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black tracking-wider uppercase rounded-xl transition-colors text-sm">
                      Batal
                    </button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-black tracking-wider uppercase rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-sm">
                      {isSubmitting ? 'Memproses...' : 'Kirim Formulir'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal Lihat Peserta Publik */}
        {showPesertaModal && selectedLombaPeserta && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[80vh]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                  <h2 className="text-xl font-black text-gray-900 leading-tight">Daftar Pendaftar</h2>
                  <p className="text-sm font-bold text-gray-500 mt-1">{selectedLombaPeserta.nama_lomba}</p>
                </div>
                <button onClick={() => setShowPesertaModal(false)} className="px-4 py-2 bg-white text-gray-600 font-bold border border-gray-200 rounded-xl hover:bg-gray-100">
                  Tutup
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                {pesertaList.length === 0 ? (
                  <div className="py-12 text-center bg-white rounded-2xl border border-gray-100">
                    <Trophy className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-800">Belum Ada Pendaftar</h3>
                    <p className="text-sm text-gray-500 mt-1">Jadilah yang pertama mendaftar lomba ini!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pesertaList.map((p, i) => (
                      <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-black flex items-center justify-center mr-4 flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-gray-900 truncate">{p.nama_peserta}</h4>
                          <p className="text-xs font-bold text-gray-500">{p.asal_rt_rw}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
