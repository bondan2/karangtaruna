import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FileText, Save, Building } from 'lucide-react';

export default function ProfilWebsiteAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    profil_tentang: '',
    profil_sejarah: '',
    profil_visi: '',
    profil_misi: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const keysToFetch = ['profil_tentang', 'profil_sejarah', 'profil_visi', 'profil_misi'];
      
      const { data, error } = await supabase
        .from('pengaturan')
        .select('kunci, nilai')
        .in('kunci', keysToFetch);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newFormData = { ...formData };
        data.forEach(item => {
          newFormData[item.kunci] = item.nilai;
        });
        setFormData(newFormData);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
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
      setSaving(true);
      
      // Upsert tiap kunci
      const entriesToUpsert = Object.entries(formData).map(([kunci, nilai]) => ({
        kunci,
        nilai: nilai || '',
        deskripsi: `Konfigurasi ${kunci.replace('_', ' ')}`
      }));

      // Di Supabase, kita harus melakukan upsert
      const { error } = await supabase
        .from('pengaturan')
        .upsert(entriesToUpsert, { onConflict: 'kunci' });
        
      if (error) throw error;
      
      alert('Profil Website berhasil diperbarui!');
    } catch (error) {
      alert('Gagal menyimpan pengaturan: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 text-blue-600">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Profil Website</h1>
            <p className="text-sm text-gray-500 font-medium">Atur konten teks tentang, sejarah, visi, dan misi organisasi</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
        {loading ? (
          <div className="py-10 text-center text-gray-500 font-medium">Memuat pengaturan...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-primary-500" /> Tentang Kami (Singkat)
              </label>
              <textarea
                name="profil_tentang"
                value={formData.profil_tentang}
                onChange={handleInputChange}
                placeholder="Deskripsi singkat yang biasa diletakkan di halaman depan atau footer"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                rows="3"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-primary-500" /> Sejarah Organisasi
              </label>
              <textarea
                name="profil_sejarah"
                value={formData.profil_sejarah}
                onChange={handleInputChange}
                placeholder="Cerita panjang berdirinya Karang Taruna di wilayah Anda"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                rows="6"
              ></textarea>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-primary-500" /> Visi
                </label>
                <textarea
                  name="profil_visi"
                  value={formData.profil_visi}
                  onChange={handleInputChange}
                  placeholder="Visi utama organisasi"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                  rows="4"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-primary-500" /> Misi
                </label>
                <textarea
                  name="profil_misi"
                  value={formData.profil_misi}
                  onChange={handleInputChange}
                  placeholder="1. Misi pertama&#10;2. Misi kedua&#10;3. Misi ketiga"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium whitespace-pre-wrap"
                  rows="4"
                ></textarea>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Menyimpan...' : 'Simpan Profil Website'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
