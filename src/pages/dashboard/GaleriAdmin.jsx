import { Image, Plus } from 'lucide-react';

export default function GaleriAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center">
            <Image className="w-8 h-8 mr-3 text-pink-500" /> Galeri Kegiatan
          </h1>
          <p className="text-gray-500 mt-1">Kelola album foto dokumentasi Karang Taruna.</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg transition-all">
          <Plus className="w-5 h-5 mr-2" /> Unggah Foto
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-12 text-center">
        <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Modul Galeri (Segera Hadir)</h3>
        <p className="text-gray-500">Fitur manajemen media dan gambar sedang dalam tahap pengembangan akhir.</p>
      </div>
    </div>
  );
}
