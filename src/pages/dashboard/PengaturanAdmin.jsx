import { useState, useEffect } from 'react';
import { Settings, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function PengaturanAdmin() {
  const [pengaturan, setPengaturan] = useState({
    nama_organisasi: 'Karang Taruna RW 05',
    nama_ketua: '',
    kontak_whatsapp: '',
    alamat_sekretariat: 'Jl. Raya Pondok Betung, Rt.001/05',
    link_instagram: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchPengaturan(); }, []);

  const fetchPengaturan = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('pengaturan').select('*');
      if (error) throw error;
      
      if (data && data.length > 0) {
        const settingMap = {};
        data.forEach(item => settingMap[item.kunci] = item.nilai);
        setPengaturan(prev => ({...prev, ...settingMap}));
      }
    } catch (err) { console.error(err.message); } finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      // We will perform upsert for each setting key
      const keys = Object.keys(pengaturan);
      for (const key of keys) {
        const { data: existing } = await supabase.from('pengaturan').select('id').eq('kunci', key).single();
        if (existing) {
          await supabase.from('pengaturan').update({ nilai: pengaturan[key] }).eq('id', existing.id);
        } else {
          await supabase.from('pengaturan').insert([{ kunci: key, nilai: pengaturan[key] }]);
        }
      }
      alert('Pengaturan berhasil disimpan!');
    } catch (err) {
      alert('Gagal menyimpan pengaturan: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center">
            <Settings className="w-8 h-8 mr-3 text-gray-700" /> Pengaturan Sistem
          </h1>
          <p className="text-gray-500 mt-1">Konfigurasi profil dasar organisasi Karang Taruna.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8">
        {loading ? (
          <div className="text-center text-gray-500 py-8">Memuat pengaturan...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Organisasi</label>
                <input required type="text" value={pengaturan.nama_organisasi} onChange={e => setPengaturan({...pengaturan, nama_organisasi: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Ketua Saat Ini</label>
                <input type="text" value={pengaturan.nama_ketua} onChange={e => setPengaturan({...pengaturan, nama_ketua: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Kontak WhatsApp Utama</label>
                <input type="text" value={pengaturan.kontak_whatsapp} onChange={e => setPengaturan({...pengaturan, kontak_whatsapp: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500 transition-colors" placeholder="081234567890" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tautan Instagram</label>
                <input type="url" value={pengaturan.link_instagram} onChange={e => setPengaturan({...pengaturan, link_instagram: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500 transition-colors" placeholder="https://instagram.com/..." />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Alamat Sekretariat</label>
              <textarea rows="3" value={pengaturan.alamat_sekretariat} onChange={e => setPengaturan({...pengaturan, alamat_sekretariat: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500 transition-colors"></textarea>
            </div>
            
            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button disabled={saving} type="submit" className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center">
                {saving ? 'Menyimpan...' : <><Save className="w-5 h-5 mr-2" /> Simpan Pengaturan</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
