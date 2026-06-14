import { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit, Trash2, CheckSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ProgramKerjaAdmin() {
  const [program, setProgram] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const defaultForm = { nama_program: '', deskripsi: '', divisi: '', target_pelaksanaan: '', status: 'Direncanakan' };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => { fetchProgram(); }, []);

  const fetchProgram = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('program_kerja').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProgram(data || []);
    } catch (err) { console.error(err.message); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        const { id, ...updateData } = formData;
        const { error } = await supabase.from('program_kerja').update(updateData).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('program_kerja').insert([formData]);
        if (error) throw error;
      }
      setShowModal(false);
      setFormData(defaultForm);
      fetchProgram();
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
    if(window.confirm('Hapus program kerja ini?')) {
      const { error } = await supabase.from('program_kerja').delete().eq('id', id);
      if(!error) fetchProgram();
    }
  };

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase.from('program_kerja').update({ status: newStatus }).eq('id', id);
    if(!error) fetchProgram();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center">
            <Briefcase className="w-8 h-8 mr-3 text-indigo-500" /> Program Kerja
          </h1>
          <p className="text-gray-500 mt-1">Pantau progres dan kelola proker seluruh divisi.</p>
        </div>
        <button onClick={handleAdd} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg transition-all">
          <Plus className="w-5 h-5 mr-2" /> Tambah Proker
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data proker...</div>
        ) : program.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Program Kerja</h3>
            <p className="text-gray-500">Input rencana kegiatan Karang Taruna di sini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Nama Program & Divisi</th>
                  <th className="px-6 py-4">Target Pelaksanaan</th>
                  <th className="px-6 py-4">Status Saat Ini</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {program.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{item.nama_program}</div>
                      <div className="text-sm text-gray-500">{item.divisi}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{item.target_pelaksanaan}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 outline-none cursor-pointer ${
                          item.status === 'Selesai' ? 'bg-green-50 text-green-700 border-green-200' :
                          item.status === 'Berjalan' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        <option value="Direncanakan">Direncanakan</option>
                        <option value="Berjalan">Sedang Berjalan</option>
                        <option value="Selesai">Telah Selesai</option>
                      </select>
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
              <h2 className="text-xl font-bold text-gray-900">{formData.id ? 'Edit Program Kerja' : 'Rencanakan Proker Baru'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Program</label>
                <input required type="text" value={formData.nama_program} onChange={e => setFormData({...formData, nama_program: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Divisi Pelaksana</label>
                  <input required type="text" value={formData.divisi} onChange={e => setFormData({...formData, divisi: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Contoh: Olahraga..." />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Target Waktu</label>
                  <input required type="date" value={formData.target_pelaksanaan} onChange={e => setFormData({...formData, target_pelaksanaan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi Singkat</label>
                <textarea rows="3" value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"></textarea>
              </div>
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl">Batal</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg">Buat Proker</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
