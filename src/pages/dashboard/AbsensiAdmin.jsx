import { useState, useEffect } from 'react';
import { ClipboardList, Plus, Trash2, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AbsensiAdmin() {
  const [absensi, setAbsensi] = useState([]);
  const [anggotaList, setAnggotaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const defaultForm = { anggota_id: '', tanggal: new Date().toISOString().split('T')[0], kegiatan: '', status_hadir: 'Hadir' };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch absensi along with anggota name
      const { data: absensiData, error: absensiError } = await supabase
        .from('absensi')
        .select(`
          *,
          anggota:anggota_id (nama_lengkap)
        `)
        .order('tanggal', { ascending: false });
      
      if (absensiError) throw absensiError;
      setAbsensi(absensiData || []);

      // Fetch anggota for dropdown
      const { data: anggotaData, error: anggotaError } = await supabase
        .from('anggota')
        .select('id, nama_lengkap')
        .order('nama_lengkap', { ascending: true });
        
      if (anggotaError) throw anggotaError;
      setAnggotaList(anggotaData || []);

    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        const { id, anggota, ...updateData } = formData;
        const { error } = await supabase.from('absensi').update(updateData).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('absensi').insert([formData]);
        if (error) throw error;
      }
      setShowModal(false);
      setFormData(defaultForm);
      fetchData();
    } catch (err) {
      alert('Gagal: ' + err.message);
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
    if(window.confirm('Hapus data absensi ini?')) {
      const { error } = await supabase.from('absensi').delete().eq('id', id);
      if(!error) fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center">
            <ClipboardList className="w-8 h-8 mr-3 text-teal-500" /> Absensi Anggota
          </h1>
          <p className="text-gray-500 mt-1">Rekap kehadiran anggota pada rapat dan kegiatan.</p>
        </div>
        <button onClick={handleAdd} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg transition-all">
          <Plus className="w-5 h-5 mr-2" /> Catat Kehadiran
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : absensi.length === 0 ? (
          <div className="p-12 text-center">
            <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Data Absensi</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Tanggal & Kegiatan</th>
                  <th className="px-6 py-4">Nama Anggota</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {absensi.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{item.tanggal}</div>
                      <div className="text-sm text-gray-500">{item.kegiatan}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-700">{item.anggota?.nama_lengkap || 'Anggota Dihapus'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.status_hadir === 'Hadir' ? 'bg-green-100 text-green-700' :
                        item.status_hadir === 'Izin' ? 'bg-blue-100 text-blue-700' :
                        item.status_hadir === 'Sakit' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {item.status_hadir}
                      </span>
                    </td>
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
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{formData.id ? 'Edit Data Absensi' : 'Catat Kehadiran Baru'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Anggota</label>
                <select required value={formData.anggota_id} onChange={e => setFormData({...formData, anggota_id: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                  <option value="" disabled>-- Pilih Anggota --</option>
                  {anggotaList.map(a => (
                    <option key={a.id} value={a.id}>{a.nama_lengkap}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal</label>
                  <input required type="date" value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Status Hadir</label>
                  <select value={formData.status_hadir} onChange={e => setFormData({...formData, status_hadir: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                    <option value="Hadir">Hadir</option>
                    <option value="Izin">Izin</option>
                    <option value="Sakit">Sakit</option>
                    <option value="Alpa">Alpa</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Kegiatan / Rapat</label>
                <input required type="text" value={formData.kegiatan} onChange={e => setFormData({...formData, kegiatan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Contoh: Rapat Mingguan..." />
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
