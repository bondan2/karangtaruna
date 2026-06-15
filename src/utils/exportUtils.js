import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Ekspor data JSON ke file Excel (.xlsx)
 * @param {Array} data - Array of objects yang akan diekspor. 
 *                       Key akan menjadi header kolom.
 * @param {string} filename - Nama file (tanpa ekstensi .xlsx)
 */
export const exportToExcel = (data, filename) => {
  if (!data || data.length === 0) {
    alert('Tidak ada data untuk diekspor!');
    return;
  }
  
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

/**
 * Ekspor data ke dokumen PDF dengan layout tabel
 * @param {Array<string>} headers - Array nama kolom ['No', 'Nama', 'Jabatan']
 * @param {Array<Array>} data - Array of arrays data baris [[1, 'Budi', 'Ketua'], [2, 'Andi', 'Wakil']]
 * @param {string} title - Judul besar di atas tabel pada PDF
 * @param {string} filename - Nama file (tanpa ekstensi .pdf)
 * @param {string} orientation - 'portrait' (default) atau 'landscape'
 */
export const exportToPDF = (headers, data, title, filename, orientation = 'portrait') => {
  if (!data || data.length === 0) {
    alert('Tidak ada data untuk diekspor!');
    return;
  }

  const doc = new jsPDF(orientation, 'mm', 'a4');
  
  // Header Text
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const textWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  const textOffset = (doc.internal.pageSize.width - textWidth) / 2;
  doc.text(title, textOffset, 15);
  
  // Tanggal Cetak
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const printDate = `Dicetak pada: ${new Date().toLocaleString('id-ID')}`;
  doc.text(printDate, 14, 22);

  // Tabel
  doc.autoTable({
    head: [headers],
    body: data,
    startY: 26,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [30, 58, 138] }, // Warna bg-primary-900 (Biru gelap)
    alternateRowStyles: { fillColor: [248, 250, 252] }, // Warna bg-gray-50
  });

  doc.save(`${filename}.pdf`);
};
