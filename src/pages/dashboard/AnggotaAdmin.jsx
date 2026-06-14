import { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AnggotaAdmin() {
  const [anggota, setAnggota] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const defaultForm = { nama_lengkap: '', nik: '', alamat: '', status_aktif: true };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => { fetchAnggota(); }, []);

  const fetchAnggota = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('anggota').select('*').order('tanggal_bergabung', { ascending: false });
      if (error) throw error;
      setAnggota(data || []);
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
        const { id, ...updateData } = formData;
        const { error } = await supabase.from('anggota').update(updateData).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('anggota').insert([formData]);
        if (error) throw error;
      }
      setShowModal(false);
      setFormData(defaultForm);
      fetchAnggota();
    } catch (err) {
      alert('Gagal menyimpan: ' + err.message);
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
    if(window.confirm('Yakin ingin menghapus data anggota ini?')) {
      const { error } = await supabase.from('anggota').delete().eq('id', id);
      if(error) alert(error.message);
      else fetchAnggota();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center">
            <Users className="w-8 h-8 mr-3 text-blue-500" /> Manajemen Anggota
          </h1>
          <p className="text-gray-500 mt-1">Kelola data keanggotaan Karang Taruna.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-primary-600/30 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" /> Tambah Anggota
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data dari Supabase...</div>
        ) : anggota.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Anggota</h3>
            <p className="text-gray-500">Mulai input data anggota Karang Taruna di sini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Nama Lengkap</th>
                  <th className="px-6 py-4">NIK</th>
                  <th className="px-6 py-4">Alamat</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {anggota.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{item.nama_lengkap}</td>
                    <td className="px-6 py-4 text-gray-600">{item.nik || '-'}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate">{item.alamat}</td>
                    <td className="px-6 py-4">
                      {item.status_aktif ? 
                        <span className="flex items-center text-green-600 font-bold text-sm"><CheckCircle2 className="w-4 h-4 mr-1"/> Aktif</span> : 
                        <span className="flex items-center text-red-600 font-bold text-sm"><XCircle className="w-4 h-4 mr-1"/> Non-aktif</span>
                      }
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
              <h2 className="text-xl font-bold text-gray-900">{formData.id ? 'Edit Data Anggota' : 'Registrasi Anggota Baru'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                <input required type="text" value={formData.nama_lengkap} onChange={e => setFormData({...formData, nama_lengkap: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">NIK (Nomor Induk Kependudukan)</label>
                <input type="text" value={formData.nik} onChange={e => setFormData({...formData, nik: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Alamat Domisili</label>
                <textarea required rows="3" value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"></textarea>
              </div>
              
              {formData.id && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Status Keanggotaan</label>
                  <select value={formData.status_aktif} onChange={e => setFormData({...formData, status_aktif: e.target.value === 'true'})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                    <option value="true">Aktif</option>
                    <option value="false">Non-aktif</option>
                  </select>
                </div>
              )}
              
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl">Batal</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
