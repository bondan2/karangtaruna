import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import heroImage from '../../assets/hero.png';
import { supabase } from '../../lib/supabase';

export default function Agenda() {
  const [agenda, setAgenda] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAgenda(); }, []);

  const fetchAgenda = async () => {
    try {
      const { data, error } = await supabase.from('agenda').select('*').order('tanggal', { ascending: true });
      if (!error) setAgenda(data || []);
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="relative h-[300px] md:h-[400px] bg-primary-900 flex items-center justify-center overflow-hidden pt-20">
        <img src={heroImage} alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/50 to-transparent"></div>
        <div className="relative z-10 text-center px-4">
          <h6 className="text-yellow-400 font-bold tracking-widest uppercase mb-2">Jadwal Acara</h6>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">Agenda Kegiatan</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 min-h-[400px] flex flex-col items-center justify-center">
          {loading ? (
            <div className="py-12 text-center text-gray-500 font-bold">Memuat jadwal kegiatan...</div>
          ) : agenda.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Calendar className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">Belum Ada Agenda Terjadwal</h3>
              <p className="text-gray-500 max-w-md">Saat ini belum ada jadwal kegiatan warga atau karang taruna dalam waktu dekat.</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {agenda.map((item) => {
                const dateObj = new Date(item.tanggal);
                return (
                  <div key={item.id} className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 hover:-translate-y-2 transition-transform duration-300 flex flex-col sm:flex-row gap-6">
                    <div className="flex-shrink-0 text-center">
                      <div className="bg-primary-50 rounded-2xl p-4 w-24 h-24 flex flex-col items-center justify-center border border-primary-100">
                        <span className="text-primary-700 font-black text-2xl leading-none mb-1">{dateObj.getDate()}</span>
                        <span className="text-primary-600 font-bold text-xs uppercase tracking-widest">{dateObj.toLocaleString('id-ID', { month: 'short' })}</span>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight">{item.nama_acara}</h3>
                      <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-2">
                        {item.deskripsi}
                      </p>
                      <div className="mt-auto flex flex-wrap gap-4 text-xs font-bold text-gray-400">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1.5 text-primary-500" /> {item.waktu}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1.5 text-primary-500" /> {item.lokasi}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
