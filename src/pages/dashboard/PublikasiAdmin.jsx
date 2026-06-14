import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Newspaper, Bell, Calendar as CalendarIcon, Plus, Edit, Trash2, XCircle, CheckCircle, X } from 'lucide-react';

export default function PublikasiAdmin({ tipe }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // State Dinamis berdasarkan tipe
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipe]);

  const getTableName = () => {
    if (tipe === 'Berita') return 'berita';
    if (tipe === 'Pengumuman') return 'pengumuman';
    return 'agenda';
  };

  const getInitialFormState = () => {
    if (tipe === 'Berita') return { judul: '', konten: '', gambar_url: '', is_published: true };
    if (tipe === 'Pengumuman') return { isi_pengumuman: '', is_aktif: true };
    return { nama_acara: '', tanggal: new Date().toISOString().split('T')[0], waktu: '', lokasi: '', deskripsi: '' };
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const tableName = getTableName();
      let query = supabase.from(tableName).select('*');
      
      if (tipe === 'Berita' || tipe === 'Pengumuman') {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('tanggal', { ascending: true }); // Agenda urut tanggal
      }

      const { data: result, error } = await query;
      if (error) throw error;
      setData(result || []);
    } catch (error) {
      console.error('Error fetching publikasi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const slugify = (text) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      
      // Khusus berita, generate slug otomatis jika belum ada atau saat create
      if (tipe === 'Berita' && !isEditing) {
        payload.slug = slugify(payload.judul) + '-' + Math.floor(Math.random() * 1000);
      }

      const tableName = getTableName();

      if (isEditing) {
        const { error } = await supabase.from(tableName).update(payload).eq('id', currentId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(tableName).insert([payload]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert('Gagal menyimpan data: ' + error.message);
    }
  };

  const handleEdit = (item) => {
    if (tipe === 'Berita') {
      setFormData({ judul: item.judul, konten: item.konten, gambar_url: item.gambar_url || '', is_published: item.is_published });
    } else if (tipe === 'Pengumuman') {
      setFormData({ isi_pengumuman: item.isi_pengumuman, is_aktif: item.is_aktif });
    } else {
      setFormData({ nama_acara: item.nama_acara, tanggal: item.tanggal, waktu: item.waktu || '', lokasi: item.lokasi || '', deskripsi: item.deskripsi || '' });
    }
    
    setCurrentId(item.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Yakin ingin menghapus ${tipe} ini?`)) {
      try {
        const { error } = await supabase.from(getTableName()).delete().eq('id', id);
        if (error) throw error;
        fetchData();
      } catch (error) {
        alert('Gagal menghapus: ' + error.message);
      }
    }
  };

  const openNewModal = () => {
    setFormData(getInitialFormState());
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const getIcon = () => {
    if (tipe === 'Berita') return <Newspaper className="w-6 h-6" />;
    if (tipe === 'Pengumuman') return <Bell className="w-6 h-6" />;
    return <CalendarIcon className="w-6 h-6" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4 text-purple-600">
            {getIcon()}
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">{tipe} Website</h1>
            <p className="text-sm text-gray-500 font-medium">Kelola informasi publik yang ditampilkan di halaman depan</p>
          </div>
        </div>
        <button 
          onClick={openNewModal}
          className="flex items-center px-4 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" /> Tulis {tipe}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                {tipe === 'Berita' && (
                  <>
                    <th className="p-4 font-black">Judul Berita</th>
                    <th className="p-4 font-black">Status</th>
                  </>
                )}
                {tipe === 'Pengumuman' && (
                  <>
                    <th className="p-4 font-black">Isi Pengumuman</th>
                    <th className="p-4 font-black">Status</th>
                  </>
                )}
                {tipe === 'Agenda' && (
                  <>
                    <th className="p-4 font-black">Kegiatan / Acara</th>
                    <th className="p-4 font-black">Jadwal</th>
                    <th className="p-4 font-black">Lokasi</th>
                  </>
                )}
                <th className="p-4 font-black text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-400 font-medium">Memuat data publikasi...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-400 font-medium">Belum ada {tipe.toLowerCase()} yang diterbitkan.</td></tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    {tipe === 'Berita' && (
                      <>
                        <td className="p-4 flex items-center">
                          {item.gambar_url && (
                            <img src={item.gambar_url} alt="Cover" className="w-12 h-12 object-cover rounded-lg mr-3 shadow-sm" />
                          )}
                          <div>
                            <div className="font-bold text-gray-900">{item.judul}</div>
                            <div className="text-xs text-gray-400 mt-1">{new Date(item.created_at).toLocaleDateString('id-ID')}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          {item.is_published ? (
                            <span className="inline-flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded"><CheckCircle className="w-3.5 h-3.5 mr-1"/> Publik</span>
                          ) : (
                            <span className="inline-flex items-center text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded"><X className="w-3.5 h-3.5 mr-1"/> Draft</span>
                          )}
                        </td>
                      </>
                    )}
                    
                    {tipe === 'Pengumuman' && (
                      <>
                        <td className="p-4">
                          <div className="font-medium text-gray-800 line-clamp-2">{item.isi_pengumuman}</div>
                          <div className="text-xs text-gray-400 mt-1">{new Date(item.created_at).toLocaleDateString('id-ID')}</div>
                        </td>
                        <td className="p-4">
                          {item.is_aktif ? (
                            <span className="inline-flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded"><CheckCircle className="w-3.5 h-3.5 mr-1"/> Aktif</span>
                          ) : (
                            <span className="inline-flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded"><X className="w-3.5 h-3.5 mr-1"/> Usang</span>
                          )}
                        </td>
                      </>
                    )}

                    {tipe === 'Agenda' && (
                      <>
                        <td className="p-4">
                          <div className="font-bold text-gray-900">{item.nama_acara}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">{item.deskripsi}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-primary-700">{new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                          <div className="text-xs text-gray-500">{item.waktu || 'Waktu tidak ditentukan'}</div>
                        </td>
                        <td className="p-4 font-medium text-gray-700">
                          {item.lokasi || '-'}
                        </td>
                      </>
                    )}

                    <td className="p-4 text-right whitespace-nowrap">
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
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-black text-gray-900">
                {isEditing ? `Edit ${tipe}` : `Tulis ${tipe} Baru`}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1">
              <form id="publikasiForm" onSubmit={handleSubmit} className="p-6 space-y-5">
                
                {/* Form Berita */}
                {tipe === 'Berita' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Judul Berita</label>
                      <input type="text" name="judul" required value={formData.judul || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-bold text-gray-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">URL Gambar Cover / Banner</label>
                      <input type="url" name="gambar_url" value={formData.gambar_url || ''} onChange={handleInputChange} placeholder="https://..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Konten / Isi Berita</label>
                      <textarea name="konten" required value={formData.konten || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-medium" rows="8"></textarea>
                    </div>
                    <div className="flex items-center pt-2">
                      <input type="checkbox" id="is_published" name="is_published" checked={formData.is_published || false} onChange={handleInputChange} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
                      <label htmlFor="is_published" className="ml-3 font-bold text-gray-700 cursor-pointer">Publikasikan Sekarang (Tampil di Web Publik)</label>
                    </div>
                  </>
                )}

                {/* Form Pengumuman */}
                {tipe === 'Pengumuman' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Isi Pengumuman</label>
                      <textarea name="isi_pengumuman" required value={formData.isi_pengumuman || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-medium text-lg" rows="5"></textarea>
                    </div>
                    <div className="flex items-center pt-2">
                      <input type="checkbox" id="is_aktif" name="is_aktif" checked={formData.is_aktif || false} onChange={handleInputChange} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
                      <label htmlFor="is_aktif" className="ml-3 font-bold text-gray-700 cursor-pointer">Pengumuman Aktif (Tampil di Ticker Web Publik)</label>
                    </div>
                  </>
                )}

                {/* Form Agenda */}
                {tipe === 'Agenda' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nama Acara / Kegiatan</label>
                      <input type="text" name="nama_acara" required value={formData.nama_acara || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Tanggal</label>
                        <input type="date" name="tanggal" required value={formData.tanggal || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Waktu (Jam)</label>
                        <input type="text" name="waktu" placeholder="Misal: 08:00 - Selesai" value={formData.waktu || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Lokasi Kegiatan</label>
                      <input type="text" name="lokasi" value={formData.lokasi || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Deskripsi Ringkas</label>
                      <textarea name="deskripsi" value={formData.deskripsi || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" rows="3"></textarea>
                    </div>
                  </>
                )}

              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3 mt-auto">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">
                Batal
              </button>
              <button type="submit" form="publikasiForm" className="px-5 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm">
                Simpan & Terbitkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
