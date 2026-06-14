import { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import heroImage from '../../assets/hero.png';

export default function KeuanganPublic() {
  const [mutasi] = useState([]);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="relative h-[300px] md:h-[400px] bg-primary-900 flex items-center justify-center overflow-hidden pt-20">
        <img src={heroImage} alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/50 to-transparent"></div>
        <div className="relative z-10 text-center px-4">
          <h6 className="text-yellow-400 font-bold tracking-widest uppercase mb-2">Transparansi Publik</h6>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">Laporan Keuangan</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 space-y-8">
        
        {/* Ringkasan Kas */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary-50 rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 flex items-center mb-4">
              <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-2xl flex items-center justify-center mr-4">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-500 uppercase tracking-wider text-sm">Total Kas Saat Ini</h3>
            </div>
            <div className="relative z-10 text-4xl font-black text-gray-900">Rp 0</div>
          </div>
          
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-green-50 rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-500 uppercase tracking-wider text-sm">Pemasukan Bulan Ini</h3>
            </div>
            <div className="relative z-10 text-4xl font-black text-gray-900">Rp 0</div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-red-50 rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mr-4">
                <TrendingDown className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-500 uppercase tracking-wider text-sm">Pengeluaran Bulan Ini</h3>
            </div>
            <div className="relative z-10 text-4xl font-black text-gray-900">Rp 0</div>
          </div>
        </div>

        {/* Tabel Mutasi */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 min-h-[400px]">
          <h2 className="text-2xl font-black text-gray-900 uppercase mb-8 flex items-center">
            <Receipt className="w-7 h-7 mr-3 text-primary-600" />
            Riwayat Transaksi Terakhir
          </h2>
          
          {mutasi.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Receipt className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Transaksi</h3>
              <p className="text-gray-500">Saat ini belum ada riwayat pemasukan maupun pengeluaran kas yang tercatat di dalam sistem.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">{/* Table goes here */}</div>
          )}
        </div>
      </div>
    </div>
  );
}
