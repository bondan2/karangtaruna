const fs = require('fs');
const path = require('path');

const publicPages = [
  'Home', 'TentangKami', 'ProgramKerja', 'Berita', 'Pengumuman', 'Agenda', 'Galeri', 'Kontak'
];

const dashboardPages = [
  'DashboardIndex', 'BeritaAdmin', 'PengumumanAdmin', 'AgendaAdmin', 'AnggotaAdmin', 
  'AbsensiAdmin', 'ProgramKerjaAdmin', 'SuratMenyuratAdmin', 'NotulenRapatAdmin', 
  'KeuanganAdmin', 'InventarisAdmin', 'DokumenAdmin', 'Event17AgustusAdmin', 
  'GaleriAdmin', 'PengaturanAdmin'
];

const authPages = ['Login'];

const createPage = (dir, name) => {
  const dirPath = path.join(__dirname, 'src', 'pages', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const content = `export default function ${name}() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">${name}</h1>
      <p className="text-gray-500">Halaman ini belum terhubung dengan Supabase.</p>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(dirPath, `${name}.jsx`), content);
};

publicPages.forEach(p => createPage('public', p));
dashboardPages.forEach(p => createPage('dashboard', p));
authPages.forEach(p => createPage('auth', p));

console.log('Pages created successfully.');
