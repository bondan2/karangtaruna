import { Settings } from 'lucide-react';

export default function PengaturanAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center">
            <Settings className="w-8 h-8 mr-3 text-primary-500" /> Pengaturan Sistem
          </h1>
          <p className="text-gray-500 mt-1">Konfigurasi hak akses pengguna dan profil organisasi.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-12 text-center">
        <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Akses Dibatasi</h3>
        <p className="text-gray-500">Hanya Super Admin yang dapat mengubah konfigurasi fundamental sistem.</p>
      </div>
    </div>
  );
}
