import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import heroImage from '../../assets/hero.png';

export default function Galeri() {
  const [galeri] = useState([]);

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
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 min-h-[400px] flex flex-col items-center justify-center">
          {galeri.length === 0 ? (
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Galeri Kosong</h2>
              <p className="text-gray-500 max-w-md mx-auto">Belum ada foto yang diunggah ke dalam galeri. Momen kegiatan akan segera kami bagikan di sini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">{/* Render gallery here later */}</div>
          )}
        </div>
      </div>
    </div>
  );
}
