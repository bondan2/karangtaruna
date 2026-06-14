import { useState, useEffect } from 'react';
import { Newspaper, Plus, Trash2, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function BeritaAdmin() {
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const defaultForm = { judul: '', slug: '', konten: '', is_published: true, gambar_url: '' };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => { fetchBerita(); }, []);

  const fetchBerita = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('berita').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setBerita(data || []);
    } catch (err) { console.error(err.message); } finally { setLoading(false); }
  };

  const generateSlug = (text) => text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      let imageUrl = formData.gambar_url;
      const fileInput = e.target.elements.gambar;
      const file = fileInput?.files[0];

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage.from('berita_images').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('berita_images').getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }

      const dataToInsert = { ...formData, gambar_url: imageUrl, slug: formData.slug || generateSlug(formData.judul) };
      
      if (formData.id) {
        const { id, created_at, ...updateData } = dataToInsert;
        const { error } = await supabase.from('berita').update(updateData).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('berita').insert([dataToInsert]);
        if (error) throw error;
      }
      setShowModal(false);
      setFormData(defaultForm);
      fetchBerita();
    } catch (err) { 
      alert('Gagal menyimpan: ' + err.message); 
    } finally {
      setUploading(false);
    }
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
    if(window.confirm('Hapus berita ini?')) {
      const { error } = await supabase.from('berita').delete().eq('id', id);
      if(!error) fetchBerita();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center">
            <Newspaper className="w-8 h-8 mr-3 text-red-500" /> Berita Publikasi
          </h1>
          <p className="text-gray-500 mt-1">Publikasi artikel dan berita kegiatan terbaru.</p>
        </div>
        <button onClick={handleAdd} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg transition-all">
          <Plus className="w-5 h-5 mr-2" /> Tulis Berita
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : berita.length === 0 ? (
          <div className="p-12 text-center">
            <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Berita</h3>
            <p className="text-gray-500">Mulai tulis artikel pertama untuk website Anda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Judul Berita</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Tanggal Dibuat</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {berita.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{item.judul}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {item.is_published ? 'Dipublikasikan' : 'Draf'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 flex justify-end space-x-2">
                      <button onClick={() => handleEdit(item)} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"><Edit className="w-5 h-5" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{formData.id ? 'Edit Berita' : 'Tulis Berita Baru'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Judul Artikel</label>
                <input required type="text" value={formData.judul} onChange={e => setFormData({...formData, judul: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Masukkan judul..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Isi Berita</label>
                <textarea required rows="6" value={formData.konten} onChange={e => setFormData({...formData, konten: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Tulis isi berita di sini..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Unggah Gambar Cover (Opsional)</label>
                <input type="file" accept="image/*" name="gambar" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                {formData.gambar_url && (
                  <p className="text-xs text-green-600 mt-2">Gambar saat ini: <a href={formData.gambar_url} target="_blank" rel="noreferrer" className="underline">Lihat Gambar</a> (Unggah baru untuk menimpa)</p>
                )}
              </div>
              <div className="pt-4 flex space-x-3">
                <button disabled={uploading} type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl disabled:opacity-50">Batal</button>
                <button disabled={uploading} type="submit" className="flex-1 px-4 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-50">
                  {uploading ? 'Mengunggah & Menyimpan...' : 'Publikasikan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
