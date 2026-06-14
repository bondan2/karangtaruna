import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Wallet, Plus, Edit, Trash2, XCircle, ArrowUpCircle, ArrowDownCircle, Search } from 'lucide-react';

export default function KeuanganTransaksi({ jenisTransaksi, kategori }) {
  const [transaksi, setTransaksi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    keterangan: '',
    nominal: '',
    bukti_struk_url: ''
  });

  const isPemasukan = jenisTransaksi === 'Pemasukan';

  useEffect(() => {
    fetchTransaksi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jenisTransaksi, kategori]);

  const fetchTransaksi = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('keuangan')
        .select('*')
        .eq('jenis_transaksi', jenisTransaksi)
        .eq('kategori', kategori)
        .order('tanggal', { ascending: false })
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setTransaksi(data || []);
    } catch (error) {
      console.error('Error fetching transaksi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        jenis_transaksi: jenisTransaksi,
        kategori: kategori,
        nominal: Number(formData.nominal)
      };

      if (isEditing) {
        const { error } = await supabase
          .from('keuangan')
          .update(payload)
          .eq('id', currentId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('keuangan')
          .insert([payload]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchTransaksi();
    } catch (error) {
      alert('Gagal menyimpan transaksi: ' + error.message);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      tanggal: item.tanggal,
      keterangan: item.keterangan,
      nominal: item.nominal,
      bukti_struk_url: item.bukti_struk_url || ''
    });
    setCurrentId(item.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus data transaksi ini? Aksi ini akan mengubah saldo akhir kas!')) {
      try {
        const { error } = await supabase.from('keuangan').delete().eq('id', id);
        if (error) throw error;
        fetchTransaksi();
      } catch (error) {
        alert('Gagal menghapus transaksi: ' + error.message);
      }
    }
  };

  const openNewModal = () => {
    setFormData({
      tanggal: new Date().toISOString().split('T')[0],
      keterangan: '',
      nominal: '',
      bukti_struk_url: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);
  };

  const filteredTransaksi = transaksi.filter(t => 
    (t.keterangan?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const totalNominal = filteredTransaksi.reduce((sum, item) => sum + Number(item.nominal), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${isPemasukan ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {isPemasukan ? <ArrowDownCircle className="w-6 h-6" /> : <ArrowUpCircle className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">{kategori}</h1>
            <p className="text-sm text-gray-500 font-medium">Buku kas khusus untuk jenis {jenisTransaksi.toLowerCase()} {kategori.toLowerCase()}</p>
          </div>
        </div>
        <button 
          onClick={openNewModal}
          className="flex items-center px-4 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-5 h-5 mr-2" /> Catat {isPemasukan ? 'Pemasukan' : 'Pengeluaran'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari keterangan transaksi..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm font-medium"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="p-4 font-black">Tanggal</th>
                  <th className="p-4 font-black">Keterangan</th>
                  <th className="p-4 font-black text-right">Nominal</th>
                  <th className="p-4 font-black text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="4" className="p-8 text-center text-gray-400 font-medium">Memuat data kas...</td></tr>
                ) : filteredTransaksi.length === 0 ? (
                  <tr><td colSpan="4" className="p-8 text-center text-gray-400 font-medium">Tidak ada transaksi ditemukan.</td></tr>
                ) : (
                  filteredTransaksi.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-bold text-gray-900">{new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-800">{item.keterangan}</div>
                        {item.bukti_struk_url && (
                          <a href={item.bukti_struk_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                            Lihat Struk / Bukti
                          </a>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <span className={`font-black ${isPemasukan ? 'text-green-600' : 'text-red-600'}`}>
                          {isPemasukan ? '+' : '-'}{formatRupiah(item.nominal)}
                        </span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
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

        {/* Panel Ringkasan */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-black text-slate-800 uppercase tracking-wider text-sm flex items-center">
              <Wallet className="w-4 h-4 mr-2 text-slate-500" /> Ringkasan Buku
            </h3>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center items-center text-center">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Total {jenisTransaksi}</p>
            <p className={`text-4xl font-black ${isPemasukan ? 'text-green-600' : 'text-red-600'}`}>
              {formatRupiah(totalNominal)}
            </p>
            <p className="text-xs text-gray-400 mt-4">
              Total dihitung dari {filteredTransaksi.length} transaksi yang ditampilkan di tabel sebelah kiri.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-black text-gray-900">
                {isEditing ? 'Edit Transaksi' : `Catat ${jenisTransaksi} Baru`}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Tanggal Transaksi</label>
                <input
                  type="date"
                  name="tanggal"
                  required
                  value={formData.tanggal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Keterangan / Uraian</label>
                <textarea
                  name="keterangan"
                  required
                  value={formData.keterangan}
                  onChange={handleInputChange}
                  placeholder={`Contoh: ${kategori} bulan Maret...`}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                  rows="3"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nominal (Rp)</label>
                <input
                  type="number"
                  name="nominal"
                  required
                  min="0"
                  value={formData.nominal}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-black text-xl ${isPemasukan ? 'text-green-600' : 'text-red-600'}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">URL Bukti / Struk (Opsional)</label>
                <input
                  type="url"
                  name="bukti_struk_url"
                  value={formData.bukti_struk_url}
                  onChange={handleInputChange}
                  placeholder="Link Google Drive / Imgur..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium text-sm"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
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
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
