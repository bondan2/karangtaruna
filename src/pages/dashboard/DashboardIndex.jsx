import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import AdminMonitoring from './AdminMonitoring';
import DefaultDashboard from './DefaultDashboard';

export default function DashboardIndex() {
  const [role, setRole] = useState('Admin');
  
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') || 'Admin';
    setRole(savedRole);
  }, []);

  // Jika Admin, tampilkan Dashboard Monitoring Khusus IT
  if (role === 'Admin') {
    return <AdminMonitoring />;
  }

  // Jika role lain, tampilkan Dashboard Standar
  return <DefaultDashboard />;
}
