/* ==========================================================================
   UMKM FIELD TRACKER — script.js
   Data disimpan lokal per LAPORAN: status/catatan/waktu di localStorage,
   foto/video di IndexedDB (terpisah per laporan). Tidak ada request ke
   server manapun.
   ========================================================================== */

(function () {
  'use strict';

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

  function defaultEntryState() {
    return {
      status: "belum",
      notes: "",
      visitTime: null,
      completedAt: null,
      doc: { front: false, right: false, left: false, alfamartVideo: false },
    };
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
    return rep.entries[no] || (rep.entries[no] = defaultEntryState());
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
        '<a class="btn btn--action" href="tel:' + next.phone.replace(/[^0-9+]/g, "") + '">' + iconSpan("phone") + ' Telepon</a>' +
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
            '<a class="btn btn--action" href="tel:' + u.phone.replace(/[^0-9+]/g, "") + '">' + iconSpan("phone") + ' Telepon</a>' +
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
      docGrid.innerHTML = "";
      for (const slot of DOC_SLOTS) {
        docGrid.appendChild(await buildDocSlotEl(slot));
      }
      updateFinishButtons();
    }

    function buildFileInput(slot) {
      const input = document.createElement("input");
      input.type = "file";
      input.className = "file-input-hidden";
      input.accept = slot.kind === "photo" ? "image/*" : "video/*";
      input.capture = "environment";
      input.addEventListener("change", (ev) => {
        const file = ev.target.files && ev.target.files[0];
        if (file) handleSaveMedia(slot, file);
        input.value = "";
      });
      return input;
    }

    async function handleSaveMedia(slot, file) {
      try {
        await saveMediaFile(reportId, no, slot.key, file);
        const e = getEntry(no);
        e.doc[slot.key] = true;
        recomputeStatus(no);
        touchActiveReport();
        saveRoot();
        if (!destroyed) await refreshDocUI();
        onChange();
        showToast((slot.kind === "photo" ? "Foto" : "Video") + " tersimpan.");
      } catch (err) {
        console.error(err);
        showToast("Gagal menyimpan dokumentasi. Coba lagi atau pilih file lebih kecil.", true);
      }
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

        getMediaFile(reportId, no, slot.key).then((record) => {
          if (destroyed) return;
          body.innerHTML = "";
          if (record && record.blob) {
            const url = trackUrl(cacheKey, URL.createObjectURL(record.blob));
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

            const hiddenInput = buildFileInput(slot);
            body.appendChild(hiddenInput);

            actions.querySelector('[data-act="dl"]').addEventListener("click", () => {
              const rep = getActiveReport();
              triggerDownload(url, filenameForSlot(rep, no, slot, record.type));
            });
            actions.querySelector('[data-act="replace"]').addEventListener("click", () => hiddenInput.click());
            actions.querySelector('[data-act="remove"]').addEventListener("click", () => handleRemoveMedia(slot));
          } else {
            const missing = document.createElement("p");
            missing.className = "doc-slot__empty-text";
            missing.textContent = "File tidak ditemukan di penyimpanan perangkat ini.";
            body.appendChild(missing);
          }
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
        const hiddenInput = buildFileInput(slot);
        emptyWrap.appendChild(btn);
        emptyWrap.appendChild(label);
        emptyWrap.appendChild(hiddenInput);
        slotEl.appendChild(emptyWrap);
        btn.addEventListener("click", () => hiddenInput.click());
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
    $("#detailCallBtn").href = "tel:" + u.phone.replace(/[^0-9+]/g, "");

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
          '<a class="btn btn--action" href="tel:' + u.phone.replace(/[^0-9+]/g, "") + '">' + iconSpan("phone") + ' Telepon</a>' +
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
            const merged = Object.assign(defaultEntryState(), incoming[u.no]);
            merged.doc = Object.assign({ front: false, right: false, left: false, alfamartVideo: false }, incoming[u.no].doc || {});
            rep.entries[u.no] = merged;
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
    bindReportsModal();
    bindKeyboard();

    renderChrome();
    switchView("home");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
