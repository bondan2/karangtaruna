import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Edit, Shield, Search } from 'lucide-react';

export default function SystemUserAdmin() {
  const [users, setUsers] = useState([]);
  const [jabatanList, setJabatanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    role: 'Anggota',
    jabatan: ''
  });

  const roleOptions = ['Admin', 'Ketua', 'Sekretaris', 'Bendahara', 'Anggota'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [profilesData, jabatanData] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('jabatan').select('nama_jabatan').order('nama_jabatan', { ascending: true })
      ]);
      
      if (profilesData.error) throw profilesData.error;
      setUsers(profilesData.data || []);
      setJabatanList(jabatanData.data || []);
      
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (u.role?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', currentId);
        
      if (error) throw error;
      
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert('Gagal mengupdate profil: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      role: user.role || 'Anggota',
      jabatan: user.jabatan || ''
    });
    setCurrentId(user.id);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Manajemen User (Pengguna)</h1>
            <p className="text-sm text-gray-500 font-medium">Kelola hak akses sistem dari seluruh pengguna yang terdaftar</p>
          </div>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari nama atau role..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-black">Profil Pengguna</th>
                <th className="p-4 font-black">Role Akses</th>
                <th className="p-4 font-black">Jabatan Organisasi</th>
                <th className="p-4 font-black text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-400 font-medium">Memuat data pengguna...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-400 font-medium">Tidak ada pengguna ditemukan.</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-blue-500 text-white flex items-center justify-center font-bold text-lg mr-3 shadow-sm">
                          {user.full_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{user.full_name}</div>
                          <div className="text-xs text-gray-500">{user.phone_number || 'Tidak ada nomor telepon'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                        user.role === 'Admin' ? 'bg-red-50 text-red-700 border-red-200' :
                        user.role === 'Ketua' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        <Shield className="w-3.5 h-3.5 mr-1" /> {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-700">
                      {user.jabatan || '-'}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleEdit(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                        <Edit className="w-4 h-4" />
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
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-black text-gray-900">
                Ubah Akses Pengguna
              </h3>
              <p className="text-xs text-gray-500 mt-1">Mengubah Role akan memengaruhi menu apa saja yang bisa diakses oleh pengguna ini.</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Role Akses (Sistem)</label>
                <select
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                >
                  {roleOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Pilih Jabatan (Label Tampilan)</label>
                <select
                  name="jabatan"
                  value={formData.jabatan}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                >
                  <option value="">-- Tidak Ada Jabatan Khusus --</option>
                  {jabatanList.map((jab, idx) => (
                    <option key={idx} value={jab.nama_jabatan}>{jab.nama_jabatan}</option>
                  ))}
                </select>
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
                  disabled={saving}
                  className="px-5 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
