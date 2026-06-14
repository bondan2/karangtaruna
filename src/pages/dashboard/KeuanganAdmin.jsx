import { useState, useEffect } from 'react';
import { Wallet, Plus, Trash2, ArrowUpRight, ArrowDownRight, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function KeuanganAdmin() {
  const [keuangan, setKeuangan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const defaultForm = { tanggal: new Date().toISOString().split('T')[0], jenis_transaksi: 'Pemasukan', kategori: '', keterangan: '', nominal: '' };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => { fetchKeuangan(); }, []);

  const fetchKeuangan = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('keuangan').select('*').order('tanggal', { ascending: false });
      if (error) throw error;
      setKeuangan(data || []);
    } catch (err) { console.error(err.message); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        const { id, ...updateData } = formData;
        const { error } = await supabase.from('keuangan').update({...updateData, nominal: Number(updateData.nominal)}).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('keuangan').insert([{...formData, nominal: Number(formData.nominal)}]);
        if (error) throw error;
      }
      setShowModal(false);
      setFormData(defaultForm);
      fetchKeuangan();
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
    if(window.confirm('Hapus transaksi ini?')) {
      const { error } = await supabase.from('keuangan').delete().eq('id', id);
      if(!error) fetchKeuangan();
    }
  };

  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center">
            <Wallet className="w-8 h-8 mr-3 text-green-500" /> Transparansi Kas
          </h1>
          <p className="text-gray-500 mt-1">Catat seluruh arus kas masuk dan keluar.</p>
        </div>
        <button onClick={handleAdd} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg transition-all">
          <Plus className="w-5 h-5 mr-2" /> Mutasi Baru
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data mutasi...</div>
        ) : keuangan.length === 0 ? (
          <div className="p-12 text-center">
            <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Buku Kas Kosong</h3>
            <p className="text-gray-500">Belum ada riwayat transaksi yang tercatat.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Jenis</th>
                  <th className="px-6 py-4">Keterangan</th>
                  <th className="px-6 py-4">Nominal</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {keuangan.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-600 font-medium">{item.tanggal}</td>
                    <td className="px-6 py-4">
                      {item.jenis_transaksi === 'Pemasukan' ? (
                        <span className="flex items-center text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full w-fit"><ArrowUpRight className="w-4 h-4 mr-1"/> Masuk</span>
                      ) : (
                        <span className="flex items-center text-red-600 font-bold text-sm bg-red-50 px-3 py-1 rounded-full w-fit"><ArrowDownRight className="w-4 h-4 mr-1"/> Keluar</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">{item.keterangan} <span className="block text-xs text-gray-400 font-normal">{item.kategori}</span></td>
                    <td className={`px-6 py-4 font-black ${item.jenis_transaksi === 'Pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.jenis_transaksi === 'Pemasukan' ? '+' : '-'}{formatRupiah(item.nominal)}
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
              <h2 className="text-xl font-bold text-gray-900">{formData.id ? 'Edit Transaksi Kas' : 'Catat Mutasi Kas Baru'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal</label>
                  <input required type="date" value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Jenis Transaksi</label>
                  <select value={formData.jenis_transaksi} onChange={e => setFormData({...formData, jenis_transaksi: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold">
                    <option value="Pemasukan">Uang Masuk (+)</option>
                    <option value="Pengeluaran">Uang Keluar (-)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Keterangan / Uraian</label>
                <input required type="text" value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Contoh: Pembelian alat tulis rapat..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nominal (Rp)</label>
                <input required type="number" min="0" value={formData.nominal} onChange={e => setFormData({...formData, nominal: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-2xl font-black text-gray-900" placeholder="0" />
              </div>
              
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl">Batal</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg">Simpan Transaksi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
