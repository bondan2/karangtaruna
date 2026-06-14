import { useState, useEffect } from 'react';
import { Bell, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Pengumuman() {
  const [pengumuman, setPengumuman] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPengumuman();
  }, []);

  const fetchPengumuman = async () => {
    try {
      const { data, error } = await supabase
        .from('pengumuman')
        .select('*')
        .eq('is_aktif', true)
        .order('created_at', { ascending: false });
        
      if (!error) setPengumuman(data || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-orange-100 text-orange-600 rounded-full mb-4">
            <Bell className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-4">Pengumuman Warga</h1>
          <p className="text-gray-500 text-lg">Informasi penting dan pemberitahuan resmi dari pengurus Karang Taruna</p>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12 text-gray-400 font-bold">Mencari pengumuman terbaru...</div>
          ) : pengumuman.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">Tidak ada pengumuman saat ini</h3>
              <p className="text-gray-500 mt-2">Semua informasi dan kegiatan berjalan normal.</p>
            </div>
          ) : (
            pengumuman.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-orange-100 relative overflow-hidden flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>
                
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-orange-50 rounded-2xl flex flex-col items-center justify-center border border-orange-100">
                    <span className="text-xl font-black text-orange-600 leading-none">
                      {new Date(item.created_at).getDate()}
                    </span>
                    <span className="text-xs font-bold text-orange-400 uppercase mt-1">
                      {new Date(item.created_at).toLocaleString('id-ID', { month: 'short' })}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center text-xs font-bold text-gray-400 mb-2">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    Diterbitkan pada {new Date(item.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="prose prose-orange max-w-none">
                    <p className="text-gray-800 text-lg font-medium leading-relaxed whitespace-pre-wrap">
                      {item.isi_pengumuman}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
