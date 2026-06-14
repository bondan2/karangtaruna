import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Layout, Save } from 'lucide-react';

export default function FooterAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    footer_deskripsi: '',
    footer_copyright: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const keysToFetch = ['footer_deskripsi', 'footer_copyright'];
      
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
      
      const entriesToUpsert = Object.entries(formData).map(([kunci, nilai]) => ({
        kunci,
        nilai: nilai || '',
        deskripsi: `Pengaturan ${kunci.replace('_', ' ')}`
      }));

      const { error } = await supabase
        .from('pengaturan')
        .upsert(entriesToUpsert, { onConflict: 'kunci' });
        
      if (error) throw error;
      
      alert('Footer Website berhasil diperbarui!');
    } catch (error) {
      alert('Gagal menyimpan pengaturan: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mr-4 text-slate-600">
            <Layout className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Pengaturan Footer</h1>
            <p className="text-sm text-gray-500 font-medium">Atur konten di bagian paling bawah website publik</p>
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
                <Layout className="w-4 h-4 mr-2 text-primary-500" /> Teks Hak Cipta (Copyright)
              </label>
              <input
                type="text"
                name="footer_copyright"
                value={formData.footer_copyright}
                onChange={handleInputChange}
                placeholder="Contoh: © 2024 Karang Taruna Bina Karya. Hak Cipta Dilindungi."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-2 flex items-center">
                <Layout className="w-4 h-4 mr-2 text-primary-500" /> Deskripsi Singkat Footer
              </label>
              <textarea
                name="footer_deskripsi"
                value={formData.footer_deskripsi}
                onChange={handleInputChange}
                placeholder="Deskripsi singkat tentang Karang Taruna Anda di bagian footer"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                rows="3"
              ></textarea>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Menyimpan...' : 'Simpan Footer'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
