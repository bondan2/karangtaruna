import { Users, FileText, Bell, Briefcase, Flag, Trophy, Wallet, Archive, Box, Activity, LogIn, Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

export default function AdminMonitoring() {
  const [userName, setUserName] = useState('Admin IT');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    anggota: 0,
    pengurus: 0,
    berita: 0,
    pengumuman: 0,
    proker: 0,
    event: 0,
    lomba: 0,
    pemasukan: 0,
    pengeluaran: 0,
    dokumen: 0,
    inventaris: 0,
  });

  const [activities, setActivities] = useState({
    pengeluaranTerakhir: null,
    beritaTerbaru: null,
    agendaMendatang: null,
    eventAktif: null,
  });

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || 'Admin IT');
    fetchMonitoringData();
  }, []);

  const fetchMonitoringData = async () => {
    try {
      setLoading(true);

      // Concurrent Data Fetching for Dashboard Speed
      const [
        { count: anggotaCount },
        { count: pengurusCount },
        { count: beritaCount },
        { count: pengumumanCount },
        { count: prokerCount },
        { count: eventCount },
        { count: lombaCount },
        { count: dokumenCount },
        { count: inventarisCount },
        { data: keuanganData },
        { data: pengeluaranTerakhir },
        { data: beritaTerbaru },
        { data: agendaMendatang },
        { data: eventAktif },
      ] = await Promise.all([
        supabase.from('anggota').select('*', { count: 'exact', head: true }),
        supabase.from('anggota').select('*', { count: 'exact', head: true }).eq('status_aktif', true), // Anggap pengurus adalah anggota aktif sementara
        supabase.from('berita').select('*', { count: 'exact', head: true }),
        supabase.from('pengumuman').select('*', { count: 'exact', head: true }),
        supabase.from('program_kerja').select('*', { count: 'exact', head: true }),
        supabase.from('event_17_agustus').select('*', { count: 'exact', head: true }),
        supabase.from('lomba').select('*', { count: 'exact', head: true }),
        supabase.from('dokumen').select('*', { count: 'exact', head: true }),
        supabase.from('inventaris').select('*', { count: 'exact', head: true }),
        supabase.from('keuangan').select('jenis_transaksi, nominal'),
        supabase.from('keuangan').select('*').eq('jenis_transaksi', 'Pengeluaran').order('created_at', { ascending: false }).limit(1),
        supabase.from('berita').select('*').order('created_at', { ascending: false }).limit(1),
        supabase.from('agenda').select('*').gte('tanggal', new Date().toISOString().split('T')[0]).order('tanggal', { ascending: true }).limit(1),
        supabase.from('event_17_agustus').select('*').neq('status', 'Selesai').limit(1),
      ]);

      let pemasukan = 0;
      let pengeluaran = 0;

      if (keuanganData) {
        keuanganData.forEach(trx => {
          if (trx.jenis_transaksi === 'Pemasukan') pemasukan += Number(trx.nominal);
          else if (trx.jenis_transaksi === 'Pengeluaran') pengeluaran += Number(trx.nominal);
        });
      }

      setStats({
        anggota: anggotaCount || 0,
        pengurus: pengurusCount || 0, // Placeholder
        berita: beritaCount || 0,
        pengumuman: pengumumanCount || 0,
        proker: prokerCount || 0,
        event: eventCount || 0,
        lomba: lombaCount || 0,
        pemasukan,
        pengeluaran,
        dokumen: dokumenCount || 0,
        inventaris: inventarisCount || 0,
      });

      setActivities({
        pengeluaranTerakhir: pengeluaranTerakhir?.[0] || null,
        beritaTerbaru: beritaTerbaru?.[0] || null,
        agendaMendatang: agendaMendatang?.[0] || null,
        eventAktif: eventAktif?.[0] || null,
      });

    } catch (error) {
      console.error("Gagal mengambil data monitoring:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  };

  const StatCard = ({ title, value, icon: Icon, color, isMoney = false }) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</p>
        <p className="text-xl font-black text-gray-900 mt-0.5">
          {loading ? '...' : isMoney ? formatRupiah(value) : value}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-slate-800 rounded-full blur-3xl opacity-50"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="flex items-center text-slate-400 mb-2 font-bold tracking-widest text-sm uppercase">
              <Activity className="w-5 h-5 mr-2 text-blue-400" /> IT Monitoring Center
            </div>
            <h1 className="text-3xl font-black mb-2">Sistem Sentral Karang Taruna</h1>
            <p className="text-slate-300 max-w-xl">
              Halo {userName}, pantau seluruh pergerakan data, aktivitas, dan keamanan sistem dari satu tempat.
            </p>
          </div>
          <div className="mt-6 md:mt-0 bg-slate-800 px-6 py-4 rounded-2xl border border-slate-700">
            <div className="text-sm text-slate-400 font-medium mb-1">Status Sistem</div>
            <div className="flex items-center text-green-400 font-bold">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              Semua Layanan Normal
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-primary-600" /> Matriks Utama
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard title="Total Anggota" value={stats.anggota} icon={Users} color="bg-blue-50 text-blue-600" />
          <StatCard title="Total Pengurus" value={stats.pengurus} icon={Users} color="bg-indigo-50 text-indigo-600" />
          <StatCard title="Berita Publik" value={stats.berita} icon={Newspaper} color="bg-sky-50 text-sky-600" />
          <StatCard title="Pengumuman" value={stats.pengumuman} icon={Bell} color="bg-orange-50 text-orange-600" />
          <StatCard title="Program Kerja" value={stats.proker} icon={Briefcase} color="bg-teal-50 text-teal-600" />
          <StatCard title="Event / Acara" value={stats.event} icon={Flag} color="bg-rose-50 text-rose-600" />
          <StatCard title="Kompetisi Lomba" value={stats.lomba} icon={Trophy} color="bg-amber-50 text-amber-600" />
          <StatCard title="Inventaris Aset" value={stats.inventaris} icon={Box} color="bg-stone-50 text-stone-600" />
          <StatCard title="Total Dokumen" value={stats.dokumen} icon={Archive} color="bg-fuchsia-50 text-fuchsia-600" />
          <StatCard title="Total Pemasukan" value={stats.pemasukan} isMoney icon={Wallet} color="bg-emerald-50 text-emerald-600" />
          <StatCard title="Total Pengeluaran" value={stats.pengeluaran} isMoney icon={Wallet} color="bg-red-50 text-red-600" />
          <StatCard title="Saldo Kas Aktual" value={stats.pemasukan - stats.pengeluaran} isMoney icon={Wallet} color="bg-green-100 text-green-700" />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-primary-600" /> Log Aktivitas Sistem Terakhir
        </h2>
        
        {loading ? (
          <div className="py-10 text-center text-gray-500 font-medium animate-pulse">Memindai log aktivitas...</div>
        ) : (
          <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
            
            {/* Login Terakhir (Simulasi) */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                <LogIn className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-gray-900 text-sm">Login Sistem</span>
                  <span className="text-xs font-bold text-gray-500">Baru Saja</span>
                </div>
                <div className="text-gray-600 text-sm">Ketua Karang Taruna login ke dalam sistem.</div>
              </div>
            </div>

            {/* Pengeluaran Terakhir */}
            {activities.pengeluaranTerakhir && (
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-red-100 text-red-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                  <Wallet className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-gray-900 text-sm">Kas Keluar</span>
                    <span className="text-xs font-bold text-gray-500">{new Date(activities.pengeluaranTerakhir.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="text-gray-600 text-sm">
                    Pengeluaran sebesar <span className="font-bold">{formatRupiah(activities.pengeluaranTerakhir.nominal)}</span> untuk {activities.pengeluaranTerakhir.keterangan}.
                  </div>
                </div>
              </div>
            )}

            {/* Berita Terbaru */}
            {activities.beritaTerbaru && (
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-sky-100 text-sky-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                  <Newspaper className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-gray-900 text-sm">Berita Dipublikasi</span>
                    <span className="text-xs font-bold text-gray-500">{new Date(activities.beritaTerbaru.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="text-gray-600 text-sm truncate">
                    "{activities.beritaTerbaru.judul}" dipublikasikan ke publik.
                  </div>
                </div>
              </div>
            )}

            {/* Agenda Mendatang */}
            {activities.agendaMendatang && (
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-purple-100 text-purple-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-gray-900 text-sm">Agenda Mendatang</span>
                    <span className="text-xs font-bold text-gray-500">{new Date(activities.agendaMendatang.tanggal).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="text-gray-600 text-sm truncate">
                    Persiapan untuk agenda: {activities.agendaMendatang.nama_acara}.
                  </div>
                </div>
              </div>
            )}

            {/* Event Aktif */}
            {activities.eventAktif && (
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-rose-100 text-rose-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                  <Flag className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-gray-900 text-sm">Event Aktif</span>
                    <span className="text-xs font-bold text-gray-500">{activities.eventAktif.status}</span>
                  </div>
                  <div className="text-gray-600 text-sm truncate">
                    Event "{activities.eventAktif.nama_kegiatan}" sedang berlangsung.
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
