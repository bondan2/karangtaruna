import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ImageIcon, Plus, Edit, Trash2, XCircle, CheckCircle } from 'lucide-react';

export default function BannerWebsiteAdmin() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    judul: '',
    sub_judul: '',
    image_url: '',
    urutan: 0,
    is_aktif: true
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('banner_website')
        .select('*')
        .order('urutan', { ascending: true });
        
      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('banner_website')
          .update(formData)
          .eq('id', currentId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('banner_website')
          .insert([formData]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchBanners();
    } catch (error) {
      alert('Gagal menyimpan data: ' + error.message);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      judul: item.judul || '',
      sub_judul: item.sub_judul || '',
      image_url: item.image_url,
      urutan: item.urutan,
      is_aktif: item.is_aktif
    });
    setCurrentId(item.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus banner ini?')) {
      try {
        const { error } = await supabase.from('banner_website').delete().eq('id', id);
        if (error) throw error;
        fetchBanners();
      } catch (error) {
        alert('Gagal menghapus: ' + error.message);
      }
    }
  };

  const openNewModal = () => {
    setFormData({
      judul: '',
      sub_judul: '',
      image_url: '',
      urutan: banners.length + 1,
      is_aktif: true
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mr-4 text-pink-600">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Banner Website</h1>
            <p className="text-sm text-gray-500 font-medium">Kelola gambar slider yang tampil di beranda web publik</p>
          </div>
        </div>
        <button 
          onClick={openNewModal}
          className="flex items-center px-4 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" /> Tambah Banner
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-black">Preview</th>
                <th className="p-4 font-black">Teks / Headline</th>
                <th className="p-4 font-black text-center">Urutan</th>
                <th className="p-4 font-black">Status</th>
                <th className="p-4 font-black text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-400 font-medium">Memuat data...</td></tr>
              ) : banners.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-400 font-medium">Belum ada banner. Web akan menampilkan warna solid.</td></tr>
              ) : (
                banners.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="w-32 h-16 bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
                        {item.image_url ? (
                          <img src={item.image_url} alt="Banner" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/300x150?text=Gambar+Rusak' }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{item.judul || '-'}</div>
                      <div className="text-xs text-gray-500">{item.sub_judul || '-'}</div>
                    </td>
                    <td className="p-4 text-center font-black text-gray-700">{item.urutan}</td>
                    <td className="p-4">
                      {item.is_aktif ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Disembunyikan
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-black text-gray-900">
                {isEditing ? 'Edit Banner' : 'Tambah Banner'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Judul Utama (Headline)</label>
                <input
                  type="text"
                  name="judul"
                  value={formData.judul}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Sub Judul / Teks Kecil</label>
                <input
                  type="text"
                  name="sub_judul"
                  value={formData.sub_judul}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">URL Gambar (Link Image)</label>
                <input
                  type="url"
                  name="image_url"
                  required
                  placeholder="https://..."
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                />
                <p className="text-xs text-gray-500 mt-2">Untuk sementara gunakan URL gambar yang sudah online (Contoh: Imgur, Google Drive public link).</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Urutan Tampil</label>
                  <input
                    type="number"
                    name="urutan"
                    required
                    value={formData.urutan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                  />
                </div>
                
                <div className="flex flex-col justify-end pb-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_aktif"
                      name="is_aktif"
                      checked={formData.is_aktif}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                    />
                    <label htmlFor="is_aktif" className="ml-3 font-bold text-gray-700 cursor-pointer">
                      Banner Aktif
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
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
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
