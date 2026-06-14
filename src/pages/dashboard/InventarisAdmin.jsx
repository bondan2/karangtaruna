import { Package } from 'lucide-react';

export default function InventarisAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center">
            <Package className="w-8 h-8 mr-3 text-primary-500" /> Inventaris Barang
          </h1>
          <p className="text-gray-500 mt-1">Pendataan aset dan barang inventaris Karang Taruna.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-12 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Modul Sedang Dalam Pengembangan</h3>
        <p className="text-gray-500">Sistem manajemen stok barang sedang dalam perakitan tahap akhir.</p>
      </div>
    </div>
  );
}
