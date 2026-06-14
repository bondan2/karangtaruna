import { HardHat } from 'lucide-react';

export default function UnderConstruction() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="bg-yellow-100 p-6 rounded-full mb-6 shadow-inner">
        <HardHat className="w-20 h-20 text-yellow-600" />
      </div>
      <h1 className="text-3xl font-black text-gray-900 mb-4">Fitur Sedang Dibangun</h1>
      <p className="text-gray-500 max-w-lg mx-auto mb-8 text-lg">
        Halaman ini merupakan bagian dari roadmap pengembangan sistem Karang Taruna. 
        Tim IT kami sedang mengerjakannya dan fitur ini akan segera tersedia!
      </p>
      <div className="flex space-x-4">
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          Kembali ke Sebelumnya
        </button>
      </div>
    </div>
  );
}
