import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Image as ImageIcon, Plus, Trash2, XCircle, Camera } from 'lucide-react';

export default function GaleriAdmin() {
  const [galeri, setGaleri] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    judul_foto: '',
    kategori: 'Umum',
    image_url: ''
  });

  const kategoriOptions = ['Umum', 'Kegiatan', 'Lomba', 'Fasilitas', 'Rapat'];

  useEffect(() => {
    fetchGaleri();
  }, []);

  const fetchGaleri = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('galeri')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setGaleri(data || []);
    } catch (error) {
      console.error('Error fetching galeri:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('galeri').insert([formData]);
      if (error) throw error;
      
      setIsModalOpen(false);
      fetchGaleri();
    } catch (error) {
      alert('Gagal mengunggah foto: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus foto ini dari galeri?')) {
      try {
        const { error } = await supabase.from('galeri').delete().eq('id', id);
        if (error) throw error;
        fetchGaleri();
      } catch (error) {
        alert('Gagal menghapus foto: ' + error.message);
      }
    }
  };

  const openNewModal = () => {
    setFormData({
      judul_foto: '',
      kategori: 'Umum',
      image_url: ''
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mr-4 text-pink-600">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Galeri & Dokumentasi</h1>
            <p className="text-sm text-gray-500 font-medium">Manajemen album foto kegiatan organisasi</p>
          </div>
        </div>
        <button 
          onClick={openNewModal}
          className="flex items-center px-4 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Camera className="w-5 h-5 mr-2" /> Unggah Foto
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-gray-400 font-medium bg-white rounded-2xl border border-gray-100">Memuat album foto...</div>
        ) : galeri.length === 0 ? (
          <div className="col-span-full p-12 text-center text-gray-400 font-medium bg-white rounded-2xl border border-gray-100">Belum ada foto di galeri.</div>
        ) : (
          galeri.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img 
                  src={item.image_url} 
                  alt={item.judul_foto} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transform scale-0 group-hover:scale-100 transition-transform shadow-lg"
                    title="Hapus Foto"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="bg-black/60 text-white backdrop-blur-md px-2 py-1 rounded text-xs font-bold">
                    {item.kategori}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 line-clamp-1" title={item.judul_foto}>{item.judul_foto}</h3>
                <p className="text-xs text-gray-500 mt-1">{new Date(item.created_at).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-black text-gray-900">
                Unggah Foto ke Galeri
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Judul / Caption Foto</label>
                <input
                  type="text"
                  name="judul_foto"
                  required
                  value={formData.judul_foto}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Kategori Foto</label>
                <select
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-medium"
                >
                  {kategoriOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">URL Foto (Link Gambar)</label>
                <input
                  type="url"
                  name="image_url"
                  required
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              {/* Image Preview */}
              {formData.image_url && (
                <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-video flex items-center justify-center">
                  <img src={formData.image_url} alt="Preview" className="max-w-full max-h-full object-contain" onError={(e) => {e.target.style.display = 'none'}} />
                </div>
              )}

              <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
                >
                  Unggah Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
