import { ShieldAlert, AlertTriangle } from 'lucide-react';

export default function SystemRoleAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4 text-red-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Role & Permission (System Core)</h1>
            <p className="text-sm text-gray-500 font-medium">Konfigurasi mendalam hak akses (*Access Control List*)</p>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Peringatan Keamanan Sistem</h2>
        <p className="text-gray-600 max-w-lg mb-6">
          Modifikasi *Role* dan *Permission* telah dikunci di tingkat kode aplikasi (*Hardcoded in Source Code*) melalui komponen <code>DashboardLayout.jsx</code> untuk mencegah insiden keamanan yang fatal jika diubah oleh pengguna yang tidak berwenang.
        </p>
        <p className="text-sm font-bold text-gray-800 bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
          Untuk mengubah menu apa yang bisa dilihat oleh Role tertentu, hubungi Developer / IT Administrator untuk mengubah file <code>src/layouts/DashboardLayout.jsx</code>.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
        <h3 className="font-black text-gray-900 mb-4 text-lg">Daftar *Role* Saat Ini (Read-Only)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <RoleCard role="Admin" desc="Memiliki akses penuh ke seluruh menu sistem (Sistem, Master Data, Website, Keuangan, dsb)." color="red" />
          <RoleCard role="Ketua" desc="Akses ke laporan keuangan, persetujuan program kerja, dan melihat rekap anggota." color="purple" />
          <RoleCard role="Sekretaris" desc="Akses untuk mengelola administrasi, persuratan, inventaris, dan publikasi web." color="emerald" />
          <RoleCard role="Bendahara" desc="Akses eksklusif untuk mengelola transaksi kasir, keuangan, iuran, donasi, dan laporan kas." color="blue" />
          <RoleCard role="Anggota" desc="Akses terbatas hanya untuk melihat profil sendiri, absen kegiatan, dan dokumen publik." color="gray" />
        </div>
      </div>
    </div>
  );
}

function RoleCard({ role, desc, color }) {
  const colorMap = {
    red: 'bg-red-50 border-red-100 text-red-700',
    purple: 'bg-purple-50 border-purple-100 text-purple-700',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    blue: 'bg-blue-50 border-blue-100 text-blue-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
  };

  return (
    <div className={`p-4 rounded-xl border ${colorMap[color]}`}>
      <h4 className="font-black text-lg mb-1">{role}</h4>
      <p className="text-sm opacity-80 font-medium">{desc}</p>
    </div>
  );
}
