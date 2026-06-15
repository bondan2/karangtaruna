import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FileText, Plus, Edit, Trash2, XCircle, Search, Download, FileJson } from 'lucide-react';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';

export default function SuratAdmin({ jenisSurat }) {
  const [surat, setSurat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    nomor_surat: '',
    tanggal_surat: new Date().toISOString().split('T')[0],
    perihal: '',
    pengirim_penerima: '',
    file_url: ''
  });

  const isNomorSuratMenu = jenisSurat === 'Nomor Surat';

  useEffect(() => {
    fetchSurat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jenisSurat]);

  const fetchSurat = async () => {
    try {
      setLoading(true);
      let query = supabase.from('surat_menyurat').select('*');
      
      // Filter jika bukan menu Nomor Surat (yang menampilkan semuanya)
      if (!isNomorSuratMenu) {
        query = query.eq('jenis_surat', jenisSurat);
      }
      
      const { data, error } = await query.order('tanggal_surat', { ascending: false });
        
      if (error) throw error;
      setSurat(data || []);
    } catch (error) {
      console.error('Error fetching surat:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSurat = surat.filter(s => 
    (s.nomor_surat?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (s.perihal?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (s.pengirim_penerima?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        jenis_surat: isNomorSuratMenu ? 'Keluar' : jenisSurat // Default Keluar jika di menu generator nomor
      };

      if (isEditing) {
        const { error } = await supabase.from('surat_menyurat').update(payload).eq('id', currentId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('surat_menyurat').insert([payload]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchSurat();
    } catch (error) {
      alert('Gagal menyimpan surat (Pastikan Nomor Surat Unik): ' + error.message);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      nomor_surat: item.nomor_surat,
      tanggal_surat: item.tanggal_surat,
      perihal: item.perihal,
      pengirim_penerima: item.pengirim_penerima || '',
      file_url: item.file_url || ''
    });
    setCurrentId(item.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus arsip surat ini?')) {
      try {
        const { error } = await supabase.from('surat_menyurat').delete().eq('id', id);
        if (error) throw error;
        fetchSurat();
      } catch (error) {
        alert('Gagal menghapus: ' + error.message);
      }
    }
  };

  const openNewModal = () => {
    let autoNumber = '';
    // Generate nomor surat otomatis jika di menu Nomor Surat atau Keluar
    if (isNomorSuratMenu || jenisSurat === 'Keluar') {
      const year = new Date().getFullYear();
      const month = String(new Date().getMonth() + 1).padStart(2, '0');
      const count = (surat.filter(s => s.jenis_surat === 'Keluar').length + 1).toString().padStart(3, '0');
      autoNumber = `${count}/KT-RW/${month}/${year}`;
    }

    setFormData({
      nomor_surat: autoNumber,
      tanggal_surat: new Date().toISOString().split('T')[0],
      perihal: '',
      pengirim_penerima: '',
      file_url: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleExportExcel = () => {
    const dataToExport = filteredSurat.map((item, index) => ({
      'No': index + 1,
      'Nomor Surat': item.nomor_surat,
      'Tanggal': new Date(item.tanggal_surat).toLocaleDateString('id-ID'),
      'Jenis': item.jenis_surat,
      'Perihal': item.perihal,
      'Pihak Terkait': item.pengirim_penerima || '-'
    }));
    exportToExcel(dataToExport, `Arsip_Surat_${jenisSurat}`);
  };

  const handleExportPDF = () => {
    const headers = ['No', 'Nomor Surat', 'Tanggal', 'Jenis', 'Perihal', 'Pihak Terkait'];
    const dataToExport = filteredSurat.map((item, index) => [
      index + 1,
      item.nomor_surat,
      new Date(item.tanggal_surat).toLocaleDateString('id-ID'),
      item.jenis_surat,
      item.perihal,
      item.pengirim_penerima || '-'
    ]);
    exportToPDF(headers, dataToExport, `Register Surat ${jenisSurat}`, `Buku_Agenda_Surat_${jenisSurat}`, 'landscape');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${isNomorSuratMenu ? 'bg-indigo-100 text-indigo-600' : jenisSurat === 'Masuk' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {isNomorSuratMenu ? 'Generator Nomor Surat' : `Arsip Surat ${jenisSurat}`}
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              {isNomorSuratMenu ? 'Buku agenda penomoran surat otomatis Karang Taruna' : `Kelola dan arsipkan fisik surat ${jenisSurat.toLowerCase()}`}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari nomor/perihal..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm font-medium"
            />
          </div>
          <button 
            onClick={handleExportPDF}
            className="flex items-center px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors shadow-sm whitespace-nowrap border border-red-200"
            title="Unduh PDF"
          >
            <FileText className="w-5 h-5 md:mr-1" /> <span className="hidden md:inline">PDF</span>
          </button>
          <button 
            onClick={handleExportExcel}
            className="flex items-center px-4 py-2 bg-green-50 text-green-600 font-bold rounded-xl hover:bg-green-100 transition-colors shadow-sm whitespace-nowrap border border-green-200"
            title="Unduh Excel"
          >
            <FileJson className="w-5 h-5 md:mr-1" /> <span className="hidden md:inline">Excel</span>
          </button>
          <button 
            onClick={openNewModal}
            className="flex items-center px-4 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-5 h-5 mr-1 md:mr-2" /> <span className="hidden md:inline">Tambah Arsip</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-black">Nomor & Tanggal Surat</th>
                {isNomorSuratMenu && <th className="p-4 font-black">Jenis</th>}
                <th className="p-4 font-black">Perihal</th>
                <th className="p-4 font-black">{jenisSurat === 'Masuk' ? 'Pengirim' : 'Tujuan / Penerima'}</th>
                <th className="p-4 font-black text-center">File Arsip</th>
                <th className="p-4 font-black text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={isNomorSuratMenu ? 6 : 5} className="p-8 text-center text-gray-400 font-medium">Membuka lemari arsip...</td></tr>
              ) : filteredSurat.length === 0 ? (
                <tr><td colSpan={isNomorSuratMenu ? 6 : 5} className="p-8 text-center text-gray-400 font-medium">Belum ada arsip persuratan.</td></tr>
              ) : (
                filteredSurat.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900 bg-gray-100 inline-block px-2 py-1 rounded text-sm mb-1">{item.nomor_surat}</div>
                      <div className="text-xs text-gray-500 font-medium flex items-center">
                        <CalendarIcon className="w-3 h-3 mr-1" /> {new Date(item.tanggal_surat).toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    
                    {isNomorSuratMenu && (
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${item.jenis_surat === 'Masuk' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                          {item.jenis_surat}
                        </span>
                      </td>
                    )}

                    <td className="p-4">
                      <div className="font-bold text-gray-800 line-clamp-2">{item.perihal}</div>
                    </td>
                    
                    <td className="p-4 font-medium text-gray-700">
                      {item.pengirim_penerima || '-'}
                    </td>
                    
                    <td className="p-4 text-center">
                      {item.file_url ? (
                        <a href={item.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-lg text-xs font-bold transition-colors">
                          <Download className="w-3.5 h-3.5 mr-1" /> Unduh
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No File</span>
                      )}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-black text-gray-900">
                {isEditing ? 'Edit Arsip Surat' : 'Tambah Arsip Surat'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nomor Surat</label>
                <input
                  type="text"
                  name="nomor_surat"
                  required
                  value={formData.nomor_surat}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-bold font-mono text-primary-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Tanggal Surat</label>
                  <input
                    type="date"
                    name="tanggal_surat"
                    required
                    value={formData.tanggal_surat}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                {isNomorSuratMenu && !isEditing && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Jenis Surat</label>
                    <select
                      name="jenis_surat"
                      onChange={(e) => {
                        // Trik kecil untuk override jenis_surat di form state
                        setFormData({...formData, _overrideJenis: e.target.value});
                      }}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Keluar">Surat Keluar</option>
                      <option value="Masuk">Surat Masuk</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Perihal / Tentang</label>
                <input
                  type="text"
                  name="perihal"
                  required
                  value={formData.perihal}
                  onChange={handleInputChange}
                  placeholder="Undangan Rapat, Peminjaman Alat..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  {jenisSurat === 'Masuk' ? 'Pengirim Instansi' : 'Tujuan Instansi / Penerima'}
                </label>
                <input
                  type="text"
                  name="pengirim_penerima"
                  value={formData.pengirim_penerima}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">URL File Arsip Dokumen (PDF/JPG)</label>
                <input
                  type="url"
                  name="file_url"
                  value={formData.file_url}
                  onChange={handleInputChange}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm"
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
                  onClick={(e) => {
                    if (formData._overrideJenis) {
                       formData.jenis_surat = formData._overrideJenis;
                       delete formData._overrideJenis;
                    }
                  }}
                  className="px-5 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
                >
                  Simpan Arsip Surat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Komponen Pembantu Kalender Icon agar tidak crash
function CalendarIcon({ className }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
}
