import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { BookOpen, Plus, Edit, Trash2, XCircle, Search } from 'lucide-react';

export default function NotulenAdmin() {
  const [notulen, setNotulen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    judul_rapat: '',
    tanggal: new Date().toISOString().split('T')[0],
    hasil_keputusan: '',
    notulis: ''
  });

  useEffect(() => {
    fetchNotulen();
  }, []);

  const fetchNotulen = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notulen_rapat')
        .select('*')
        .order('tanggal', { ascending: false });
        
      if (error) throw error;
      setNotulen(data || []);
    } catch (error) {
      console.error('Error fetching notulen:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotulen = notulen.filter(n => 
    (n.judul_rapat?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (n.hasil_keputusan?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const { error } = await supabase.from('notulen_rapat').update(formData).eq('id', currentId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('notulen_rapat').insert([formData]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchNotulen();
    } catch (error) {
      alert('Gagal menyimpan notulen: ' + error.message);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      judul_rapat: item.judul_rapat,
      tanggal: item.tanggal,
      hasil_keputusan: item.hasil_keputusan,
      notulis: item.notulis || ''
    });
    setCurrentId(item.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus notulen rapat ini?')) {
      try {
        const { error } = await supabase.from('notulen_rapat').delete().eq('id', id);
        if (error) throw error;
        fetchNotulen();
      } catch (error) {
        alert('Gagal menghapus: ' + error.message);
      }
    }
  };

  const openNewModal = () => {
    const userName = localStorage.getItem('userName') || 'Sekretaris';
    setFormData({
      judul_rapat: '',
      tanggal: new Date().toISOString().split('T')[0],
      hasil_keputusan: '',
      notulis: userName
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mr-4 text-teal-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Notulen Rapat</h1>
            <p className="text-sm text-gray-500 font-medium">Arsip kesimpulan dan hasil keputusan rapat pengurus</p>
          </div>
        </div>
        
        <div className="flex space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari notulen..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm font-medium"
            />
          </div>
          <button 
            onClick={openNewModal}
            className="flex items-center px-4 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-5 h-5 mr-1 md:mr-2" /> <span className="hidden md:inline">Tulis Notulen</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-gray-400 font-medium bg-white rounded-2xl border border-gray-100">Membuka buku notulen...</div>
        ) : filteredNotulen.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-400 font-medium bg-white rounded-2xl border border-gray-100">Belum ada catatan rapat.</div>
        ) : (
          filteredNotulen.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative group flex flex-col">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <button onClick={() => handleEdit(item)} className="p-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg shadow-sm border border-gray-200 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 bg-white text-red-600 hover:bg-red-50 rounded-lg shadow-sm border border-gray-200 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-lg font-black text-gray-900 pr-16 mb-1">{item.judul_rapat}</h3>
              <p className="text-sm font-medium text-primary-600 mb-4">
                {new Date(item.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex-1 mb-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Hasil Keputusan / Catatan</h4>
                <div className="text-sm text-gray-800 whitespace-pre-wrap font-medium">{item.hasil_keputusan}</div>
              </div>

              <div className="flex justify-end items-center text-xs text-gray-500 font-bold border-t border-gray-100 pt-4">
                <span>Notulis: {item.notulis || 'Sekretaris'}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-black text-gray-900">
                {isEditing ? 'Edit Notulen Rapat' : 'Tulis Notulen Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} id="notulenForm" className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Judul / Agenda Rapat</label>
                <input
                  type="text"
                  name="judul_rapat"
                  required
                  value={formData.judul_rapat}
                  onChange={handleInputChange}
                  placeholder="Misal: Rapat Pleno Persiapan 17 Agustus"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    name="tanggal"
                    required
                    value={formData.tanggal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nama Notulis</label>
                  <input
                    type="text"
                    name="notulis"
                    value={formData.notulis}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Hasil Keputusan Rapat</label>
                <textarea
                  name="hasil_keputusan"
                  required
                  value={formData.hasil_keputusan}
                  onChange={handleInputChange}
                  placeholder="1. Membentuk kepanitiaan inti...&#10;2. Iuran warga ditetapkan sebesar..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-medium font-mono text-sm leading-relaxed"
                  rows="8"
                ></textarea>
              </div>

            </form>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3 mt-auto">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                form="notulenForm"
                className="px-5 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
              >
                Simpan Notulen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
