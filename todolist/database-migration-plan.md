### Rencana Migrasi ke Vercel Postgres dengan Prisma

**Tujuan:** Mengganti sumber data dari file JSON statis menjadi database Vercel Postgres yang skalabel, dan menambahkan API untuk berbagai sumber tafsir.

---

### Fase 1: Inisialisasi dan Penyiapan Skema Prisma

1.  **Instalasi Dependensi:**
    *   Install Prisma CLI sebagai dev dependency dan Prisma Client sebagai dependency.
    ```bash
    npm install prisma --save-dev
    npm install @prisma/client
    ```

2.  **Inisialisasi Prisma:**
    *   Jalankan perintah `init` untuk membuat direktori `prisma` dan file `schema.prisma`.
    ```bash
    npx prisma init
    ```

3.  **Definisi Skema Database (`prisma/schema.prisma`):**
    *   Definisikan model untuk `Surah`, `Verse`, dan `Tafsir`. Model `Tafsir` akan memungkinkan penyimpanan dari berbagai sumber (Kemenag, Jalalayn, dll) secara fleksibel.

    ```prisma
    generator client {
      provider = "prisma-client-js"
    }

    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }

    model Surah {
      number         Int     @id
      name           String
      nameLatin      String  @map("name_latin")
      numberOfVerses Int     @map("number_of_verses")
      revelation     String
      description    String  @db.Text
      audio          String

      verses         Verse[]
    }

    model Verse {
      id             Int     @id @default(autoincrement())
      surahNumber    Int     @map("surah_number")
      verseNumber    Int     @map("verse_number")
      
      textArabic     String  @map("text_arabic") @db.Text
      textLatin      String  @map("text_latin") @db.Text
      textIndonesian String  @map("text_indonesian") @db.Text

      juz            Int
      page           Int

      surah          Surah    @relation(fields: [surahNumber], references: [number])
      tafsirs        Tafsir[]

      @@unique([surahNumber, verseNumber])
    }

    model Tafsir {
      id          Int     @id @default(autoincrement())
      verseId     Int     @map("verse_id")
      source      String  // e.g., "kemenag", "jalalayn"
      text        String  @db.Text

      verse       Verse   @relation(fields: [verseId], references: [id])
    }
    ```

### Fase 2: Migrasi dan Seeding Data

1.  **Membuat dan Menjalankan Migrasi Skema:**
    *   Jalankan `migrate` untuk membuat tabel-tabel di database Vercel Postgres.
    ```bash
    npx prisma migrate dev --name "initial-quran-schema"
    ```

2.  **Membuat Skrip Seeding (`prisma/seed.js`):**
    *   Buat skrip untuk membaca `quran.json` dan file-file dari `src/data/tmp/` untuk mengisi semua data.
    *   **Langkah 1: Seed Surah dan Ayat.** Baca `quran.json` untuk mengisi tabel `Surah` dan `Verse` (tanpa tafsir).
    *   **Langkah 2: Seed Tafsir.** Setelah data ayat ada, baca setiap file JSON tafsir (misal `tafsir-kemenag.json`, `tafsir-jalalayn.json`) dan masukkan datanya ke tabel `Tafsir` dengan relasi yang sesuai ke tabel `Verse`.

    *   **Konsep Skrip Seeding Tafsir:**
        ```javascript
        // (Setelah seeding Surah dan Verse selesai)
        const tafsirKemenag = require('../src/data/tmp/tafsir-kemenag.json');
        // ...baca file tafsir lainnya

        for (const tafsir of tafsirKemenag) {
          // Cari verseId yang sesuai berdasarkan surah & nomor ayat
          const verse = await prisma.verse.findUnique({ where: { surahNumber_verseNumber: { surahNumber: tafsir.sura_id, verseNumber: tafsir.aya_number } } });
          if (verse) {
            await prisma.tafsir.create({
              data: {
                verseId: verse.id,
                source: 'kemenag',
                text: tafsir.text
              }
            });
          }
        }
        // Ulangi untuk sumber tafsir lain
        ```

3.  **Menjalankan Skrip Seeding:**
    *   Jalankan perintah `db seed` setelah `package.json` dikonfigurasi.
    ```bash
    npx prisma db seed
    ```

### Fase 3: Refactoring Layer Service

1.  **Refactor Fungsi yang Ada:** Tulis ulang semua fungsi di `quran.service.js` untuk mengambil data dari database menggunakan Prisma, bukan dari file JSON.
2.  **Tambah Fungsi Tafsir:** Buat fungsi baru di `quran.service.js` untuk mengambil data tafsir.
    ```javascript
    const getTafsir = async (surahNumber, verseNumber, source) => {
      return prisma.tafsir.findMany({
        where: { 
          source: source,
          verse: {
            surahNumber: surahNumber,
            verseNumber: verseNumber
          }
        }
      });
    };
    ```

### Fase 4: Validasi dan Pembersihan

1.  **Jalankan Test:** Eksekusi semua test yang ada (`npm test`) untuk memastikan tidak ada *breaking changes*.
2.  **Hapus File Lama:** Hapus file `src/data/quran.json` dan `src/data/tmp/*.json` yang sudah tidak digunakan lagi.
3.  **Update Dokumentasi:** Perbarui `README.md` dan `API_DOCUMENTATION.md`.

---

### Fase 5: Menambahkan API Tafsir

1.  **Definisi Endpoint:**
    *   Buat endpoint baru untuk mendapatkan tafsir berdasarkan sumbernya. Contoh: `GET /surahs/:surahNumber/:verseNumber/tafsir/:source`.

2.  **Layer Controller (`src/controllers/`):**
    *   Buat file baru: `tafsir.controller.js` atau tambahkan ke `surahs.controller.js`.
    *   Buat fungsi `getTafsirBySource` yang mengambil `surahNumber`, `verseNumber`, dan `source` dari `req.params`.
    *   Panggil `quran.service.getTafsir` dan kirim hasilnya sebagai response. Tangani kasus jika data tidak ditemukan (404).

3.  **Layer Route (`src/routes/`):**
    *   Perbarui `surahs.route.js` untuk menambahkan route baru.
    ```javascript
    // dalam surahs.route.js
    const tafsirController = require('../controllers/tafsir.controller');
    router.get('/:surahNumber/:verseNumber/tafsir/:source', tafsirController.getTafsirBySource);
    ```
    *   Pastikan `index.js` di dalam direktori routes sudah benar konfigurasinya.

4.  **Testing (`tests/integration/`):**
    *   Buat file test baru: `tafsir.test.js`.
    *   Tambahkan test case untuk endpoint tafsir dengan input valid (misal, sumber 'kemenag') dan input invalid untuk memastikan response sesuai (200 OK atau 404 Not Found).
