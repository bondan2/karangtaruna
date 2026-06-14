import { Users, Wallet, Trophy, CalendarDays, TrendingUp, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardIndex() {
  const [userName, setUserName] = useState('Administrator');
  const [role, setRole] = useState('Admin');

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || 'Administrator');
    setRole(localStorage.getItem('userRole') || 'Admin');
  }, []);

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
            <p className="text-2xl font-black text-gray-900">0</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mr-4">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Saldo Kas</p>
            <p className="text-2xl font-black text-gray-900">Rp 0</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center mr-4">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Lomba Aktif</p>
            <p className="text-2xl font-black text-gray-900">0</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mr-4">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Agenda</p>
            <p className="text-2xl font-black text-gray-900">0</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary-600" /> Grafik Keuangan
          </h3>
          <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 font-medium">
            <span>[Grafik Pendapatan & Pengeluaran]</span>
            <span className="text-sm mt-2">Akan muncul setelah data mutasi tersedia.</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-primary-600" /> Pemberitahuan Sistem
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-primary-50 text-primary-800 rounded-xl text-sm font-medium border border-primary-100">
              Selamat datang di Sistem Informasi Manajemen baru. Silakan mulai dengan menambahkan data Anggota pada menu di samping kiri.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
