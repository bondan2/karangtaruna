import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Plus, Edit, Trash2, XCircle, DollarSign, Building } from 'lucide-react';

export default function SponsorAdmin() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    nama_sponsor: '',
    kontak_person: '',
    nomor_telepon: '',
    bentuk_dukungan: 'Dana',
    nominal: 0,
    logo_url: '',
    keterangan: '',
    status_aktif: true
  });

  const bentukDukunganOptions = ['Dana', 'Barang', 'Jasa', 'Fasilitas'];

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sponsor')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setSponsors(data || []);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('sponsor')
          .update(formData)
          .eq('id', currentId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('sponsor')
          .insert([formData]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchSponsors();
    } catch (error) {
      alert('Gagal menyimpan data: ' + error.message);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      nama_sponsor: item.nama_sponsor || '',
      kontak_person: item.kontak_person || '',
      nomor_telepon: item.nomor_telepon || '',
      bentuk_dukungan: item.bentuk_dukungan || 'Dana',
      nominal: item.nominal || 0,
      logo_url: item.logo_url || '',
      keterangan: item.keterangan || '',
      status_aktif: item.status_aktif
    });
    setCurrentId(item.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus data sponsor ini?')) {
      try {
        const { error } = await supabase.from('sponsor').delete().eq('id', id);
        if (error) throw error;
        fetchSponsors();
      } catch (error) {
        alert('Gagal menghapus: ' + error.message);
      }
    }
  };

  const openNewModal = () => {
    setFormData({
      nama_sponsor: '',
      kontak_person: '',
      nomor_telepon: '',
      bentuk_dukungan: 'Dana',
      nominal: 0,
      logo_url: '',
      keterangan: '',
      status_aktif: true
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-4 text-indigo-600">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Kelola Sponsor</h1>
            <p className="text-sm text-gray-500 font-medium">Data perusahaan/pihak donatur yang mendukung kegiatan Karang Taruna</p>
          </div>
        </div>
        <button 
          onClick={openNewModal}
          className="flex items-center px-4 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" /> Tambah Sponsor
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-black">Instansi / Sponsor</th>
                <th className="p-4 font-black">Kontak Person</th>
                <th className="p-4 font-black">Bentuk Dukungan</th>
                <th className="p-4 font-black">Nilai Dukungan</th>
                <th className="p-4 font-black">Status</th>
                <th className="p-4 font-black text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-400 font-medium">Memuat data...</td></tr>
              ) : sponsors.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-400 font-medium">Belum ada data sponsor/donatur.</td></tr>
              ) : (
                sponsors.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mr-3 border border-gray-200">
                        {item.logo_url ? (
                          <img src={item.logo_url} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Building className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-gray-900">{item.nama_sponsor}</span>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{item.kontak_person || '-'}</div>
                      <div className="text-xs text-gray-500">{item.nomor_telepon}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                        {item.bentuk_dukungan}
                      </span>
                    </td>
                    <td className="p-4">
                      {item.bentuk_dukungan === 'Dana' ? (
                        <span className="font-black text-emerald-600">{formatRupiah(item.nominal)}</span>
                      ) : (
                        <span className="font-medium text-gray-600 truncate block max-w-[120px]" title={item.keterangan}>
                          {item.keterangan || '-'}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {item.status_aktif ? (
                        <span className="text-xs font-bold text-green-600">Aktif</span>
                      ) : (
                        <span className="text-xs font-bold text-gray-400">Non-Aktif</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
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
                {isEditing ? 'Edit Sponsor' : 'Tambah Sponsor Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nama Instansi / Perusahaan</label>
                <input
                  type="text"
                  name="nama_sponsor"
                  required
                  value={formData.nama_sponsor}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Kontak Person (PIC)</label>
                  <input
                    type="text"
                    name="kontak_person"
                    value={formData.kontak_person}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">No. Telp / WA</label>
                  <input
                    type="text"
                    name="nomor_telepon"
                    value={formData.nomor_telepon}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Bentuk Dukungan</label>
                  <select
                    name="bentuk_dukungan"
                    required
                    value={formData.bentuk_dukungan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                  >
                    {bentukDukunganOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                
                {formData.bentuk_dukungan === 'Dana' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nominal Dana (Rp)</label>
                    <input
                      type="number"
                      name="nominal"
                      value={formData.nominal}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium text-emerald-600 font-black"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Keterangan Dukungan</label>
                <textarea
                  name="keterangan"
                  value={formData.keterangan}
                  onChange={handleInputChange}
                  placeholder={formData.bentuk_dukungan !== 'Dana' ? 'Sebutkan rincian barang/jasa yang diberikan...' : 'Catatan tambahan...'}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                  rows="2"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">URL Logo Instansi (Opsional)</label>
                <input
                  type="url"
                  name="logo_url"
                  value={formData.logo_url}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium text-sm"
                />
              </div>

              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  id="status_aktif"
                  name="status_aktif"
                  checked={formData.status_aktif}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                />
                <label htmlFor="status_aktif" className="ml-3 font-bold text-gray-700 cursor-pointer">
                  Status Kemitraan Aktif
                </label>
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
                  Simpan Sponsor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
