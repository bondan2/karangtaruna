import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Activity, Clock, Server, Monitor } from 'lucide-react';

export default function SystemActivityLogAdmin() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100); // Batasi 100 log terakhir agar tidak berat
        
      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    switch (action?.toUpperCase()) {
      case 'CREATE': return 'bg-green-100 text-green-700 border-green-200';
      case 'UPDATE': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'DELETE': return 'bg-red-100 text-red-700 border-red-200';
      case 'LOGIN': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'EXPORT': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mr-4 text-white">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Audit & Activity Log</h1>
            <p className="text-sm text-gray-500 font-medium">Rekaman jejak aktivitas (*Server Logs*) dari seluruh pengguna sistem</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-xs font-bold text-gray-600"><Monitor className="w-4 h-4 mr-1"/> System Monitor Active</span>
            <span className="flex items-center text-xs font-bold text-gray-600"><Server className="w-4 h-4 mr-1"/> Showing Last 100 Events</span>
          </div>
          <button onClick={fetchLogs} className="text-xs font-bold text-blue-600 hover:text-blue-800">
            Segarkan Log
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-black">Waktu (*Timestamp*)</th>
                <th className="p-4 font-black">Pengguna / Aktor</th>
                <th className="p-4 font-black">Modul Target</th>
                <th className="p-4 font-black">Jenis Aksi</th>
                <th className="p-4 font-black">Keterangan / Rincian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono text-sm">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-400">Loading system logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-400">Belum ada aktivitas terekam.</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-500 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-2" />
                      {formatTime(log.created_at)}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{log.user_name}</div>
                      <div className="text-xs text-slate-400">Role: {log.user_role}</div>
                    </td>
                    <td className="p-4 font-bold text-slate-700">
                      [{log.modul?.toUpperCase()}]
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-0.5 rounded border text-xs font-bold ${getActionColor(log.aksi)}`}>
                        {log.aksi}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 text-xs truncate max-w-xs" title={log.keterangan}>
                      {log.keterangan || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
