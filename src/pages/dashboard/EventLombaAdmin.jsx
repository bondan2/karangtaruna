import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Flag, Trophy, Users, Plus, Edit, Trash2, XCircle, Search, FileText, Download } from 'lucide-react';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';

export default function EventLombaAdmin({ tipe }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({});
  const [lombaOptions, setLombaOptions] = useState([]);

  useEffect(() => {
    fetchData();
    if (tipe === 'Peserta') fetchLombaOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipe]);

  const fetchLombaOptions = async () => {
    const { data } = await supabase.from('lomba').select('id, nama_lomba');
    if (data) setLombaOptions(data);
  };

  const getTableName = () => {
    if (tipe === 'Event') return 'event_17_agustus';
    if (tipe === 'Lomba') return 'lomba';
    return 'peserta_lomba';
  };

  const getInitialFormState = () => {
    if (tipe === 'Event') return { nama_kegiatan: '', jenis_kegiatan: '', penanggung_jawab: '', anggaran: 0, status: 'Direncanakan' };
    if (tipe === 'Lomba') return { nama_lomba: '', deskripsi: '', kategori: '', tanggal_pelaksanaan: '', status: 'Pendaftaran Buka', banner_url: '' };
    return { lomba_id: '', nama_peserta: '', kontak: '', asal_rt_rw: '', status_juara: '' };
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const tableName = getTableName();
      let query = supabase.from(tableName).select(tipe === 'Peserta' ? '*, lomba(nama_lomba)' : '*');
      
      const { data: result, error } = await query;
      if (error) throw error;
      setData(result || []);
    } catch (error) {
      console.error('Error fetching data:', error);
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
      const payload = { ...formData };
      const tableName = getTableName();

      if (isEditing) {
        const { error } = await supabase.from(tableName).update(payload).eq('id', currentId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(tableName).insert([payload]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert('Gagal menyimpan data: ' + error.message);
    }
  };

  const handleEdit = (item) => {
    if (tipe === 'Event') {
      setFormData({ nama_kegiatan: item.nama_kegiatan, jenis_kegiatan: item.jenis_kegiatan || '', penanggung_jawab: item.penanggung_jawab || '', anggaran: item.anggaran || 0, status: item.status || 'Direncanakan' });
    } else if (tipe === 'Lomba') {
      setFormData({ nama_lomba: item.nama_lomba, deskripsi: item.deskripsi || '', kategori: item.kategori || '', tanggal_pelaksanaan: item.tanggal_pelaksanaan || '', status: item.status || 'Pendaftaran Buka', banner_url: item.banner_url || '' });
    } else {
      setFormData({ lomba_id: item.lomba_id, nama_peserta: item.nama_peserta, kontak: item.kontak || '', asal_rt_rw: item.asal_rt_rw || '', status_juara: item.status_juara || '' });
    }
    
    setCurrentId(item.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Yakin ingin menghapus ${tipe} ini?`)) {
      try {
        const { error } = await supabase.from(getTableName()).delete().eq('id', id);
        if (error) throw error;
        fetchData();
      } catch (error) {
        alert('Gagal menghapus: ' + error.message);
      }
    }
  };

  const openNewModal = () => {
    setFormData(getInitialFormState());
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const getIcon = () => {
    if (tipe === 'Event') return <Flag className="w-6 h-6" />;
    if (tipe === 'Lomba') return <Trophy className="w-6 h-6" />;
    return <Users className="w-6 h-6" />;
  };

  const handleExportExcel = () => {
    let dataToExport = [];
    if (tipe === 'Event') {
      dataToExport = data.map((item, index) => ({
        'No': index + 1,
        'Nama Kegiatan': item.nama_kegiatan,
        'Penanggung Jawab': item.penanggung_jawab || '-',
        'Anggaran': item.anggaran || 0,
        'Status': item.status
      }));
    } else if (tipe === 'Lomba') {
      dataToExport = data.map((item, index) => ({
        'No': index + 1,
        'Nama Lomba': item.nama_lomba,
        'Kategori': item.kategori,
        'Tanggal': item.tanggal_pelaksanaan,
        'Status': item.status
      }));
    } else {
      dataToExport = data.map((item, index) => ({
        'No': index + 1,
        'Nama Peserta': item.nama_peserta,
        'Kontak': item.kontak || '-',
        'Asal RT/RW': item.asal_rt_rw || '-',
        'Lomba': item.lomba?.nama_lomba || '-',
        'Status Juara': item.status_juara || '-'
      }));
    }
    exportToExcel(dataToExport, `Data_${tipe}_Karang_Taruna`);
  };

  const handleExportPDF = () => {
    let headers = [];
    let dataToExport = [];
    
    if (tipe === 'Event') {
      headers = ['No', 'Nama Kegiatan', 'Penanggung Jawab', 'Anggaran', 'Status'];
      dataToExport = data.map((item, index) => [
        index + 1, item.nama_kegiatan, item.penanggung_jawab || '-', item.anggaran ? `Rp${item.anggaran}` : '-', item.status
      ]);
    } else if (tipe === 'Lomba') {
      headers = ['No', 'Nama Lomba', 'Kategori', 'Tanggal', 'Status'];
      dataToExport = data.map((item, index) => [
        index + 1, item.nama_lomba, item.kategori, item.tanggal_pelaksanaan || '-', item.status
      ]);
    } else {
      headers = ['No', 'Nama Peserta', 'Kontak', 'Asal RT/RW', 'Lomba', 'Juara'];
      dataToExport = data.map((item, index) => [
        index + 1, item.nama_peserta, item.kontak || '-', item.asal_rt_rw || '-', item.lomba?.nama_lomba || '-', item.status_juara || '-'
      ]);
    }

    exportToPDF(headers, dataToExport, `Laporan Kepanitiaan - ${tipe}`, `Data_${tipe}`, 'landscape');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4 text-red-600">
            {getIcon()}
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Kepanitiaan {tipe}</h1>
            <p className="text-sm text-gray-500 font-medium">Manajemen data khusus {tipe.toLowerCase()} Karang Taruna</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportPDF}
            className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold flex items-center transition-all border border-red-200"
            title="Unduh PDF"
          >
            <FileText className="w-5 h-5 mr-2" /> PDF
          </button>
          <button 
            onClick={handleExportExcel}
            className="bg-green-50 hover:bg-green-100 text-green-600 px-4 py-2 rounded-xl font-bold flex items-center transition-all border border-green-200"
            title="Unduh Excel"
          >
            <Download className="w-5 h-5 mr-2" /> Excel
          </button>
          <button 
            onClick={openNewModal}
            className="flex items-center px-4 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5 mr-2" /> Tambah {tipe}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                {tipe === 'Event' && (
                  <>
                    <th className="p-4 font-black">Nama Kegiatan</th>
                    <th className="p-4 font-black">Penanggung Jawab</th>
                    <th className="p-4 font-black">Status</th>
                  </>
                )}
                {tipe === 'Lomba' && (
                  <>
                    <th className="p-4 font-black">Nama Lomba</th>
                    <th className="p-4 font-black">Jadwal Pelaksanaan</th>
                    <th className="p-4 font-black">Status</th>
                  </>
                )}
                {tipe === 'Peserta' && (
                  <>
                    <th className="p-4 font-black">Nama Peserta / Tim</th>
                    <th className="p-4 font-black">Asal RT/RW</th>
                    <th className="p-4 font-black">Ikut Lomba</th>
                    <th className="p-4 font-black">Juara</th>
                  </>
                )}
                <th className="p-4 font-black text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-400 font-medium">Memuat data {tipe}...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-400 font-medium">Belum ada data {tipe.toLowerCase()}.</td></tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    {tipe === 'Event' && (
                      <>
                        <td className="p-4 font-bold text-gray-900">{item.nama_kegiatan}</td>
                        <td className="p-4 text-gray-700 font-medium">{item.penanggung_jawab || '-'}</td>
                        <td className="p-4">
                          <span className="inline-flex px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-bold text-gray-700">
                            {item.status}
                          </span>
                        </td>
                      </>
                    )}
                    
                    {tipe === 'Lomba' && (
                      <>
                        <td className="p-4">
                          <div className="font-bold text-gray-900">{item.nama_lomba}</div>
                          <div className="text-xs text-gray-500">{item.kategori}</div>
                        </td>
                        <td className="p-4 text-gray-700 font-medium">
                          {item.tanggal_pelaksanaan ? new Date(item.tanggal_pelaksanaan).toLocaleDateString('id-ID') : '-'}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex px-2 py-1 rounded text-xs font-bold border ${item.status === 'Selesai' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                            {item.status}
                          </span>
                        </td>
                      </>
                    )}

                    {tipe === 'Peserta' && (
                      <>
                        <td className="p-4">
                          <div className="font-bold text-gray-900">{item.nama_peserta}</div>
                          <div className="text-xs text-gray-500">HP: {item.kontak || '-'}</div>
                        </td>
                        <td className="p-4 text-gray-700 font-medium">{item.asal_rt_rw || '-'}</td>
                        <td className="p-4 font-bold text-primary-700">{item.lomba?.nama_lomba || '-'}</td>
                        <td className="p-4">
                          {item.status_juara ? (
                            <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-black text-xs border border-yellow-200">
                              <Trophy className="w-3 h-3 mr-1" /> {item.status_juara}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs italic">-</span>
                          )}
                        </td>
                      </>
                    )}

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
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-black text-gray-900">
                {isEditing ? `Edit Data ${tipe}` : `Tambah ${tipe} Baru`}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-6">
              <form id="eventForm" onSubmit={handleSubmit} className="space-y-4">
                
                {tipe === 'Event' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nama Kegiatan</label>
                      <input type="text" name="nama_kegiatan" required value={formData.nama_kegiatan || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-bold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Penanggung Jawab (Ketua Pelaksana)</label>
                      <input type="text" name="penanggung_jawab" value={formData.penanggung_jawab || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Status Event</label>
                      <select name="status" value={formData.status || 'Direncanakan'} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-bold">
                        <option value="Direncanakan">Direncanakan</option>
                        <option value="Berjalan">Berjalan</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </div>
                  </>
                )}

                {tipe === 'Lomba' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nama Lomba</label>
                      <input type="text" name="nama_lomba" required value={formData.nama_lomba || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-bold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Tanggal Pelaksanaan</label>
                      <input type="date" name="tanggal_pelaksanaan" value={formData.tanggal_pelaksanaan || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Status Pendaftaran</label>
                      <select name="status" value={formData.status || 'Pendaftaran Buka'} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-bold">
                        <option value="Pendaftaran Buka">Pendaftaran Buka</option>
                        <option value="Sedang Berjalan">Sedang Berjalan</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </div>
                  </>
                )}

                {tipe === 'Peserta' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Pilih Lomba</label>
                      <select name="lomba_id" required value={formData.lomba_id || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-bold">
                        <option value="">-- Pilih Lomba --</option>
                        {lombaOptions.map(l => <option key={l.id} value={l.id}>{l.nama_lomba}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nama Peserta / Nama Tim</label>
                      <input type="text" name="nama_peserta" required value={formData.nama_peserta || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Asal RT/RW</label>
                        <input type="text" name="asal_rt_rw" value={formData.asal_rt_rw || ''} onChange={handleInputChange} placeholder="Misal: RT 01/RW 03" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Kontak / WA</label>
                        <input type="text" name="kontak" value={formData.kontak || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Status Juara (Kosongkan jika bukan pemenang)</label>
                      <select name="status_juara" value={formData.status_juara || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-500 font-bold text-yellow-800">
                        <option value="">-- Bukan Juara --</option>
                        <option value="Juara 1">Juara 1 (Satu)</option>
                        <option value="Juara 2">Juara 2 (Dua)</option>
                        <option value="Juara 3">Juara 3 (Tiga)</option>
                        <option value="Harapan 1">Juara Harapan</option>
                      </select>
                    </div>
                  </>
                )}

              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3 mt-auto">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">
                Batal
              </button>
              <button type="submit" form="eventForm" className="px-5 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm">
                Simpan Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
