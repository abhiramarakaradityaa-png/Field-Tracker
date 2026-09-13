UMKM FIELD TRACKER — Region 2, Semarang (Redesign)
====================================================

CARA MENJALANKAN
1. Simpan ketiga file (index.html, style.css, script.js) dalam satu folder yang sama.
2. Buka file index.html langsung di browser HP atau laptop (double-click, atau
   klik kanan -> Open with -> browser pilihan).
3. Tidak perlu internet, server, atau instalasi apapun untuk menjalankan aplikasi
   (font Inter akan memuat dari Google Fonts jika online, dan otomatis memakai
   font cadangan sistem jika sedang offline).

APA YANG BARU DI REDESIGN INI
- Tampilan gelap, minimal, premium (dark corporate SaaS) dengan satu warna
  aksen (lime/hijau-kuning pudar), navigasi baru: Home, UMKM, Field Mode,
  Progress, Settings.
- MULTI LAPORAN: Anda sekarang bisa membuat beberapa laporan/kunjungan
  ("Laporan 1", "Laporan 2", dst) dari menu Settings > Kelola Laporan atau
  lewat tombol nama laporan di kanan atas. Setiap laporan punya progres,
  catatan, waktu kunjungan, dan dokumentasi foto/video SENDIRI — tidak akan
  saling menimpa.
- FIELD MODE sekarang benar-benar berfungsi sebagai layar kerja lapangan:
  menampilkan UMKM yang sedang/berikutnya dikunjungi, tombol Maps/Telepon,
  dokumentasi, catatan, dan tombol selesai — semua dalam satu layar, dengan
  tombol sebelumnya/berikutnya dan "Lompat ke berikutnya" untuk lompat ke
  UMKM yang belum selesai.
- Setiap foto/video punya tombol UNDUH sendiri dengan nama file yang jelas
  (contoh: laporan-1-umkm-44-front.jpg), serta menu "Unduh Semua Media" di
  Settings untuk mengunduh seluruh dokumentasi laporan aktif satu per satu.
- RESET hanya menghapus laporan yang sedang aktif; laporan lain tidak
  terpengaruh.

PENYIMPANAN DATA
- Status selesai, catatan lapangan, dan waktu kunjungan disimpan di
  localStorage, terpisah per laporan.
- Foto & video dokumentasi disimpan di IndexedDB browser ini, juga terpisah
  per laporan (media Laporan 1 tidak akan pernah menimpa media Laporan 2).
- Semua data tetap ada setelah refresh atau menutup browser, SELAMA Anda
  membuka aplikasi dari browser & perangkat yang sama, dan tidak membersihkan
  data situs/browser.
- Jika sebelumnya Anda sudah memakai versi lama aplikasi ini (satu laporan),
  data lama Anda akan otomatis dipindahkan menjadi "Laporan 1" saat pertama
  kali membuka versi baru ini — termasuk foto/video yang sudah tersimpan.
- Tidak ada data yang dikirim ke internet.

CATATAN PENTING
- Karena data tersimpan per-browser (bukan di cloud), gunakan HP & browser
  yang sama selama proses pendataan.
- Gunakan menu Settings > Export Laporan Ini (atau Export Semua) secara
  berkala sebagai cadangan data (status, catatan, waktu kunjungan — file
  foto/video tidak ikut ter-export dalam JSON, gunakan "Unduh Semua Media"
  atau tombol unduh per file untuk mencadangkan foto/video).
- Tombol "Reset Laporan Ini" di Settings akan menghapus SEMUA data pada
  laporan yang sedang aktif saja (termasuk foto & video), laporan lain
  tidak terpengaruh.
- Menghapus sebuah laporan lewat "Kelola Laporan" akan menghapus permanen
  seluruh progres, catatan, dan dokumentasi laporan tersebut.
