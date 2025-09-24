### Rencana Penambahan Fitur Pencarian

1.  **Analisis Struktur Data Quran:**
    *   Langkah pertama adalah membaca dan memahami struktur file `src/data/quran.json`. Saya perlu mengidentifikasi field mana yang berisi teks Arab, terjemahan bahasa Indonesia, nomor surah, dan nomor ayat.

2.  **Membuat Service untuk Logika Pencarian:**
    *   Saya akan menambahkan fungsi baru di dalam `src/services/quran.service.js`.
    *   Fungsi ini akan menerima kata kunci sebagai argumen.
    *   Logikanya akan melakukan iterasi pada seluruh data Al-Qur'an, memeriksa setiap ayat apakah teks Arab atau terjemahan Indonesianya mengandung kata kunci yang dicari (case-insensitive untuk pencarian bahasa Indonesia).
    *   Hasilnya akan berupa array dari objek ayat yang cocok, beserta informasi surah dan ayatnya.

3.  **Membuat Controller:**
    *   Saya akan membuat file baru `src/controllers/search.controller.js`.
    *   Controller ini akan menangani request dari user, mengambil query pencarian (misalnya dari `req.query.q`), dan memanggil fungsi service yang telah dibuat.
    *   Controller akan mengirimkan hasil pencarian sebagai response JSON.

4.  **Membuat Route (Endpoint API):**
    *   Saya akan membuat file `src/routes/search.route.js` untuk mendefinisikan endpoint baru, misalnya `GET /search`.
    *   Endpoint ini akan dihubungkan dengan controller yang sesuai.
    *   Route baru ini juga akan didaftarkan di file `src/routes/index.js` agar dapat diakses oleh aplikasi.

5.  **Menambahkan Test (Opsional, tapi direkomendasikan):**
    *   Untuk memastikan fitur berjalan dengan baik, saya bisa membuat file test baru di `tests/integration/search.test.js` untuk menguji endpoint pencarian dengan beberapa skenario.

6.  **Memperbarui Dokumentasi:**
    *   Setelah fitur selesai, saya akan memperbarui file `API_DOCUMENTATION.md` untuk menambahkan dokumentasi mengenai cara menggunakan endpoint pencarian yang baru.
