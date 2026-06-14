import { Flag } from 'lucide-react';

export default function Event17AgustusAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center">
            <Flag className="w-8 h-8 mr-3 text-primary-500" /> Kepanitiaan 17 Agustus
          </h1>
          <p className="text-gray-500 mt-1">Sistem komando terpadu untuk peringatan HUT Kemerdekaan RI.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-12 text-center">
        <Flag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Sistem Sedang Dikunci</h3>
        <p className="text-gray-500">Modul ini hanya akan diaktifkan secara otomatis menjelang bulan Agustus.</p>
      </div>
    </div>
  );
}
