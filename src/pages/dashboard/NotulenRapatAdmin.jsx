import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function NotulenRapatAdmin() {
  const [notulen, setNotulen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const defaultForm = { judul_rapat: '', tanggal: new Date().toISOString().split('T')[0], hasil_keputusan: '', notulis: '' };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => { fetchNotulen(); }, []);

  const fetchNotulen = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('notulen_rapat').select('*').order('tanggal', { ascending: false });
      if (error) throw error;
      setNotulen(data || []);
    } catch (err) { console.error(err.message); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        const { id, created_at, ...updateData } = formData;
        const { error } = await supabase.from('notulen_rapat').update(updateData).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('notulen_rapat').insert([formData]);
        if (error) throw error;
      }
      setShowModal(false);
      setFormData(defaultForm);
      fetchNotulen();
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
    if(window.confirm('Hapus notulen rapat ini?')) {
      const { error } = await supabase.from('notulen_rapat').delete().eq('id', id);
      if(!error) fetchNotulen();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-indigo-500" /> Notulen Rapat
          </h1>
          <p className="text-gray-500 mt-1">Dokumentasikan hasil keputusan dan jalannya rapat.</p>
        </div>
        <button onClick={handleAdd} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg transition-all">
          <Plus className="w-5 h-5 mr-2" /> Buat Notulensi
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : notulen.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Notulen</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Rapat & Tanggal</th>
                  <th className="px-6 py-4">Hasil Keputusan</th>
                  <th className="px-6 py-4">Notulis</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {notulen.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{item.judul_rapat}</div>
                      <div className="text-sm text-gray-500">{new Date(item.tanggal).toLocaleDateString('id-ID')}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium max-w-sm line-clamp-2">{item.hasil_keputusan}</td>
                    <td className="px-6 py-4 text-gray-600">{item.notulis || '-'}</td>
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
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{formData.id ? 'Edit Notulensi' : 'Tulis Notulensi Baru'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex space-x-4">
                <div className="flex-2 w-2/3">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Judul Rapat</label>
                  <input required type="text" value={formData.judul_rapat} onChange={e => setFormData({...formData, judul_rapat: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Contoh: Rapat Evaluasi Proker..." />
                </div>
                <div className="flex-1 w-1/3">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal</label>
                  <input required type="date" value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Hasil Keputusan Rapat</label>
                <textarea required rows="5" value={formData.hasil_keputusan} onChange={e => setFormData({...formData, hasil_keputusan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Tuliskan poin-poin keputusan rapat..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Notulis</label>
                <input type="text" value={formData.notulis} onChange={e => setFormData({...formData, notulis: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Siapa yang mencatat..." />
              </div>
              
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl">Batal</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg">Simpan Notulen</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
