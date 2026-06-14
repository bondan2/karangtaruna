import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { BarChart3, TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react';

export default function KeuanganLaporan({ rentang }) {
  const [transaksi, setTransaksi] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [bulanSelected, setBulanSelected] = useState(new Date().getMonth() + 1);
  const [tahunSelected, setTahunSelected] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('keuangan')
        .select('*')
        .order('tanggal', { ascending: false });
        
      if (error) throw error;
      setTransaksi(data || []);
    } catch (error) {
      console.error('Error fetching keuangan:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);
  };

  // Filter data berdasarkan rentang
  let filteredData = transaksi;
  if (rentang === 'Bulanan') {
    filteredData = transaksi.filter(t => {
      const d = new Date(t.tanggal);
      return d.getMonth() + 1 === parseInt(bulanSelected) && d.getFullYear() === parseInt(tahunSelected);
    });
  } else if (rentang === 'Tahunan') {
    filteredData = transaksi.filter(t => {
      const d = new Date(t.tanggal);
      return d.getFullYear() === parseInt(tahunSelected);
    });
  } else if (rentang === 'Harian') {
    // Tampilkan 30 hari terakhir
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    filteredData = transaksi.filter(t => new Date(t.tanggal) >= thirtyDaysAgo);
  }

  const totalPemasukan = filteredData.filter(t => t.jenis_transaksi === 'Pemasukan').reduce((sum, t) => sum + Number(t.nominal), 0);
  const totalPengeluaran = filteredData.filter(t => t.jenis_transaksi === 'Pengeluaran').reduce((sum, t) => sum + Number(t.nominal), 0);
  const saldoAkhir = totalPemasukan - totalPengeluaran;

  // Render filter bar
  const renderFilter = () => {
    if (rentang === 'Rekap Kas' || rentang === 'Harian') return null;
    
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-4 mb-6">
        <span className="font-bold text-gray-700 text-sm flex items-center">
          <Calendar className="w-4 h-4 mr-2" /> Filter Periode:
        </span>
        
        {rentang === 'Bulanan' && (
          <select 
            value={bulanSelected} 
            onChange={(e) => setBulanSelected(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm font-bold"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('id-ID', { month: 'long' })}</option>
            ))}
          </select>
        )}

        <select 
          value={tahunSelected} 
          onChange={(e) => setTahunSelected(e.target.value)}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm font-bold"
        >
          {[...Array(5)].map((_, i) => {
            const year = new Date().getFullYear() - i;
            return <option key={year} value={year}>{year}</option>;
          })}
        </select>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 text-blue-600">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Laporan Keuangan {rentang}</h1>
            <p className="text-sm text-gray-500 font-medium">Rekapitulasi arus kas organisasi {rentang === 'Rekap Kas' ? 'secara keseluruhan' : 'berdasarkan periode'}</p>
          </div>
        </div>
      </div>

      {renderFilter()}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="w-24 h-24 text-green-500" />
          </div>
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 relative z-10">Total Pemasukan</p>
          <h2 className="text-3xl font-black text-green-600 relative z-10">{formatRupiah(totalPemasukan)}</h2>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingDown className="w-24 h-24 text-red-500" />
          </div>
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 relative z-10">Total Pengeluaran</p>
          <h2 className="text-3xl font-black text-red-600 relative z-10">{formatRupiah(totalPengeluaran)}</h2>
        </div>

        <div className="bg-gradient-to-br from-primary-600 to-blue-700 rounded-2xl shadow-sm p-6 flex flex-col justify-center relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet className="w-24 h-24" />
          </div>
          <p className="text-xs font-black text-primary-200 uppercase tracking-widest mb-1 relative z-10">Saldo Bersih (Neraca)</p>
          <h2 className="text-3xl font-black relative z-10">{formatRupiah(saldoAkhir)}</h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800 text-sm">Rincian Transaksi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-black">Tanggal</th>
                <th className="p-4 font-black">Kategori</th>
                <th className="p-4 font-black">Keterangan</th>
                <th className="p-4 font-black text-right">Debit (Masuk)</th>
                <th className="p-4 font-black text-right">Kredit (Keluar)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-400 font-medium">Mengkalkulasi buku kas...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-400 font-medium">Tidak ada pergerakan dana pada periode ini.</td></tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      {new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-bold border ${item.jenis_transaksi === 'Pemasukan' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                        {item.kategori}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-800 font-medium">
                      {item.keterangan}
                    </td>
                    <td className="p-4 text-right">
                      {item.jenis_transaksi === 'Pemasukan' ? (
                        <span className="font-black text-green-600">{formatRupiah(item.nominal)}</span>
                      ) : '-'}
                    </td>
                    <td className="p-4 text-right">
                      {item.jenis_transaksi === 'Pengeluaran' ? (
                        <span className="font-black text-red-600">{formatRupiah(item.nominal)}</span>
                      ) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
