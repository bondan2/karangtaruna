import { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function GaleriAdmin() {
  const [galeri, setGaleri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const defaultForm = { judul_foto: '', kategori: 'Kegiatan Rutin', image_url: '' };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => { fetchGaleri(); }, []);

  const fetchGaleri = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('galeri').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setGaleri(data || []);
    } catch (err) { console.error(err.message); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {...formData, image_url: formData.image_url || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80'};
      if (formData.id) {
        const { id, created_at, ...updateData } = payload;
        const { error } = await supabase.from('galeri').update(updateData).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('galeri').insert([payload]);
        if (error) throw error;
      }
      setShowModal(false);
      setFormData(defaultForm);
      fetchGaleri();
    } catch (err) { alert('Gagal: ' + err.message); }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setShowModal(true);
  };

  const handleAdd = () => {
    setFormData(defaultForm);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm('Hapus foto ini?')) {
      const { error } = await supabase.from('galeri').delete().eq('id', id);
      if(!error) fetchGaleri();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center">
            <ImageIcon className="w-8 h-8 mr-3 text-pink-500" /> Galeri Foto
          </h1>
          <p className="text-gray-500 mt-1">Dokumentasi momen kegiatan Karang Taruna.</p>
        </div>
        <button onClick={handleAdd} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg transition-all">
          <Plus className="w-5 h-5 mr-2" /> Tambah Foto
        </button>
      </div>

      {loading ? (
        <div className="bg-white p-8 text-center text-gray-500 rounded-2xl border border-gray-100">Memuat galeri...</div>
      ) : galeri.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-100">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Galeri Masih Kosong</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galeri.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm group">
              <div className="h-48 relative overflow-hidden bg-gray-100">
                <img src={item.image_url} alt={item.judul_foto} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-gray-800 shadow-sm">
                  {item.kategori}
                </span>
              </div>
              <div className="p-5 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-1">{item.judul_foto}</h3>
                  <p className="text-xs text-gray-400 mt-1">{new Date(item.created_at).toLocaleDateString('id-ID')}</p>
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => handleEdit(item)} className="p-2 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{formData.id ? 'Edit Foto' : 'Unggah Foto Baru'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Judul / Keterangan Foto</label>
                <input required type="text" value={formData.judul_foto} onChange={e => setFormData({...formData, judul_foto: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Kategori</label>
                <select value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                  <option value="Kegiatan Rutin">Kegiatan Rutin</option>
                  <option value="Lomba & Event">Lomba & Event</option>
                  <option value="Rapat Warga">Rapat Warga</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">URL Gambar (Simulasi Upload)</label>
                <input type="url" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Kosongkan untuk pakai gambar demo" />
              </div>
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl">Batal</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
