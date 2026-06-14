import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Briefcase, Flag, FileText, CheckCircle, Clock } from 'lucide-react';

export default function KeuanganAnggaran({ tipe }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipe]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let query = null;
      
      if (tipe === 'Proker') {
        query = supabase.from('program_kerja').select('id, nama_program as judul, divisi as penanggung_jawab, target_pelaksanaan as tanggal, anggaran, status');
      } else if (tipe === 'Event') {
        query = supabase.from('event_17_agustus').select('id, nama_kegiatan as judul, penanggung_jawab, created_at as tanggal, anggaran, status');
      } else {
        // Untuk Proposal (Mock data / belum ada tabel spesifik proposal keuangan, kita ambil proker yang berstatus Direncanakan)
        query = supabase.from('program_kerja').select('id, nama_program as judul, divisi as penanggung_jawab, target_pelaksanaan as tanggal, anggaran, status').eq('status', 'Direncanakan');
      }

      const response = await query.order('anggaran', { ascending: false });
      if (response.error) throw response.error;
      
      setData(response.data || []);
    } catch (error) {
      console.error('Error fetching anggaran:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);
  };

  const getIcon = () => {
    if (tipe === 'Proker') return <Briefcase className="w-6 h-6" />;
    if (tipe === 'Event') return <Flag className="w-6 h-6" />;
    return <FileText className="w-6 h-6" />;
  };

  const totalAnggaran = data.reduce((sum, item) => sum + Number(item.anggaran), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mr-4 text-amber-600">
            {getIcon()}
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Anggaran {tipe}</h1>
            <p className="text-sm text-gray-500 font-medium">Rekapitulasi target pengeluaran untuk {tipe.toLowerCase()}</p>
          </div>
        </div>
        
        <div className="bg-amber-50 px-5 py-3 rounded-xl border border-amber-200 text-right">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">Total Kebutuhan Dana</p>
          <p className="text-xl font-black text-amber-600">{formatRupiah(totalAnggaran)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-black">Judul Kegiatan / Program</th>
                <th className="p-4 font-black">Penanggung Jawab</th>
                <th className="p-4 font-black">Status Kegiatan</th>
                <th className="p-4 font-black text-right">Estimasi Anggaran</th>
                <th className="p-4 font-black text-center">Status Pencairan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-400 font-medium">Memuat data anggaran...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-400 font-medium">Belum ada perencanaan anggaran.</td></tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{item.judul}</div>
                    </td>
                    <td className="p-4 font-medium text-gray-700">
                      {item.penanggung_jawab || '-'}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-bold border border-gray-200 bg-white">
                        {item.status || 'Direncanakan'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-black text-amber-600">
                        {formatRupiah(item.anggaran)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {(item.status === 'Selesai' || item.status === 'Berjalan') ? (
                        <span className="inline-flex items-center text-xs font-bold text-green-600">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Telah Cair
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-bold text-orange-500">
                          <Clock className="w-3.5 h-3.5 mr-1" /> Menunggu Kas
                        </span>
                      )}
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
