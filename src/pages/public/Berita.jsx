import { useState, useEffect } from 'react';
import { Newspaper, ChevronRight, Calendar } from 'lucide-react';
import heroImage from '../../assets/hero.png';
import { supabase } from '../../lib/supabase';

export default function Berita() {
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchBerita(); }, []);

  const fetchBerita = async () => {
    try {
      const { data, error } = await supabase.from('berita').select('*').eq('is_published', true).order('created_at', { ascending: false });
      if (!error) setBerita(data || []);
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="relative h-[300px] md:h-[400px] bg-primary-900 flex items-center justify-center overflow-hidden pt-20">
        <img src={heroImage} alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/50 to-transparent"></div>
        <div className="relative z-10 text-center px-4">
          <h6 className="text-yellow-400 font-bold tracking-widest uppercase mb-2">Kabar Terkini</h6>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">Berita Utama</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 min-h-[400px] flex flex-col items-center justify-center">
          {loading ? (
            <div className="py-12 text-center text-gray-500 font-bold">Memuat berita terbaru...</div>
          ) : berita.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Newspaper className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">Belum Ada Publikasi Berita</h3>
              <p className="text-gray-500 max-w-md">Saat ini belum ada artikel berita atau rilis informasi dari divisi Humas Karang Taruna.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {berita.map((item) => (
                <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 hover:-translate-y-2 transition-transform duration-300 flex flex-col">
                  <div className="h-48 bg-gray-200 relative">
                    <img src={item.gambar_url || heroImage} alt={item.judul} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-black tracking-wider text-primary-700 uppercase">
                      Informasi
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center text-gray-400 text-xs font-bold mb-3">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight">{item.judul}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                      {item.konten}
                    </p>
                    <button className="flex items-center text-primary-600 font-black text-sm uppercase tracking-wider hover:text-primary-800 transition-colors group">
                      Baca Selengkapnya
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
