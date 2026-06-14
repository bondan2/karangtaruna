-- Schema Database Karang Taruna (Supabase PostgreSQL)

-- 1. Tabel Profil Pengguna (Di-link ke Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Anggota', -- Admin, Ketua, Bendahara, Sekretaris, Anggota
  jabatan TEXT,
  phone_number TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Tabel Anggota & Absensi
CREATE TABLE anggota (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nama_lengkap TEXT NOT NULL,
  nik TEXT UNIQUE,
  alamat TEXT,
  status_aktif BOOLEAN DEFAULT true,
  tanggal_bergabung DATE DEFAULT CURRENT_DATE
);

CREATE TABLE absensi (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  anggota_id UUID REFERENCES anggota(id),
  tanggal DATE NOT NULL,
  kegiatan TEXT NOT NULL,
  status_hadir TEXT NOT NULL -- Hadir, Izin, Sakit, Alpa
);

-- 3. Tabel Keuangan
CREATE TABLE keuangan (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  jenis_transaksi TEXT NOT NULL, -- Pemasukan, Pengeluaran
  kategori TEXT, -- Iuran, Donasi, Operasional, Acara
  keterangan TEXT NOT NULL,
  nominal NUMERIC NOT NULL,
  bukti_struk_url TEXT,
  diinput_oleh UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Tabel Program Kerja
CREATE TABLE program_kerja (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nama_program TEXT NOT NULL,
  deskripsi TEXT,
  divisi TEXT,
  target_pelaksanaan DATE,
  anggaran NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Direncanakan', -- Direncanakan, Berjalan, Selesai, Dibatalkan
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. Tabel Lomba & Pendaftaran Lomba
CREATE TABLE lomba (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nama_lomba TEXT NOT NULL,
  deskripsi TEXT,
  kategori TEXT,
  tanggal_pelaksanaan DATE,
  status TEXT DEFAULT 'Pendaftaran Buka', -- Pendaftaran Buka, Sedang Berjalan, Selesai
  banner_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE peserta_lomba (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lomba_id UUID REFERENCES lomba(id),
  nama_peserta TEXT NOT NULL,
  kontak TEXT,
  asal_rt_rw TEXT,
  status_juara TEXT -- Juara 1, Juara 2, Juara 3, null
);

-- 6. Tabel Publikasi (Berita, Pengumuman, Agenda, Galeri)
CREATE TABLE berita (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  judul TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  konten TEXT NOT NULL,
  gambar_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE agenda (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nama_acara TEXT NOT NULL,
  tanggal DATE NOT NULL,
  waktu TEXT,
  lokasi TEXT,
  deskripsi TEXT
);

CREATE TABLE galeri (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  judul_foto TEXT,
  kategori TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 7. Tabel Surat & Dokumen
CREATE TABLE surat_menyurat (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nomor_surat TEXT UNIQUE NOT NULL,
  jenis_surat TEXT NOT NULL, -- Masuk, Keluar
  tanggal_surat DATE,
  perihal TEXT NOT NULL,
  pengirim_penerima TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE dokumen (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nama_dokumen TEXT NOT NULL,
  kategori TEXT, -- AD/ART, SK, Laporan
  file_url TEXT NOT NULL,
  diunggah_pada TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);
