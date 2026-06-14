import { useState, useEffect } from 'react';
import { Briefcase, Activity, CheckCircle2, Circle } from 'lucide-react';
import heroImage from '../../assets/hero.png';
import { supabase } from '../../lib/supabase';

export default function ProgramKerja() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProgram(); }, []);

  const fetchProgram = async () => {
    try {
      const { data, error } = await supabase.from('program_kerja').select('*').order('created_at', { ascending: false });
      if (!error) setPrograms(data || []);
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="relative h-[300px] md:h-[400px] bg-primary-900 flex items-center justify-center overflow-hidden pt-20">
        <img src={heroImage} alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/50 to-transparent"></div>
        <div className="relative z-10 text-center px-4">
          <h6 className="text-yellow-400 font-bold tracking-widest uppercase mb-2">Dedikasi Untuk Negeri</h6>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">Program Kerja</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 min-h-[400px] flex flex-col items-center justify-center">
          {loading ? (
            <div className="py-12 text-center text-gray-500 font-bold">Memuat program kerja...</div>
          ) : programs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Briefcase className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">Belum Ada Program Kerja</h3>
              <p className="text-gray-500 max-w-md">Saat ini belum ada data program kerja kepengurusan yang dipublikasikan. Silakan cek kembali nanti.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((item) => (
                <div key={item.id} className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-primary-50 p-3 rounded-2xl">
                      <Briefcase className="w-6 h-6 text-primary-600" />
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase flex items-center ${
                      item.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                      item.status === 'Berjalan' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {item.status === 'Selesai' && <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
                      {item.status === 'Berjalan' && <Activity className="w-3.5 h-3.5 mr-1 animate-pulse" />}
                      {item.status === 'Direncanakan' && <Circle className="w-3.5 h-3.5 mr-1" />}
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">{item.nama_program}</h3>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-3">
                    {item.deskripsi}
                  </p>
                  <div className="pt-6 border-t border-gray-100 flex justify-between items-center text-sm font-bold">
                    <div className="text-primary-600">Divisi {item.divisi}</div>
                    <div className="text-gray-400">Target: {item.target_pelaksanaan}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
