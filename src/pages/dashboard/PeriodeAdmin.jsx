import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function PeriodeAdmin() {
  const [periode, setPeriode] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    tahun_mulai: new Date().getFullYear(),
    tahun_selesai: new Date().getFullYear() + 2,
    is_aktif: false,
    keterangan: ''
  });

  useEffect(() => {
    fetchPeriode();
  }, []);

  const fetchPeriode = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('periode')
        .select('*')
        .order('tahun_mulai', { ascending: false });
        
      if (error) throw error;
      setPeriode(data || []);
    } catch (error) {
      console.error('Error fetching periode:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Jika set aktif, matikan yang lain dulu
      if (formData.is_aktif) {
        await supabase.from('periode').update({ is_aktif: false }).neq('id', '00000000-0000-0000-0000-000000000000');
      }

      if (isEditing) {
        const { error } = await supabase
          .from('periode')
          .update(formData)
          .eq('id', currentId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('periode')
          .insert([formData]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchPeriode();
    } catch (error) {
      alert('Gagal menyimpan data: ' + error.message);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      tahun_mulai: item.tahun_mulai,
      tahun_selesai: item.tahun_selesai,
      is_aktif: item.is_aktif,
      keterangan: item.keterangan || ''
    });
    setCurrentId(item.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus periode ini?')) {
      try {
        const { error } = await supabase.from('periode').delete().eq('id', id);
        if (error) throw error;
        fetchPeriode();
      } catch (error) {
        alert('Gagal menghapus: ' + error.message);
      }
    }
  };

  const openNewModal = () => {
    setFormData({
      tahun_mulai: new Date().getFullYear(),
      tahun_selesai: new Date().getFullYear() + 2,
      is_aktif: false,
      keterangan: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const setAktif = async (id) => {
    try {
      await supabase.from('periode').update({ is_aktif: false }).neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('periode').update({ is_aktif: true }).eq('id', id);
      fetchPeriode();
    } catch (error) {
      alert('Gagal mengaktifkan: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 text-blue-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Periode Kepengurusan</h1>
            <p className="text-sm text-gray-500 font-medium">Kelola masa bakti kepengurusan Karang Taruna</p>
          </div>
        </div>
        <button 
          onClick={openNewModal}
          className="flex items-center px-4 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" /> Tambah Periode
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-black">Masa Bakti</th>
                <th className="p-4 font-black">Status</th>
                <th className="p-4 font-black">Keterangan</th>
                <th className="p-4 font-black text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-400 font-medium">Memuat data...</td></tr>
              ) : periode.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-400 font-medium">Belum ada data periode.</td></tr>
              ) : (
                periode.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-900">
                      {item.tahun_mulai} - {item.tahun_selesai}
                    </td>
                    <td className="p-4">
                      {item.is_aktif ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Tidak Aktif
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-600">{item.keterangan || '-'}</td>
                    <td className="p-4 text-right">
                      {!item.is_aktif && (
                        <button onClick={() => setAktif(item.id)} className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg mr-2 hover:bg-green-100 transition-colors">
                          Set Aktif
                        </button>
                      )}
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
                {isEditing ? 'Edit Periode' : 'Tambah Periode'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Tahun Mulai</label>
                  <input
                    type="number"
                    name="tahun_mulai"
                    required
                    value={formData.tahun_mulai}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Tahun Selesai</label>
                  <input
                    type="number"
                    name="tahun_selesai"
                    required
                    value={formData.tahun_selesai}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Keterangan</label>
                <textarea
                  name="keterangan"
                  value={formData.keterangan}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                  rows="3"
                ></textarea>
              </div>

              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  id="is_aktif"
                  name="is_aktif"
                  checked={formData.is_aktif}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                />
                <label htmlFor="is_aktif" className="ml-3 font-bold text-gray-700 cursor-pointer">
                  Jadikan Periode Aktif
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
