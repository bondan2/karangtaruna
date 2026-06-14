import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Share2, Camera, Globe, Tv, Save, Music } from 'lucide-react';

export default function MediaSosialAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    medsos_ig: '',
    medsos_fb: '',
    medsos_yt: '',
    medsos_tiktok: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const keysToFetch = ['medsos_ig', 'medsos_fb', 'medsos_yt', 'medsos_tiktok'];
      
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
        deskripsi: `Tautan Akun ${kunci.replace('_', ' ').toUpperCase()}`
      }));

      const { error } = await supabase
        .from('pengaturan')
        .upsert(entriesToUpsert, { onConflict: 'kunci' });
        
      if (error) throw error;
      
      alert('Tautan Media Sosial berhasil diperbarui!');
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
          <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mr-4 text-rose-600">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Media Sosial</h1>
            <p className="text-sm text-gray-500 font-medium">Tautkan akun sosial media resmi Karang Taruna</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
        {loading ? (
          <div className="py-10 text-center text-gray-500 font-medium">Memuat pengaturan...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-2 flex items-center">
                  <Camera className="w-4 h-4 mr-2 text-pink-500" /> Tautan Akun Instagram
                </label>
                <input
                  type="url"
                  name="medsos_ig"
                  value={formData.medsos_ig}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/karangtarunaku"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-2 flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-blue-500" /> Tautan Halaman Facebook
                </label>
                <input
                  type="url"
                  name="medsos_fb"
                  value={formData.medsos_fb}
                  onChange={handleInputChange}
                  placeholder="https://facebook.com/karangtarunaku"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-2 flex items-center">
                  <Tv className="w-4 h-4 mr-2 text-red-500" /> Tautan Channel YouTube
                </label>
                <input
                  type="url"
                  name="medsos_yt"
                  value={formData.medsos_yt}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/c/karangtarunaku"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-2 flex items-center">
                  <Music className="w-4 h-4 mr-2 text-black" /> Tautan Akun TikTok
                </label>
                <input
                  type="url"
                  name="medsos_tiktok"
                  value={formData.medsos_tiktok}
                  onChange={handleInputChange}
                  placeholder="https://tiktok.com/@karangtarunaku"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                />
              </div>

            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Menyimpan...' : 'Simpan Media Sosial'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
