import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FolderOpen, Plus, Edit, Trash2, XCircle, Search, DownloadCloud } from 'lucide-react';

export default function DokumenAdmin({ kategoriDokumen }) {
  const [dokumen, setDokumen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    nama_dokumen: '',
    file_url: ''
  });

  const isGeneral = kategoriDokumen === 'Semua';

  useEffect(() => {
    fetchDokumen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kategoriDokumen]);

  const fetchDokumen = async () => {
    try {
      setLoading(true);
      let query = supabase.from('dokumen').select('*');
      
      if (!isGeneral) {
        query = query.eq('kategori', kategoriDokumen);
      }
      
      const { data, error } = await query.order('diunggah_pada', { ascending: false });
        
      if (error) throw error;
      setDokumen(data || []);
    } catch (error) {
      console.error('Error fetching dokumen:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDokumen = dokumen.filter(d => 
    (d.nama_dokumen?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        kategori: isGeneral ? 'Lainnya' : kategoriDokumen
      };

      if (isEditing) {
        const { error } = await supabase.from('dokumen').update(payload).eq('id', currentId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('dokumen').insert([payload]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchDokumen();
    } catch (error) {
      alert('Gagal menyimpan dokumen: ' + error.message);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      nama_dokumen: item.nama_dokumen,
      file_url: item.file_url
    });
    setCurrentId(item.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus dokumen arsip ini?')) {
      try {
        const { error } = await supabase.from('dokumen').delete().eq('id', id);
        if (error) throw error;
        fetchDokumen();
      } catch (error) {
        alert('Gagal menghapus: ' + error.message);
      }
    }
  };

  const openNewModal = () => {
    setFormData({
      nama_dokumen: '',
      file_url: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4 text-emerald-600">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Arsip {isGeneral ? 'Dokumen' : kategoriDokumen}
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Manajemen *Cloud Drive* khusus dokumen organisasi
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari file dokumen..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm font-medium"
            />
          </div>
          <button 
            onClick={openNewModal}
            className="flex items-center px-4 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-5 h-5 mr-1 md:mr-2" /> <span className="hidden md:inline">Unggah File</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-black">Nama Dokumen / File</th>
                {isGeneral && <th className="p-4 font-black">Kategori</th>}
                <th className="p-4 font-black">Tanggal Diunggah</th>
                <th className="p-4 font-black text-center">Akses File</th>
                <th className="p-4 font-black text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={isGeneral ? 5 : 4} className="p-8 text-center text-gray-400 font-medium">Memuat daftar file...</td></tr>
              ) : filteredDokumen.length === 0 ? (
                <tr><td colSpan={isGeneral ? 5 : 4} className="p-8 text-center text-gray-400 font-medium">Belum ada dokumen yang diunggah ke *cloud*.</td></tr>
              ) : (
                filteredDokumen.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900 flex items-center">
                        <FolderOpen className="w-4 h-4 mr-2 text-yellow-500" />
                        {item.nama_dokumen}
                      </div>
                    </td>
                    
                    {isGeneral && (
                      <td className="p-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border bg-gray-100 text-gray-700 border-gray-200">
                          {item.kategori}
                        </span>
                      </td>
                    )}
                    
                    <td className="p-4 font-medium text-gray-600 text-sm">
                      {new Date(item.diunggah_pada).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </td>
                    
                    <td className="p-4 text-center">
                      <a href={item.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200 rounded-xl text-sm font-bold transition-colors">
                        <DownloadCloud className="w-4 h-4 mr-2" /> Buka / Unduh
                      </a>
                    </td>

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
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-black text-gray-900">
                {isEditing ? 'Edit Informasi Dokumen' : 'Unggah Dokumen Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nama Dokumen / Berkas</label>
                <input
                  type="text"
                  name="nama_dokumen"
                  required
                  value={formData.nama_dokumen}
                  onChange={handleInputChange}
                  placeholder="Misal: Proposal 17 Agustus 2024 V2.pdf"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">URL Link File (Google Drive / Dropbox)</label>
                <input
                  type="url"
                  name="file_url"
                  required
                  value={formData.file_url}
                  onChange={handleInputChange}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mt-4">
                <p className="text-xs text-blue-800 font-medium">
                  Pastikan tautan link dari Google Drive sudah diatur privasinya menjadi "Bisa dilihat oleh siapa saja yang memiliki tautan" (*Anyone with the link*).
                </p>
              </div>

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
                  Simpan Arsip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
