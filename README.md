# 🎯 Quizz App - Aplikasi Quiz Interaktif

Aplikasi quiz dengan sistem otorisasi 3 level (Admin, User, Guest) yang bisa di-deploy gratis di Vercel.

## ✨ Fitur Utama

- 🔐 **Sistem Login** dengan 3 role berbeda
- 📝 **Admin Panel** untuk kelola soal
- 🎲 **Random Quiz** atau pilih subtopik tertentu
- 📊 **Filter Kesulitan** (mudah, sedang, sulit)
- ⏱️ **Timer** dan pembahasan lengkap
- 💾 **Backup & Restore** data
- 📱 **Responsive** mobile-friendly
- 🆓 **No Database** - file-based dengan JSON

## 🚀 Quick Start

```bash
# Setup project
cd quizz
npm install
npm run dev
```

Buka `http://localhost:5173`

## 🔑 Login Credentials

### Admin
- **Username:** `admin`
- **Password:** `admin123`
- **Akses:** Full (Quiz + Admin Panel + Stats)

### User Reguler
- **Username:** `user` atau `peserta`
- **Password:** `user123` atau `peserta123`
- **Akses:** Quiz + Stats pribadi

### Guest
- Klik tombol **"Lanjutkan sebagai Guest"**
- **Akses:** Hanya Quiz (no stats)

## 📁 Struktur Folder

```
quizz/
├── public/
│   └── quiz-data/
│       ├── structure.json      # Konfigurasi topik
│       └── [Topik]/
│           └── [Subtopik]/
│               └── questions.json
├── src/
│   ├── components/
│   │   ├── QuizApp.jsx         # Main quiz
│   │   ├── AdminPanel.jsx      # Admin panel
│   │   └── AuthSystem.jsx      # Auth system
│   └── App.jsx
└── tools/
    ├── excel-converter.html     # Convert Excel → JSON
    └── template-generator.html  # Download template
```

## 📝 Cara Menambah Soal

### Metode 1: Via Excel (Recommended)

1. Buka `tools/template-generator.html`
2. Download template Excel
3. Isi data soal
4. Buka `tools/excel-converter.html`
5. Upload & convert ke JSON
6. Taruh di `public/quiz-data/[Topik]/[Subtopik]/questions.json`

### Metode 2: Via Admin Panel

1. Login sebagai admin
2. Klik menu "Admin Panel"
3. Isi form & klik "Tambah Soal"
4. Export JSON saat selesai
5. Taruh di folder yang sesuai

## 🔧 Menambah Topik Baru

Edit `public/quiz-data/structure.json`:

```json
{
  "TopikBaru": {
    "name": "Nama Topik",
    "icon": "📚",
    "description": "Deskripsi topik",
    "subtopics": {
      "SubtopikBaru": {
        "name": "Nama Subtopik",
        "file": "TopikBaru/SubtopikBaru/questions.json"
      }
    }
  }
}
```

Buat file `public/quiz-data/TopikBaru/SubtopikBaru/questions.json`

## 🌐 Deploy ke Vercel

### Via GitHub

```bash
# Push ke GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

1. Login ke [vercel.com](https://vercel.com)
2. Import repository GitHub
3. Deploy (auto-detect Vite)
4. Done! 🎉

### Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

## 🔐 Menambah User Baru

Edit `src/components/AuthSystem.jsx`:

```javascript
const USERS_DB = {
  // ... existing users ...
  newuser: {
    username: 'newuser',
    password: 'pass123',
    role: 'user', // atau 'admin'
    name: 'Nama User'
  }
};
```

## 📊 Format Data Soal (JSON)

```json
{
  "id": "topik-subtopik-001",
  "question": "Pertanyaan?",
  "options": ["A", "B", "C", "D"],
  "correctIndex": 1,
  "difficulty": "mudah",
  "explanation": "Pembahasan...",
  "tags": ["tag1", "tag2"],
  "references": "Sumber"
}
```

## 🛠️ Tech Stack

- **React** + **Vite** - UI Framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **localStorage** - Client-side storage
- **JSON Files** - Data storage

## 🎯 Role-Based Access

| Fitur | Admin | User | Guest |
|-------|-------|------|-------|
| Ikuti Quiz | ✅ | ✅ | ✅ |
| Admin Panel | ✅ | ❌ | ❌ |
| Statistik | ✅ | ✅ | ❌ |
| Export/Import | ✅ | ❌ | ❌ |
| Backup/Restore | ✅ | ❌ | ❌ |

## 📖 Dokumentasi Lengkap

Lihat file `DOCUMENTATION.md` untuk:
- Setup detail
- Troubleshooting
- Best practices
- API reference

## 🤝 Kontribusi

Silakan fork dan submit PR untuk improvement!

## 📄 Lisensi

Free to use untuk keperluan pendidikan dan internal.

---

**Made with ❤️ for better learning experience**
