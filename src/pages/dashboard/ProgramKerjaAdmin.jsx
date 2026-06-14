import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Briefcase, Plus, Edit, Trash2, XCircle, Search } from 'lucide-react';

export default function ProgramKerjaAdmin() {
  const [proker, setProker] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    nama_program: '',
    deskripsi: '',
    divisi: '',
    target_pelaksanaan: '',
    anggaran: 0,
    status: 'Direncanakan'
  });

  const statusOptions = ['Direncanakan', 'Berjalan', 'Selesai', 'Dibatalkan'];

  useEffect(() => {
    fetchProker();
  }, []);

  const fetchProker = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('program_kerja')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setProker(data || []);
    } catch (error) {
      console.error('Error fetching proker:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProker = proker.filter(p => 
    (p.nama_program?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (p.divisi?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const { error } = await supabase.from('program_kerja').update(formData).eq('id', currentId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('program_kerja').insert([formData]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchProker();
    } catch (error) {
      alert('Gagal menyimpan program kerja: ' + error.message);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      nama_program: item.nama_program,
      deskripsi: item.deskripsi || '',
      divisi: item.divisi || '',
      target_pelaksanaan: item.target_pelaksanaan || '',
      anggaran: item.anggaran || 0,
      status: item.status || 'Direncanakan'
    });
    setCurrentId(item.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus program kerja ini?')) {
      try {
        const { error } = await supabase.from('program_kerja').delete().eq('id', id);
        if (error) throw error;
        fetchProker();
      } catch (error) {
        alert('Gagal menghapus: ' + error.message);
      }
    }
  };

  const openNewModal = () => {
    setFormData({
      nama_program: '',
      deskripsi: '',
      divisi: '',
      target_pelaksanaan: '',
      anggaran: 0,
      status: 'Direncanakan'
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Direncanakan': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Berjalan': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Selesai': return 'bg-green-50 text-green-700 border-green-200';
      case 'Dibatalkan': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-4 text-indigo-600">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Program Kerja</h1>
            <p className="text-sm text-gray-500 font-medium">Manajemen rencana kegiatan dan alokasi anggaran divisi</p>
          </div>
        </div>
        
        <div className="flex space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari program kerja..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm font-medium"
            />
          </div>
          <button 
            onClick={openNewModal}
            className="flex items-center px-4 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-5 h-5 mr-1 md:mr-2" /> <span className="hidden md:inline">Tambah Proker</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-gray-400 font-medium bg-white rounded-2xl border border-gray-100">Memuat data program kerja...</div>
        ) : filteredProker.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-400 font-medium bg-white rounded-2xl border border-gray-100">Belum ada program kerja yang didaftarkan.</div>
        ) : (
          filteredProker.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
                <div className="flex space-x-1">
                  <button onClick={() => handleEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-black text-gray-900 leading-tight mb-2">{item.nama_program}</h3>
              <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">{item.deskripsi || 'Tidak ada deskripsi rinci.'}</p>
              
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Divisi Pelaksana</span>
                  <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{item.divisi || '-'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Target Waktu</span>
                  <span className="font-bold text-primary-700">
                    {item.target_pelaksanaan ? new Date(item.target_pelaksanaan).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : 'TBD'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Est. Anggaran</span>
                  <span className="font-black text-green-600">{formatRupiah(item.anggaran)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-black text-gray-900">
                {isEditing ? 'Edit Program Kerja' : 'Tambah Program Kerja Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nama Program Kerja</label>
                <input
                  type="text"
                  name="nama_program"
                  required
                  value={formData.nama_program}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Deskripsi Ringkas</label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                  rows="3"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Divisi Penanggung Jawab</label>
                  <input
                    type="text"
                    name="divisi"
                    value={formData.divisi}
                    onChange={handleInputChange}
                    placeholder="Edukasi, Olahraga..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Status Saat Ini</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-bold"
                  >
                    {statusOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Target Bulan Pelaksanaan</label>
                  <input
                    type="date"
                    name="target_pelaksanaan"
                    value={formData.target_pelaksanaan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Estimasi Anggaran (Rp)</label>
                  <input
                    type="number"
                    name="anggaran"
                    value={formData.anggaran}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-black text-green-600"
                  />
                </div>
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
                  Simpan Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
