/* ==========================================================================
   UMKM FIELD TRACKER — script.js
   Data disimpan lokal per LAPORAN: status/catatan/waktu di localStorage,
   foto/video di IndexedDB (terpisah per laporan). Tidak ada request ke
   server manapun.
   ========================================================================== */

(function () {
  'use strict';

  /* ==========================================================================
   * MANUAL CONFIGURATION — bagian yang HARUS Anda isi sendiri
   * ==========================================================================
   * Hanya SATU nilai yang perlu diisi di sini: APPS_SCRIPT_URL.
   *
   * APPS_SCRIPT_URL
   *   - Apa ini?      URL Web App dari backend Google Apps Script (Code.gs)
   *                    yang menjadi perantara antara aplikasi ini dan Google
   *                    Drive Anda.
   *   - Dari mana?    Setelah men-deploy Apps Script sebagai "Web app", Google
   *                    akan memberikan URL berbentuk:
   *                    https://script.google.com/macros/s/XXXXXXXX/exec
   *                    Copy URL tersebut lalu paste di bawah ini.
   *   - Amankah?      YA. URL ini AMAN untuk ada di frontend/GitHub Pages.
   *                    URL ini tidak berisi password, API key, atau credential
   *                    rahasia apapun — hanya alamat endpoint publik yang
   *                    dijaga oleh logika Apps Script itu sendiri (yang hanya
   *                    mengizinkan upload ke dalam folder ROOT_FOLDER_ID).
   *   - Belum diisi?  Selama masih bertuliskan "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE",
   *                    fitur upload ke Google Drive otomatis NONAKTIF (upload
   *                    lokal ke perangkat tetap berjalan seperti biasa, tidak
   *                    ada fitur existing yang rusak).
   *
   * CATATAN: ROOT_FOLDER_ID (folder utama "UMKM FIELD TRACKER" di Google
   * Drive) TIDAK diisi di sini — nilai itu hanya ada di backend Google Apps
   * Script (file Code.gs), bukan di frontend. Ini sengaja, supaya struktur
   * folder Drive Anda tidak bisa diubah/diarahkan dari sisi browser.
   */
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx284AwAFm6kp8NFJw7wudgbFP3nrdup95l1MapMvJ8f_0bIkR07E1j5YFOLwIyF6D-IQ/exec";

  /* ------------------------------------------------------------------ *
   * 1. DATA 50 UMKM — urutan perjalanan (JANGAN UBAH nomor/telepon/URL)
   * ------------------------------------------------------------------ */
  const UMKM_DATA = [
    { visit: 1,  no: 44, name: "Nasi Goreng Mas Zaki Umam",              phone: "083197207102",  distance: "0,5 km",  maps: "https://maps.app.goo.gl/tpiixz5qFsyHyucD6?g_st=aw", note: "" },
    { visit: 2,  no: 1,  name: "MARTABAK FAVORITE 165",                  phone: "085870006816",  distance: "0,9 km",  maps: "https://maps.app.goo.gl/9228KMwi1VdrXezP9?g_st=aw", note: "" },
    { visit: 3,  no: 4,  name: "Martabak Bandung",                       phone: "085725039520",  distance: "0,9 km",  maps: "https://maps.app.goo.gl/9228KMwi1VdrXezP9?g_st=aw", note: "Satu titik dengan #1" },
    { visit: 4,  no: 15, name: "Gorengan Miraos",                        phone: "085727930455",  distance: "1,2 km",  maps: "https://maps.app.goo.gl/6JbZXzx6cRScRxM67?g_st=aw", note: "" },
    { visit: 5,  no: 24, name: "Aneka Gorengan",                         phone: "08112666226",   distance: "1,4 km",  maps: "https://maps.app.goo.gl/51uNAXLRNsHLf1L39?g_st=aw", note: "" },
    { visit: 6,  no: 2,  name: "Onde-onde Molen",                        phone: "085879029153",  distance: "1,6 km",  maps: "https://maps.app.goo.gl/dnER6wEXoCAs7Frn6",         note: "" },
    { visit: 7,  no: 5,  name: "Gorengan Putra Molen",                   phone: "085861619557",  distance: "1,6 km",  maps: "https://maps.app.goo.gl/jXDruWuHJMG6nUc9A",         note: "Sangat dekat dengan #2" },
    { visit: 8,  no: 18, name: "Gorengan Arkhan",                        phone: "081336756147",  distance: "1,7 km",  maps: "https://maps.app.goo.gl/C8FYWWxWB8kRj1Nc8?g_st=aw", note: "" },
    { visit: 9,  no: 19, name: "Aneka Gorengan",                         phone: "087832491083",  distance: "1,7 km",  maps: "https://maps.app.goo.gl/C8FYWWxWB8kRj1Nc8?g_st=aw", note: "Satu titik dengan #18" },
    { visit: 10, no: 20, name: "Gorengan AA Teteh",                      phone: "08994148037",   distance: "1,7 km",  maps: "https://maps.app.goo.gl/C8FYWWxWB8kRj1Nc8?g_st=aw", note: "Satu titik dengan #18/#19" },
    { visit: 11, no: 3,  name: "Gorengan Berkah",                        phone: "085693906586",  distance: "1,8 km",  maps: "https://maps.app.goo.gl/Ws44ukgSDXFgjggH9?g_st=aw", note: "" },
    { visit: 12, no: 25, name: "Nasi Goreng Putra Brebes",               phone: "083851949756",  distance: "1,9 km",  maps: "https://maps.app.goo.gl/3iwPjQQqa6o6BBv5A?g_st=aw", note: "" },
    { visit: 13, no: 17, name: "Stick Kentang Cimol",                    phone: "085848900483",  distance: "2,1 km",  maps: "https://maps.app.goo.gl/nwgM371wNzZgKUZ6A?g_st=aw", note: "" },
    { visit: 14, no: 46, name: "Martabak Rizkia Danu",                   phone: "087848622443",  distance: "2,1 km",  maps: "https://maps.app.goo.gl/Djbux167RGk1osDs9?g_st=aw", note: "" },
    { visit: 15, no: 6,  name: "Siomay & Batagor Bandung",               phone: "083165203630",  distance: "2,1 km",  maps: "https://maps.app.goo.gl/pyA9LG3KoFUeiBp47",         note: "" },
    { visit: 16, no: 38, name: "Mie Ayam Kriting",                       phone: "081316916689",  distance: "2,1 km*", maps: "https://maps.app.goo.gl/fF9MXmTTyuzBJ5fx7",         note: "" },
    { visit: 17, no: 10, name: "Ayam Geprek Ghalya",                     phone: "088985271-67",  distance: "2,4 km",  maps: "https://maps.app.goo.gl/pMU7NpMaeVTiHBv9A?g_st=aw", note: "" },
    { visit: 18, no: 14, name: "Nasi Goreng Primadona",                  phone: "082324045477",  distance: "2,4 km",  maps: "https://maps.app.goo.gl/pMU7NpMaeVTiHBv9A?g_st=aw", note: "Satu titik dengan #10" },
    { visit: 19, no: 43, name: "Seblak Urang Sunda",                     phone: "081575688725",  distance: "2,4 km*", maps: "https://maps.app.goo.gl/SpG4awt3scu3esQQA",         note: "" },
    { visit: 20, no: 16, name: "Gorengan Pasar Mijen",                   phone: "0895396245004", distance: "2,6 km",  maps: "https://maps.app.goo.gl/AqJ4niE3x6wWqPu86",         note: "" },
    { visit: 21, no: 8,  name: "Ayam Geprek & Nasi Goreng",              phone: "088227295089",  distance: "2,6 km",  maps: "https://goo.gl/maps/BYABp71C6yZYjtGC7",             note: "" },
    { visit: 22, no: 21, name: "Martabak Safira",                        phone: "085925725785",  distance: "2,6 km",  maps: "https://maps.app.goo.gl/GsF9KsXX6QWMUP718?g_st=aw", note: "" },
    { visit: 23, no: 12, name: "Bakso & Mie Ayam",                       phone: "081225615411",  distance: "3,2 km",  maps: "https://goo.gl/maps/G9mr31mwCA78Rvx49",             note: "" },
    { visit: 24, no: 45, name: "Nasi Goreng Khazanah",                   phone: "0857603533748", distance: "3,3 km",  maps: "https://maps.app.goo.gl/LFRxh5oa1CVJMZej7?g_st=aw", note: "" },
    { visit: 25, no: 26, name: "Nasi Goreng Terang",                     phone: "087735380775",  distance: "3,5 km*", maps: "https://maps.app.goo.gl/w1LHB4gAnnqtVSAU9",         note: "" },
    { visit: 26, no: 23, name: "Nasi Goreng Bang Mad Khas Tegal",        phone: "085866669296",  distance: "3,8 km",  maps: "https://maps.app.goo.gl/M6ZTUyD9u8dvMMEo8?g_st=aw", note: "" },
    { visit: 27, no: 47, name: "Aneka Gorengan Andini",                  phone: "081228307879",  distance: "3,9 km",  maps: "https://maps.app.goo.gl/RwPsNzpazJJxVzaN8",         note: "" },
    { visit: 28, no: 36, name: "Martabak Ayis",                          phone: "085963148779",  distance: "3,9 km",  maps: "https://maps.app.goo.gl/sH1hGhpdmrHZYR7s5?g_st=aw", note: "" },
    { visit: 29, no: 37, name: "Aneka Gorengan Pasadena",                phone: "085225693380",  distance: "3,9 km",  maps: "https://maps.app.goo.gl/sH1hGhpdmrHZYR7s5?g_st=aw", note: "Satu titik dengan #36" },
    { visit: 30, no: 50, name: "Nasi Goreng & Bakmi Goreng Pak To",      phone: "081956412307",  distance: "4,2 km",  maps: "https://maps.app.goo.gl/bJTFBTbpN2kpN5dC8?g_st=aw", note: "" },
    { visit: 31, no: 7,  name: "Aneka Gorengan",                         phone: "08386004753",   distance: "4,2 km",  maps: "https://maps.app.goo.gl/NKpbYiZx3L1QGhFk6?g_st=aw", note: "" },
    { visit: 32, no: 41, name: "Martabak Telor & Manis (Yati)",          phone: "08179874134",   distance: "4,4 km",  maps: "https://maps.app.goo.gl/sLvrm4kYLyAXWpJdA?g_st=aw", note: "" },
    { visit: 33, no: 27, name: "Mie Ayam & Bakso Mang Die",              phone: "085866851253",  distance: "4,4 km",  maps: "https://maps.app.goo.gl/qdmFdo69VuTQLrPN8?g_st=aw", note: "" },
    { visit: 34, no: 48, name: "Nasi Goreng Bang Mandra",                phone: "087899676388",  distance: "4,8 km",  maps: "https://maps.app.goo.gl/hrt7T69R6UFuXbyQA?g_st=aw", note: "" },
    { visit: 35, no: 9,  name: "Nasi Goreng & Kwetiau Tegal",            phone: "082327266085",  distance: "5,1 km",  maps: "https://maps.app.goo.gl/HydynyrsH71JxQkz8?g_st=aw", note: "" },
    { visit: 36, no: 11, name: "Nasi Goreng Kwetiau Tegal 2",            phone: "082327266085",  distance: "5,1 km",  maps: "https://maps.app.goo.gl/HydynyrsH71JxQkz8?g_st=aw", note: "Satu titik dengan #9" },
    { visit: 37, no: 28, name: "Nasi Goreng & Bakmie Jawa",              phone: "085736166765",  distance: "5,1 km",  maps: "https://maps.app.goo.gl/xASx7Khuw48PQVxa8?g_st=aw", note: "Link sama dengan #9/#11" },
    { visit: 38, no: 13, name: "Mie Ayam Bakso & Berkah",                phone: "082135605536",  distance: "5,6 km",  maps: "https://maps.app.goo.gl/vfL4zKoyQ2hTKikE9?g_st=aw", note: "" },
    { visit: 39, no: 42, name: "Nasi Goreng Komarudin",                  phone: "083804684818",  distance: "5,6 km",  maps: "https://maps.app.goo.gl/n4cMoaLoYmLuTxjk8",         note: "Lokasi sama dengan #13. Alamat: Jl Jendral Urip Sumoharjo" },
    { visit: 40, no: 22, name: "Handayani Aneka Gorengan Pasar",         phone: "081390849588",  distance: "7,4 km",  maps: "https://maps.app.goo.gl/zrk8KoGgXr7qYzCD8",         note: "" },
    { visit: 41, no: 29, name: "Risoles Lumpia",                         phone: "0882003594837", distance: "7,5 km",  maps: "https://maps.app.goo.gl/Y88svzsgpzvPzN54A?g_st=aw", note: "" },
    { visit: 42, no: 35, name: "Siomay Batagor Bandung / Pak Gendut",    phone: "0882005445560", distance: "7,5 km",  maps: "https://maps.app.goo.gl/r3cLpFRPPbrJDZ7RA?g_st=aw", note: "Hampir satu titik dengan #29" },
    { visit: 43, no: 39, name: "Martabak Populer Si Kembar",             phone: "081935302006",  distance: "8,0 km",  maps: "https://maps.app.goo.gl/Fa8faEB8AGUfEARN7?g_st=aw", note: "" },
    { visit: 44, no: 49, name: "Nasi Goreng 88",                         phone: "087778737512",  distance: "8,1 km",  maps: "https://maps.app.goo.gl/nwW1EgnmQGUznZsH9?g_st=aw", note: "" },
    { visit: 45, no: 32, name: "Martabak Telor & Kue Bandung",           phone: "081392160145",  distance: "9,7 km",  maps: "https://maps.app.goo.gl/ddcRgEyEtxD6fEYL9?g_st=aw", note: "" },
    { visit: 46, no: 34, name: "Aneka Gorengan Barles",                  phone: "081222510912",  distance: "9,7 km",  maps: "https://maps.app.goo.gl/ddcRgEyEtxD6fEYL9?g_st=aw", note: "Satu titik dengan #32" },
    { visit: 47, no: 31, name: "Nasi Goreng Brebes",                     phone: "08988144461",   distance: "10,2 km", maps: "https://maps.app.goo.gl/e5H9mey4zDXjeLJx9?g_st=aw", note: "" },
    { visit: 48, no: 33, name: "Nasi Goreng Tegal / Mbangun Nur Sakti",  phone: "0882007931718", distance: "10,2 km", maps: "https://maps.app.goo.gl/hoQr112Gs8mYWNXY6",         note: "" },
    { visit: 49, no: 30, name: "Mie Ayam & Bakso Benaji",                phone: "081328103567",  distance: "10,6 km", maps: "https://maps.app.goo.gl/QNzPCC76yGjViBAN9?g_st=aw", note: "" },
    { visit: 50, no: 40, name: "Aneka Gorengan Gor Max Nyus",            phone: "081345318698",  distance: "11,6 km", maps: "https://maps.app.goo.gl/nYyeoJzqZMnxHjB37",         note: "" },
  ];

  const UMKM_BY_NO = {};
  UMKM_DATA.forEach((u) => { UMKM_BY_NO[u.no] = u; });
  const UMKM_BY_VISIT = UMKM_DATA.slice().sort((a, b) => a.visit - b.visit);

  const DOC_SLOTS = [
    { key: "front",         label: "Foto sisi depan",       shortLabel: "Depan",   kind: "photo", slug: "front" },
    { key: "right",         label: "Foto samping kanan",    shortLabel: "Kanan",   kind: "photo", slug: "right" },
    { key: "left",          label: "Foto samping kiri",     shortLabel: "Kiri",    kind: "photo", slug: "left" },
    { key: "alfamartVideo", label: "Video nampak Alfamart", shortLabel: "Video",   kind: "video", slug: "alfamart-video" },
  ];

  /* ------------------------------------------------------------------ *
   * 2. ICONS — konsisten, satu sistem ukuran/berat
   * ------------------------------------------------------------------ */
  const ICONS = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9"/></svg>',
    store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5 5 4h14l1 5.5"/><path d="M4 9.5a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0"/><path d="M5 9.8V20h14V9.8"/><path d="M10 20v-5.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V20"/></svg>',
    field: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>',
    progress: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V11M12 20V4M20 20v-6.5"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.36a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.64 15a1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.64 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.64a1.7 1.7 0 0 0 1.04-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.36 9a1.7 1.7 0 0 0 1.56 1.04H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1.04Z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    sort: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 5v14M7 5 4 8M7 5l3 3"/><path d="M17 19V5m0 14 3-3m-3 3-3-3"/></svg>',
    chevLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    chevRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.7 7-11.5A7 7 0 0 0 5 9.5C5 14.3 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.3"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.6 10.8a15.4 15.4 0 0 0 6.6 6.6l2.2-2.2a1.2 1.2 0 0 1 1.2-.3c1.3.4 2.7.7 4.1.7.7 0 1.3.6 1.3 1.3V21a1.3 1.3 0 0 1-1.3 1.3C10.7 22.3 1.7 13.3 1.7 2.3A1.3 1.3 0 0 1 3 1h3.1c.7 0 1.3.6 1.3 1.3 0 1.4.2 2.8.7 4.1.1.4 0 .9-.3 1.2Z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h2.5L8 5.5h8L17.5 8H20a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13.5" r="3.2"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="6" width="13" height="12" rx="1.8"/><path d="m20 9.2-4.5 2.8 4.5 2.8V9.2Z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>',
    checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.3 2.3 4.7-5.1"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11m0 0-4-4m4 4 4-4"/><path d="M4 18v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1"/></svg>',
    swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13l-3-3m3 3-3 3"/><path d="M20 16H7l3 3m-3-3 3-3"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L18.5 9.5a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0L4 15v5Z"/><path d="m13.5 6.5 4 4"/></svg>',
    gallery: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="15" rx="2"/><path d="m3 16 5-4.5 3.5 3 4-3.8L21 15"/><circle cx="8.2" cy="8.5" r="1.4"/></svg>',
    folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 6.5a1 1 0 0 1 1-1h4.4l1.6 2h9a1 1 0 0 1 1 1v9.5a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1V6.5Z"/></svg>',
    cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18h10a4 4 0 0 0 .4-7.98A5.5 5.5 0 0 0 7.1 9.8 4 4 0 0 0 7 18Z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.8 17.3 4 20l2.8-.7A8.4 8.4 0 1 0 4 12a8.3 8.3 0 0 0 1.1 4.2Z"/><path d="M9 9.6c0-.5.4-.9.9-.9h.6c.3 0 .6.2.7.5l.6 1.6c.1.3 0 .6-.2.8l-.6.6c.5 1 1.4 1.9 2.4 2.4l.6-.6c.2-.2.5-.3.8-.2l1.6.6c.3.1.5.4.5.7v.6c0 .5-.4.9-.9.9-3.6 0-7-3.2-7-6.8Z"/></svg>',
  };
  function icon(name) { return ICONS[name] || ""; }
  function iconSpan(name, extraClass) {
    return '<span class="' + (extraClass || "") + '" data-icon="' + name + '">' + icon(name) + '</span>';
  }
  function injectStaticIcons() {
    $all("[data-icon]").forEach((el) => {
      if (!el.innerHTML.trim()) el.innerHTML = icon(el.dataset.icon);
    });
  }

  /* ------------------------------------------------------------------ *
   * 3. STORAGE KEYS
   * ------------------------------------------------------------------ */
  const REPORTS_KEY = "umkm_tracker_reports_v2";
  const LEGACY_STATE_KEY = "umkm_tracker_state_v1";
  const DB_NAME = "umkm_tracker_media_v2";
  const DB_STORE = "media";
  const LEGACY_DB_NAME = "umkm_tracker_media_v1";
  const LEGACY_DB_STORE = "media";
  const DRIVE_FOLDER_CACHE_KEY = "umkm_tracker_drive_folders_v1"; // cache folderId per nama lokasi (bukan satu-satunya sumber kebenaran)

  /* ------------------------------------------------------------------ *
   * 4. STATE
   * ------------------------------------------------------------------ */
  let root = null;        // { activeReportId, order:[ids], reports:{id:report}, nextOrderIndex, legacyMediaMigrated }
  let db = null;
  let legacyDb = null;
  let currentView = "home";
  let currentFilter = "semua";
  let currentSearch = "";
  let currentSort = "visit"; // 'visit' | 'name'
  let openRowNo = null;       // expanded row in list
  let fieldCurrentNo = null;
  let objectUrlCache = {};    // id -> objectURL, revoked on unmount/close

  function defaultDriveFileState() {
    return {
      status: "idle", fileId: null, fileUrl: null, message: null,
      // Field tambahan untuk upload berbagian (chunked) — supaya "Coba lagi"
      // bisa melanjutkan dari bagian terakhir yang berhasil, bukan mengulang
      // dari awal, dan supaya retry tidak membuat file duplikat di Drive.
      uploadId: null, totalChunks: 0, sentChunks: [], fileName: null, progressText: null,
    };
  }

  function defaultDriveState() {
    return {
      folderId: null,
      folderUrl: null,
      files: {
        front: defaultDriveFileState(),
        right: defaultDriveFileState(),
        left: defaultDriveFileState(),
        alfamartVideo: defaultDriveFileState(),
      },
    };
  }

  function defaultEntryState() {
    return {
      status: "belum",
      notes: "",
      visitTime: null,
      completedAt: null,
      doc: { front: false, right: false, left: false, alfamartVideo: false },
      drive: defaultDriveState(),
    };
  }

  // Memastikan entry lama (dibuat sebelum fitur Google Drive ada) tetap
  // punya bentuk data "drive" yang lengkap, tanpa menimpa progres upload
  // yang sudah tersimpan.
  function ensureDriveShape(entry) {
    if (!entry.drive) entry.drive = defaultDriveState();
    if (!entry.drive.files) entry.drive.files = {};
    DOC_SLOTS.forEach((s) => {
      if (!entry.drive.files[s.key]) {
        entry.drive.files[s.key] = defaultDriveFileState();
      } else {
        // Data lama (sebelum fitur upload berbagian ada) mungkin belum
        // punya field uploadId/totalChunks/dst — tambahkan tanpa menimpa
        // progres yang sudah ada.
        const fs = entry.drive.files[s.key];
        const defaults = defaultDriveFileState();
        Object.keys(defaults).forEach((k) => {
          if (typeof fs[k] === "undefined") fs[k] = defaults[k];
        });
      }
    });
    if (typeof entry.drive.folderId === "undefined") entry.drive.folderId = null;
    if (typeof entry.drive.folderUrl === "undefined") entry.drive.folderUrl = null;
    return entry.drive;
  }

  function emptyEntries() {
    const entries = {};
    UMKM_DATA.forEach((u) => { entries[u.no] = defaultEntryState(); });
    return entries;
  }

  function uid() {
    return "r_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function createEmptyReport(name, orderIndex) {
    const now = new Date().toISOString();
    return {
      id: uid(),
      name: name,
      orderIndex: orderIndex,
      createdAt: now,
      updatedAt: now,
      lastFieldNo: null,
      entries: emptyEntries(),
    };
  }

  /* ------------------------------------------------------------------ *
   * 5. REPORTS ROOT — load / save / migration dari v1
   * ------------------------------------------------------------------ */
  function loadRoot() {
    const raw = localStorage.getItem(REPORTS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.reports && parsed.order && parsed.order.length) {
          UMKM_DATA.forEach((u) => {
            Object.keys(parsed.reports).forEach((rid) => {
              const rep = parsed.reports[rid];
              if (!rep.entries) rep.entries = {};
              if (!rep.entries[u.no]) rep.entries[u.no] = defaultEntryState();
              if (!rep.entries[u.no].doc) rep.entries[u.no].doc = { front: false, right: false, left: false, alfamartVideo: false };
              ensureDriveShape(rep.entries[u.no]);
            });
          });
          if (typeof parsed.nextOrderIndex !== "number") parsed.nextOrderIndex = Object.keys(parsed.reports).length + 1;
          if (typeof parsed.legacyMediaMigrated !== "boolean") parsed.legacyMediaMigrated = true;
          return parsed;
        }
      } catch (e) {
        console.error("Gagal membaca data laporan", e);
      }
    }

    // belum ada data v2 -> coba migrasi dari v1 (single-report lama)
    const firstReport = createEmptyReport("Laporan 1", 1);
    let hadLegacy = false;
    const legacyRaw = localStorage.getItem(LEGACY_STATE_KEY);
    if (legacyRaw) {
      try {
        const legacyState = JSON.parse(legacyRaw);
        UMKM_DATA.forEach((u) => {
          if (legacyState[u.no]) {
            const merged = Object.assign(defaultEntryState(), legacyState[u.no]);
            merged.doc = Object.assign({ front: false, right: false, left: false, alfamartVideo: false }, legacyState[u.no].doc || {});
            ensureDriveShape(merged);
            firstReport.entries[u.no] = merged;
            hadLegacy = true;
          }
        });
      } catch (e) {
        console.error("Gagal migrasi data lama", e);
      }
    }

    return {
      activeReportId: firstReport.id,
      order: [firstReport.id],
      reports: { [firstReport.id]: firstReport },
      nextOrderIndex: 2,
      legacyMediaMigrated: !hadLegacy, // kalau tidak ada legacy state, tidak perlu migrasi media
    };
  }

  function saveRoot() {
    try {
      localStorage.setItem(REPORTS_KEY, JSON.stringify(root));
    } catch (e) {
      console.error("Gagal menyimpan data laporan", e);
      showToast("Gagal menyimpan data. Penyimpanan perangkat mungkin penuh.", true);
    }
  }

  function getActiveReport() {
    return root.reports[root.activeReportId];
  }

  function getEntry(no) {
    const rep = getActiveReport();
    const e = rep.entries[no] || (rep.entries[no] = defaultEntryState());
    ensureDriveShape(e);
    return e;
  }

  function touchActiveReport() {
    getActiveReport().updatedAt = new Date().toISOString();
  }

  function reportsInOrder() {
    return root.order.map((id) => root.reports[id]).filter(Boolean);
  }

  /* ------------------------------------------------------------------ *
   * 6. REPORT CRUD
   * ------------------------------------------------------------------ */
  function createReport(name) {
    const rep = createEmptyReport(name.trim() || ("Laporan " + (root.order.length + 1)), root.nextOrderIndex);
    root.nextOrderIndex += 1;
    root.reports[rep.id] = rep;
    root.order.push(rep.id);
    root.activeReportId = rep.id;
    saveRoot();
    return rep;
  }

  function switchReport(id) {
    if (!root.reports[id] || root.activeReportId === id) return;
    root.activeReportId = id;
    saveRoot();
    onReportSwitched();
  }

  function renameReport(id, name) {
    const rep = root.reports[id];
    if (!rep) return;
    rep.name = name.trim() || rep.name;
    rep.updatedAt = new Date().toISOString();
    saveRoot();
  }

  async function deleteReport(id) {
    if (root.order.length <= 1) {
      showToast("Tidak bisa menghapus laporan terakhir.", true);
      return false;
    }
    const wasActive = root.activeReportId === id;
    delete root.reports[id];
    root.order = root.order.filter((x) => x !== id);
    if (wasActive) root.activeReportId = root.order[0];
    saveRoot();
    try { await clearReportMedia(id); } catch (e) { console.error(e); }
    if (wasActive) onReportSwitched();
    return true;
  }

  function countsForReport(rep) {
    let done = 0, proses = 0, belum = 0, flagged = 0;
    UMKM_DATA.forEach((u) => {
      const e = rep.entries[u.no] || defaultEntryState();
      if (e.status === "selesai") {
        done++;
        const filled = DOC_SLOTS.filter((s) => e.doc[s.key]).length;
        if (filled < DOC_SLOTS.length) flagged++;
      } else if (e.status === "proses" || e.status === "siap") proses++;
      else belum++;
    });
    const total = UMKM_DATA.length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { total, done, proses, belum, pct, flagged };
  }

  /* ------------------------------------------------------------------ *
   * 7. STATUS / GROUPING LOGIC (per laporan aktif)
   * ------------------------------------------------------------------ */
  function recomputeStatus(no) {
    const e = getEntry(no);
    if (e.status === "selesai") return;
    const doc = e.doc;
    const filled = DOC_SLOTS.filter((s) => doc[s.key]).length;
    if (filled === 0) e.status = "belum";
    else if (filled === DOC_SLOTS.length) e.status = "siap";
    else e.status = "proses";
  }

  function docFilledCount(no) {
    const doc = getEntry(no).doc;
    return DOC_SLOTS.filter((s) => doc[s.key]).length;
  }

  function statusLabel(status) {
    switch (status) {
      case "belum": return "Belum";
      case "proses": return "Proses";
      case "siap": return "Siap";
      case "selesai": return "Selesai";
      default: return "Belum";
    }
  }

  let locationGroups = {};
  function buildLocationGroups() {
    locationGroups = {};
    UMKM_DATA.forEach((u) => {
      if (!locationGroups[u.maps]) locationGroups[u.maps] = [];
      locationGroups[u.maps].push(u.no);
    });
  }
  function sameLocationPartners(u) {
    return (locationGroups[u.maps] || []).filter((no) => no !== u.no);
  }

  /* ------------------------------------------------------------------ *
   * 8. INDEXEDDB — media per laporan
   * ------------------------------------------------------------------ */
  function openDB() {
    return new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) { resolve(null); return; }
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const idb = req.result;
        if (!idb.objectStoreNames.contains(DB_STORE)) idb.createObjectStore(DB_STORE, { keyPath: "id" });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function openLegacyDB() {
    return new Promise((resolve) => {
      if (!("indexedDB" in window)) { resolve(null); return; }
      const req = indexedDB.open(LEGACY_DB_NAME, 1);
      req.onupgradeneeded = () => {
        const idb = req.result;
        if (!idb.objectStoreNames.contains(LEGACY_DB_STORE)) idb.createObjectStore(LEGACY_DB_STORE, { keyPath: "id" });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
  }

  function mediaId(reportId, no, slot) { return reportId + "::" + no + "::" + slot; }

  function saveMediaFile(reportId, no, slot, file) {
    return new Promise((resolve, reject) => {
      if (!db) { reject(new Error("IndexedDB tidak tersedia")); return; }
      const tx = db.transaction(DB_STORE, "readwrite");
      const store = tx.objectStore(DB_STORE);
      const record = {
        id: mediaId(reportId, no, slot),
        reportId: reportId,
        umkmNo: no,
        slot: slot,
        blob: file,
        type: file.type,
        name: file.name || slot,
        savedAt: new Date().toISOString(),
      };
      const req = store.put(record);
      req.onsuccess = () => resolve(record);
      req.onerror = () => reject(req.error);
    });
  }

  function getMediaFile(reportId, no, slot) {
    return new Promise((resolve, reject) => {
      if (!db) { resolve(null); return; }
      const tx = db.transaction(DB_STORE, "readonly");
      const req = tx.objectStore(DB_STORE).get(mediaId(reportId, no, slot));
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  function deleteMediaFile(reportId, no, slot) {
    return new Promise((resolve, reject) => {
      if (!db) { resolve(); return; }
      const tx = db.transaction(DB_STORE, "readwrite");
      const req = tx.objectStore(DB_STORE).delete(mediaId(reportId, no, slot));
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async function clearReportMedia(reportId) {
    if (!db) return;
    for (const u of UMKM_DATA) {
      for (const s of DOC_SLOTS) {
        try { await deleteMediaFile(reportId, u.no, s.key); } catch (e) { /* ignore */ }
      }
    }
  }

  function getLegacyMediaFile(no, slot) {
    return new Promise((resolve) => {
      if (!legacyDb) { resolve(null); return; }
      try {
        const tx = legacyDb.transaction(LEGACY_DB_STORE, "readonly");
        const req = tx.objectStore(LEGACY_DB_STORE).get(no + "_" + slot);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (e) { resolve(null); }
    });
  }

  async function migrateLegacyMediaIfNeeded() {
    if (root.legacyMediaMigrated) return;
    const targetReportId = root.order[0];
    if (db && legacyDb) {
      for (const u of UMKM_DATA) {
        for (const s of DOC_SLOTS) {
          try {
            const rec = await getLegacyMediaFile(u.no, s.key);
            if (rec && rec.blob) {
              await saveMediaFile(targetReportId, u.no, s.key, rec.blob);
            }
          } catch (e) { /* ignore single-file failures */ }
        }
      }
    }
    root.legacyMediaMigrated = true;
    saveRoot();
  }

  /* ------------------------------------------------------------------ *
   * 8a. MEDIA SOURCE RESOLUTION — helper terpusat
   * Dipakai di semua tempat yang menampilkan dokumentasi (Detail UMKM,
   * Field Mode) supaya urutan pencarian medianya selalu sama:
   *   1. IndexedDB perangkat ini (prioritas utama, tidak diubah)
   *   2. Metadata Google Drive yang tersimpan di entry.drive.files[slot]
   *      (fallback — dipakai kalau file lokal tidak ada, mis. setelah
   *      import JSON dari perangkat lain)
   *   3. "missing" kalau keduanya tidak tersedia
   * ------------------------------------------------------------------ */
  function buildDriveThumbnailUrl(fileId) {
    // Pendekatan yang paling kompatibel untuk preview gambar Google Drive
    // langsung di tag <img> tanpa perlu API key di frontend. fileUrl biasa
    // (drive.google.com/file/d/.../view) BUKAN direct image URL, jadi tidak
    // dipakai untuk <img src>.
    return "https://drive.google.com/thumbnail?id=" + encodeURIComponent(fileId) + "&sz=w1200";
  }

  async function getMediaSource(reportId, no, slot) {
    // 1. IndexedDB perangkat ini — selalu diprioritaskan, tidak diubah.
    try {
      const record = await getMediaFile(reportId, no, slot.key);
      if (record && record.blob) {
        return { source: "local", blob: record.blob, type: record.type, name: record.name };
      }
    } catch (err) {
      // Gagal baca IndexedDB (jarang terjadi) -> tetap lanjut coba Drive,
      // jangan langsung anggap dokumentasi hilang.
      console.error("Gagal membaca media lokal untuk " + no + "/" + slot.key, err);
    }

    // 2. Fallback: metadata Google Drive yang sudah ada pada entry (baik
    // hasil upload di perangkat ini maupun hasil import JSON dari rekan).
    const entry = getEntry(no);
    const fstate = entry.drive && entry.drive.files ? entry.drive.files[slot.key] : null;
    if (fstate && fstate.fileId) {
      return {
        source: "drive",
        fileId: fstate.fileId,
        fileUrl: fstate.fileUrl || null,
        previewUrl: slot.kind === "photo" ? buildDriveThumbnailUrl(fstate.fileId) : null,
      };
    }

    // 3. Tidak ditemukan di manapun.
    return { source: "missing" };
  }

  /* ------------------------------------------------------------------ *
   * 8b. GOOGLE DRIVE INTEGRATION
   * Setiap foto/video yang disimpan lokal (IndexedDB) juga otomatis dikirim
   * ke Google Drive lewat Apps Script Web App (lihat MANUAL CONFIGURATION
   * di bagian atas file ini, dan Code.gs untuk backend-nya). Jika belum
   * dikonfigurasi, atau upload gagal, file TETAP tersimpan lokal — tidak
   * ada dokumentasi yang hilang.
   * ------------------------------------------------------------------ */

  // Batas ukuran file untuk AUTO-upload ke Drive. Karena upload sekarang
  // dikirim per-bagian kecil (lihat DRIVE_CHUNK_RAW_BYTES di bawah), batas
  // ini bisa lebih longgar daripada sebelumnya — tidak lagi dibatasi oleh
  // ukuran satu request. Di atas batas ini upload otomatis dilewati (file
  // tetap aman di penyimpanan lokal perangkat), dan pengguna bisa menekan
  // "Upload sekarang" untuk tetap mencoba secara manual.
  const MAX_DRIVE_AUTO_UPLOAD_BYTES = 60 * 1024 * 1024; // 60 MB — cukup untuk video 20–30 detik

  // Ukuran satu "bagian" (chunk) file sebelum di-base64 (dalam byte). Ini
  // adalah bagian dari perbaikan utama upload mobile: daripada mengirim
  // SATU request raksasa berisi seluruh foto/video sekaligus (yang mudah
  // timeout / gagal di jaringan seluler yang lambat & tidak stabil), file
  // dipecah menjadi bagian-bagian kecil ini dan dikirim satu per satu.
  const DRIVE_CHUNK_RAW_BYTES = 1500 * 1024; // ~1.5 MB per bagian (sebelum jadi base64, jadi ~2 MB per request)
  const DRIVE_CHUNK_TIMEOUT_MS = 60000; // timeout PER BAGIAN (bukan per file) — bagian kecil, jadi ini sudah longgar
  const DRIVE_CHUNK_MAX_AUTO_RETRY = 3; // percobaan ulang otomatis per bagian sebelum menyerah ke tombol manual

  // Menghasilkan ID unik untuk satu upaya upload. Dipakai server untuk
  // mengenali bagian-bagian mana yang milik file yang sama, dan untuk
  // mencegah file duplikat jika "Coba lagi" ditekan setelah upload
  // sebenarnya sudah selesai di server tapi responsnya tidak sampai ke HP.
  function generateUploadId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    // Fallback untuk browser/WebView lama yang belum punya crypto.randomUUID.
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

  function isDriveConfigured() {
    return typeof APPS_SCRIPT_URL === "string" &&
      /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(APPS_SCRIPT_URL.trim());
  }

  function sanitizeLocationName(str) {
    return String(str || "")
      .replace(/[\/\\]/g, "-")
      .replace(/\.\./g, "-")
      .replace(/[\r\n\t]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 100);
  }

  // Nama folder Drive per lokasi. Memakai "nomor - nama UMKM" (bukan hanya
  // nama) karena beberapa UMKM pada data ini berbagi nama yang sama persis
  // (misal beberapa "Aneka Gorengan") — supaya tidak tercampur ke satu folder.
  function locationNameFor(u) {
    return sanitizeLocationName(u.no + " - " + u.name) || ("Lokasi " + u.no);
  }

  function sanitizeFileNamePart(name) {
    return String(name || "")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^[-.]+|[-.]+$/g, "")
      .slice(0, 60);
  }

  function driveTimestamp() {
    const d = new Date();
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()) +
      "_" + pad2(d.getHours()) + "-" + pad2(d.getMinutes()) + "-" + pad2(d.getSeconds());
  }

  function buildDriveFileName(slot, file) {
    const ext = mimeToExt(file.type, slot.kind);
    const base = file.name ? sanitizeFileNamePart(file.name.replace(/\.[^.]+$/, "")) : "";
    return driveTimestamp() + "_" + slot.slug + (base ? "_" + base : "") + "." + ext;
  }

  function loadDriveFolderCache() {
    try {
      const raw = localStorage.getItem(DRIVE_FOLDER_CACHE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function getCachedFolder(locationName) {
    const cache = loadDriveFolderCache();
    return cache[locationName] || null;
  }

  function setCachedFolder(locationName, folderId, folderUrl) {
    try {
      const cache = loadDriveFolderCache();
      cache[locationName] = { folderId: folderId, folderUrl: folderUrl, updatedAt: new Date().toISOString() };
      localStorage.setItem(DRIVE_FOLDER_CACHE_KEY, JSON.stringify(cache));
    } catch (e) { /* cache Drive folder bersifat opsional, aman diabaikan jika gagal */ }
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || "");
        const comma = result.indexOf(",");
        resolve(comma >= 0 ? result.slice(comma + 1) : result);
      };
      reader.onerror = () => reject(reader.error || new Error("Gagal membaca file"));
      reader.readAsDataURL(file);
    });
  }

  // Sama seperti fileToBase64, tapi hanya membaca SATU potongan kecil file
  // (lewat File.slice) — dipakai untuk upload berbagian supaya HP dengan RAM
  // terbatas tidak pernah harus menyimpan seluruh foto/video sebagai satu
  // string base64 raksasa di memori sekaligus.
  function fileSliceToBase64(file, start, end) {
    return new Promise((resolve, reject) => {
      const blob = file.slice(start, end);
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || "");
        const comma = result.indexOf(",");
        resolve(comma >= 0 ? result.slice(comma + 1) : result);
      };
      reader.onerror = () => reject(reader.error || new Error("Gagal membaca bagian file"));
      reader.readAsDataURL(blob);
    });
  }

  // Wrapper fetch generik untuk memanggil Apps Script: menangani offline,
  // timeout, respons non-JSON, dan error logis dari backend, lalu selalu
  // mengembalikan pesan yang mudah dimengerti manusia (bukan pesan teknis).
  function driveFetchJSON(url, options, timeoutMs) {
    return new Promise((resolve) => {
      if (typeof navigator !== "undefined" && "onLine" in navigator && !navigator.onLine) {
        resolve({ ok: false, error: "Tidak ada koneksi internet. Periksa jaringan lalu coba lagi." });
        return;
      }
      let settled = false;
      const controller = (typeof AbortController !== "undefined") ? new AbortController() : null;
      const timer = setTimeout(() => { if (controller) controller.abort(); }, timeoutMs || 30000);
      const finish = (result) => { if (!settled) { settled = true; clearTimeout(timer); resolve(result); } };
      const fetchOpts = Object.assign({}, options);
      if (controller) fetchOpts.signal = controller.signal;

      fetch(url, fetchOpts)
        .then((res) => res.text().then((text) => ({ res: res, text: text })))
        .then(({ res, text }) => {
          let data = null;
          try { data = JSON.parse(text); } catch (e) { data = null; }
          if (!data) {
            finish({ ok: false, error: "Respon server Apps Script tidak valid (bukan JSON). Pastikan URL Web App benar dan sudah di-deploy ulang." });
            return;
          }
          if (data.success === false) {
            finish({ ok: false, error: data.error || "Upload ke Google Drive gagal.", data: data });
            return;
          }
          if (!res.ok) {
            finish({ ok: false, error: "Server Apps Script mengembalikan error (kode " + res.status + ")." });
            return;
          }
          finish({ ok: true, data: data });
        })
        .catch((err) => {
          if (err && err.name === "AbortError") {
            finish({ ok: false, error: "Waktu upload ke Google Drive habis (timeout). Coba lagi dengan koneksi yang lebih stabil." });
          } else {
            finish({ ok: false, error: "Tidak dapat terhubung ke Apps Script. Periksa APPS_SCRIPT_URL dan koneksi internet." });
          }
        });
    });
  }

  // Mengirim satu bagian (chunk) ke Apps Script, dengan percobaan ulang
  // otomatis (backoff) sebelum benar-benar dianggap gagal. Chunk kecil +
  // timeout yang cukup (DRIVE_CHUNK_TIMEOUT_MS) membuat ini jauh lebih
  // tahan terhadap jaringan seluler yang lambat/putus-putus dibanding
  // mengirim seluruh file dalam satu request raksasa.
  async function sendDriveChunk_(payload, attempt) {
    const result = await driveFetchJSON(APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    }, DRIVE_CHUNK_TIMEOUT_MS);
    if (result.ok) return result;
    if (attempt < DRIVE_CHUNK_MAX_AUTO_RETRY) {
      await sleep(1200 * (attempt + 1));
      return sendDriveChunk_(payload, attempt + 1);
    }
    return result;
  }

  function finalizeDriveSuccess_(entry, fstate, locationName, d, opts) {
    fstate.status = "done";
    fstate.fileId = d.fileId || null;
    fstate.fileUrl = d.fileUrl || null;
    fstate.message = null;
    fstate.progressText = null;
    fstate.uploadId = null;
    fstate.totalChunks = 0;
    fstate.sentChunks = [];
    entry.drive.folderId = d.folderId || entry.drive.folderId;
    entry.drive.folderUrl = d.folderUrl || entry.drive.folderUrl;
    if (d.folderId) setCachedFolder(locationName, d.folderId, d.folderUrl);
    saveRoot();
    if (opts.onUpdate) opts.onUpdate();
    console.log("[Drive] Upload success", d);
    return { ok: true, data: d };
  }

  // Mengupload satu file dokumentasi ke Google Drive secara BERBAGIAN
  // (chunked). Ini adalah perbaikan utama untuk masalah upload di HP:
  // - File dipecah jadi bagian ~1.5 MB dan dikirim satu per satu, bukan
  //   sebagai satu request JSON raksasa (root cause timeout/"bukan JSON"
  //   di Android). Setiap bagian punya timeout sendiri yang jauh lebih
  //   longgar dibanding sisa waktu yang dibutuhkan seluruh file.
  // - uploadId dipakai server untuk mengenali upaya upload yang sama, jadi
  //   "Coba lagi" melanjutkan dari bagian terakhir yang berhasil (bukan
  //   mengulang dari nol) dan tidak membuat file duplikat di Drive kalau
  //   ternyata server sudah selesai memprosesnya sebelumnya.
  // Selalu memperbarui entry.drive.files[slot.key] (status: idle/uploading/
  // done/error/skipped) dan menyimpannya, supaya status + progres bertahan
  // walau halaman ditutup/dibuka lagi.
  async function performDriveUpload(no, slot, file, opts) {
    opts = opts || {};
    const entry = getEntry(no);
    const fstate = entry.drive.files[slot.key];

    if (!isDriveConfigured()) {
      fstate.status = "idle";
      fstate.message = null;
      saveRoot();
      return { ok: false, reason: "not-configured" };
    }

    if (!opts.force && file.size > MAX_DRIVE_AUTO_UPLOAD_BYTES) {
      fstate.status = "skipped";
      fstate.message = "Ukuran file > " + Math.round(MAX_DRIVE_AUTO_UPLOAD_BYTES / (1024 * 1024)) + " MB, auto-upload dilewati.";
      saveRoot();
      if (opts.onUpdate) opts.onUpdate();
      return { ok: false, reason: "too-large" };
    }

    const u = UMKM_BY_NO[no];
    const locationName = locationNameFor(u);
    const cached = getCachedFolder(locationName);

    // Jika ini retry dari upload yang sebelumnya sudah mulai mengirim
    // sebagian bagian, lanjutkan uploadId yang sama supaya bagian yang
    // sudah terkirim tidak perlu dikirim ulang.
    const resuming = !!(fstate.uploadId && fstate.totalChunks > 0 && Array.isArray(fstate.sentChunks) && fstate.sentChunks.length > 0);
    const uploadId = resuming ? fstate.uploadId : generateUploadId();
    const totalChunks = Math.max(1, Math.ceil(file.size / DRIVE_CHUNK_RAW_BYTES));
    const fileName = (resuming && fstate.fileName) ? fstate.fileName : buildDriveFileName(slot, file);
    const mimeType = file.type || (slot.kind === "photo" ? "image/jpeg" : "video/mp4");

    fstate.status = "uploading";
    fstate.message = null;
    fstate.uploadId = uploadId;
    fstate.totalChunks = totalChunks;
    fstate.fileName = fileName;
    if (!Array.isArray(fstate.sentChunks)) fstate.sentChunks = [];
    fstate.progressText = "Menyiapkan upload...";
    saveRoot();
    if (opts.onUpdate) opts.onUpdate();

    console.log("[Drive] Upload started", { no: no, slot: slot.key, uploadId: uploadId, totalChunks: totalChunks });
    console.log("[Drive] File:", fileName, "| Size:", file.size, "| MIME:", mimeType, "| Location:", locationName);

    // ---- 1. Tanya server dulu: bagian mana yang sudah pernah diterima? ----
    // (bersifat opsional — kalau gagal/timeout, lanjut saja kirim semua
    // bagian yang belum tercatat terkirim di localStorage perangkat ini)
    let alreadyReceived = [];
    try {
      const statusResult = await driveFetchJSON(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ action: "status", uploadId: uploadId }),
      }, 20000);
      if (statusResult.ok && statusResult.data) {
        if (statusResult.data.done) {
          console.log("[Drive] Upload ini ternyata sudah selesai di server sebelumnya, memakai hasil lama.");
          return finalizeDriveSuccess_(entry, fstate, locationName, statusResult.data, opts);
        }
        if (Array.isArray(statusResult.data.receivedChunks)) {
          alreadyReceived = statusResult.data.receivedChunks;
        }
      }
    } catch (e) { /* status check opsional; lanjut kirim semua bagian jika gagal */ }

    async function sendOneChunk(index) {
      const start = index * DRIVE_CHUNK_RAW_BYTES;
      const end = Math.min(file.size, start + DRIVE_CHUNK_RAW_BYTES);

      fstate.progressText = "Mengupload bagian " + (index + 1) + "/" + totalChunks + "...";
      saveRoot();
      if (opts.onUpdate) opts.onUpdate();

      let chunkBase64;
      try {
        chunkBase64 = await fileSliceToBase64(file, start, end);
      } catch (e) {
        console.error("[Drive] Upload failed | [Drive] Error:", e);
        fstate.status = "error";
        fstate.message = "Gagal membaca bagian file untuk diupload.";
        fstate.progressText = null;
        saveRoot();
        if (opts.onUpdate) opts.onUpdate();
        return { ok: false, failResult: { ok: false, reason: "read-failed" } };
      }

      console.log("[Drive] Request started (bagian " + (index + 1) + "/" + totalChunks + ")");
      const result = await sendDriveChunk_({
        action: "chunk",
        uploadId: uploadId,
        chunkIndex: index,
        totalChunks: totalChunks,
        chunkBase64: chunkBase64,
        locationName: locationName,
        fileName: fileName,
        mimeType: mimeType,
        folderIdHint: (cached && cached.folderId) || "",
      }, 0);

      if (!result.ok) {
        console.error("[Drive] Upload failed | [Drive] Error:", result.error);
        fstate.status = "error";
        fstate.message = result.error || "Upload ke Drive gagal.";
        fstate.progressText = null;
        saveRoot();
        if (opts.onUpdate) opts.onUpdate();
        return { ok: false, failResult: { ok: false, reason: "request-failed", error: result.error } };
      }

      console.log("[Drive] Response status: ok | [Drive] Parsed response:", result.data);
      if (fstate.sentChunks.indexOf(index) < 0) fstate.sentChunks.push(index);
      saveRoot();
      if (opts.onUpdate) opts.onUpdate();
      return { ok: true, data: result.data };
    }

    // ---- 2. Kirim semua bagian SELAIN bagian terakhir, lewati yang sudah ada ----
    for (let i = 0; i < totalChunks - 1; i++) {
      if (alreadyReceived.indexOf(i) >= 0) {
        if (fstate.sentChunks.indexOf(i) < 0) fstate.sentChunks.push(i);
        continue;
      }
      if (fstate.sentChunks.indexOf(i) >= 0) continue;
      const sent = await sendOneChunk(i);
      if (!sent.ok) return sent.failResult;
    }

    // ---- 3. Bagian TERAKHIR SELALU dikirim (memicu penggabungan di server) ----
    // Dikirim ulang meski sempat tercatat "sudah diterima" sebelumnya — ini
    // aman (server menimpa bagian yang sama, bukan menduplikasi) dan perlu
    // untuk memicu ulang proses penggabungan jika percobaan sebelumnya
    // sempat gagal tepat di langkah terakhir ini.
    fstate.progressText = "Menunggu konfirmasi server...";
    saveRoot();
    if (opts.onUpdate) opts.onUpdate();
    const finalSend = await sendOneChunk(totalChunks - 1);
    if (!finalSend.ok) return finalSend.failResult;

    if (finalSend.data && finalSend.data.done) {
      return finalizeDriveSuccess_(entry, fstate, locationName, finalSend.data, opts);
    }

    // Jarang terjadi: bagian terakhir terkirim tapi server melaporkan
    // bagian lain masih belum lengkap. Laporkan supaya user menekan "Coba
    // lagi" (yang akan otomatis melanjutkan, bukan mengulang dari awal).
    console.error("[Drive] Upload failed | [Drive] Raw response:", finalSend.data);
    fstate.status = "error";
    fstate.message = "Sebagian bagian file belum lengkap di server. Coba lagi.";
    fstate.progressText = null;
    saveRoot();
    if (opts.onUpdate) opts.onUpdate();
    return { ok: false, reason: "incomplete" };
  }

  async function testDriveConnection() {
    if (!isDriveConfigured()) {
      return { ok: false, error: "APPS_SCRIPT_URL belum diisi di script.js." };
    }
    const sep = APPS_SCRIPT_URL.indexOf("?") >= 0 ? "&" : "?";
    return driveFetchJSON(APPS_SCRIPT_URL + sep + "action=test", { method: "GET" }, 20000);
  }

  function mimeToExt(mime, kind) {
    const map = {
      "image/jpeg": "jpg", "image/jpg": "jpg", "image/png": "png", "image/webp": "webp", "image/heic": "heic",
      "video/mp4": "mp4", "video/quicktime": "mov", "video/webm": "webm", "video/3gpp": "3gp",
    };
    if (mime && map[mime]) return map[mime];
    if (mime && mime.includes("/")) {
      const sub = mime.split("/")[1].split(";")[0].replace(/[^a-z0-9]/gi, "");
      if (sub) return sub;
    }
    return kind === "video" ? "mp4" : "jpg";
  }

  function filenameForSlot(report, no, slot, mime) {
    const ext = mimeToExt(mime, slot.kind);
    return "laporan-" + report.orderIndex + "-umkm-" + no + "-" + slot.slug + "." + ext;
  }

  function triggerDownload(url, filename) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /* ------------------------------------------------------------------ *
   * 9. HELPERS
   * ------------------------------------------------------------------ */
  function $(sel, root2) { return (root2 || document).querySelector(sel); }
  function $all(sel, root2) { return Array.from((root2 || document).querySelectorAll(sel)); }

  // Helper terpusat: normalisasi nomor telepon Indonesia menjadi format yang
  // dibutuhkan wa.me (angka saja, diawali 62, tanpa "+", spasi, "-", "(", ")").
  //   083197207102        -> 6283197207102
  //   0812-3456-7890      -> 6281234567890
  //   +62 812-3456-7890   -> 6281234567890
  function normalizeWhatsAppNumber(phone) {
    let digits = String(phone || "").replace(/\D/g, ""); // buang semua karakter non-angka (spasi, -, (), +, dst)
    if (digits.startsWith("0")) {
      digits = "62" + digits.slice(1);
    } else if (!digits.startsWith("62") && digits.startsWith("8")) {
      // nomor tanpa awalan 0 / 62 (jarang, tapi tetap dijaga)
      digits = "62" + digits;
    }
    return digits;
  }

  function waLink(phone) {
    return "https://wa.me/" + normalizeWhatsAppNumber(phone);
  }

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function formatDateTime(iso) {
    if (!iso) return { time: "Belum dikunjungi", date: "—" };
    const d = new Date(iso);
    const time = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
    const date = d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    return { time, date };
  }

  function pad2(n) { return n < 10 ? "0" + n : "" + n; }

  let toastTimer = null;
  function showToast(msg, isError) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.toggle("is-error", !!isError);
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add("is-visible"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.classList.remove("is-visible");
      setTimeout(() => { el.hidden = true; }, 250);
    }, 2600);
  }

  function confirmDialog(title, body, okLabel) {
    return new Promise((resolve) => {
      const overlay = $("#confirmOverlay");
      $("#confirmTitle").textContent = title;
      $("#confirmBody").textContent = body;
      $("#confirmOk").textContent = okLabel || "Ya";
      overlay.hidden = false;
      function cleanup(result) {
        overlay.hidden = true;
        okBtn.removeEventListener("click", onOk);
        cancelBtn.removeEventListener("click", onCancel);
        resolve(result);
      }
      const okBtn = $("#confirmOk");
      const cancelBtn = $("#confirmCancel");
      function onOk() { cleanup(true); }
      function onCancel() { cleanup(false); }
      okBtn.addEventListener("click", onOk);
      cancelBtn.addEventListener("click", onCancel);
    });
  }

  // Menampilkan bottom sheet "Tambah Media" (Kamera / Album-Galeri / File) dan
  // mengembalikan Promise yang resolve ke "camera" | "gallery" | "file" | null
  // (null jika user menekan Batal, menutup sheet, atau klik di luar sheet).
  function pickMediaSource(slot) {
    return new Promise((resolve) => {
      const overlay = $("#mediaSourceOverlay");
      const cancelBtn = $("#mediaSourceCancel");
      const closeBtn = $("#mediaSourceClose");
      const optButtons = $all(".media-source-opt", overlay);
      const isVideo = slot && slot.kind === "video";
      $("#mediaSourceTitle").textContent = isVideo ? "Tambah Video" : "Tambah Foto";
      $("#mediaSourceHint").textContent = "Pilih sumber " + (isVideo ? "video" : "foto") + ".";
      overlay.hidden = false;

      function cleanup(result) {
        overlay.hidden = true;
        optButtons.forEach((b) => b.removeEventListener("click", onOpt));
        cancelBtn.removeEventListener("click", onCancel);
        closeBtn.removeEventListener("click", onCancel);
        overlay.removeEventListener("click", onOverlayClick);
        resolve(result);
      }
      function onOpt(ev) { cleanup(ev.currentTarget.dataset.source || null); }
      function onCancel() { cleanup(null); }
      function onOverlayClick(ev) { if (ev.target === overlay) cleanup(null); }

      optButtons.forEach((b) => b.addEventListener("click", onOpt));
      cancelBtn.addEventListener("click", onCancel);
      closeBtn.addEventListener("click", onCancel);
      overlay.addEventListener("click", onOverlayClick);
    });
  }

  function trackUrl(key, url) {
    if (objectUrlCache[key]) URL.revokeObjectURL(objectUrlCache[key]);
    objectUrlCache[key] = url;
    return url;
  }
  function revokeUrl(key) {
    if (objectUrlCache[key]) { URL.revokeObjectURL(objectUrlCache[key]); delete objectUrlCache[key]; }
  }
  function revokeAllUrls() {
    Object.keys(objectUrlCache).forEach(revokeUrl);
  }

  /* ------------------------------------------------------------------ *
   * 10. TOP CHROME — report switcher label, sidebar mini progress
   * ------------------------------------------------------------------ */
  function renderChrome() {
    const rep = getActiveReport();
    $("#reportSwitcherLabel").textContent = rep.name;
    $("#settingsActiveReportName").textContent = rep.name;

    const c = countsForReport(rep);
    const circumference = 2 * Math.PI * 17;
    const offset = circumference - (c.pct / 100) * circumference;
    const ringFill = $("#sidebarRingFill");
    ringFill.style.strokeDasharray = circumference;
    ringFill.style.strokeDashoffset = offset;
    $("#sidebarRingPct").textContent = c.pct + "%";
    $("#sidebarDoneCount").textContent = c.done + "/" + c.total;
  }

  /* ------------------------------------------------------------------ *
   * 11. RENDER — HOME
   * ------------------------------------------------------------------ */
  function renderStatStrip() {
    const c = countsForReport(getActiveReport());
    $("#statStrip").innerHTML =
      cell(c.total, "Total", "") +
      cell(c.done, "Selesai", "accent") +
      cell(c.total - c.done, "Belum", "") +
      cell(c.pct + "%", "Progres", "");
    function cell(value, label, mod) {
      return '<div class="stat-cell' + (mod ? " stat-cell--" + mod : "") + '"><span class="stat-cell__value">' + value + '</span><span class="stat-cell__label">' + label + '</span></div>';
    }
  }

  function findNextIncomplete(fromVisit) {
    const start = fromVisit || 0;
    for (let i = 0; i < UMKM_BY_VISIT.length; i++) {
      const u = UMKM_BY_VISIT[i];
      if (u.visit > start && getEntry(u.no).status !== "selesai") return u;
    }
    // wrap: cari dari awal (untuk kasus sudah lewat semua tapi masih ada yang belum di depan)
    for (let i = 0; i < UMKM_BY_VISIT.length; i++) {
      const u = UMKM_BY_VISIT[i];
      if (getEntry(u.no).status !== "selesai") return u;
    }
    return null;
  }

  function renderNextVisitCard(containerEl, opts) {
    opts = opts || {};
    const next = findNextIncomplete(0);
    if (!next) {
      containerEl.innerHTML = '<p class="next-card__done">' + iconSpan("checkCircle") + " Semua UMKM sudah selesai didokumentasikan.</p>";
      return;
    }
    const e = getEntry(next.no);
    const partners = sameLocationPartners(next);
    containerEl.innerHTML =
      '<div class="next-card__eyebrow"><span class="next-card__visit-tag">VISIT #' + pad2(next.visit) + '</span>' + (partners.length ? '<span>' + iconSpan("pin") + " Satu lokasi dengan #" + partners.join(", #") + "</span>" : "") + '</div>' +
      '<h3 class="next-card__name">' + escapeHtml(next.name) + '</h3>' +
      '<p class="next-card__umkm">UMKM #' + next.no + ' &middot; <span class="status-pill" data-status="' + e.status + '">' + statusLabel(e.status) + '</span></p>' +
      '<div class="next-card__row">' + iconSpan("pin") + ' &plusmn; ' + escapeHtml(next.distance) + '</div>' +
      '<div class="next-card__row">' + iconSpan("phone") + ' ' + escapeHtml(next.phone) + '</div>' +
      '<div class="next-card__actions">' +
        '<button class="btn btn--primary" data-action="mulai" data-no="' + next.no + '" type="button">Mulai Kunjungan</button>' +
        '<a class="btn btn--action" href="' + encodeURI(next.maps) + '" target="_blank" rel="noopener">' + iconSpan("pin") + ' Maps</a>' +
        '<a class="btn btn--action" href="' + waLink(next.phone) + '" target="_blank" rel="noopener">' + iconSpan("whatsapp") + ' WhatsApp</a>' +
      '</div>';
    containerEl.querySelector('[data-action="mulai"]').addEventListener("click", () => {
      fieldCurrentNo = next.no;
      switchView("field");
    });
  }

  function renderTodayActivity() {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todays = UMKM_DATA
      .map((u) => ({ u, e: getEntry(u.no) }))
      .filter((x) => x.e.visitTime && new Date(x.e.visitTime) >= today)
      .sort((a, b) => new Date(b.e.visitTime) - new Date(a.e.visitTime));

    const wrap = $("#todayActivity");
    if (!todays.length) {
      wrap.innerHTML = '<div class="activity-row activity-row--empty">Belum ada aktivitas hari ini.</div>';
      return;
    }
    wrap.innerHTML = todays.slice(0, 6).map(({ u, e }) => {
      const dt = formatDateTime(e.visitTime);
      const done = e.status === "selesai";
      return '<div class="activity-row">' +
        '<span class="activity-row__icon">' + icon(done ? "check" : "field") + '</span>' +
        '<div class="activity-row__text"><strong>' + escapeHtml(u.name) + '</strong><span>UMKM #' + u.no + ' &middot; ' + (done ? "Selesai" : "Dikunjungi") + ' ' + dt.time + '</span></div>' +
      '</div>';
    }).join("");
  }

  function renderRecentList() {
    const completed = UMKM_DATA
      .map((u) => ({ u, e: getEntry(u.no) }))
      .filter((x) => x.e.status === "selesai" && x.e.completedAt)
      .sort((a, b) => new Date(b.e.completedAt) - new Date(a.e.completedAt));

    const wrap = $("#recentList");
    if (!completed.length) {
      wrap.innerHTML = '<div class="recent-row recent-row--empty">Belum ada kunjungan yang diselesaikan.</div>';
      return;
    }
    wrap.innerHTML = completed.slice(0, 5).map(({ u, e }) => {
      const dt = formatDateTime(e.completedAt);
      return '<div class="recent-row">' +
        '<div class="recent-row__main"><div class="recent-row__name">' + escapeHtml(u.name) + '</div><div class="recent-row__meta">UMKM #' + u.no + ' &middot; ' + dt.date + '</div></div>' +
        '<span class="recent-row__badge">' + icon("checkCircle") + '</span>' +
      '</div>';
    }).join("");
  }

  function renderDocSummary() {
    const wrap = $("#docSummary");
    wrap.innerHTML = DOC_SLOTS.map((s) => {
      const count = UMKM_DATA.filter((u) => getEntry(u.no).doc[s.key]).length;
      return '<div class="doc-summary__cell"><strong>' + count + ' / ' + UMKM_DATA.length + '</strong><span>' + escapeHtml(s.shortLabel) + '</span></div>';
    }).join("");
  }

  function renderHome() {
    renderStatStrip();
    renderNextVisitCard($("#nextVisitCard"));
    renderTodayActivity();
    renderRecentList();
    renderDocSummary();
  }

  /* ------------------------------------------------------------------ *
   * 12. RENDER — UMKM LIST (compact expandable rows)
   * ------------------------------------------------------------------ */
  function matchesFilter(u) {
    const status = getEntry(u.no).status;
    if (currentFilter === "semua") return true;
    if (currentFilter === "belum") return status === "belum";
    if (currentFilter === "proses") return status === "proses" || status === "siap";
    if (currentFilter === "selesai") return status === "selesai";
    return true;
  }
  function matchesSearch(u) {
    if (!currentSearch) return true;
    const q = currentSearch.toLowerCase();
    return u.name.toLowerCase().includes(q) || String(u.no).includes(q) || String(u.visit).includes(q) || u.phone.toLowerCase().includes(q);
  }

  function sortedFilteredData() {
    const list = UMKM_DATA.filter((u) => matchesFilter(u) && matchesSearch(u));
    if (currentSort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else list.sort((a, b) => a.visit - b.visit);
    return list;
  }

  function renderRow(u) {
    const e = getEntry(u.no);
    const done = e.status === "selesai";
    const partners = sameLocationPartners(u);
    const isOpen = openRowNo === u.no;

    const row = document.createElement("article");
    row.className = "umkm-row" + (done ? " is-done" : "") + (isOpen ? " is-open" : "");
    row.dataset.no = u.no;

    row.innerHTML =
      '<button class="umkm-row__main" type="button" data-toggle-row="' + u.no + '">' +
        '<span class="umkm-row__no">' + (done ? icon("check") : u.no) + '</span>' +
        '<span class="umkm-row__name-wrap"><span class="umkm-row__name">' + escapeHtml(u.name) + '</span>' + (partners.length ? '<span class="umkm-row__sameloc">' + iconSpan("pin") + ' Satu lokasi</span>' : "") + '</span>' +
        '<span class="status-pill" data-status="' + e.status + '">' + statusLabel(e.status) + '</span>' +
        '<span class="umkm-row__chev">' + icon("chevRight") + '</span>' +
      '</button>' +
      '<div class="umkm-row__detail">' +
        '<div class="umkm-row__detail-inner">' +
          '<div class="umkm-row__meta-line">' + iconSpan("pin") + ' &plusmn; ' + escapeHtml(u.distance) + (u.note ? " &middot; " + escapeHtml(u.note) : "") + '</div>' +
          '<div class="umkm-row__meta-line">' + iconSpan("phone") + ' ' + escapeHtml(u.phone) + '</div>' +
          '<div class="umkm-row__detail-actions">' +
            '<a class="btn btn--action" href="' + encodeURI(u.maps) + '" target="_blank" rel="noopener">' + iconSpan("pin") + ' Maps</a>' +
            '<a class="btn btn--action" href="' + waLink(u.phone) + '" target="_blank" rel="noopener">' + iconSpan("whatsapp") + ' WhatsApp</a>' +
            '<button class="btn btn--primary" data-open-detail="' + u.no + '" type="button">Detail</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    return row;
  }

  function renderList() {
    const wrap = $("#umkmRows");
    const emptyState = $("#listEmptyState");
    const filtered = sortedFilteredData();
    wrap.innerHTML = "";
    if (!filtered.length) {
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;
    const frag = document.createDocumentFragment();
    filtered.forEach((u) => frag.appendChild(renderRow(u)));
    wrap.appendChild(frag);
  }

  /* ------------------------------------------------------------------ *
   * 13. VISIT WORKFLOW — dipakai bersama oleh Modal Detail & Field Mode
   * ------------------------------------------------------------------ */
  function mountVisitWorkflow(container, no, opts) {
    opts = opts || {};
    const onChange = opts.onChange || function () {};
    const scopeId = "wf_" + no + "_" + Math.random().toString(36).slice(2, 7);

    container.innerHTML =
      '<div>' +
        '<div class="vw-section-title"><span>Dokumentasi</span><span class="vw-count" data-role="doc-count"></span></div>' +
        '<a class="link-btn drive-folder-link" data-role="drive-folder-link" href="#" target="_blank" rel="noopener" hidden>' + iconSpan("folder") + '<span>Buka Folder Drive</span></a>' +
        '<div class="doc-progress-bar"><div class="doc-progress-bar__fill" data-role="doc-fill" style="width:0%"></div></div>' +
        '<div class="doc-grid" data-role="doc-grid"></div>' +
      '</div>' +
      '<div>' +
        '<div class="vw-section-title"><span>Catatan lapangan</span></div>' +
        '<textarea class="notes-area" data-role="notes" placeholder="Tulis catatan di sini..."></textarea>' +
        '<div class="notes-save-hint" data-role="notes-hint">Tersimpan otomatis</div>' +
      '</div>' +
      '<div class="vw-finish">' +
        '<button class="btn btn--complete btn--block" data-role="btn-complete" type="button">' + iconSpan("check") + ' Tandai Selesai</button>' +
        '<button class="btn btn--undo btn--block" data-role="btn-undo" type="button" hidden>Batalkan Selesai</button>' +
      '</div>';

    const docGrid = container.querySelector('[data-role="doc-grid"]');
    const docFill = container.querySelector('[data-role="doc-fill"]');
    const docCount = container.querySelector('[data-role="doc-count"]');
    const driveFolderLink = container.querySelector('[data-role="drive-folder-link"]');
    const notesArea = container.querySelector('[data-role="notes"]');
    const notesHint = container.querySelector('[data-role="notes-hint"]');
    const btnComplete = container.querySelector('[data-role="btn-complete"]');
    const btnUndo = container.querySelector('[data-role="btn-undo"]');

    const reportId = root.activeReportId;
    let notesSaveTimer = null;
    let destroyed = false;

    notesArea.value = getEntry(no).notes || "";
    notesArea.addEventListener("input", () => {
      clearTimeout(notesSaveTimer);
      notesSaveTimer = setTimeout(() => {
        getEntry(no).notes = notesArea.value;
        touchActiveReport();
        saveRoot();
        notesHint.classList.add("is-visible");
        setTimeout(() => notesHint.classList.remove("is-visible"), 1200);
      }, 450);
    });

    function updateFinishButtons() {
      const e = getEntry(no);
      btnComplete.hidden = e.status === "selesai";
      btnUndo.hidden = e.status !== "selesai";
    }

    async function refreshDocUI() {
      const e = getEntry(no);
      const filled = docFilledCount(no);
      const pct = Math.round((filled / DOC_SLOTS.length) * 100);
      docCount.textContent = filled + " / " + DOC_SLOTS.length + " lengkap";
      docFill.style.width = pct + "%";
      docFill.style.background = filled === DOC_SLOTS.length ? "var(--accent)" : "var(--amber)";
      if (driveFolderLink) {
        if (e.drive.folderUrl) { driveFolderLink.href = e.drive.folderUrl; driveFolderLink.hidden = false; }
        else { driveFolderLink.hidden = true; }
      }
      docGrid.innerHTML = "";
      for (const slot of DOC_SLOTS) {
        docGrid.appendChild(await buildDocSlotEl(slot));
      }
      updateFinishButtons();
    }

    const MAX_MEDIA_BYTES = 300 * 1024 * 1024; // batas aman ukuran file (penyimpanan IndexedDB di HP bisa gagal untuk file sangat besar)

    function validateMediaFile(slot, file) {
      const expectedPrefix = slot.kind === "photo" ? "image/" : "video/";
      if (file.type && !file.type.startsWith(expectedPrefix)) {
        showToast("Format file tidak didukung untuk " + (slot.kind === "photo" ? "foto" : "video") + " ini.", true);
        return false;
      }
      if (file.size > MAX_MEDIA_BYTES) {
        showToast("Ukuran file terlalu besar (maks " + Math.round(MAX_MEDIA_BYTES / (1024 * 1024)) + " MB).", true);
        return false;
      }
      return true;
    }

    function handleMediaPicked(slot, file) {
      if (!file) return; // user membatalkan picker: tidak melakukan apa-apa
      if (!validateMediaFile(slot, file)) return;
      handleSaveMedia(slot, file);
    }

    // Membuat 3 input file tersembunyi (Kamera / Album-Galeri / File) untuk satu
    // slot dokumentasi, lalu mengembalikan fungsi open() yang menampilkan bottom
    // sheet pemilih sumber media terlebih dahulu — bukan langsung membuka kamera.
    function setupMediaPicker(container, slot) {
      const mime = slot.kind === "photo" ? "image/*" : "video/*";

      function makeInput(withCapture) {
        const input = document.createElement("input");
        input.type = "file";
        input.className = "file-input-hidden";
        input.accept = mime;
        if (withCapture) {
          // Kamera: paksa buka kamera HP langsung (foto atau video sesuai slot).
          input.capture = "environment";
        }
        // Untuk galeri & file: Sengaja TIDAK diberi atribut "capture" — supaya
        // browser HP membuka galeri/photo picker atau file picker, bukan kamera.
        input.addEventListener("change", (ev) => {
          const file = ev.target.files && ev.target.files[0];
          input.value = "";
          handleMediaPicked(slot, file);
        });
        container.appendChild(input);
        return input;
      }

      const cameraInput = makeInput(true);
      const galleryInput = makeInput(false);
      const fileInput = makeInput(false);

      return {
        async open() {
          const source = await pickMediaSource(slot);
          if (source === "camera") cameraInput.click();
          else if (source === "gallery") galleryInput.click();
          else if (source === "file") fileInput.click();
          // source === null => user menekan Batal / menutup sheet: tidak melakukan apa-apa.
        },
      };
    }

    async function handleSaveMedia(slot, file) {
      try {
        await saveMediaFile(reportId, no, slot.key, file);
        const e = getEntry(no);
        e.doc[slot.key] = true;
        // Reset status Drive untuk file baru ini (menimpa status file lama di slot yang sama).
        e.drive.files[slot.key] = defaultDriveFileState();
        recomputeStatus(no);
        touchActiveReport();
        saveRoot();
        if (!destroyed) await refreshDocUI();
        onChange();
        showToast((slot.kind === "photo" ? "Foto" : "Video") + " tersimpan.");

        // Upload ke Google Drive berjalan di latar belakang — tidak menahan UI,
        // dan jika gagal, file tetap aman tersimpan di perangkat ini.
        performDriveUpload(no, slot, file, {}).then(() => {
          if (!destroyed) refreshDocUI();
        });
      } catch (err) {
        console.error(err);
        showToast("Gagal menyimpan dokumentasi. Coba lagi atau pilih file lebih kecil.", true);
      }
    }

    // Mencoba (ulang) upload ke Drive untuk file yang SUDAH tersimpan lokal —
    // dipakai oleh tombol "Upload" / "Coba lagi" / "Upload sekarang".
    async function manualDriveRetry(slot, force) {
      const entry = getEntry(no);
      entry.drive.files[slot.key].status = "uploading";
      entry.drive.files[slot.key].message = null;
      saveRoot();
      if (!destroyed) await refreshDocUI();
      try {
        const record = await getMediaFile(reportId, no, slot.key);
        if (!record || !record.blob) {
          entry.drive.files[slot.key].status = "error";
          entry.drive.files[slot.key].message = "File lokal tidak ditemukan di perangkat ini.";
          saveRoot();
        } else {
          const blob = record.blob;
          if (!blob.name && record.name) { try { blob.name = record.name; } catch (e) { /* Blob tanpa nama tetap bisa diupload */ } }
          if (!blob.type && record.type) { try { blob.type = record.type; } catch (e) { /* abaikan */ } }
          await performDriveUpload(no, slot, blob, { force: !!force });
        }
      } catch (err) {
        console.error(err);
        entry.drive.files[slot.key].status = "error";
        entry.drive.files[slot.key].message = "Gagal membaca file lokal untuk diupload.";
        saveRoot();
      }
      if (!destroyed) await refreshDocUI();
    }

    async function handleRemoveMedia(slot) {
      const ok = await confirmDialog("Hapus dokumentasi?", "File " + slot.label.toLowerCase() + " akan dihapus dari perangkat ini.", "Hapus");
      if (!ok) return;
      try {
        await deleteMediaFile(reportId, no, slot.key);
        const e = getEntry(no);
        e.doc[slot.key] = false;
        recomputeStatus(no);
        touchActiveReport();
        saveRoot();
        if (!destroyed) await refreshDocUI();
        onChange();
        showToast("Dokumentasi dihapus.");
      } catch (err) {
        console.error(err);
        showToast("Gagal menghapus dokumentasi.", true);
      }
    }

    // Baris kecil status upload Google Drive di bawah preview foto/video.
    function buildDriveStatusRow(slot) {
      const entry = getEntry(no);
      const fstate = entry.drive.files[slot.key];
      const row = document.createElement("div");
      row.className = "drive-status drive-status--" + fstate.status;

      if (!isDriveConfigured()) {
        row.classList.add("drive-status--unconfigured");
        row.innerHTML = iconSpan("cloud") + '<span class="drive-status__text">Google Drive belum dikonfigurasi</span>';
        return row;
      }

      if (fstate.status === "uploading") {
        row.innerHTML = iconSpan("cloud") + '<span class="drive-status__text">' + escapeHtml(fstate.progressText || "Mengupload ke Drive...") + '</span>';
      } else if (fstate.status === "done") {
        row.innerHTML = iconSpan("checkCircle") + '<span class="drive-status__text">Tersimpan di Drive</span>' +
          '<a class="drive-status__link" href="' + escapeHtml(fstate.fileUrl || "#") + '" target="_blank" rel="noopener">Buka</a>';
      } else if (fstate.status === "error") {
        row.innerHTML = iconSpan("cloud") + '<span class="drive-status__text">' + escapeHtml(fstate.message || "Upload ke Drive gagal") + '</span>' +
          '<button type="button" class="drive-status__retry" data-act="drive-retry">Coba lagi</button>';
      } else if (fstate.status === "skipped") {
        row.innerHTML = iconSpan("cloud") + '<span class="drive-status__text">' + escapeHtml(fstate.message || "Auto-upload dilewati") + '</span>' +
          '<button type="button" class="drive-status__retry" data-act="drive-retry-force">Upload sekarang</button>';
      } else {
        row.innerHTML = iconSpan("cloud") + '<span class="drive-status__text">Belum diupload ke Drive</span>' +
          '<button type="button" class="drive-status__retry" data-act="drive-retry">Upload</button>';
      }

      const retryBtn = row.querySelector('[data-act="drive-retry"]');
      if (retryBtn) retryBtn.addEventListener("click", () => manualDriveRetry(slot, false));
      const forceBtn = row.querySelector('[data-act="drive-retry-force"]');
      if (forceBtn) forceBtn.addEventListener("click", () => manualDriveRetry(slot, true));

      return row;
    }

    // Badge kecil "Lokal" / "Drive" di atas preview, supaya jelas dari mana
    // sumber file yang sedang ditampilkan (lihat butir 6 spesifikasi).
    function appendSourceBadge(body, label, mod) {
      const row = document.createElement("div");
      row.className = "doc-slot__source-row";
      row.innerHTML = '<span class="doc-slot__source-badge doc-slot__source-badge--' + mod + '">' + escapeHtml(label) + '</span>';
      body.appendChild(row);
    }

    // Catatan fallback dengan tombol "Buka di Drive" — dipakai untuk video
    // Drive, foto Drive yang preview-nya gagal dimuat, dan kondisi lain di
    // mana kita tahu file ADA di Drive tapi tidak bisa ditampilkan langsung.
    function appendDriveFallbackNote(body, media, text) {
      const wrap = document.createElement("div");
      wrap.className = "doc-slot__drive-fallback";
      wrap.innerHTML = '<p class="doc-slot__empty-text">' + escapeHtml(text) + '</p>' +
        (media.fileUrl ? '<a class="btn btn--action btn--sm" href="' + escapeHtml(media.fileUrl) + '" target="_blank" rel="noopener">' + iconSpan("folder") + ' Buka di Drive</a>' : '');
      body.appendChild(wrap);
    }

    // Sumber = file lokal (IndexedDB) — perilaku sama seperti sebelumnya.
    function renderLocalSlotBody(body, slot, media, cacheKey) {
      appendSourceBadge(body, "Lokal", "local");

      const url = trackUrl(cacheKey, URL.createObjectURL(media.blob));
      let mediaEl;
      if (slot.kind === "photo") {
        mediaEl = document.createElement("img");
        mediaEl.className = "doc-slot__preview";
        mediaEl.src = url;
        mediaEl.alt = slot.label;
        mediaEl.addEventListener("click", () => openLightbox("img", url));
      } else {
        mediaEl = document.createElement("video");
        mediaEl.className = "doc-slot__preview";
        mediaEl.src = url;
        mediaEl.controls = true;
        mediaEl.playsInline = true;
      }
      body.appendChild(mediaEl);

      const actions = document.createElement("div");
      actions.className = "doc-slot__file-actions";
      actions.innerHTML =
        '<button class="btn btn--ghost btn--sm" data-act="dl">' + iconSpan("download") + ' Unduh</button>' +
        '<button class="btn btn--ghost btn--sm" data-act="replace">' + iconSpan("swap") + ' Ganti</button>' +
        '<button class="btn btn--danger btn--sm" data-act="remove">' + iconSpan("trash") + ' Hapus</button>';
      body.appendChild(actions);

      const picker = setupMediaPicker(body, slot);

      actions.querySelector('[data-act="dl"]').addEventListener("click", () => {
        const rep = getActiveReport();
        triggerDownload(url, filenameForSlot(rep, no, slot, media.type));
      });
      actions.querySelector('[data-act="replace"]').addEventListener("click", () => picker.open());
      actions.querySelector('[data-act="remove"]').addEventListener("click", () => handleRemoveMedia(slot));

      body.appendChild(buildDriveStatusRow(slot));
    }

    // Sumber = fallback Google Drive (file lokal tidak ada di perangkat ini,
    // biasanya karena hasil import JSON dari perangkat lain).
    function renderDriveSlotBody(body, slot, media) {
      appendSourceBadge(body, "Drive", "drive");

      if (slot.kind === "photo" && media.previewUrl) {
        const loadingNote = document.createElement("p");
        loadingNote.className = "doc-slot__empty-text";
        loadingNote.textContent = "Memuat foto dari Drive...";
        body.appendChild(loadingNote);

        const img = document.createElement("img");
        img.className = "doc-slot__preview";
        img.style.display = "none";
        img.alt = slot.label;
        img.addEventListener("load", () => {
          if (destroyed) return;
          loadingNote.remove();
          img.style.display = "block";
        });
        img.addEventListener("error", () => {
          // Preview Drive tidak bisa diakses (mis. permission file belum
          // dibagikan) — jangan sampai merusak UI, tampilkan fallback yang
          // jelas + tombol "Buka di Drive" saja.
          if (destroyed) return;
          img.remove();
          loadingNote.remove();
          appendDriveFallbackNote(body, media, "Foto tersimpan di Drive, tapi preview tidak tersedia.");
        });
        img.addEventListener("click", () => {
          if (img.style.display !== "none") openLightbox("img", media.previewUrl);
        });
        body.appendChild(img);
        img.src = media.previewUrl; // set terakhir supaya listener sudah terpasang
      } else if (slot.kind === "video") {
        // Video Drive sengaja tidak dipaksakan jadi <video src> (URL Drive
        // biasa bukan direct video URL yang kompatibel) — cukup tombol buka.
        appendDriveFallbackNote(body, media, "Video tersedia di Google Drive.");
      } else {
        appendDriveFallbackNote(body, media, "Dokumentasi tersimpan di Drive.");
      }

      const actions = document.createElement("div");
      actions.className = "doc-slot__file-actions";
      actions.innerHTML = '<button class="btn btn--ghost btn--sm" data-act="replace">' + iconSpan("swap") + ' Ambil Baru</button>';
      body.appendChild(actions);
      const picker = setupMediaPicker(body, slot);
      actions.querySelector('[data-act="replace"]').addEventListener("click", () => picker.open());
    }

    // Sumber = tidak ada di manapun (bukan lagi diasumsikan hilang dari
    // perangkat ini saja — sudah dicek IndexedDB DAN Drive).
    function renderMissingSlotBody(body, slot) {
      const wrap = document.createElement("div");
      wrap.className = "doc-slot__empty";
      const text = document.createElement("p");
      text.className = "doc-slot__empty-text";
      text.textContent = "Dokumentasi tidak tersedia.";
      wrap.appendChild(text);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn--action btn--sm";
      btn.innerHTML = (slot.kind === "photo" ? iconSpan("camera") : iconSpan("video")) + " Tambah";
      wrap.appendChild(btn);
      body.appendChild(wrap);
      const picker = setupMediaPicker(wrap, slot);
      btn.addEventListener("click", () => picker.open());
    }

    async function buildDocSlotEl(slot) {
      const e = getEntry(no);
      const filled = e.doc[slot.key];
      const slotEl = document.createElement("div");
      slotEl.className = "doc-slot" + (filled ? " doc-slot--filled" : "");

      const head = document.createElement("div");
      head.className = "doc-slot__head";
      head.innerHTML = '<span class="doc-slot__check">' + (filled ? icon("check") : "") + '</span><span>' + escapeHtml(slot.shortLabel) + '</span>';
      slotEl.appendChild(head);

      if (filled) {
        const cacheKey = scopeId + "_" + slot.key;
        const body = document.createElement("div");
        body.className = "doc-slot__preview-wrap";
        const placeholder = document.createElement("div");
        placeholder.className = "doc-slot__preview skeleton";
        placeholder.style.aspectRatio = "4/3";
        body.appendChild(placeholder);
        slotEl.appendChild(body);

        // Setiap slot berdiri sendiri: kalau slot ini gagal (mis. error
        // jaringan saat resolve sumber), slot lain tetap render normal.
        getMediaSource(reportId, no, slot).then((media) => {
          if (destroyed) return;
          body.innerHTML = "";
          if (media.source === "local") {
            renderLocalSlotBody(body, slot, media, cacheKey);
          } else if (media.source === "drive") {
            renderDriveSlotBody(body, slot, media);
          } else {
            renderMissingSlotBody(body, slot);
          }
        }).catch((err) => {
          console.error("Gagal memuat dokumentasi untuk slot " + slot.key, err);
          if (destroyed) return;
          body.innerHTML = "";
          renderMissingSlotBody(body, slot);
        });
      } else {
        const emptyWrap = document.createElement("div");
        emptyWrap.className = "doc-slot__empty";
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn--action";
        btn.innerHTML = (slot.kind === "photo" ? iconSpan("camera") : iconSpan("video")) + " Tambah";
        const label = document.createElement("span");
        label.className = "doc-slot__empty-text";
        label.textContent = slot.kind === "photo" ? "Belum ada foto" : "Belum ada video";
        emptyWrap.appendChild(btn);
        emptyWrap.appendChild(label);
        slotEl.appendChild(emptyWrap);
        const picker = setupMediaPicker(emptyWrap, slot);
        btn.addEventListener("click", () => picker.open());
      }
      return slotEl;
    }

    btnComplete.addEventListener("click", async () => {
      const e = getEntry(no);
      const missing = DOC_SLOTS.filter((s) => !e.doc[s.key]);
      if (missing.length) {
        const body = "Yang belum tersedia:\n" + missing.map((s) => "• " + s.label).join("\n") + "\n\nTetap tandai sebagai selesai?";
        const ok = await confirmDialog("Dokumentasi belum lengkap.", body, "Tetap Selesaikan");
        if (!ok) return;
      } else {
        const ok = await confirmDialog("Selesaikan UMKM ini?", "Pastikan dokumentasi sudah benar.", "Ya, Selesaikan");
        if (!ok) return;
      }
      e.status = "selesai";
      e.completedAt = new Date().toISOString();
      touchActiveReport();
      saveRoot();
      updateFinishButtons();
      onChange();
      showToast("UMKM ditandai selesai.");
    });

    btnUndo.addEventListener("click", async () => {
      const ok = await confirmDialog("Batalkan status selesai?", "Status UMKM ini akan dikembalikan sesuai kelengkapan dokumentasi.", "Ya, Batalkan");
      if (!ok) return;
      const e = getEntry(no);
      e.status = "proses"; // sementara, langsung dihitung ulang di bawah (lewati guard status "selesai")
      e.completedAt = null;
      recomputeStatus(no);
      touchActiveReport();
      saveRoot();
      updateFinishButtons();
      onChange();
      showToast("Status selesai dibatalkan.");
    });

    refreshDocUI();

    return {
      destroy() {
        destroyed = true;
        clearTimeout(notesSaveTimer);
        Object.keys(objectUrlCache).forEach((k) => { if (k.indexOf(scopeId) === 0) revokeUrl(k); });
      },
    };
  }

  function ensureVisitStarted(no) {
    const e = getEntry(no);
    if (!e.visitTime) {
      e.visitTime = new Date().toISOString();
      touchActiveReport();
      saveRoot();
    }
  }

  /* ------------------------------------------------------------------ *
   * 14. DETAIL MODAL (dibuka dari daftar UMKM)
   * ------------------------------------------------------------------ */
  let activeWorkflow = null;

  function openDetail(no) {
    const u = UMKM_BY_NO[no];
    if (!u) return;
    ensureVisitStarted(no);
    const e = getEntry(no);

    $("#detailVisitBadge").textContent = "VISIT #" + pad2(u.visit);
    const pill = $("#detailStatusPill");
    pill.textContent = statusLabel(e.status);
    pill.dataset.status = e.status;

    $("#detailName").textContent = u.name;
    $("#detailUmkmNo").textContent = "UMKM #" + u.no;

    const partners = sameLocationPartners(u);
    const sameLocWrap = $("#detailSameLoc");
    if (partners.length) {
      sameLocWrap.hidden = false;
      $("#detailSameLocNames").textContent = partners.map((n) => "#" + n).join(", ");
    } else {
      sameLocWrap.hidden = true;
    }

    $("#detailPhone").textContent = u.phone;
    $("#detailDistance").textContent = "±" + u.distance;
    const noteWrap = $("#detailNoteWrap");
    if (u.note) { noteWrap.hidden = false; $("#detailLocNote").textContent = u.note; } else { noteWrap.hidden = true; }

    $("#detailMapsBtn").href = u.maps;
    $("#detailCallBtn").href = waLink(u.phone);

    const dt = formatDateTime(e.visitTime);
    $("#detailVisitTime").textContent = dt.time + (dt.date !== "—" ? " · " + dt.date : "");

    if (activeWorkflow) activeWorkflow.destroy();
    activeWorkflow = mountVisitWorkflow($("#detailWorkflow"), no, {
      onChange: () => {
        const ne = getEntry(no);
        pill.textContent = statusLabel(ne.status);
        pill.dataset.status = ne.status;
        renderStats();
      },
    });

    $("#detailOverlay").hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeDetail() {
    $("#detailOverlay").hidden = true;
    document.body.style.overflow = "";
    if (activeWorkflow) { activeWorkflow.destroy(); activeWorkflow = null; }
    if (currentView === "list") renderList();
    if (currentView === "home") renderHome();
    if (currentView === "progress") renderProgressView();
    renderStats();
  }

  /* ------------------------------------------------------------------ *
   * 15. FIELD MODE
   * ------------------------------------------------------------------ */
  function renderFieldMode() {
    const rep = getActiveReport();
    if (fieldCurrentNo == null) {
      fieldCurrentNo = rep.lastFieldNo && UMKM_BY_NO[rep.lastFieldNo] ? rep.lastFieldNo : (findNextIncomplete(0) || UMKM_BY_VISIT[0]).no;
    }
    const u = UMKM_BY_NO[fieldCurrentNo];
    rep.lastFieldNo = fieldCurrentNo;
    ensureVisitStarted(fieldCurrentNo);

    $("#fieldVisitCount").textContent = "Kunjungan " + u.visit + " / " + UMKM_DATA.length;
    $("#fieldPrevBtn").disabled = u.visit <= 1;
    $("#fieldNextBtn").disabled = u.visit >= UMKM_DATA.length;

    const e = getEntry(u.no);
    const partners = sameLocationPartners(u);
    const dt = formatDateTime(e.visitTime);

    if (activeWorkflow) activeWorkflow.destroy();

    const content = $("#fieldContent");
    content.innerHTML =
      '<div class="field-hero">' +
        '<div class="field-hero__top"><span class="next-card__visit-tag">VISIT #' + pad2(u.visit) + '</span><span class="status-pill" data-status="' + e.status + '" id="fieldStatusPill">' + statusLabel(e.status) + '</span></div>' +
        '<h2 class="field-hero__name">' + escapeHtml(u.name) + '</h2>' +
        '<p class="field-hero__no">UMKM #' + u.no + (partners.length ? ' &middot; ' + iconSpan("pin") + ' satu lokasi dengan #' + partners.join(", #") : '') + '</p>' +
        '<div class="field-hero__row">' + iconSpan("pin") + ' &plusmn; ' + escapeHtml(u.distance) + '</div>' +
        '<div class="field-hero__row">' + iconSpan("phone") + ' ' + escapeHtml(u.phone) + '</div>' +
        '<div class="field-hero__row">Waktu kunjungan: ' + dt.time + '</div>' +
        '<div class="field-hero__actions">' +
          '<a class="btn btn--action" href="' + encodeURI(u.maps) + '" target="_blank" rel="noopener">' + iconSpan("pin") + ' Maps</a>' +
          '<a class="btn btn--action" href="' + waLink(u.phone) + '" target="_blank" rel="noopener">' + iconSpan("whatsapp") + ' WhatsApp</a>' +
        '</div>' +
      '</div>' +
      '<div id="fieldWorkflow" class="visit-workflow"></div>';

    activeWorkflow = mountVisitWorkflow($("#fieldWorkflow"), u.no, {
      onChange: () => {
        const ne = getEntry(u.no);
        const pill = $("#fieldStatusPill");
        if (pill) { pill.textContent = statusLabel(ne.status); pill.dataset.status = ne.status; }
        renderStats();
      },
    });
  }

  function fieldGo(delta) {
    const u = UMKM_BY_NO[fieldCurrentNo];
    const targetVisit = u.visit + delta;
    const target = UMKM_BY_VISIT.find((x) => x.visit === targetVisit);
    if (!target) return;
    fieldCurrentNo = target.no;
    renderFieldMode();
  }

  function fieldJumpToNextIncomplete() {
    const u = UMKM_BY_NO[fieldCurrentNo];
    const next = findNextIncomplete(u.visit);
    if (!next) { showToast("Semua UMKM sudah selesai."); return; }
    fieldCurrentNo = next.no;
    renderFieldMode();
  }

  /* ------------------------------------------------------------------ *
   * 16. PROGRESS VIEW
   * ------------------------------------------------------------------ */
  function renderProgressView() {
    const rep = getActiveReport();
    const c = countsForReport(rep);
    $("#bigProgressFill").style.width = c.pct + "%";
    $("#bigProgressCaption").textContent = c.done + " / " + c.total + " UMKM selesai · " + c.pct + "%";

    $("#progressSummaryGrid").innerHTML =
      cell(c.done, "Selesai", "done") +
      cell(c.proses, "Proses", "progress") +
      cell(c.belum, "Belum Mulai", "") +
      cell(c.flagged, "Dok. Belum Lengkap", "flag");
    function cell(value, label, mod) {
      return '<div class="summary-cell' + (mod ? " summary-cell--" + mod : "") + '"><span class="summary-cell__value">' + value + '</span><span class="summary-cell__label">' + label + '</span></div>';
    }

    const next = findNextIncomplete(0);
    const nextWrap = $("#progressNextCard");
    if (next) {
      nextWrap.innerHTML =
        '<div><div class="mini-next-card__name">' + escapeHtml(next.name) + '</div><div class="mini-next-card__meta">UMKM #' + next.no + ' &middot; VISIT #' + pad2(next.visit) + '</div></div>' +
        '<button class="btn btn--primary" data-action="go-field" type="button">Buka</button>';
      nextWrap.querySelector('[data-action="go-field"]').addEventListener("click", () => { fieldCurrentNo = next.no; switchView("field"); });
    } else {
      nextWrap.innerHTML = '<div class="mini-next-card__name">' + iconSpan("checkCircle") + ' Semua UMKM sudah selesai.</div>';
    }

    const completed = UMKM_DATA
      .map((u) => ({ u, e: getEntry(u.no) }))
      .filter((x) => x.e.status === "selesai" && x.e.completedAt)
      .sort((a, b) => new Date(b.e.completedAt) - new Date(a.e.completedAt));
    const list = $("#historyList");
    if (!completed.length) {
      list.innerHTML = '<p class="empty-state">Belum ada riwayat.</p>';
      return;
    }
    list.innerHTML = completed.map(({ u, e }) => {
      const dt = formatDateTime(e.completedAt);
      return '<div class="history-row"><div><div class="history-row__name">' + escapeHtml(u.name) + '</div><div class="history-row__meta">UMKM #' + u.no + ' &middot; VISIT #' + pad2(u.visit) + ' &middot; ' + dt.date + ' — ' + dt.time + '</div></div><span class="history-row__badge">' + icon("checkCircle") + '</span></div>';
    }).join("");
  }

  /* ------------------------------------------------------------------ *
   * 17. VIEW SWITCHING
   * ------------------------------------------------------------------ */
  function switchView(view) {
    if (currentView === view) { renderCurrentView(); return; }
    currentView = view;
    $all(".view").forEach((v) => { v.hidden = v.dataset.view !== view; });
    $all(".sidebar__item").forEach((b) => b.classList.toggle("is-active", b.dataset.view === view));
    $all(".bottom-nav__item").forEach((b) => b.classList.toggle("is-active", b.dataset.view === view));
    renderCurrentView();
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function renderCurrentView() {
    if (currentView === "home") renderHome();
    if (currentView === "list") renderList();
    if (currentView === "field") renderFieldMode();
    if (currentView === "progress") renderProgressView();
    renderStats();
  }

  function renderStats() {
    renderChrome();
    if (currentView === "home") { renderStatStrip(); }
    if (currentView === "progress") { renderProgressView(); }
  }

  function onReportSwitched() {
    fieldCurrentNo = null;
    openRowNo = null;
    if (!$("#detailOverlay").hidden) closeDetail();
    renderChrome();
    renderCurrentView();
  }

  /* ------------------------------------------------------------------ *
   * 18. LIGHTBOX
   * ------------------------------------------------------------------ */
  function openLightbox(kind, url) {
    const body = $("#lightboxBody");
    body.innerHTML = "";
    if (kind === "img") {
      const img = document.createElement("img");
      img.src = url;
      body.appendChild(img);
    }
    $("#lightbox").hidden = false;
  }
  function closeLightbox() {
    $("#lightbox").hidden = true;
    $("#lightboxBody").innerHTML = "";
  }

  /* ------------------------------------------------------------------ *
   * 19. REPORT MANAGER MODAL
   * ------------------------------------------------------------------ */
  function openReportsModal() {
    renderReportsList();
    $("#newReportInput").value = "";
    $("#reportsOverlay").hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeReportsModal() {
    $("#reportsOverlay").hidden = true;
    document.body.style.overflow = "";
  }

  function renderReportsList() {
    const wrap = $("#reportsList");
    wrap.innerHTML = "";
    reportsInOrder().forEach((rep) => {
      const c = countsForReport(rep);
      const isActive = rep.id === root.activeReportId;
      const row = document.createElement("div");
      row.className = "report-row" + (isActive ? " is-active" : "");
      row.innerHTML =
        '<div class="report-row__main">' +
          '<div class="report-row__name" data-role="name">' + escapeHtml(rep.name) + '</div>' +
          '<div class="report-row__meta">' + c.done + ' / ' + c.total + ' selesai &middot; ' + (isActive ? "Aktif" : "dibuat " + formatDateTime(rep.createdAt).date) + '</div>' +
        '</div>' +
        '<div class="report-row__actions">' +
          (isActive ? "" : '<button class="btn btn--ghost btn--sm" data-act="use">Gunakan</button>') +
          '<button class="icon-btn" data-act="rename" aria-label="Ganti nama" type="button">' + icon("edit") + '</button>' +
          '<button class="icon-btn" data-act="delete" aria-label="Hapus laporan" type="button">' + icon("trash") + '</button>' +
        '</div>';

      row.querySelector('[data-act="use"]')?.addEventListener("click", () => {
        switchReport(rep.id);
        closeReportsModal();
        showToast('Beralih ke "' + rep.name + '".');
      });
      row.querySelector('[data-act="rename"]').addEventListener("click", () => startRename(row, rep));
      row.querySelector('[data-act="delete"]').addEventListener("click", async () => {
        const ok = await confirmDialog("Hapus laporan ini?", 'Laporan "' + rep.name + '" beserta seluruh progres, catatan, dan dokumentasinya akan dihapus permanen. Laporan lain tidak terpengaruh.', "Hapus");
        if (!ok) return;
        const success = await deleteReport(rep.id);
        if (success) { renderReportsList(); showToast("Laporan dihapus."); }
      });

      wrap.appendChild(row);
    });
  }

  function startRename(row, rep) {
    const main = row.querySelector(".report-row__main");
    const original = main.innerHTML;
    main.innerHTML = '<input type="text" class="report-row__name-input" maxlength="80" value="' + escapeHtml(rep.name) + '">';
    const input = main.querySelector("input");
    input.focus();
    input.select();
    function commit() {
      const val = input.value.trim();
      if (val) renameReport(rep.id, val);
      renderReportsList();
      renderChrome();
    }
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") commit();
      if (ev.key === "Escape") { main.innerHTML = original; }
    });
    input.addEventListener("blur", commit);
  }

  /* ------------------------------------------------------------------ *
   * 20. EXPORT / IMPORT / RESET / DOWNLOAD ALL
   * ------------------------------------------------------------------ */
  function slugify(str) {
    return String(str || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "laporan";
  }

  function handleExportCurrent() {
    const rep = getActiveReport();
    const payload = {
      exportedAt: new Date().toISOString(),
      app: "umkm-field-tracker",
      version: 2,
      report: { id: rep.id, name: rep.name, orderIndex: rep.orderIndex, createdAt: rep.createdAt, updatedAt: rep.updatedAt },
      data: rep.entries,
    };
    downloadJson(payload, "umkm-progress-" + slugify(rep.name) + "-" + new Date().toISOString().slice(0, 10) + ".json");
    showToast("Laporan aktif berhasil diexport.");
  }

  function handleExportAll() {
    const reports = {};
    reportsInOrder().forEach((rep) => {
      reports[rep.id] = { name: rep.name, orderIndex: rep.orderIndex, createdAt: rep.createdAt, updatedAt: rep.updatedAt, entries: rep.entries };
    });
    const payload = { exportedAt: new Date().toISOString(), app: "umkm-field-tracker", version: 2, reports: reports };
    downloadJson(payload, "umkm-progress-semua-laporan-" + new Date().toISOString().slice(0, 10) + ".json");
    showToast("Semua laporan berhasil diexport.");
  }

  function downloadJson(payload, filename) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, filename);
    URL.revokeObjectURL(url);
  }

  function extractEntriesFromImport(parsed) {
    if (!parsed || typeof parsed !== "object") throw new Error("Format tidak dikenali");
    if (parsed.reports && typeof parsed.reports === "object") {
      if (parsed.reports[root.activeReportId] && parsed.reports[root.activeReportId].entries) return parsed.reports[root.activeReportId].entries;
      const firstKey = Object.keys(parsed.reports)[0];
      if (firstKey) return parsed.reports[firstKey].entries || parsed.reports[firstKey].data;
      throw new Error("Tidak ada laporan dalam file.");
    }
    if (parsed.data && typeof parsed.data === "object") return parsed.data;
    return parsed;
  }

  // Deep merge yang aman khusus untuk import: memastikan field nested
  // (doc per slot, drive.folderId/folderUrl, drive.files per slot) tidak
  // pernah hilang atau tertimpa jadi null hanya karena JSON hasil export
  // tidak lengkap (mis. hasil export versi lama sebelum fitur Drive ada,
  // atau sebagian slot belum pernah diupload saat export dilakukan).
  function mergeImportedEntry(incoming) {
    const merged = defaultEntryState();
    if (!incoming || typeof incoming !== "object") return merged;

    ["status", "notes", "visitTime", "completedAt"].forEach((k) => {
      if (typeof incoming[k] !== "undefined") merged[k] = incoming[k];
    });

    // doc: merge per-slot — slot yang tidak ada di JSON tetap default (false).
    merged.doc = Object.assign({}, merged.doc, incoming.doc || {});

    // drive: merge nested per-slot supaya fileId/fileUrl satu slot tidak
    // pernah hilang hanya karena field lain pada slot yang sama tidak ada
    // di JSON, atau karena slot lain di drive.files tidak lengkap.
    const incomingDrive = incoming.drive || {};
    if (typeof incomingDrive.folderId !== "undefined") merged.drive.folderId = incomingDrive.folderId;
    if (typeof incomingDrive.folderUrl !== "undefined") merged.drive.folderUrl = incomingDrive.folderUrl;
    const incomingFiles = incomingDrive.files || {};
    DOC_SLOTS.forEach((s) => {
      const inc = incomingFiles[s.key];
      if (inc && typeof inc === "object") {
        merged.drive.files[s.key] = Object.assign({}, merged.drive.files[s.key], inc);
      }
    });

    ensureDriveShape(merged); // jaga-jaga untuk field yang masih kurang
    return merged;
  }

  function handleImportFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const incoming = extractEntriesFromImport(parsed);
        if (!incoming || typeof incoming !== "object") throw new Error("Format tidak dikenali");
        const rep = getActiveReport();
        UMKM_DATA.forEach((u) => {
          if (incoming[u.no]) {
            rep.entries[u.no] = mergeImportedEntry(incoming[u.no]);
          }
        });
        touchActiveReport();
        saveRoot();
        renderChrome();
        renderCurrentView();
        showToast('Progress berhasil diimport ke "' + rep.name + '".');
      } catch (err) {
        console.error(err);
        showToast("Gagal membaca file import. Pastikan file JSON valid.", true);
      }
    };
    reader.onerror = () => showToast("Gagal membaca file.", true);
    reader.readAsText(file);
  }

  async function handleReset() {
    const rep = getActiveReport();
    const ok1 = await confirmDialog(
      'Reset laporan "' + rep.name + '"?',
      "Semua status progres dan catatan pada laporan ini akan dihapus. Seluruh foto dan video dokumentasi laporan ini juga akan dihapus permanen. Laporan lain tidak terpengaruh.",
      "Lanjut"
    );
    if (!ok1) return;
    const ok2 = await confirmDialog("Konfirmasi terakhir", "Tindakan ini tidak dapat dibatalkan. Reset laporan ini sekarang?", "Reset");
    if (!ok2) return;

    rep.entries = emptyEntries();
    rep.updatedAt = new Date().toISOString();
    saveRoot();
    try { await clearReportMedia(rep.id); } catch (e) { console.error(e); }
    renderChrome();
    renderCurrentView();
    showToast('Laporan "' + rep.name + '" telah direset.');
  }

  async function handleDownloadAllMedia() {
    const rep = getActiveReport();
    const jobs = [];
    for (const u of UMKM_DATA) {
      for (const s of DOC_SLOTS) {
        if (getEntry(u.no).doc[s.key]) jobs.push({ no: u.no, slot: s });
      }
    }
    if (!jobs.length) { showToast("Belum ada dokumentasi untuk diunduh."); return; }
    showToast("Mengunduh " + jobs.length + " file...");
    for (let i = 0; i < jobs.length; i++) {
      const { no, slot } = jobs[i];
      setTimeout(async () => {
        const record = await getMediaFile(rep.id, no, slot.key).catch(() => null);
        if (record && record.blob) {
          const url = URL.createObjectURL(record.blob);
          triggerDownload(url, filenameForSlot(rep, no, slot, record.type));
          setTimeout(() => URL.revokeObjectURL(url), 4000);
        }
      }, i * 350);
    }
  }

  /* ------------------------------------------------------------------ *
   * 21. EVENT BINDING
   * ------------------------------------------------------------------ */
  function bindNav() {
    // Scope to actual nav controls (buttons), not the .view <section> elements,
    // which also carry data-view for the show/hide logic in switchView().
    // Matching those too would let a bubbled click re-trigger switchView()
    // back to the section's own view right after navigating away from it.
    $all("button[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => switchView(btn.dataset.view));
    });
  }

  function bindListToolbar() {
    $("#searchInput").addEventListener("input", (e) => {
      currentSearch = e.target.value.trim();
      renderList();
    });
    $all(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        currentFilter = chip.dataset.filter;
        $all(".chip").forEach((c) => c.classList.toggle("is-active", c === chip));
        renderList();
      });
    });
    $("#sortBtn").addEventListener("click", () => {
      currentSort = currentSort === "visit" ? "name" : "visit";
      $("#sortBtn").title = currentSort === "visit" ? "Urutan kunjungan" : "Nama A-Z";
      renderList();
    });
  }

  function bindListDelegation() {
    $("#umkmRows").addEventListener("click", (e) => {
      const openBtn = e.target.closest("[data-open-detail]");
      if (openBtn) { openDetail(Number(openBtn.dataset.openDetail)); return; }
      const toggleBtn = e.target.closest("[data-toggle-row]");
      if (toggleBtn) {
        const no = Number(toggleBtn.dataset.toggleRow);
        openRowNo = openRowNo === no ? null : no;
        renderList();
      }
    });
  }

  function bindDetailModal() {
    $("#detailClose").addEventListener("click", closeDetail);
    $("#detailOverlay").addEventListener("click", (e) => { if (e.target.id === "detailOverlay") closeDetail(); });
  }

  function bindFieldMode() {
    $("#fieldPrevBtn").addEventListener("click", () => fieldGo(-1));
    $("#fieldNextBtn").addEventListener("click", () => fieldGo(1));
    $("#fieldJumpBtn").addEventListener("click", fieldJumpToNextIncomplete);
  }

  function bindLightbox() {
    $("#lightboxClose").addEventListener("click", closeLightbox);
    $("#lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") closeLightbox(); });
  }

  function bindSettings() {
    $("#btnExportCurrent").addEventListener("click", handleExportCurrent);
    $("#btnExportAll").addEventListener("click", handleExportAll);
    $("#btnReset").addEventListener("click", handleReset);
    $("#btnDownloadAllMedia").addEventListener("click", handleDownloadAllMedia);
    $("#btnManageReports").addEventListener("click", openReportsModal);
    $("#importFile").addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) handleImportFile(file);
      e.target.value = "";
    });
  }

  /* ------------------------------------------------------------------ *
   * GOOGLE DRIVE — Settings: status konfigurasi & tombol Tes Koneksi
   * ------------------------------------------------------------------ */
  function renderDriveConfigStatus() {
    const el = $("#driveConfigStatus");
    if (!el) return;
    el.textContent = isDriveConfigured()
      ? "APPS_SCRIPT_URL sudah diisi. Gunakan tombol \u201cTes Koneksi\u201d untuk memastikan sambungan ke Google Drive berjalan."
      : "Belum dikonfigurasi. Isi APPS_SCRIPT_URL di bagian atas script.js (lihat komentar MANUAL CONFIGURATION). Selama belum diisi, dokumentasi tetap tersimpan normal di perangkat ini, hanya belum otomatis terkirim ke Drive.";
  }

  async function handleTestDriveConnection() {
    const btn = $("#btnTestDrive");
    if (!isDriveConfigured()) {
      showToast("APPS_SCRIPT_URL belum diisi di script.js.", true);
      return;
    }
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Menguji...";
    const result = await testDriveConnection();
    btn.disabled = false;
    btn.textContent = original;
    if (result.ok) {
      showToast("\u2713 Terhubung. Folder utama: " + (result.data.rootFolderName || "-"));
    } else {
      showToast(result.error || "Gagal terhubung ke Google Drive.", true);
    }
  }

  function bindDriveSettings() {
    renderDriveConfigStatus();
    const btn = $("#btnTestDrive");
    if (btn) btn.addEventListener("click", handleTestDriveConnection);
  }

  function bindReportsModal() {
    $("#reportSwitcherBtn").addEventListener("click", openReportsModal);
    $("#reportsClose").addEventListener("click", closeReportsModal);
    $("#reportsOverlay").addEventListener("click", (e) => { if (e.target.id === "reportsOverlay") closeReportsModal(); });
    $("#btnCreateReport").addEventListener("click", () => {
      const input = $("#newReportInput");
      const name = input.value.trim() || ("Laporan " + (root.order.length + 1));
      createReport(name);
      input.value = "";
      onReportSwitched();
      renderReportsList();
      showToast('Laporan "' + name + '" dibuat.');
    });
  }

  function bindKeyboard() {
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (!$("#lightbox").hidden) closeLightbox();
      else if (!$("#reportsOverlay").hidden) closeReportsModal();
      else if (!$("#detailOverlay").hidden) closeDetail();
    });
  }

  /* ------------------------------------------------------------------ *
   * 22. INIT
   * ------------------------------------------------------------------ */
  async function init() {
    injectStaticIcons();
    root = loadRoot();
    buildLocationGroups();
    UMKM_DATA.forEach((u) => recomputeStatus(u.no));

    try { db = await openDB(); } catch (e) { console.error("IndexedDB gagal dibuka", e); showToast("Penyimpanan foto/video tidak tersedia di browser ini.", true); }
    try { legacyDb = await openLegacyDB(); } catch (e) { legacyDb = null; }
    await migrateLegacyMediaIfNeeded();

    bindNav();
    bindListToolbar();
    bindListDelegation();
    bindDetailModal();
    bindFieldMode();
    bindLightbox();
    bindSettings();
    bindDriveSettings();
    bindReportsModal();
    bindKeyboard();

    renderChrome();
    switchView("home");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
