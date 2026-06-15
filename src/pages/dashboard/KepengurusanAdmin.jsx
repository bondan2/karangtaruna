import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Plus, Edit, Trash2, XCircle, CheckCircle } from 'lucide-react';

export default function KepengurusanAdmin() {
  const [kepengurusan, setKepengurusan] = useState([]);
  const [anggotaList, setAnggotaList] = useState([]);
  const [jabatanList, setJabatanList] = useState([]);
  const [periodeList, setPeriodeList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    anggota_id: '',
    jabatan_id: '',
    periode_id: '',
    status_aktif: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [kepData, angData, jabData, perData] = await Promise.all([
        supabase.from('kepengurusan').select('*, anggota(nama_lengkap, nik), jabatan(nama_jabatan, level_akses), periode(tahun_mulai, tahun_selesai)').order('status_aktif', { ascending: false }),
        supabase.from('anggota').select('id, nama_lengkap').eq('status_aktif', true).order('nama_lengkap', { ascending: true }),
        supabase.from('jabatan').select('id, nama_jabatan').order('nama_jabatan', { ascending: true }),
        supabase.from('periode').select('id, tahun_mulai, tahun_selesai, is_aktif').order('tahun_mulai', { ascending: false })
      ]);
      
      setKepengurusan(kepData.data || []);
      setAnggotaList(angData.data || []);
      setJabatanList(jabData.data || []);
      setPeriodeList(perData.data || []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
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
          .from('kepengurusan')
          .update(formData)
          .eq('id', currentId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('kepengurusan')
          .insert([formData]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert('Gagal menyimpan data: ' + error.message);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      anggota_id: item.anggota_id,
      jabatan_id: item.jabatan_id,
      periode_id: item.periode_id,
      status_aktif: item.status_aktif
    });
    setCurrentId(item.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus data kepengurusan ini?')) {
      try {
        const { error } = await supabase.from('kepengurusan').delete().eq('id', id);
        if (error) throw error;
        fetchData();
      } catch (error) {
        alert('Gagal menghapus: ' + error.message);
      }
    }
  };

  const openNewModal = () => {
    // Default to active periode if available
    const activePeriode = periodeList.find(p => p.is_aktif);
    
    setFormData({
      anggota_id: anggotaList.length > 0 ? anggotaList[0].id : '',
      jabatan_id: jabatanList.length > 0 ? jabatanList[0].id : '',
      periode_id: activePeriode ? activePeriode.id : (periodeList.length > 0 ? periodeList[0].id : ''),
      status_aktif: true
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4 text-emerald-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Struktur Kepengurusan</h1>
            <p className="text-sm text-gray-500 font-medium">Susunan pengurus Karang Taruna dan jabatannya</p>
          </div>
        </div>
        <button 
          onClick={openNewModal}
          className="flex items-center px-4 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" /> Tambah Pengurus
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-black">Nama Pengurus</th>
                <th className="p-4 font-black">Jabatan</th>
                <th className="p-4 font-black">Periode</th>
                <th className="p-4 font-black">Status</th>
                <th className="p-4 font-black text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-400 font-medium">Memuat data...</td></tr>
              ) : kepengurusan.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-400 font-medium">Belum ada struktur kepengurusan.</td></tr>
              ) : (
                kepengurusan.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{item.anggota?.nama_lengkap || 'Anggota dihapus'}</div>
                      <div className="text-xs text-gray-500">{item.anggota?.nik}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-primary-700">{item.jabatan?.nama_jabatan || 'Jabatan dihapus'}</div>
                      <div className="text-xs text-primary-500 font-medium">Level: {item.jabatan?.level_akses}</div>
                    </td>
                    <td className="p-4 font-medium text-gray-700">
                      {item.periode ? `${item.periode.tahun_mulai} - ${item.periode.tahun_selesai}` : '-'}
                    </td>
                    <td className="p-4">
                      {item.status_aktif ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                          Non-Aktif / Demisioner
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
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-black text-gray-900">
                {isEditing ? 'Edit Pengurus' : 'Tambah Pengurus Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Pilih Anggota</label>
                <select
                  name="anggota_id"
                  required
                  value={formData.anggota_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                >
                  <option value="" disabled>-- Pilih Anggota --</option>
                  {anggotaList.map((ang) => (
                    <option key={ang.id} value={ang.id}>{ang.nama_lengkap}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Pilih Jabatan</label>
                <select
                  name="jabatan_id"
                  required
                  value={formData.jabatan_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                >
                  <option value="" disabled>-- Pilih Jabatan --</option>
                  {jabatanList.map((jab) => (
                    <option key={jab.id} value={jab.id}>{jab.nama_jabatan}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Periode Masa Bakti</label>
                <select
                  name="periode_id"
                  required
                  value={formData.periode_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                >
                  <option value="" disabled>-- Pilih Periode --</option>
                  {periodeList.map((per) => (
                    <option key={per.id} value={per.id}>
                      {per.tahun_mulai} - {per.tahun_selesai} {per.is_aktif ? '(Aktif)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  id="status_aktif"
                  name="status_aktif"
                  checked={formData.status_aktif}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                />
                <label htmlFor="status_aktif" className="ml-3 font-bold text-gray-700 cursor-pointer">
                  Pengurus Masih Aktif Menjabat
                </label>
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
