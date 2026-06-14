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
import SuratMenyuratAdmin from './pages/dashboard/SuratMenyuratAdmin';
import NotulenRapatAdmin from './pages/dashboard/NotulenRapatAdmin';
import KeuanganAdmin from './pages/dashboard/KeuanganAdmin';
import InventarisAdmin from './pages/dashboard/InventarisAdmin';
import LombaAdmin from './pages/dashboard/LombaAdmin';
import Event17AgustusAdmin from './pages/dashboard/Event17AgustusAdmin';
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

// Bendahara (Keuangan) Phase 2
import SponsorAdmin from './pages/dashboard/SponsorAdmin';
import KeuanganTransaksi from './pages/dashboard/KeuanganTransaksi';
import KeuanganLaporan from './pages/dashboard/KeuanganLaporan';
import KeuanganAnggaran from './pages/dashboard/KeuanganAnggaran';

// Sekretaris & Operasional Phase 3
import PublikasiAdmin from './pages/dashboard/PublikasiAdmin';
import GaleriAdmin from './pages/dashboard/GaleriAdmin';
import SuratAdmin from './pages/dashboard/SuratAdmin';
import DokumenAdmin from './pages/dashboard/DokumenAdmin';
import ProgramKerjaAdmin from './pages/dashboard/ProgramKerjaAdmin';
import EventLombaAdmin from './pages/dashboard/EventLombaAdmin';
import NotulenAdmin from './pages/dashboard/NotulenAdmin';

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
          
          {/* Rute Bendahara (Keuangan) */}
          <Route path="iuran" element={<KeuanganTransaksi jenisTransaksi="Pemasukan" kategori="Iuran Anggota" />} />
          <Route path="donasi" element={<KeuanganTransaksi jenisTransaksi="Pemasukan" kategori="Donasi" />} />
          <Route path="pemasukan-sponsor" element={<KeuanganTransaksi jenisTransaksi="Pemasukan" kategori="Sponsor" />} />
          <Route path="pendapatan-event" element={<KeuanganTransaksi jenisTransaksi="Pemasukan" kategori="Pendapatan Event" />} />
          
          <Route path="operasional" element={<KeuanganTransaksi jenisTransaksi="Pengeluaran" kategori="Operasional" />} />
          <Route path="pengeluaran-kegiatan" element={<KeuanganTransaksi jenisTransaksi="Pengeluaran" kategori="Kegiatan" />} />
          <Route path="pengeluaran-inventaris" element={<KeuanganTransaksi jenisTransaksi="Pengeluaran" kategori="Inventaris" />} />
          <Route path="pengeluaran-lainnya" element={<KeuanganTransaksi jenisTransaksi="Pengeluaran" kategori="Lainnya" />} />
          
          <Route path="anggaran-proker" element={<KeuanganAnggaran tipe="Proker" />} />
          <Route path="anggaran-event" element={<KeuanganAnggaran tipe="Event" />} />
          <Route path="anggaran-proposal" element={<KeuanganAnggaran tipe="Proposal" />} />
          
          <Route path="laporan-harian" element={<KeuanganLaporan rentang="Harian" />} />
          <Route path="laporan-bulanan" element={<KeuanganLaporan rentang="Bulanan" />} />
          <Route path="laporan-tahunan" element={<KeuanganLaporan rentang="Tahunan" />} />
          <Route path="rekap-kas" element={<KeuanganLaporan rentang="Rekap Kas" />} />
          <Route path="keuangan" element={<KeuanganLaporan rentang="Rekap Kas" />} />
          
          <Route path="sponsor" element={<SponsorAdmin />} />
          
          {/* Rute Sekretaris & Operasional (Phase 3) */}
          <Route path="berita" element={<PublikasiAdmin tipe="Berita" />} />
          <Route path="pengumuman" element={<PublikasiAdmin tipe="Pengumuman" />} />
          <Route path="agenda" element={<PublikasiAdmin tipe="Agenda" />} />
          <Route path="galeri" element={<GaleriAdmin />} />
          <Route path="dokumentasi" element={<GaleriAdmin />} />
          
          <Route path="surat-masuk" element={<SuratAdmin jenisSurat="Masuk" />} />
          <Route path="surat-keluar" element={<SuratAdmin jenisSurat="Keluar" />} />
          <Route path="nomor-surat" element={<SuratAdmin jenisSurat="Nomor Surat" />} />
          <Route path="surat-menyurat" element={<SuratAdmin jenisSurat="Nomor Surat" />} />
          
          <Route path="notulen-rapat" element={<NotulenAdmin />} />
          
          <Route path="dokumen" element={<DokumenAdmin kategoriDokumen="Semua" />} />
          <Route path="dokumen-publik" element={<DokumenAdmin kategoriDokumen="Semua" />} />
          <Route path="proposal" element={<DokumenAdmin kategoriDokumen="Proposal" />} />
          <Route path="lpj" element={<DokumenAdmin kategoriDokumen="LPJ" />} />
          <Route path="sk" element={<DokumenAdmin kategoriDokumen="SK" />} />
          <Route path="ad-art" element={<DokumenAdmin kategoriDokumen="AD/ART" />} />
          <Route path="laporan-kegiatan" element={<DokumenAdmin kategoriDokumen="Laporan Kegiatan" />} />
          
          <Route path="program-kerja" element={<ProgramKerjaAdmin />} />
          
          <Route path="event" element={<EventLombaAdmin tipe="Event" />} />
          <Route path="lomba" element={<EventLombaAdmin tipe="Lomba" />} />
          <Route path="peserta" element={<EventLombaAdmin tipe="Peserta" />} />
          
          <Route path="*" element={<UnderConstruction />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
