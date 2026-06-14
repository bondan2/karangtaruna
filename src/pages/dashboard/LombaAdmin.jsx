import { useState, useEffect } from 'react';
import { Trophy, Plus, Edit, Trash2, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function LombaAdmin() {
  const [lombaList, setLombaList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State form
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nama_lomba: '', kategori: '', tanggal_pelaksanaan: '', status: 'Pendaftaran Buka' });

  useEffect(() => {
    fetchLomba();
  }, []);

  const fetchLomba = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('lomba').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setLombaList(data || []);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('lomba').insert([formData]);
      if (error) throw error;
      setShowModal(false);
      setFormData({ nama_lomba: '', kategori: '', tanggal_pelaksanaan: '', status: 'Pendaftaran Buka' });
      fetchLomba();
    } catch (error) {
      alert('Gagal menyimpan: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Yakin ingin menghapus lomba ini?')) {
      try {
        const { error } = await supabase.from('lomba').delete().eq('id', id);
        if (error) throw error;
        fetchLomba();
      } catch (error) {
        alert('Gagal menghapus: ' + error.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center">
            <Trophy className="w-8 h-8 mr-3 text-yellow-500" /> Manajemen Lomba
          </h1>
          <p className="text-gray-500 mt-1">Kelola data perlombaan dan pendaftaran peserta.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-primary-600/30 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" /> Tambah Lomba
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Daftar Lomba Tersedia</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data dari Supabase...</div>
        ) : lombaList.length === 0 ? (
          <div className="p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Data Lomba</h3>
            <p className="text-gray-500">Mulai buat perlombaan pertama Anda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Nama Lomba</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Pelaksanaan</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lombaList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{item.nama_lomba}</td>
                    <td className="px-6 py-4 text-gray-600">{item.kategori}</td>
                    <td className="px-6 py-4 text-gray-600">{item.tanggal_pelaksanaan}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-end space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Users className="w-5 h-5" /></button>
                      <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"><Edit className="w-5 h-5" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tambah Lomba */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Buat Lomba Baru</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lomba</label>
                <input required type="text" value={formData.nama_lomba} onChange={e => setFormData({...formData, nama_lomba: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Kategori</label>
                <input required type="text" value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Olahraga, Seni, Keagamaan..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal Pelaksanaan</label>
                <input required type="date" value={formData.tanggal_pelaksanaan} onChange={e => setFormData({...formData, tanggal_pelaksanaan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Batal</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-600/30">Simpan Lomba</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
