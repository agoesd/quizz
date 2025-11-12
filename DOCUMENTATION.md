# 📚 Dokumentasi Lengkap - Aplikasi Quiz

## 📋 Daftar Isi
1. [Struktur Project](#struktur-project)
2. [Setup & Instalasi](#setup--instalasi)
3. [Sistem Otorisasi](#sistem-otorisasi)
4. [Cara Menambah Soal](#cara-menambah-soal)
5. [Deploy ke Vercel](#deploy-ke-vercel)
6. [Troubleshooting](#troubleshooting)

---

## 🗂️ Struktur Project

```
quizz/
├── public/
│   └── quiz-data/
│       ├── structure.json          # Struktur topik & subtopik
│       ├── PBJ/
│       │   ├── HPS/
│       │   │   └── questions.json
│       │   ├── Kontrak/
│       │   │   └── questions.json
│       │   └── Lelang/
│       │       └── questions.json
│       ├── Hukum/
│       │   ├── Pidana/
│       │   │   └── questions.json
│       │   └── Perdata/
│       │       └── questions.json
│       └── Akuntansi/
│           ├── Dasar/
│           │   └── questions.json
│           └── Keuangan/
│               └── questions.json
├── src/
│   ├── components/
│   │   ├── QuizApp.jsx             # Aplikasi quiz utama
│   │   └── AdminPanel.jsx          # Panel admin input soal
│   ├── utils/
│   │   └── quizDataLoader.js       # Loader JSON otomatis
│   └── App.jsx
├── tools/
│   ├── excel-converter.html        # Converter Excel to JSON
│   └── template-generator.html     # Generator template Excel
├── package.json
└── README.md
```

---

## ⚙️ Setup & Instalasi

### 1. Install Dependencies

```bash
# Clone atau buat project baru
npm create vite@latest quiz-app -- --template react
cd quiz-app

# Install dependencies
npm install
npm install lucide-react

# Jalankan development server
npm run dev
```

### 2. Setup Struktur Folder

Buat folder `public/quiz-data/` dan file-file berikut:

**public/quiz-data/structure.json**
```json
{
  "PBJ": {
    "name": "Pengadaan Barang dan Jasa",
    "icon": "📋",
    "description": "Materi pengadaan barang dan jasa pemerintah",
    "subtopics": {
      "HPS": {
        "name": "Harga Perkiraan Sendiri",
        "file": "PBJ/HPS/questions.json"
      },
      "Kontrak": {
        "name": "Kontrak Pengadaan",
        "file": "PBJ/Kontrak/questions.json"
      }
    }
  }
}
```

### 3. Integrasi Loader

Di `src/App.jsx`:

```javascript
import { useEffect, useState } from 'react';
import QuizApp from './components/QuizApp';
import { loadQuizDatabase } from './utils/quizDataLoader';

function App() {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizDatabase()
      .then(data => {
        setQuizData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading quiz:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading quiz data...</div>;
  }

  return <QuizApp database={quizData} />;
}

export default App;
```

---

## 📝 Cara Menambah Soal

### Metode 1: Menggunakan Excel (Recommended untuk banyak soal)

1. **Download Template**
   - Buka `tools/template-generator.html` di browser
   - Pilih template sesuai kebutuhan:
     - Template Kosong (mulai dari nol)
     - Template + Contoh (5 contoh soal)
     - Template Lengkap (20 contoh soal)

2. **Isi Data di Excel**
   - Kolom A: ID Soal (pbj-hps-001)
   - Kolom B: Pertanyaan
   - Kolom C-F: Pilihan A, B, C, D
   - Kolom G: Jawaban Benar (A/B/C/D atau 0/1/2/3)
   - Kolom H: Tingkat Kesulitan (mudah/sedang/sulit)
   - Kolom I: Pembahasan
   - Kolom J: Tags (pisahkan dengan koma)
   - Kolom K: Referensi

3. **Convert ke JSON**
   - Buka `tools/excel-converter.html`
   - Upload file Excel
   - Download hasil JSON
   - Taruh di folder: `public/quiz-data/[Topik]/[Subtopik]/questions.json`

4. **Update structure.json**
   ```json
   {
     "TopikBaru": {
       "name": "Nama Topik",
       "subtopics": {
         "SubtopikBaru": {
           "name": "Nama Subtopik",
           "file": "TopikBaru/SubtopikBaru/questions.json"
         }
       }
     }
   }
   ```

### Metode 2: Menggunakan Admin Panel (Untuk input manual)

1. **Buka Admin Panel**
   ```javascript
   // Di App.jsx, tambahkan route atau component
   import AdminPanel from './components/AdminPanel';
   ```

2. **Input Soal**
   - Pilih Topik & Subtopik
   - Isi form lengkap
   - Klik "Tambah Soal"

3. **Export JSON**
   - Klik "Export All" untuk semua soal
   - Atau "Export by Subtopic" untuk per subtopik
   - Taruh file di folder yang sesuai

4. **Backup Regular**
   - Gunakan fitur "Create Backup"
   - Backup disimpan di localStorage
   - Bisa restore kapan saja

---

## 🚀 Deploy ke Vercel

### Metode 1: Via GitHub (Recommended)

1. **Push ke GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/quiz-app.git
   git push -u origin main
   ```

2. **Deploy via Vercel Dashboard**
   - Login ke [vercel.com](https://vercel.com)
   - Klik "Add New Project"
   - Import repository GitHub
   - Vercel akan auto-detect React/Vite
   - Klik "Deploy"

3. **Konfigurasi (jika perlu)**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Metode 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Untuk production
vercel --prod
```

### Update Content Tanpa Redeploy

Karena menggunakan file JSON statis:
1. Update file JSON di folder `public/quiz-data/`
2. Push ke GitHub
3. Vercel akan auto-deploy
4. Atau manual deploy: `vercel --prod`

---

## 🔧 Troubleshooting

### 1. File JSON tidak ter-load

**Problem:** Console error "Failed to fetch"

**Solusi:**
```javascript
// Cek path file di structure.json
// Pastikan format:
"file": "PBJ/HPS/questions.json"  // ✅ Benar
"file": "/PBJ/HPS/questions.json" // ❌ Salah (jangan pakai / di depan)
```

### 2. CORS Error saat Development

**Solusi:**
```javascript
// vite.config.js
export default {
  server: {
    cors: true
  }
}
```

### 3. Excel Converter tidak jalan

**Problem:** Hasil convert kosong atau error

**Solusi:**
- Pastikan header di row 1
- Data soal mulai dari row 2
- Tidak ada row kosong di tengah
- Format kolom G (jawaban) benar: A/B/C/D atau 0/1/2/3

### 4. Backup tidak tersimpan

**Problem:** Backup hilang saat refresh

**Solusi:**
- Backup menggunakan localStorage
- Jangan clear browser data
- Export JSON regular sebagai backup external
- Gunakan fitur "Export All" sebelum clear data

### 5. Soal tidak muncul di Quiz

**Checklist:**
- ✅ File JSON sudah di folder `public/quiz-data/`
- ✅ Path di `structure.json` sesuai dengan lokasi file
- ✅ Format JSON valid (cek dengan JSON validator)
- ✅ Semua field wajib terisi (id, question, options, correctIndex, dll)
- ✅ Browser sudah di-refresh setelah update

---

## 📊 Format Data

### Format Question JSON

```json
{
  "id": "pbj-hps-001",
  "question": "Apa yang dimaksud dengan HPS?",
  "options": [
    "Pilihan A",
    "Pilihan B", 
    "Pilihan C",
    "Pilihan D"
  ],
  "correctIndex": 1,
  "difficulty": "mudah",
  "explanation": "Penjelasan lengkap...",
  "tags": ["tag1", "tag2"],
  "references": "Perpres 12/2021"
}
```

### Validasi Data

```javascript
// Field wajib:
- id: string (unique)
- question: string (tidak kosong)
- options: array[4] (semua tidak kosong)
- correctIndex: number (0-3)
- difficulty: "mudah" | "sedang" | "sulit"
- explanation: string (tidak kosong)

// Field opsional:
- tags: array[string]
- references: string
```

---

## 🎯 Tips & Best Practices

### 1. Penamaan ID Soal
```
Format: [topik]-[subtopik]-[nomor]
Contoh:
- pbj-hps-001
- pbj-hps-002
- hukum-pidana-001
```

### 2. Menulis Pembahasan yang Baik
- Jelaskan mengapa jawaban benar
- Jelaskan mengapa pilihan lain salah
- Tambahkan konteks atau contoh jika perlu
- Sertakan referensi jika ada

### 3. Penggunaan Tags
- Gunakan untuk kategorisasi lebih detail
- Konsisten dalam penamaan
- Contoh: "HPS", "PPK", "Pengadaan", "Kontrak"

### 4. Backup Strategy
- Backup otomatis via localStorage
- Export JSON manual setiap minggu
- Simpan di cloud storage (Google Drive, Dropbox)
- Version control dengan Git

### 5. Optimasi Performa
- Maksimal 50 soal per file JSON
- Jika lebih, pecah ke subtopik baru
- Lazy load untuk banyak soal
- Compress JSON jika perlu

---

## 🆘 Support & Kontribusi

### Menambah Fitur Baru

Struktur component modular memudahkan penambahan fitur:
- Quiz multiplayer
- Leaderboard global
- Export hasil ke PDF
- Analytics per soal
- Timer per soal

### Lapor Bug

Jika menemukan bug, catat:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser & OS
5. Screenshot/video jika perlu

---

## 📄 Lisensi

Aplikasi ini free to use untuk keperluan pendidikan dan internal.

---

## 🎉 Selamat Menggunakan!

Jika ada pertanyaan atau butuh bantuan, jangan ragu untuk bertanya.

**Happy Quizzing! 🚀**
