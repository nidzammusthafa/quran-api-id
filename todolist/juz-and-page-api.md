### Rencana Implementasi API Juz & Halaman

1.  **Analisis Data Sumber (`src/data/quran.json`)**
    *   Memeriksa struktur data pada `quran.json` untuk memastikan setiap ayat memiliki informasi `juz` dan `page`. Jika tidak, perlu ada langkah untuk memperkaya data terlebih dahulu. (Asumsi saat ini: `meta.juz` dan `meta.page` ada di setiap objek ayat).

2.  **Layer Service (`src/services/quran.service.js`)**
    *   Membuat fungsi `getJuz(juzNumber)`:
        *   Fungsi ini akan menerima nomor juz sebagai argumen.
        *   Melakukan iterasi pada `quran.json` dan mengumpulkan semua ayat yang `meta.juz`-nya cocok.
        *   Mengembalikan data yang terstruktur, misalnya dikelompokkan per surah.
    *   Membuat fungsi `getPage(pageNumber)`:
        *   Fungsi ini akan menerima nomor halaman sebagai argumen.
        *   Melakukan iterasi pada `quran.json` dan mengumpulkan semua ayat yang `meta.page`-nya cocok.
        *   Mengembalikan data yang terstruktur.

3.  **Layer Controller (`src/controllers/`)**
    *   Membuat file baru: `juz.controller.js`.
        *   Membuat fungsi `getJuz` yang memanggil `quran.service.getJuz`.
        *   Menambahkan validasi input untuk memastikan nomor juz valid (antara 1-30).
    *   Membuat file baru: `page.controller.js`.
        *   Membuat fungsi `getPage` yang memanggil `quran.service.getPage`.
        *   Menambahkan validasi input untuk memastikan nomor halaman valid (misalnya antara 1-604).

4.  **Layer Route (`src/routes/`)**
    *   Membuat file baru: `juz.route.js`.
        *   Mendefinisikan endpoint `GET /:juzNumber` yang akan diarahkan ke `juz.controller.getJuz`.
    *   Membuat file baru: `page.route.js`.
        *   Mendefinisikan endpoint `GET /:pageNumber` yang akan diarahkan ke `page.controller.getPage`.
    *   Memperbarui `src/routes/index.js` untuk mengimpor dan menggunakan kedua router baru di atas dengan prefix, misal `/juz` dan `/pages`.

5.  **Testing (`tests/integration/`)**
    *   Membuat file test baru: `juz.test.js`.
        *   Menambahkan test case untuk endpoint juz dengan input valid dan invalid.
        *   Memverifikasi struktur dan kebenaran data yang dikembalikan.
    *   Membuat file test baru: `page.test.js`.
        *   Menambahkan test case untuk endpoint halaman dengan input valid dan invalid.
        *   Memverifikasi struktur dan kebenaran data.

6.  **Dokumentasi**
    *   Memperbarui file `README.md` atau dokumentasi API lainnya untuk mencantumkan endpoint baru yang telah dibuat.
