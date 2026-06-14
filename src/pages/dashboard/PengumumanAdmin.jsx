import { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Edit, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function PengumumanAdmin() {
  const [pengumuman, setPengumuman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const defaultForm = { isi_pengumuman: '', is_aktif: true };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => { fetchPengumuman(); }, []);

  const fetchPengumuman = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('pengumuman').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setPengumuman(data || []);
    } catch (err) { console.error(err.message); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        const { id, created_at, ...updateData } = formData;
        const { error } = await supabase.from('pengumuman').update(updateData).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('pengumuman').insert([formData]);
        if (error) throw error;
      }
      setShowModal(false);
      setFormData(defaultForm);
      fetchPengumuman();
    } catch (err) { alert('Gagal: ' + err.message); }
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
    if(window.confirm('Hapus pengumuman ini?')) {
      const { error } = await supabase.from('pengumuman').delete().eq('id', id);
      if(!error) fetchPengumuman();
    }
  };

  const toggleStatus = async (item) => {
    const { error } = await supabase.from('pengumuman').update({ is_aktif: !item.is_aktif }).eq('id', item.id);
    if (!error) fetchPengumuman();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center">
            <Bell className="w-8 h-8 mr-3 text-red-500" /> Pengumuman
          </h1>
          <p className="text-gray-500 mt-1">Sampaikan informasi cepat untuk ditampilkan di beranda.</p>
        </div>
        <button onClick={handleAdd} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg transition-all">
          <Plus className="w-5 h-5 mr-2" /> Buat Pengumuman
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : pengumuman.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Pengumuman</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Isi Pengumuman</th>
                  <th className="px-6 py-4">Tgl Dibuat</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pengumuman.map((item) => (
                  <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${!item.is_aktif && 'opacity-60'}`}>
                    <td className="px-6 py-4 font-bold text-gray-900">{item.isi_pengumuman}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleStatus(item)} className={`flex items-center px-3 py-1 rounded-full text-xs font-bold ${item.is_aktif ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        {item.is_aktif ? <><Check className="w-3 h-3 mr-1"/> Aktif</> : <><X className="w-3 h-3 mr-1"/> Nonaktif</>}
                      </button>
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
              <h2 className="text-xl font-bold text-gray-900">{formData.id ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Isi Pesan Singkat</label>
                <textarea required rows="3" value={formData.isi_pengumuman} onChange={e => setFormData({...formData, isi_pengumuman: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Tulis pengumuman..."></textarea>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input type="checkbox" id="aktif" checked={formData.is_aktif} onChange={e => setFormData({...formData, is_aktif: e.target.checked})} className="w-5 h-5 text-primary-600 rounded" />
                <label htmlFor="aktif" className="font-bold text-gray-700 cursor-pointer">Langsung Aktifkan/Tayangkan</label>
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
