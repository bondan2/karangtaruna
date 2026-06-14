import { useState, useEffect } from 'react';
import { Archive, Plus, Trash2, Edit, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function SuratMenyuratAdmin() {
  const [surat, setSurat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const defaultForm = { nomor_surat: '', jenis_surat: 'Masuk', tanggal_surat: '', perihal: '', pengirim_penerima: '', file_url: '' };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => { fetchSurat(); }, []);

  const fetchSurat = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('surat_menyurat').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setSurat(data || []);
    } catch (err) { console.error(err.message); } finally { setLoading(false); }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `surat_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('surat_dokumen')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('surat_dokumen')
        .getPublicUrl(fileName);

      setFormData({ ...formData, file_url: data.publicUrl });
    } catch (error) {
      alert('Gagal mengunggah file: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        const { id, created_at, ...updateData } = formData;
        const { error } = await supabase.from('surat_menyurat').update(updateData).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('surat_menyurat').insert([formData]);
        if (error) throw error;
      }
      setShowModal(false);
      setFormData(defaultForm);
      fetchSurat();
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
    if(window.confirm('Hapus arsip surat ini?')) {
      const { error } = await supabase.from('surat_menyurat').delete().eq('id', id);
      if(!error) fetchSurat();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center">
            <Archive className="w-8 h-8 mr-3 text-orange-500" /> Surat Menyurat
          </h1>
          <p className="text-gray-500 mt-1">Sistem pengarsipan digital surat masuk dan keluar.</p>
        </div>
        <button onClick={handleAdd} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg transition-all">
          <Plus className="w-5 h-5 mr-2" /> Arsip Baru
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : surat.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Arsip Surat</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Nomor & Tanggal Surat</th>
                  <th className="px-6 py-4">Perihal</th>
                  <th className="px-6 py-4">Jenis & Tujuan/Asal</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {surat.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{item.nomor_surat}</div>
                      <div className="text-sm text-gray-500">{item.tanggal_surat}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-700">{item.perihal}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold mr-2 ${item.jenis_surat === 'Masuk' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                        {item.jenis_surat}
                      </span>
                      <span className="text-sm font-medium text-gray-600">{item.pengirim_penerima}</span>
                    </td>
                    <td className="px-6 py-4 flex justify-end space-x-2">
                      {item.file_url && (
                        <a href={item.file_url} target="_blank" rel="noreferrer" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          Lihat File
                        </a>
                      )}
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
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{formData.id ? 'Edit Arsip Surat' : 'Arsipkan Surat Baru'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nomor Surat</label>
                  <input required type="text" value={formData.nomor_surat} onChange={e => setFormData({...formData, nomor_surat: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Jenis</label>
                  <select value={formData.jenis_surat} onChange={e => setFormData({...formData, jenis_surat: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                    <option value="Masuk">Masuk</option>
                    <option value="Keluar">Keluar</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal Surat</label>
                  <input required type="date" value={formData.tanggal_surat} onChange={e => setFormData({...formData, tanggal_surat: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">{formData.jenis_surat === 'Masuk' ? 'Pengirim' : 'Tujuan'}</label>
                  <input required type="text" value={formData.pengirim_penerima} onChange={e => setFormData({...formData, pengirim_penerima: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Perihal / Hal</label>
                <input required type="text" value={formData.perihal} onChange={e => setFormData({...formData, perihal: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Unggah Arsip Asli (Opsional, PDF/Gambar)</label>
                {formData.file_url ? (
                  <div className="flex items-center space-x-4 mb-2 bg-green-50 p-4 rounded-xl border border-green-100">
                    <div className="flex-1 text-sm font-bold text-green-700 truncate">
                      File telah diunggah!
                    </div>
                    <button type="button" onClick={() => setFormData({...formData, file_url: ''})} className="text-red-600 text-sm font-bold hover:underline">Hapus / Ganti</button>
                  </div>
                ) : (
                  <div className="relative">
                    <input type="file" onChange={handleFileChange} accept=".pdf,image/*" disabled={uploading} className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer" />
                  </div>
                )}
              </div>
              
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl">Batal</button>
                <button type="submit" disabled={uploading} className="flex-1 px-4 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-50">
                  {uploading ? 'Mengunggah Berkas...' : 'Simpan Arsip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
