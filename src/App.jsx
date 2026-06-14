import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import TentangKami from './pages/public/TentangKami';
import ProgramKerja from './pages/public/ProgramKerja';
import Berita from './pages/public/Berita';
import Pengumuman from './pages/public/Pengumuman';
import Agenda from './pages/public/Agenda';
import Galeri from './pages/public/Galeri';
import Kontak from './pages/public/Kontak';
import KeuanganPublic from './pages/public/KeuanganPublic';
import LombaPublic from './pages/public/LombaPublic';

// Auth
import Login from './pages/auth/Login';

// Dashboard Pages
import DashboardIndex from './pages/dashboard/DashboardIndex';
import BeritaAdmin from './pages/dashboard/BeritaAdmin';
import PengumumanAdmin from './pages/dashboard/PengumumanAdmin';
import AgendaAdmin from './pages/dashboard/AgendaAdmin';
import AnggotaAdmin from './pages/dashboard/AnggotaAdmin';
import AbsensiAdmin from './pages/dashboard/AbsensiAdmin';
import ProgramKerjaAdmin from './pages/dashboard/ProgramKerjaAdmin';
import SuratMenyuratAdmin from './pages/dashboard/SuratMenyuratAdmin';
import NotulenRapatAdmin from './pages/dashboard/NotulenRapatAdmin';
import KeuanganAdmin from './pages/dashboard/KeuanganAdmin';
import InventarisAdmin from './pages/dashboard/InventarisAdmin';
import DokumenAdmin from './pages/dashboard/DokumenAdmin';
import LombaAdmin from './pages/dashboard/LombaAdmin';
import Event17AgustusAdmin from './pages/dashboard/Event17AgustusAdmin';
import GaleriAdmin from './pages/dashboard/GaleriAdmin';
import PengaturanAdmin from './pages/dashboard/PengaturanAdmin';
import UnderConstruction from './pages/dashboard/UnderConstruction';

// Master Data Phase 1
import PeriodeAdmin from './pages/dashboard/PeriodeAdmin';
import JabatanAdmin from './pages/dashboard/JabatanAdmin';
import KepengurusanAdmin from './pages/dashboard/KepengurusanAdmin';

// Website Config Phase 1
import BannerWebsiteAdmin from './pages/dashboard/BannerWebsiteAdmin';
import ProfilWebsiteAdmin from './pages/dashboard/ProfilWebsiteAdmin';
import KontakAdmin from './pages/dashboard/KontakAdmin';
import MediaSosialAdmin from './pages/dashboard/MediaSosialAdmin';
import FooterAdmin from './pages/dashboard/FooterAdmin';

// System Admin (IT) Phase 1B
import SystemUserAdmin from './pages/dashboard/SystemUserAdmin';
import SystemRoleAdmin from './pages/dashboard/SystemRoleAdmin';
import SystemActivityLogAdmin from './pages/dashboard/SystemActivityLogAdmin';
import SystemBackupAdmin from './pages/dashboard/SystemBackupAdmin';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="tentang" element={<TentangKami />} />
          <Route path="program" element={<ProgramKerja />} />
          <Route path="berita" element={<Berita />} />
          <Route path="pengumuman" element={<Pengumuman />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path="galeri" element={<Galeri />} />
          <Route path="keuangan" element={<KeuanganPublic />} />
          <Route path="lomba" element={<LombaPublic />} />
          <Route path="kontak" element={<Kontak />} />
        </Route>

        {/* Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardIndex />} />
          <Route path="berita" element={<BeritaAdmin />} />
          <Route path="pengumuman" element={<PengumumanAdmin />} />
          <Route path="agenda" element={<AgendaAdmin />} />
          <Route path="anggota" element={<AnggotaAdmin />} />
          <Route path="periode" element={<PeriodeAdmin />} />
          <Route path="jabatan" element={<JabatanAdmin />} />
          <Route path="kepengurusan" element={<KepengurusanAdmin />} />
          <Route path="absensi" element={<AbsensiAdmin />} />
          <Route path="program-kerja" element={<ProgramKerjaAdmin />} />
          <Route path="surat-menyurat" element={<SuratMenyuratAdmin />} />
          <Route path="notulen-rapat" element={<NotulenRapatAdmin />} />
          <Route path="keuangan" element={<KeuanganAdmin />} />
          <Route path="inventaris" element={<InventarisAdmin />} />
          <Route path="dokumen" element={<DokumenAdmin />} />
          <Route path="lomba" element={<LombaAdmin />} />
          <Route path="event" element={<Event17AgustusAdmin />} />
          <Route path="event-17-agustus" element={<Event17AgustusAdmin />} />
          <Route path="galeri" element={<GaleriAdmin />} />
          <Route path="pengaturan" element={<PengaturanAdmin />} />
          
          <Route path="website-banner" element={<BannerWebsiteAdmin />} />
          <Route path="website-profil" element={<ProfilWebsiteAdmin />} />
          <Route path="website-kontak" element={<KontakAdmin />} />
          <Route path="website-medsos" element={<MediaSosialAdmin />} />
          <Route path="website-footer" element={<FooterAdmin />} />
          
          <Route path="sistem-user" element={<SystemUserAdmin />} />
          <Route path="sistem-role" element={<SystemRoleAdmin />} />
          <Route path="sistem-permission" element={<SystemRoleAdmin />} />
          <Route path="sistem-activity-log" element={<SystemActivityLogAdmin />} />
          <Route path="sistem-audit-log" element={<SystemActivityLogAdmin />} />
          <Route path="sistem-backup" element={<SystemBackupAdmin />} />
          <Route path="sistem-restore" element={<SystemBackupAdmin />} />
          
          <Route path="*" element={<UnderConstruction />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
