import { useState, useEffect } from 'react';
import { Flag, Plus, Trash2, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Event17AgustusAdmin() {
  const [event, setEvent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const defaultForm = { nama_kegiatan: '', jenis_kegiatan: 'Lomba', penanggung_jawab: '', anggaran: 0, status: 'Direncanakan' };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => { fetchEvent(); }, []);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('event_17_agustus').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setEvent(data || []);
    } catch (err) { console.error(err.message); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        const { id, created_at, ...updateData } = formData;
        const { error } = await supabase.from('event_17_agustus').update(updateData).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('event_17_agustus').insert([formData]);
        if (error) throw error;
      }
      setShowModal(false);
      setFormData(defaultForm);
      fetchEvent();
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
    if(window.confirm('Hapus kegiatan ini dari daftar event 17an?')) {
      const { error } = await supabase.from('event_17_agustus').delete().eq('id', id);
      if(!error) fetchEvent();
    }
  };

  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center">
            <Flag className="w-8 h-8 mr-3 text-red-600" /> Event 17 Agustus
          </h1>
          <p className="text-gray-500 mt-1">Manajemen khusus kepanitiaan HUT RI.</p>
        </div>
        <button onClick={handleAdd} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg transition-all">
          <Plus className="w-5 h-5 mr-2" /> Tambah Kegiatan
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : event.length === 0 ? (
          <div className="p-12 text-center">
            <Flag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Rencana Kegiatan HUT RI</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Nama Kegiatan & Jenis</th>
                  <th className="px-6 py-4">Pj / Koordinator</th>
                  <th className="px-6 py-4">Anggaran</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {event.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{item.nama_kegiatan}</div>
                      <div className="text-sm text-gray-500">{item.jenis_kegiatan}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{item.penanggung_jawab || '-'}</td>
                    <td className="px-6 py-4 font-bold text-primary-600">{formatRupiah(item.anggaran)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                        item.status === 'Berjalan' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.status}
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
              <h2 className="text-xl font-bold text-gray-900">{formData.id ? 'Edit Kegiatan HUT RI' : 'Rencana Kegiatan Baru'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Kegiatan</label>
                <input required type="text" value={formData.nama_kegiatan} onChange={e => setFormData({...formData, nama_kegiatan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Lomba Balap Karung, Malam Puncak..." />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Jenis Kegiatan</label>
                  <select value={formData.jenis_kegiatan} onChange={e => setFormData({...formData, jenis_kegiatan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                    <option value="Lomba">Perlombaan</option>
                    <option value="Kesenian">Kesenian / Panggung</option>
                    <option value="Kerja Bakti">Kerja Bakti</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                    <option value="Direncanakan">Direncanakan</option>
                    <option value="Berjalan">Sedang Berjalan</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Penanggung Jawab (PJ)</label>
                <input type="text" value={formData.penanggung_jawab} onChange={e => setFormData({...formData, penanggung_jawab: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Nama Koordinator..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Rencana Anggaran (Rp)</label>
                <input type="number" min="0" value={formData.anggaran} onChange={e => setFormData({...formData, anggaran: Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xl font-bold" />
              </div>
              
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl">Batal</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg">Simpan Kegiatan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
