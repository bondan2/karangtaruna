import { useState } from 'react';
import { Building2, History, Target, Users, Network, Star, ChevronRight, ChevronDown } from 'lucide-react';
import heroImage from '../../assets/hero.png';
import logo from '../../assets/img/logo.png';

export default function TentangKami() {
  const [expandedDivisi, setExpandedDivisi] = useState(null);

  const pengurus = [
    { jabatan: 'Ketua', nama: 'Ahmad Fauzan' },
    { jabatan: 'Wakil Ketua', nama: 'Bima Sena' },
    { jabatan: 'Sekretaris', nama: 'Siti Aminah' },
    { jabatan: 'Bendahara', nama: 'Dewi Lestari' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="relative h-[300px] md:h-[400px] bg-primary-900 flex items-center justify-center overflow-hidden pt-20">
        <img src={heroImage} alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/50 to-transparent"></div>
        <div className="relative z-10 text-center px-4">
          <h6 className="text-yellow-400 font-bold tracking-widest uppercase mb-2">Mengenal Lebih Dekat</h6>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">Tentang Kami</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 space-y-8">
        
        {/* PROFIL & SEJARAH (Grid) */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Profil */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100 group hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors">
              <Building2 className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase mb-4">Profil Organisasi</h2>
            <p className="text-gray-600 leading-relaxed text-justify">
              Karang Taruna Bina Pemuda adalah organisasi sosial kemasyarakatan yang dibentuk sebagai wadah pembinaan dan pengembangan generasi muda. Kami berkedudukan di wilayah Desa/Kelurahan, tumbuh atas dasar kesadaran dan tanggung jawab sosial dari, oleh, dan untuk masyarakat.
            </p>
          </div>

          {/* Sejarah */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100 group hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-400 transition-colors">
              <History className="w-7 h-7 text-yellow-600 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase mb-4">Sejarah Singkat</h2>
            <p className="text-gray-600 leading-relaxed text-justify">
              Didirikan oleh para pemuda desa yang memiliki kepedulian tinggi terhadap kesejahteraan dan kemajuan lingkungan. Sejak awal berdirinya, organisasi ini telah menjadi motor penggerak dalam berbagai kegiatan sosial, olahraga, kesenian, hingga pemberdayaan ekonomi mikro bagi pemuda sekitar.
            </p>
          </div>
        </div>

        {/* VISI & MISI */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
          <div className="flex items-center mb-8">
            <Target className="w-8 h-8 text-primary-600 mr-3" />
            <h2 className="text-3xl font-black text-gray-900 uppercase">Visi & Misi</h2>
          </div>
          
          <div className="grid md:grid-cols-5 gap-12">
            <div className="md:col-span-2">
              <div className="bg-primary-50 rounded-2xl p-8 h-full border border-primary-100 relative overflow-hidden">
                <Target className="absolute -right-4 -bottom-4 w-32 h-32 text-primary-100 opacity-50" />
                <h3 className="text-primary-700 font-bold uppercase tracking-widest mb-4 relative z-10">Visi Kami</h3>
                <p className="text-xl font-bold text-gray-900 leading-snug relative z-10">
                  "Mewujudkan Pemuda yang Mandiri, Tangguh, Berkarakter, dan Berdaya Saing Global demi Terwujudnya Kesejahteraan Sosial Masyarakat."
                </p>
              </div>
            </div>
            <div className="md:col-span-3">
              <h3 className="text-gray-900 font-bold uppercase tracking-widest mb-4">Misi Kami</h3>
              <ul className="space-y-4">
                {[
                  'Menumbuhkembangkan kesadaran dan tanggung jawab sosial generasi muda.',
                  'Meningkatkan kapasitas dan kompetensi pemuda melalui pelatihan dan pendidikan vokasi.',
                  'Mendorong jiwa kewirausahaan (entrepreneurship) di kalangan pemuda.',
                  'Melestarikan nilai-nilai seni, budaya, dan tradisi lokal.',
                  'Memperkuat solidaritas dan gotong royong antar warga masyarakat.'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-xs mt-0.5 mr-3">
                      {idx + 1}
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* STRUKTUR ORGANISASI & KEPENGURUSAN */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Struktur */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100">
            <div className="flex items-center mb-6">
              <Network className="w-8 h-8 text-primary-600 mr-3" />
              <h2 className="text-2xl font-black text-gray-900 uppercase">Struktur Organisasi</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Struktur organisasi dirancang agar setiap divisi memiliki tugas pokok dan fungsi yang spesifik untuk melayani masyarakat.
            </p>
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <div className="space-y-2 font-medium text-gray-700">
                {[
                  { nama: 'Majelis Pertimbangan Karang Taruna (MPKT)', deskripsi: 'Dewan penasihat yang memberikan arahan, saran, dan pertimbangan kepada pengurus Karang Taruna dalam mengambil kebijakan strategis.' },
                  { nama: 'Ketua, Sekretaris, Bendahara (KSB)', deskripsi: 'Pengurus inti (Badan Pengurus Harian) yang mengelola jalannya organisasi sehari-hari, meliputi operasional, administrasi, dan manajemen keuangan.' },
                  { nama: 'Bidang Usaha Kesejahteraan Sosial (UKS)', deskripsi: 'Fokus pada penyelesaian masalah sosial, pemberian santunan, bantuan kebencanaan, dan program peningkatan kesejahteraan masyarakat sekitar.' },
                  { nama: 'Bidang Lingkungan Hidup & Pariwisata', deskripsi: 'Bertanggung jawab atas program penghijauan, kerja bakti, pengelolaan bank sampah, serta pengembangan potensi pariwisata wilayah lokal.' },
                  { nama: 'Bidang Olahraga & Seni Budaya', deskripsi: 'Mewadahi bakat dan minat pemuda di bidang olahraga (turnamen, latihan rutin) serta kesenian (tari, musik) untuk memupuk kreativitas warga.' },
                  { nama: 'Bidang Kerohanian & Pembinaan Mental', deskripsi: 'Mengkoordinir kegiatan keagamaan, peringatan hari besar agama, majelis taklim, serta pembinaan karakter dan mental spiritual pemuda.' }
                ].map((item, idx) => (
                  <div key={idx} className="border border-gray-100 bg-white rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md">
                    <button 
                      onClick={() => setExpandedDivisi(expandedDivisi === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
                    >
                      <span className="flex items-center font-bold text-gray-800">
                        {expandedDivisi === idx ? <ChevronDown className="w-5 h-5 text-primary-600 mr-3 shrink-0"/> : <ChevronRight className="w-5 h-5 text-gray-400 mr-3 shrink-0"/>}
                        {item.nama}
                      </span>
                    </button>
                    {expandedDivisi === idx && (
                      <div className="px-12 pb-4 text-sm text-gray-600 leading-relaxed animate-in slide-in-from-top-2">
                        {item.deskripsi}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kepengurusan */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100">
            <div className="flex items-center mb-6">
              <Users className="w-8 h-8 text-primary-600 mr-3" />
              <h2 className="text-2xl font-black text-gray-900 uppercase">Pengurus Inti</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {pengurus.map((org, idx) => (
                <div key={idx} className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100 hover:border-primary-300 hover:shadow-md transition-all">
                  <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full mb-3 flex items-center justify-center text-gray-400 overflow-hidden">
                    {/* Placeholder image */}
                    <Users className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">{org.nama}</h4>
                  <p className="text-xs text-primary-600 font-bold uppercase mt-1">{org.jabatan}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LOGO & FILOSOFI */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-50 rounded-bl-full -z-0"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-shrink-0">
              <div className="bg-white p-4 rounded-full shadow-2xl border-8 border-gray-50">
                <img src={logo} alt="Logo Karang Taruna" className="w-48 h-48 md:w-64 md:h-64 object-contain" />
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-4">
                <Star className="w-8 h-8 text-yellow-500 mr-3" />
                <h2 className="text-3xl font-black text-gray-900 uppercase">Logo & Filosofi</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                Lambang Karang Taruna merepresentasikan semangat juang, kejayaan, dan tekad baja generasi muda dalam mewujudkan pembangunan nasional.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 flex items-center mb-2">
                    <span className="w-4 h-4 rounded-full bg-red-600 mr-2 shadow-sm"></span>
                    Merah
                  </h4>
                  <p className="text-sm text-gray-600">Melambangkan keberanian, semangat pantang menyerah, dan tekad yang kuat untuk berjuang demi kebenaran dan keadilan.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 flex items-center mb-2">
                    <span className="w-4 h-4 rounded-full bg-yellow-400 mr-2 shadow-sm"></span>
                    Kuning
                  </h4>
                  <p className="text-sm text-gray-600">Melambangkan keagungan, kejayaan, kemakmuran, dan harapan masa depan yang cerah bagi pemuda dan masyarakat.</p>
                </div>
                <div className="sm:col-span-2">
                  <h4 className="font-bold text-gray-900 flex items-center mb-2">
                    <Star className="w-4 h-4 text-gray-400 fill-gray-400 mr-2" />
                    Bintang
                  </h4>
                  <p className="text-sm text-gray-600">Ketuhanan Yang Maha Esa. Pemuda Karang Taruna dituntut untuk selalu mengedepankan nilai-nilai religius dan ketakwaan dalam setiap gerak langkah pengabdiannya.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
