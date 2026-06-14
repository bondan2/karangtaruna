import { useState, useEffect } from 'react';
import { Box, Plus, Trash2, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function InventarisAdmin() {
  const [inventaris, setInventaris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const defaultForm = { nama_barang: '', jumlah: 1, kondisi: 'Baik', lokasi_penyimpanan: '' };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => { fetchInventaris(); }, []);

  const fetchInventaris = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('inventaris').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setInventaris(data || []);
    } catch (err) { console.error(err.message); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        const { id, created_at, ...updateData } = formData;
        const { error } = await supabase.from('inventaris').update(updateData).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('inventaris').insert([formData]);
        if (error) throw error;
      }
      setShowModal(false);
      setFormData(defaultForm);
      fetchInventaris();
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
    if(window.confirm('Hapus aset ini dari inventaris?')) {
      const { error } = await supabase.from('inventaris').delete().eq('id', id);
      if(!error) fetchInventaris();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center">
            <Box className="w-8 h-8 mr-3 text-emerald-500" /> Inventaris Aset
          </h1>
          <p className="text-gray-500 mt-1">Pencatatan aset barang milik Karang Taruna.</p>
        </div>
        <button onClick={handleAdd} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg transition-all">
          <Plus className="w-5 h-5 mr-2" /> Tambah Aset
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : inventaris.length === 0 ? (
          <div className="p-12 text-center">
            <Box className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Buku Inventaris Kosong</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Nama Barang</th>
                  <th className="px-6 py-4">Jumlah</th>
                  <th className="px-6 py-4">Kondisi</th>
                  <th className="px-6 py-4">Lokasi Penyimpanan</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inventaris.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{item.nama_barang}</td>
                    <td className="px-6 py-4 font-black text-gray-600">{item.jumlah}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.kondisi === 'Baik' ? 'bg-green-100 text-green-700' :
                        item.kondisi === 'Kurang Baik' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.kondisi}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.lokasi_penyimpanan || '-'}</td>
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
              <h2 className="text-xl font-bold text-gray-900">{formData.id ? 'Edit Aset' : 'Tambah Aset Baru'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Barang / Aset</label>
                <input required type="text" value={formData.nama_barang} onChange={e => setFormData({...formData, nama_barang: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Tenda, Sound System, dll" />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Jumlah</label>
                  <input required type="number" min="1" value={formData.jumlah} onChange={e => setFormData({...formData, jumlah: Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Kondisi Barang</label>
                  <select value={formData.kondisi} onChange={e => setFormData({...formData, kondisi: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                    <option value="Baik">Baik</option>
                    <option value="Kurang Baik">Kurang Baik</option>
                    <option value="Rusak">Rusak</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Lokasi Penyimpanan</label>
                <input type="text" value={formData.lokasi_penyimpanan} onChange={e => setFormData({...formData, lokasi_penyimpanan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Contoh: Gudang RT 01..." />
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
