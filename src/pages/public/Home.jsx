import { AlertTriangle, ArrowRight, Download, FileText, Phone, User, ChevronRight, Calendar, Users, Handshake, Trophy } from 'lucide-react';
import { FaYoutube, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../../assets/img/logo.png';
import heroImage from '../../assets/hero.png';

export default function Home() {
  const [berita, setBerita] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [berkas, setBerkas] = useState([]);
  const [layanan, setLayanan] = useState([]);
  const [sambutan, setSambutan] = useState(null); // null means no data yet
  const [sosmed, setSosmed] = useState(null);
  const [statistik, setStatistik] = useState({ anggota: 0, kegiatan: 0, program: 0, prestasi: 0 });

  useEffect(() => {
    // In future, fetch from Supabase here
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f2f5] relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23000000\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>

      {/* NEW HERO SECTION */}
      <section className="relative w-full min-h-[600px] lg:h-[700px] bg-[#f8f9fa] overflow-hidden flex items-center pt-10 lg:pt-0">
        
        {/* Mobile Background Decoration */}
        <div className="absolute inset-0 lg:hidden opacity-5 pointer-events-none">
          <img src={logo} alt="Bg" className="w-[150%] h-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Left Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20">
          <div className="w-full lg:w-[50%] lg:pb-16 flex flex-col justify-center h-full">
            <h2 className="font-caveat text-[45px] md:text-[60px] text-primary-700 leading-none -mb-2 md:-mb-4 transform -rotate-2">Bersatu, Beraksi,</h2>
            <h1 className="font-black text-[65px] md:text-[90px] text-gray-900 leading-none uppercase tracking-tighter">BERKARYA</h1>
            <h3 className="font-bold text-xl md:text-3xl text-primary-600 uppercase tracking-widest mt-1 md:mt-2">UNTUK DESA DAN BANGSA</h3>
            
            <div className="w-24 h-2 bg-yellow-400 my-6 md:my-8 rounded-full shadow-sm"></div>
            
            <p className="text-gray-600 text-base md:text-lg font-medium max-w-lg leading-relaxed mb-8 md:mb-10">
              Karang Taruna Bina Pemuda adalah wadah generasi muda yang berkomitmen untuk membangun, berkontribusi, dan memberikan manfaat bagi masyarakat.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/agenda" className="flex items-center justify-center px-8 py-3.5 bg-[#cc0000] text-white rounded-full font-bold shadow-lg shadow-red-900/20 hover:bg-red-800 hover:-translate-y-1 transition-all text-sm uppercase tracking-wide border border-transparent">
                <Calendar className="w-5 h-5 mr-2" /> LIHAT AGENDA
              </Link>
              <Link to="/berita" className="flex items-center justify-center px-8 py-3.5 bg-white text-gray-900 rounded-full font-bold shadow-lg shadow-gray-200/50 hover:bg-gray-50 hover:-translate-y-1 transition-all text-sm uppercase tracking-wide border border-gray-200">
                <FileText className="w-5 h-5 mr-2" /> BERITA TERBARU
              </Link>
            </div>
          </div>
        </div>

        {/* Right Content Area (Graphics & Swoosh) */}
        <div className="hidden lg:block absolute top-0 right-0 w-[55%] h-full z-10 overflow-visible pointer-events-none">
          {/* Yellow Swoosh Background */}
          <div className="absolute top-[-10%] -left-[10%] w-[120%] h-[120%] bg-yellow-400 rounded-l-[250px] shadow-2xl transform rotate-3"></div>
          
          {/* Red Image Container */}
          <div className="absolute top-[-5%] -left-[5%] w-[110%] h-[110%] bg-[#b30000] rounded-l-[220px] shadow-2xl overflow-hidden border-l-[12px] border-white transform rotate-1">
            <img src={heroImage} alt="Background" className="w-full h-full object-cover opacity-30 mix-blend-multiply scale-110" />
            {/* Dark gradient overlay for text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-24 right-16 z-20">
              <h2 className="font-caveat text-[55px] text-yellow-400 transform -rotate-6 leading-[0.8] drop-shadow-2xl text-right">
                <span className="text-white text-[45px]">Muda Bergerak</span><br/>
                Desa Berdaya
              </h2>
            </div>
          </div>
          
          {/* Huge Circular Logo overlapping the intersection */}
          <div className="absolute top-1/2 -left-24 transform -translate-y-1/2 z-30 drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]">
            <div className="bg-white rounded-full p-2 border-[6px] border-white">
              <img src={logo} alt="Logo Besar" className="w-[420px] h-[420px] object-contain rounded-full border-[8px] border-yellow-400 bg-white" />
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS BAR */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 lg:-mt-16 mb-16">
        <div className="bg-[#8c2211] rounded-[24px] shadow-2xl flex flex-col md:flex-row flex-wrap lg:flex-nowrap justify-between items-center p-2 text-white divide-y md:divide-y-0 md:divide-x divide-white/10 border-4 border-white">
          
          <div className="flex items-center space-x-4 w-full md:w-1/2 lg:w-1/4 p-6 hover:bg-white/5 transition-colors rounded-t-2xl lg:rounded-l-2xl lg:rounded-t-none">
            <Users className="w-10 h-10 text-yellow-400 flex-shrink-0 drop-shadow-md" />
            <div>
              <div className="text-2xl font-black leading-none mb-1 text-white">{statistik.anggota || 0}</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/70 font-bold leading-tight">Anggota Aktif</div>
            </div>
          </div>

          <div className="flex items-center space-x-4 w-full md:w-1/2 lg:w-1/4 p-6 hover:bg-white/5 transition-colors">
            <Calendar className="w-10 h-10 text-yellow-400 flex-shrink-0 drop-shadow-md" />
            <div>
              <div className="text-2xl font-black leading-none mb-1 text-white">{statistik.kegiatan || 0}</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/70 font-bold leading-tight">Kegiatan</div>
            </div>
          </div>

          <div className="flex items-center space-x-4 w-full md:w-1/2 lg:w-1/4 p-6 hover:bg-white/5 transition-colors">
            <Handshake className="w-10 h-10 text-yellow-400 flex-shrink-0 drop-shadow-md" />
            <div>
              <div className="text-2xl font-black leading-none mb-1 text-white">{statistik.program || 0}</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/70 font-bold leading-tight">Program Kerja</div>
            </div>
          </div>

          <div className="flex items-center space-x-4 w-full md:w-1/2 lg:w-1/4 p-6 hover:bg-white/5 transition-colors rounded-b-2xl lg:rounded-r-2xl lg:rounded-b-none">
            <Trophy className="w-10 h-10 text-yellow-400 flex-shrink-0 drop-shadow-md" />
            <div>
              <div className="text-2xl font-black leading-none mb-1 text-white">{statistik.prestasi || 0}</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/70 font-bold leading-tight">Prestasi Diraih</div>
            </div>
          </div>

        </div>
      </div>

      {/* Sambutan & Berkas Unduh */}
      <section className="relative z-20 -mt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-smooth p-6 md:p-10 border border-gray-100">
            <div className="grid lg:grid-cols-12 gap-10">
              
              {/* Sambutan Ketua */}
              <div className="lg:col-span-7">
                {sambutan ? (
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3 flex-shrink-0">
                      <div className="relative bg-gray-100 rounded-xl aspect-[3/4] flex items-center justify-center border border-gray-200 overflow-hidden">
                        {sambutan.fotoUrl ? (
                          <img src={sambutan.fotoUrl} alt="Ketua KT" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-4">
                            <User className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                            <span className="text-xs text-gray-400">Foto Ketua</span>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent rounded-b-xl"></div>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <h6 className="text-primary-600 font-bold text-xs uppercase tracking-widest mb-2 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1.5" /> Sambutan Ketua Karang Taruna
                      </h6>
                      <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{sambutan.nama}</h3>
                      
                      <div className="text-gray-700 leading-relaxed mb-6 space-y-3">
                        {sambutan.teks.map((paragraf, i) => (
                          <p key={i}>{paragraf}</p>
                        ))}
                      </div>

                      <div className="mt-6">
                        <p className="text-gray-500 italic text-sm mb-1">Hormat Kami,</p>
                        <div className="font-caveat text-4xl text-primary-600 mb-1">{sambutan.nama}</div>
                        <div className="text-gray-900 font-bold text-xs uppercase tracking-widest opacity-75">Ketua Karang Taruna</div>
                      </div>

                      <div className="mt-8 flex gap-4">
                        <Link to="/tentang" className="btn bg-primary-600 text-white hover:bg-primary-700 rounded-full px-6 py-2.5 font-bold shadow-sm transition-smooth hover-top text-sm inline-flex items-center">
                          JELAJAHI PROFIL <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                    <User className="w-12 h-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-bold text-gray-900">Data Pengurus Belum Tersedia</h3>
                    <p className="text-sm text-gray-500 mt-1 max-w-sm">Informasi sambutan dan profil ketua akan tampil setelah data dimasukkan ke dalam sistem.</p>
                  </div>
                )}
              </div>

              {/* Agenda & Berkas */}
              <div className="lg:col-span-5 space-y-8">
                {/* Agenda */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center uppercase tracking-wide">
                    <Calendar className="w-5 h-5 text-primary-600 mr-2" /> AGENDA KEGIATAN
                  </h3>
                  {agenda.length > 0 ? (
                    <div className="space-y-4">
                      {agenda.map((item, idx) => (
                        <div key={idx} className="flex gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                          <div className="w-14 h-14 rounded-xl bg-primary-50 border border-primary-100 flex flex-col items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-primary-600 leading-none">{item.date}</span>
                            <span className="text-[10px] font-bold text-gray-600 mt-1 uppercase">{item.month}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{item.title}</h4>
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" /> {item.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100 text-gray-500 text-sm">
                      Belum ada agenda terdekat.
                    </div>
                  )}
                </div>

                {/* Berkas Unduh */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-xl font-bold flex items-center uppercase tracking-wide">
                      <Download className="w-5 h-5 text-primary-600 mr-2" /> BERKAS UNDUH
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">Akses dokumen resmi dan formulir publik.</p>
                  </div>
                  <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-900 text-white text-[11px] uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-3 font-semibold w-12">No</th>
                          <th className="px-4 py-3 font-semibold">Nama Berkas</th>
                          <th className="px-4 py-3 font-semibold text-center w-20">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {berkas.length > 0 ? (
                          berkas.map((item, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-3 text-gray-500 font-medium">{idx + 1}</td>
                              <td className="px-4 py-3">
                                <div className="font-bold text-gray-900">{item.nama}</div>
                                <div className="text-[10px] text-gray-500">{item.format} • {item.tanggal}</div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <a href={item.url} target="_blank" rel="noreferrer" className="text-primary-600 hover:text-primary-800">
                                  <Download className="w-4 h-4 mx-auto" />
                                </a>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="px-4 py-8 text-center bg-gray-50 text-gray-500 text-sm">
                              Belum ada berkas yang diunggah.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Berita Section */}
      <section className="py-12 bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h6 className="text-primary-600 font-bold text-xs uppercase tracking-widest mb-1">Informasi Terbaru</h6>
              <h2 className="text-3xl font-extrabold text-gray-900">BERITA KARANG TARUNA</h2>
            </div>
            <Link to="/berita" className="hidden md:inline-flex items-center px-5 py-2 border-2 border-primary-600 text-primary-600 rounded-full font-bold hover:bg-primary-600 hover:text-white transition-colors text-sm">
              Lihat Semua Berita
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {berita.length > 0 ? (
              berita.map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm hover-top group cursor-pointer border border-gray-100 flex flex-col h-full">
                  <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-gray-300" />
                    )}
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-md">{item.kategori}</span>
                      <span className="text-[11px] text-gray-500 font-medium">{item.tanggal}</span>
                    </div>
                    <h5 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">{item.judul}</h5>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">{item.ringkasan}</p>
                    <span className="text-primary-600 font-bold text-xs inline-flex items-center group-hover:underline">
                      Baca Selengkapnya <ChevronRight className="w-3 h-3 ml-1" />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900">Belum Ada Berita</h3>
                <p className="text-gray-500 text-sm mt-1">Berita terbaru akan segera diperbarui oleh admin.</p>
              </div>
            )}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/berita" className="inline-flex items-center px-6 py-2.5 bg-primary-600 text-white rounded-full font-bold hover:bg-primary-700 transition-colors text-sm w-full justify-center">
              Lihat Semua Berita
            </Link>
          </div>
        </div>
      </section>

      {/* Layanan & Data Anggota */}
      <section className="py-16 bg-white border-y border-gray-200 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Layanan */}
            <div className="lg:col-span-7 bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-primary-600 mb-2 uppercase flex items-center">
                <Phone className="w-6 h-6 mr-2" /> LAYANAN SOSIAL & PUBLIK
              </h3>
              <p className="text-gray-500 text-sm mb-6">Akses cepat layanan darurat (SOS) dan layanan publik terpadu.</p>
              
              {layanan.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {layanan.map((item, idx) => (
                    <a key={idx} href={item.url} className="bg-white border-2 border-red-100 rounded-2xl p-4 text-center hover:scale-105 hover:border-primary-600 hover:shadow-lg transition-all group">
                      <AlertTriangle className="w-8 h-8 text-primary-600 mx-auto mb-2 group-hover:animate-bounce" />
                      <p className="text-[11px] font-extrabold text-gray-800 uppercase leading-tight">{item.nama}</p>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-2xl border border-gray-100 text-gray-500 text-sm">
                  Belum ada data layanan darurat/publik yang ditambahkan.
                </div>
              )}
            </div>

            {/* Data Anggota */}
            <div className="lg:col-span-5 bg-gray-900 rounded-3xl p-6 md:p-8 text-white flex flex-col justify-between shadow-lg relative overflow-hidden border border-gray-800">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-5 text-white">
                <FileText className="w-64 h-64" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-6 uppercase flex items-center">
                  <div className="p-1.5 bg-primary-600 rounded-lg mr-3"><FileText className="w-5 h-5 text-white" /></div> DATA ANGGOTA
                </h3>
                
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="w-40 h-40 rounded-full border-[12px] border-gray-800 border-t-primary-600 flex items-center justify-center mb-4 bg-gray-800/50">
                    <div className="text-center">
                      <span className="block text-3xl font-black">{statistik.anggota || 0}</span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400">Total Anggota</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm text-center">Data anggota tervalidasi dalam sistem.</p>
                </div>
              </div>
              
              <div className="mt-4 relative z-10">
                <Link to="/login" className="btn block w-full bg-primary-600 text-white hover:bg-primary-700 rounded-xl py-3 font-bold text-center text-sm transition-colors shadow-sm">
                  LOGIN PORTAL INTERNAL
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Wall */}
      <section className="py-20 bg-transparent relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Instagram */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <div className="font-caveat text-4xl text-primary-600 mb-2">Terhubung Dengan Kami</div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 uppercase">GALERI INSTAGRAM</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Ikuti keseharian dan dokumentasi kegiatan Karang Taruna Bina Pemuda melalui kanal Instagram kami. Dapatkan update visual terbaru mengenai pengabdian masyarakat. <span className="text-primary-600 font-bold">Mari berpartisipasi!</span>
              </p>
              <a href="#" className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-full font-bold hover:bg-primary-700 hover:-translate-y-1 transition-all shadow-sm">
                <FaInstagram className="w-5 h-5 mr-2" /> Kunjungi Instagram
              </a>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 text-center flex flex-col items-center justify-center h-full min-h-[350px]">
              {sosmed?.instagram ? (
                <>
                  <div className="bg-primary-50 p-5 rounded-full mb-6 inline-block border border-primary-100">
                    <FaInstagram className="w-12 h-12 text-primary-600" />
                  </div>
                  <h3 className="text-gray-900 text-2xl font-bold mb-2">{sosmed.instagram}</h3>
                  <p className="text-gray-500 mb-8 max-w-sm mx-auto">Dapatkan pembaruan visual terbaru dan keseharian kegiatan kami langsung di aplikasi Instagram.</p>
                  <a href={`https://instagram.com/${sosmed.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center px-8 py-3 bg-gray-100 text-primary-700 rounded-full font-bold hover:bg-gray-200 transition-colors text-sm">
                    LIHAT PROFIL <ChevronRight className="w-4 h-4 ml-1" />
                  </a>
                </>
              ) : (
                <div className="py-10">
                  <FaInstagram className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900">Galeri Instagram Kosong</h3>
                  <p className="text-sm text-gray-500 mt-2">Data tautan akun Instagram belum diatur.</p>
                </div>
              )}
            </div>
          </div>

          {/* Youtube */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 min-h-[350px] flex flex-col justify-center">
                <h5 className="font-bold mb-4 flex items-center text-gray-900">
                  <FaYoutube className="w-6 h-6 text-primary-600 mr-2" /> Video Gallery
                </h5>
                {sosmed?.youtubeVideos?.length > 0 ? (
                  <>
                    <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center relative mb-4 border border-gray-200">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center pl-1 cursor-pointer hover:bg-white hover:scale-110 transition-all shadow-md">
                          <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-primary-600"></div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:ring-2 ring-primary-600 transition-all border border-gray-200">
                          <FaYoutube className="w-6 h-6 text-gray-300" />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-10">
                    <FaYoutube className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900">Galeri Video Kosong</h3>
                    <p className="text-sm text-gray-500 mt-2">Data video Youtube belum ditambahkan ke dalam sistem.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:text-right">
              <div className="font-caveat text-4xl text-primary-600 mb-2">Video Terkini</div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 uppercase">MULTIMEDIA YOUTUBE</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Simak video dokumentasi kegiatan, profil, dan informasi penting Karang Taruna Bina Pemuda dalam bentuk format multimedia yang menarik.
              </p>
              <a href="#" className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-full font-bold hover:bg-primary-700 hover:-translate-y-1 transition-all shadow-sm">
                <FaYoutube className="w-5 h-5 mr-2" /> KUNJUNGI CHANNEL
              </a>
            </div>
          </div>
          
        </div>
      </section>

    </div>
  );
}
