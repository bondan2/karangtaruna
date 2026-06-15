import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Database, Download, UploadCloud, AlertTriangle, CheckCircle } from 'lucide-react';

export default function SystemBackupAdmin() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);
  
  const handleBackup = async () => {
    if (!window.confirm('Proses ini akan mengunduh seluruh data krusial sistem (Anggota, Keuangan, dsb). Lanjutkan?')) return;
    
    setIsBackingUp(true);
    setBackupSuccess(false);
    
    try {
      // Simulasi backup: Mengambil data dari beberapa tabel utama
      const [profiles, anggota, keuangan, pengaturan] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('anggota').select('*'),
        supabase.from('keuangan').select('*'),
        supabase.from('pengaturan').select('*')
      ]);

      const backupData = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: {
          profiles: profiles.data,
          anggota: anggota.data,
          keuangan: keuangan.data,
          pengaturan: pengaturan.data
        }
      };

      // Buat file JSON untuk didownload
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `backup_karang_taruna_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      
      // Catat ke activity log jika user login (simulasi, karena kita tidak punya context auth disini, kita abaikan saja)
      
      setBackupSuccess(true);
      setTimeout(() => setBackupSuccess(false), 5000);
    } catch (error) {
      alert('Terjadi kesalahan saat membuat file backup: ' + error.message);
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestoreClick = () => {
    alert('Fungsi Restore Database dinonaktifkan di sisi Klien (Frontend) karena alasan keamanan. Harap gunakan fitur Restore Database langsung dari panel Supabase Studio Anda untuk menghindari kehilangan atau korupsi data massal.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mr-4 text-amber-600">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Database Backup & Restore</h1>
            <p className="text-sm text-gray-500 font-medium">Amankan data organisasi Anda dengan pencadangan rutin</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Panel Backup */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6">
            <Download className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Eksportir Cadangan (*Backup*)</h2>
          <p className="text-gray-500 mb-8 font-medium">
            Unduh seluruh data sistem Anda ke dalam format <code>.json</code>. Fitur ini menarik data dari tabel Anggota, Keuangan, Pengaturan, dan Profil. Pastikan Anda menyimpan file hasil unduhan di tempat yang aman.
          </p>
          
          <button 
            onClick={handleBackup}
            disabled={isBackingUp}
            className="w-full flex justify-center items-center px-6 py-4 bg-primary-600 text-white font-black rounded-xl hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-70"
          >
            {isBackingUp ? (
              'Sedang Menarik Data...'
            ) : backupSuccess ? (
              <><CheckCircle className="w-5 h-5 mr-2" /> Backup Berhasil!</>
            ) : (
              <><Download className="w-5 h-5 mr-2" /> Buat File Backup (.JSON)</>
            )}
          </button>
        </div>

        {/* Panel Restore */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative overflow-hidden">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-6 relative z-10">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2 relative z-10">Pemulihan Data (*Restore*)</h2>
          <p className="text-gray-500 mb-8 font-medium relative z-10">
            Mengembalikan data sistem dari file backup <code>.json</code> atau <code>.sql</code>. Menggunakan fitur ini akan menghapus dan menimpa seluruh data yang ada saat ini dengan data dari file cadangan.
          </p>
          
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-6 relative z-10 flex items-start">
            <AlertTriangle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-800 font-medium">
              Untuk mencegah kerusakan struktural, fitur *Restore* melalui *web interface* dinonaktifkan. Lakukan *Restore* secara aman melalui SQL Editor Supabase.
            </p>
          </div>

          <button 
            onClick={handleRestoreClick}
            className="w-full flex justify-center items-center px-6 py-4 bg-gray-100 text-gray-400 font-black rounded-xl cursor-not-allowed shadow-inner relative z-10"
          >
            <UploadCloud className="w-5 h-5 mr-2" /> Unggah File Cadangan (Terkunci)
          </button>
        </div>

      </div>
    </div>
  );
}
