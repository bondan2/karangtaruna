import { Bell } from 'lucide-react';

export default function PengumumanAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center">
            <Bell className="w-8 h-8 mr-3 text-primary-500" /> Pusat Pengumuman
          </h1>
          <p className="text-gray-500 mt-1">Penyebaran informasi dan instruksi cepat untuk kepengurusan.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-12 text-center">
        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Pengumuman</h3>
        <p className="text-gray-500">Anda dapat mempublikasikan pengumuman mendesak di sini nanti.</p>
      </div>
    </div>
  );
}
