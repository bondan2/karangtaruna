import { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function DokumenAdmin() {
  const [dokumen, setDokumen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nama_dokumen: '', kategori: 'AD/ART', file_url: '' });

  useEffect(() => { fetchDokumen(); }, []);

  const fetchDokumen = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('dokumen').select('*').order('diunggah_pada', { ascending: false });
      if (error) throw error;
      setDokumen(data || []);
    } catch (err) { console.error(err.message); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Dalam implementasi nyata, ini akan mengupload file ke bucket Supabase Storage
      // Saat ini kita menggunakan text input sebagai mock URL
      const { error } = await supabase.from('dokumen').insert([{...formData, file_url: formData.file_url || 'https://example.com/doc.pdf'}]);
      if (error) throw error;
      setShowModal(false);
      setFormData({ nama_dokumen: '', kategori: 'AD/ART', file_url: '' });
      fetchDokumen();
    } catch (err) { alert('Gagal: ' + err.message); }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Hapus dokumen ini secara permanen?')) {
      const { error } = await supabase.from('dokumen').delete().eq('id', id);
      if(!error) fetchDokumen();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-cyan-500" /> Dokumen Digital
          </h1>
          <p className="text-gray-500 mt-1">Manajemen AD/ART, SK, dan Laporan.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg transition-all">
          <Plus className="w-5 h-5 mr-2" /> Unggah Dokumen
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : dokumen.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Dokumen</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Nama Dokumen</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Tgl Unggah</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dokumen.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{item.nama_dokumen}</td>
                    <td className="px-6 py-4 font-medium text-gray-600">{item.kategori}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(item.diunggah_pada).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 flex justify-end space-x-2">
                      <a href={item.file_url} target="_blank" rel="noreferrer" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Download className="w-5 h-5" /></a>
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
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Unggah Dokumen Baru</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Dokumen</label>
                <input required type="text" value={formData.nama_dokumen} onChange={e => setFormData({...formData, nama_dokumen: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Kategori</label>
                <select value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                  <option value="AD/ART">AD / ART</option>
                  <option value="Surat Keputusan (SK)">Surat Keputusan (SK)</option>
                  <option value="Laporan LPJ">Laporan LPJ</option>
                  <option value="Dokumen Lainnya">Lainnya</option>
                </select>
              </div>
              
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl">Batal</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg">Simpan & Unggah</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
