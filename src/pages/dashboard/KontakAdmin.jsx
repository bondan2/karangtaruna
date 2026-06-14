import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Phone, Mail, MapPin, Map, Save } from 'lucide-react';

export default function KontakAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    kontak_alamat: '',
    kontak_email: '',
    kontak_telepon: '',
    kontak_gmaps: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const keysToFetch = ['kontak_alamat', 'kontak_email', 'kontak_telepon', 'kontak_gmaps'];
      
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
        deskripsi: `Informasi ${kunci.replace('_', ' ')}`
      }));

      const { error } = await supabase
        .from('pengaturan')
        .upsert(entriesToUpsert, { onConflict: 'kunci' });
        
      if (error) throw error;
      
      alert('Informasi Kontak berhasil diperbarui!');
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
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4 text-green-600">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Informasi Kontak</h1>
            <p className="text-sm text-gray-500 font-medium">Atur alamat, nomor telepon, email, dan peta lokasi</p>
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
                  <Phone className="w-4 h-4 mr-2 text-primary-500" /> Nomor Telepon / WA
                </label>
                <input
                  type="text"
                  name="kontak_telepon"
                  value={formData.kontak_telepon}
                  onChange={handleInputChange}
                  placeholder="Contoh: 0812-3456-7890"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                />
              </div>
              
              <div>
                <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-primary-500" /> Alamat Email Resmi
                </label>
                <input
                  type="email"
                  name="kontak_email"
                  value={formData.kontak_email}
                  onChange={handleInputChange}
                  placeholder="Contoh: halo@karangtarunaku.org"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-primary-500" /> Alamat Sekretariat
              </label>
              <textarea
                name="kontak_alamat"
                value={formData.kontak_alamat}
                onChange={handleInputChange}
                placeholder="Alamat lengkap balai RW / sekretariat Karang Taruna"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                rows="3"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-2 flex items-center">
                <Map className="w-4 h-4 mr-2 text-primary-500" /> Google Maps Iframe URL (Opsional)
              </label>
              <textarea
                name="kontak_gmaps"
                value={formData.kontak_gmaps}
                onChange={handleInputChange}
                placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe>'
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium font-mono text-sm"
                rows="4"
              ></textarea>
              <p className="text-xs text-gray-500 mt-2">Buka Google Maps &gt; Bagikan &gt; Sematkan Peta &gt; Salin HTML, lalu tempel di sini.</p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Menyimpan...' : 'Simpan Kontak'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
