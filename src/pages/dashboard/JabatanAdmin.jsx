import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Shield, Plus, Edit, Trash2, XCircle } from 'lucide-react';

export default function JabatanAdmin() {
  const [jabatan, setJabatan] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    nama_jabatan: '',
    level_akses: 'Anggota',
    deskripsi: ''
  });

  const levelAksesOptions = ['Admin', 'Ketua', 'Sekretaris', 'Bendahara', 'Anggota'];

  useEffect(() => {
    fetchJabatan();
  }, []);

  const fetchJabatan = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jabatan')
        .select('*')
        .order('nama_jabatan', { ascending: true });
        
      if (error) throw error;
      setJabatan(data || []);
    } catch (error) {
      console.error('Error fetching jabatan:', error);
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
      if (isEditing) {
        const { error } = await supabase
          .from('jabatan')
          .update(formData)
          .eq('id', currentId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('jabatan')
          .insert([formData]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchJabatan();
    } catch (error) {
      alert('Gagal menyimpan data: ' + error.message);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      nama_jabatan: item.nama_jabatan,
      level_akses: item.level_akses || 'Anggota',
      deskripsi: item.deskripsi || ''
    });
    setCurrentId(item.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus jabatan ini?')) {
      try {
        const { error } = await supabase.from('jabatan').delete().eq('id', id);
        if (error) throw error;
        fetchJabatan();
      } catch (error) {
        alert('Gagal menghapus (Mungkin sedang digunakan): ' + error.message);
      }
    }
  };

  const openNewModal = () => {
    setFormData({
      nama_jabatan: '',
      level_akses: 'Anggota',
      deskripsi: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-4 text-indigo-600">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Master Jabatan</h1>
            <p className="text-sm text-gray-500 font-medium">Kelola daftar jabatan dan hak akses default</p>
          </div>
        </div>
        <button 
          onClick={openNewModal}
          className="flex items-center px-4 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" /> Tambah Jabatan
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-black">Nama Jabatan</th>
                <th className="p-4 font-black">Level Akses (Sistem)</th>
                <th className="p-4 font-black">Deskripsi</th>
                <th className="p-4 font-black text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-400 font-medium">Memuat data...</td></tr>
              ) : jabatan.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-400 font-medium">Belum ada data jabatan.</td></tr>
              ) : (
                jabatan.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-900">{item.nama_jabatan}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100">
                        {item.level_akses}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{item.deskripsi || '-'}</td>
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
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-black text-gray-900">
                {isEditing ? 'Edit Jabatan' : 'Tambah Jabatan'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nama Jabatan</label>
                <input
                  type="text"
                  name="nama_jabatan"
                  required
                  placeholder="Cth: Ketua Umum, Sekretaris I, Humas"
                  value={formData.nama_jabatan}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Pilih Level Akses Sistem</label>
                <select
                  name="level_akses"
                  required
                  value={formData.level_akses}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                >
                  {levelAksesOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">Level akses ini menentukan hak akses menu (Role) saat pengguna login.</p>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Deskripsi Tugas</label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  placeholder="Tugas pokok dan fungsi dari jabatan ini"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                  rows="3"
                ></textarea>
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
