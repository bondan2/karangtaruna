import { useState, useEffect } from 'react';
import { Image as ImageIcon, Search } from 'lucide-react';
import heroImage from '../../assets/hero.png';
import { supabase } from '../../lib/supabase';

export default function Galeri() {
  const [galeri, setGaleri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kategoriFilter, setKategoriFilter] = useState('Semua');

  useEffect(() => {
    fetchGaleri();
  }, []);

  const fetchGaleri = async () => {
    try {
      const { data, error } = await supabase
        .from('galeri')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setGaleri(data || []);
    } finally {
      setLoading(false);
    }
  };

  const filteredGaleri = kategoriFilter === 'Semua' 
    ? galeri 
    : galeri.filter(g => g.kategori === kategoriFilter);

  const kategoriOptions = ['Semua', 'Umum', 'Kegiatan', 'Lomba', 'Fasilitas', 'Rapat'];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="relative h-[300px] md:h-[400px] bg-primary-900 flex items-center justify-center overflow-hidden pt-20">
        <img src={heroImage} alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/50 to-transparent"></div>
        <div className="relative z-10 text-center px-4">
          <h6 className="text-yellow-400 font-bold tracking-widest uppercase mb-2">Dokumentasi Kegiatan</h6>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">Galeri Foto</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 min-h-[400px]">
          
          {/* Filter Bar */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {kategoriOptions.map(kat => (
              <button
                key={kat}
                onClick={() => setKategoriFilter(kat)}
                className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${kategoriFilter === kat ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {kat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500 font-bold">Memuat album foto...</div>
          ) : filteredGaleri.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <ImageIcon className="w-12 h-12 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Foto {kategoriFilter !== 'Semua' ? `Kategori ${kategoriFilter}` : ''}</h2>
              <p className="text-gray-500 max-w-md mx-auto">Dokumentasi kegiatan akan segera kami bagikan di sini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
              {filteredGaleri.map(item => (
                <div key={item.id} className="group relative rounded-2xl overflow-hidden aspect-square bg-gray-100 border border-gray-100 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
                  <img src={item.image_url} alt={item.judul_foto} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <span className="text-primary-400 font-bold text-[10px] uppercase tracking-widest mb-1">{item.kategori}</span>
                    <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md">{item.judul_foto}</h3>
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
