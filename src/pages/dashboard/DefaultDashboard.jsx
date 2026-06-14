import { Users, Wallet, Trophy, CalendarDays, TrendingUp, AlertCircle, Bell, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function DefaultDashboard() {
  const [userName, setUserName] = useState('Pengguna');
  const [role, setRole] = useState('');
  
  const [stats, setStats] = useState({
    anggota: 0,
    saldoKas: 0,
    lombaAktif: 0,
    agenda: 0
  });
  
  const [keuangan, setKeuangan] = useState({
    pemasukan: 0,
    pengeluaran: 0
  });
  
  const [pengumuman, setPengumuman] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || 'Pengguna');
    setRole(localStorage.getItem('userRole') || '');
    
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Anggota Count
      const { count: anggotaCount } = await supabase
        .from('anggota')
        .select('*', { count: 'exact', head: true });
        
      // 2. Fetch Keuangan
      const { data: dataKeuangan } = await supabase
        .from('keuangan')
        .select('jenis_transaksi, nominal');
        
      let pemasukan = 0;
      let pengeluaran = 0;
      
      if (dataKeuangan) {
        dataKeuangan.forEach(trx => {
          if (trx.jenis_transaksi === 'Pemasukan') pemasukan += Number(trx.nominal);
          else if (trx.jenis_transaksi === 'Pengeluaran') pengeluaran += Number(trx.nominal);
        });
      }
      
      // 3. Fetch Lomba Aktif
      const { count: lombaCount } = await supabase
        .from('lomba')
        .select('*', { count: 'exact', head: true })
        .neq('status', 'Selesai');
        
      // 4. Fetch Agenda
      const { count: agendaCount } = await supabase
        .from('agenda')
        .select('*', { count: 'exact', head: true });
        
      // 5. Fetch Pengumuman Terbaru
      const { data: dataPengumuman } = await supabase
        .from('pengumuman')
        .select('*')
        .eq('is_aktif', true)
        .order('created_at', { ascending: false })
        .limit(3);

      setStats({
        anggota: anggotaCount || 0,
        saldoKas: pemasukan - pengeluaran,
        lombaAktif: lombaCount || 0,
        agenda: agendaCount || 0
      });
      
      setKeuangan({
        pemasukan,
        pengeluaran
      });
      
      setPengumuman(dataPengumuman || []);
      
    } catch (error) {
      console.error("Gagal mengambil data dasbor:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  };

  const totalKeuangan = keuangan.pemasukan + keuangan.pengeluaran;
  const persentasePemasukan = totalKeuangan > 0 ? (keuangan.pemasukan / totalKeuangan) * 100 : 0;
  const persentasePengeluaran = totalKeuangan > 0 ? (keuangan.pengeluaran / totalKeuangan) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="bg-primary-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-primary-800 rounded-full blur-3xl opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2">Selamat Datang, {userName}!</h1>
          <p className="text-primary-200">Anda masuk sebagai {role}. Berikut adalah ringkasan sistem hari ini.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Anggota</p>
            <p className="text-2xl font-black text-gray-900">{loading ? '...' : stats.anggota}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mr-4">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Saldo Kas</p>
            <p className="text-2xl font-black text-gray-900">{loading ? '...' : formatRupiah(stats.saldoKas)}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center mr-4">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Lomba Aktif</p>
            <p className="text-2xl font-black text-gray-900">{loading ? '...' : stats.lombaAktif}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mr-4">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Agenda</p>
            <p className="text-2xl font-black text-gray-900">{loading ? '...' : stats.agenda}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary-600" /> Perbandingan Keuangan
          </h3>
          
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 font-medium">Memuat grafik...</div>
          ) : totalKeuangan === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 font-medium p-6 text-center">
              <Wallet className="w-10 h-10 mb-3 text-gray-300" />
              <span>Belum ada pergerakan kas.</span>
              <span className="text-sm mt-1">Grafik akan muncul setelah data mutasi tersedia.</span>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center space-y-8">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Pemasukan</div>
                  <div className="text-xl font-black text-green-600">{formatRupiah(keuangan.pemasukan)}</div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-6 overflow-hidden flex">
                  <div 
                    className="bg-green-500 h-6 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${persentasePemasukan}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Pengeluaran</div>
                  <div className="text-xl font-black text-red-500">{formatRupiah(keuangan.pengeluaran)}</div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-6 overflow-hidden flex">
                  <div 
                    className="bg-red-500 h-6 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${persentasePengeluaran}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-gray-500 font-medium">Total Volume Transaksi</span>
                <span className="font-bold text-gray-900">{formatRupiah(totalKeuangan)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-primary-600" /> Pemberitahuan Sistem
          </h3>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {loading ? (
              <div className="text-center py-10 text-gray-500 font-medium">Memuat pemberitahuan...</div>
            ) : pengumuman.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <AlertCircle className="w-10 h-10 text-gray-300 mb-3" />
                <h4 className="text-gray-800 font-bold mb-1">Tidak Ada Pemberitahuan</h4>
                <p className="text-sm text-gray-500">Sistem berjalan normal. Belum ada pengumuman terbaru.</p>
              </div>
            ) : (
              pengumuman.map((item) => (
                <div key={item.id} className="p-4 bg-primary-50 text-primary-900 rounded-xl border border-primary-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center text-xs font-bold text-primary-600 mb-2 uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <p className="font-medium text-sm leading-relaxed">{item.isi_pengumuman}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
