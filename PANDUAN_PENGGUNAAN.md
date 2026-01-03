# 📖 PANDUAN PENGGUNAAN - Blood on the Clocktower Web Application

## Daftar Isi
1. [Persiapan Awal](#persiapan-awal)
2. [Membuat Game (Game Master)](#membuat-game-game-master)
3. [Bergabung ke Game (Players)](#bergabung-ke-game-players)
4. [Setup Karakter](#setup-karakter)
5. [Menjalankan Game - Malam Pertama](#menjalankan-game---malam-pertama)
6. [Menjalankan Game - Siang Hari](#menjalankan-game---siang-hari)
7. [Fitur-Fitur GM](#fitur-fitur-gm)
8. [Fitur-Fitur Player](#fitur-fitur-player)
9. [Tips & Best Practices](#tips--best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Persiapan Awal

### Kebutuhan Perangkat
- **Game Master**: 1 perangkat (laptop/tablet/smartphone)
- **Players**: Minimal 5 perangkat, maksimal 15 perangkat
- **Koneksi Internet**: Stabil untuk semua perangkat
- **Browser**: Chrome, Safari, Firefox, atau Edge (versi terbaru)

### Instalasi PWA (Opsional, Sangat Direkomendasikan)

**Desktop (Chrome/Edge):**
1. Buka aplikasi di browser
2. Klik icon install (+) di address bar
3. Klik "Install"
4. Aplikasi akan terbuka di window terpisah

**Mobile (iOS Safari):**
1. Buka aplikasi di Safari
2. Tap tombol Share (kotak dengan panah ke atas)
3. Scroll dan tap "Add to Home Screen"
4. Tap "Add"
5. Icon aplikasi muncul di home screen

**Mobile (Android Chrome):**
1. Buka aplikasi di Chrome
2. Tap menu (3 titik vertikal)
3. Tap "Add to Home screen" atau "Install app"
4. Tap "Add"

---

## Membuat Game (Game Master)

### Langkah 1: Akses Aplikasi
```
Buka: http://localhost:3003
(Atau URL production jika sudah deploy)
```

### Langkah 2: Buat Game Baru
1. Di halaman utama, klik tombol **"Buat Game Baru"**
2. Masukkan nama Anda sebagai Storyteller (GM)
   - Contoh: "Storyteller", "GM", atau nama Anda
3. Klik **"Buat Game"**

### Langkah 3: Dapatkan Room Code
Setelah game dibuat, Anda akan melihat:
- **Room Code**: 6 karakter (contoh: "ABC123")
- Tombol **Copy Room Code** untuk copy ke clipboard
- Daftar pemain yang sudah join (real-time)

**PENTING: Bagikan Room Code ini ke semua pemain!**

### Langkah 4: Tunggu Pemain Join
- Minimal: **5 pemain** (untuk Trouble Brewing)
- Maksimal: **15 pemain**
- Daftar pemain akan update real-time saat ada yang join
- Anda akan melihat nama dan nomor kursi setiap pemain

### Langkah 5: Mulai Setup
Setelah cukup pemain (minimal 5):
1. Klik tombol **"Mulai Setup Game"**
2. Anda akan masuk ke halaman pemilihan karakter

---

## Bergabung ke Game (Players)

### Langkah 1: Akses Aplikasi
```
Buka URL yang sama dengan GM
```

### Langkah 2: Join Game
1. Di halaman utama, klik tombol **"Gabung Game"**
2. Masukkan **Room Code** yang diberikan GM (6 karakter)
   - Huruf besar/kecil tidak masalah (auto-uppercase)
3. Masukkan **Nama Anda**
   - Nama yang mudah diingat pemain lain
   - Contoh: "Alice", "Bob", "Charlie"
4. Klik **"Join Game"**

### Langkah 3: Tunggu di Lobby
Setelah join, Anda akan melihat:
- Room Code
- Nama Anda dan nomor kursi
- Daftar semua pemain (real-time)
- Status: "Menunggu Storyteller memulai game..."

**Jangan tutup tab/aplikasi!** Biarkan terbuka hingga game selesai.

---

## Setup Karakter

### Bagian 1: Pemilihan Karakter (GM)

#### Memahami Distribusi
Untuk setiap jumlah pemain, ada distribusi yang benar:
```
5 Players:  3 Townsfolk, 0 Outsider, 1 Minion, 1 Demon
6 Players:  3 Townsfolk, 1 Outsider, 1 Minion, 1 Demon
7 Players:  5 Townsfolk, 0 Outsider, 1 Minion, 1 Demon
8 Players:  5 Townsfolk, 1 Outsider, 1 Minion, 1 Demon
9 Players:  5 Townsfolk, 2 Outsider, 1 Minion, 1 Demon
10 Players: 7 Townsfolk, 0 Outsider, 2 Minion, 1 Demon
11 Players: 7 Townsfolk, 1 Outsider, 2 Minion, 1 Demon
12 Players: 7 Townsfolk, 2 Outsider, 2 Minion, 1 Demon
13 Players: 9 Townsfolk, 0 Outsider, 3 Minion, 1 Demon
14 Players: 9 Townsfolk, 1 Outsider, 3 Minion, 1 Demon
15 Players: 9 Townsfolk, 2 Outsider, 3 Minion, 1 Demon
```

#### Cara Memilih Karakter
1. **Lihat Indikator**: Di atas grid karakter ada counter:
   - Required: Jumlah yang dibutuhkan
   - Selected: Jumlah yang sudah dipilih
   - Warna hijau = cukup, merah = kurang/lebih

2. **Klik Karakter**:
   - Klik karakter untuk select/deselect
   - Border berubah jadi merah tebal saat selected

3. **Validasi Otomatis**:
   - Sistem akan cek apakah distribusi benar
   - Tombol "Lanjut ke Assignment" hanya aktif jika valid

4. **Contoh untuk 5 Pemain**:
   - Pilih 3 Townsfolk (misal: Washerwoman, Chef, Empath)
   - Pilih 0 Outsider
   - Pilih 1 Minion (misal: Poisoner)
   - Pilih 1 Demon (pilih Imp - ini satu-satunya demon)

5. Klik **"Lanjut ke Assignment"**

### Bagian 2: Assignment Karakter (GM)

#### Cara Assign
1. Anda akan melihat grid dengan semua pemain
2. Setiap pemain punya dropdown karakter
3. **Assign satu per satu**:
   - Pilih karakter dari dropdown
   - Karakter yang sudah diassign tidak muncul di dropdown lain
   - Progress bar menunjukkan berapa yang sudah diassign

4. **Tips Assignment**:
   - Assign Demon & Minion di kursi yang berdekatan (lebih mudah saat night 1)
   - Catat assignment Anda (atau andalkan Grimoire nanti)
   - Jangan biarkan pemain melihat layar Anda!

5. Setelah **SEMUA** pemain dapat karakter:
   - Klik **"Mulai Game"**

### Bagian 3: Menunggu Role (Players)

Saat GM sedang assign:
- Anda akan melihat: "⏳ Menunggu Storyteller memberikan peran..."
- Tunggu hingga game dimulai
- Jangan refresh halaman!

Setelah GM klik "Mulai Game":
- Halaman otomatis update
- Anda masuk ke Player Dashboard
- Role Anda sudah tersimpan (tapi masih tersembunyi)

---

## Menjalankan Game - Malam Pertama

### Persiapan GM

Setelah klik "Mulai Game", Anda akan melihat **GM Dashboard** dengan:
- Header menunjukkan fase: **🌙 Night 1**
- **PhaseGuide** (panel utama kiri): Step-by-step instructions
- **Sidebar kanan**: Wake Order, Information Panel, Player List
- **Floating buttons**: 📖 Grimoire, 📜 History

### Step-by-Step Night 1

#### Step 0: Persiapan
```
Instruction: "🌙 Umumkan bahwa malam telah tiba..."
Action: Minta SEMUA pemain TUTUP MATA dan TUTUP LAYAR
```

**Cara Announce:**
- Katakan: "Malam telah tiba. Semua orang tutup mata."
- Pastikan semua pemain tutup layar (atau putar perangkat ke bawah)
- Baru lanjut ke step berikutnya

**Navigasi:**
- **"Next Step"**: Lanjut ke step berikutnya
- **"Prev Step"**: Kembali ke step sebelumnya
- **Progress bar**: Menunjukkan step berapa dari total

#### Step 1: Bangunkan Minions
```
Instruction: "👹 Bangunkan semua Minion..."
Details: Minion melihat satu sama lain dan melihat Demon
```

**Cara Eksekusi:**
1. Lihat di **Wake Order** (sidebar): Siapa yang jadi Minion
2. Katakan: "Minions, buka mata dan kenali satu sama lain"
3. Tunjuk ke Demon (jangan sebut nama, hanya tunjuk)
4. Tunggu beberapa detik
5. Katakan: "Minions, tutup mata"
6. **Kirim Informasi** (via Information Panel):
   - Pilih setiap Minion
   - Ketik: "Kamu adalah [CharacterName]. Demon adalah [DemonName] di kursi #[X]"
   - Kirim (player akan terima real-time)

#### Step 2: Bangunkan Demon
```
Instruction: "👹 Bangunkan Demon..."
Details: Demon melihat semua Minion
```

**Cara Eksekusi:**
1. Katakan: "Demon, buka mata"
2. Tunjuk ke semua Minion (tanpa sebut nama)
3. Katakan: "Demon, tutup mata"
4. **Kirim Informasi**:
   - Pilih Demon
   - Ketik: "Kamu adalah Imp. Minion kamu: [list names]"

#### Step 3-9: Bangunkan Characters
Untuk setiap character dengan firstNight ability (Washerwoman, Librarian, dll):

**Contoh: Washerwoman**
1. Lihat di Wake Order: Siapa yang jadi Washerwoman
2. Katakan: "Washerwoman, buka mata"
3. **Tentukan info yang akan diberikan**:
   - Pilih 2 pemain
   - 1 adalah Townsfolk tertentu (misal Monk)
   - 1 lainnya bukan Monk
   - Info: "Salah satu dari Alice atau Bob adalah Monk"
4. **Kirim Informasi** via Information Panel:
   - Pilih Washerwoman
   - Tipe: ✨ Kemampuan
   - Ketik info yang sudah ditentukan
   - Kirim
5. Katakan: "Washerwoman, tutup mata"
6. Klik **"Next Step"**

**Ulangi untuk semua character** sesuai Wake Order.

#### Step Terakhir: Tutup Malam
```
Instruction: "🌅 Umumkan bahwa malam telah berlalu..."
Action: Minta semua pemain BUKA MATA
```

Katakan: "Malam telah berlalu. Semua orang buka mata dan buka layar."

Klik **"Lanjut ke Fase Berikutnya"** → Game masuk **☀️ Day 1**

### Perspektif Players (Malam 1)

#### Saat Malam Dimulai
- Header berubah: **🌙 Night 1**
- Subtitle: "Tutup mata dan tunggu instruksi"
- **TUTUP MATA dan TUTUP LAYAR**

#### Menerima Informasi
Saat GM kirim info ke Anda:
- **Notifikasi suara** (jika browser support)
- Card baru muncul di **"📬 Informasi dari Storyteller"**
- Tampilan:
  - Icon tipe (✨ untuk ability)
  - Background berwarna (ungu untuk ability)
  - Badge fase: 🌙 Malam 1
  - Isi pesan lengkap

**PENTING**: Jangan buka layar sampai GM bilang "Buka mata"!

#### Melihat Role Pertama Kali
Setelah malam selesai dan siang tiba:
1. Klik tombol **"👁️‍🗨️ Lihat Peran"**
2. Card besar muncul dengan:
   - Icon character (👤/🎭/😈/👹)
   - Nama character (warna sesuai team)
   - Team type
   - **Ability lengkap** (baca baik-baik!)
3. Klik **"👁️ Sembunyikan"** untuk hide role
4. **Jangan tunjukkan ke pemain lain** kecuali strategi Anda!

---

## Menjalankan Game - Siang Hari

### Persiapan GM

Saat masuk **☀️ Day 1**:
- Header berubah kuning
- PhaseGuide tampil step siang hari (5 steps)
- **Voting Controls** muncul (panel baru di main area)
- Wake Order hilang (tidak ada night abilities)

### Step-by-Step Day Phase

#### Step 0: Pembukaan Siang
```
Instruction: "☀️ Umumkan bahwa siang hari dimulai..."
Action: Berikan waktu untuk diskusi
```

**Cara Eksekusi:**
1. Katakan: "Siang hari dimulai. Silakan diskusi siapa yang mencurigakan."
2. **Beri waktu 5-10 menit** untuk diskusi bebas
3. Pemain boleh claim role, share info, atau berdebat
4. Anda hanya observe, jangan intervensi
5. Lanjut ke step berikutnya saat siap untuk nomination

#### Step 1-3: Nominasi & Voting

**Cara Nominasi:**
1. Tanya: "Ada yang ingin menominasikan siapa?"
2. Pemain A sebut nama pemain B (yang dinominasikan)
3. Di **Voting Controls**:
   - **"Nominasi Pemain"**: Pilih pemain B (yang dinominasikan)
   - **"Nominator"**: Pilih pemain A (yang nominasi) - opsional
   - Klik **"🗳️ Mulai Voting"**

**Saat Voting Aktif:**
- Voting panel muncul di **SEMUA Player Dashboard** secara real-time!
- Players bisa klik: **YES** / **NO** / **PASS**
- Anda melihat real-time di GM Dashboard:
  - Vote count (✓ Yes, ✗ No, ○ Pass)
  - Progress bar
  - List siapa yang sudah vote
  - Indikator 🔒 (locked) dan 👻 (ghost vote)

**Tunggu Sampai Semua Vote:**
- Pantau progress: "X/Y voted"
- Butuh berapa yes untuk eksekusi: "Butuh Z yes untuk eksekusi"
- Formula: **> 50% total players** harus vote yes

**Tutup Voting:**
1. Setelah semua vote (atau waktu habis)
2. Klik **"🔒 Tutup Voting & Hitung Hasil"**
3. Alert muncul dengan hasil:

**Jika DIEKSEKUSI (yes ≥ threshold):**
```
✅ [Nama] DIEKSEKUSI!

Yes: X
No: Y
Pass: Z

Dibutuhkan: W votes
```
- Player otomatis jadi MATI (💀)
- Status update real-time di semua dashboard

**Jika TIDAK DIEKSEKUSI (yes < threshold):**
```
❌ [Nama] TIDAK dieksekusi.

Yes: X
No: Y
Pass: Z

Dibutuhkan: W votes
```
- Player tetap hidup
- Bisa ada nominasi lagi (maksimal 1 eksekusi per hari)

#### Nominasi Berikutnya (Opsional)
Jika voting pertama gagal:
1. Tanya lagi: "Ada nominasi lain?"
2. Ulangi proses nominasi & voting
3. **Aturan**: Hanya **1 eksekusi maksimal per hari**
4. Jika sudah ada yang dieksekusi, tidak bisa nominasi lagi hari itu

#### Step 4: Tutup Siang
```
Instruction: "🌙 Umumkan bahwa siang telah berakhir..."
Action: Persiapkan malam berikutnya
```

Katakan: "Siang hari berakhir. Malam akan segera tiba."

Klik **"Lanjut ke Fase Berikutnya"** → Game masuk **🌙 Night 2**

### Perspektif Players (Siang Hari)

#### Saat Siang Dimulai
- Header berubah: **☀️ Day 1**
- Subtitle: "Diskusi dan voting"
- **Voting Panel muncul** (tapi masih inactive)

#### Diskusi
- **Bisa chat** dengan pemain lain (via voice/text di luar aplikasi)
- Bisa claim role atau bohong
- Bisa share informasi yang diterima
- **Strategi**:
  - Townsfolk: Share info untuk find demon
  - Minion/Demon: Bluff atau menyesatkan

#### Saat Nominasi Dimulai
**Voting panel update:**
- Card merah muncul: "Yang Dinominasikan: [Nama] (oleh [Nominator])"
- 3 tombol besar: **✓ YES** / **✗ NO** / **○ PASS**

**Cara Vote:**
1. Klik salah satu tombol
2. Vote Anda tampil di card:
   ```
   Vote kamu: ✓ YES
   🔓 Belum dikunci
   ```
3. **Bisa ubah vote** selama belum di-lock

**Lock Vote (Opsional):**
1. Klik **"🔒 Lock Vote (Tidak bisa diubah!)"**
2. Icon berubah: 🔒 Dikunci
3. **Tidak bisa ubah lagi!**
4. GM akan melihat icon 🔒 di vote Anda

**Ghost Vote (Jika Sudah Mati):**
- Jika Anda sudah mati (💀), masih bisa vote **1 kali**
- Saat vote, otomatis jadi **Ghost Vote** (👻)
- Setelah pakai 1x, tidak bisa vote lagi:
  ```
  ⚠️ Kamu sudah mati dan sudah menggunakan ghost vote.
  Kamu tidak bisa voting lagi.
  ```

#### Setelah Voting Ditutup
- Voting panel hilang
- Hasil tidak ditampilkan ke player (hanya GM tahu)
- Jika ada yang dieksekusi:
  - Status player berubah jadi 💀 Mati
  - Counter "💀 Pemain Mati" update

---

## Fitur-Fitur GM

### 1. Phase Guide (Panel Utama)

**Fungsi:**
- Step-by-step instructions untuk setiap fase
- Tidak akan terlewat satupun langkah

**Cara Pakai:**
- Baca instruction di card besar
- Klik **"Next Step"** setelah selesai
- Klik **"Prev Step"** jika perlu mundur
- Lihat progress bar untuk track
- Klik **"Lihat semua steps"** untuk expand semua

**Tips:**
- Ikuti urutan step secara berurutan
- Jangan skip kecuali memang tidak relevan
- Baca details (text kecil) untuk penjelasan lengkap

### 2. Wake Order (Sidebar)

**Fungsi:**
- Menampilkan urutan character yang harus dibangunkan di malam hari
- Berbeda antara Night 1 dan Other Nights

**Cara Baca:**
1. Setiap character tampil dengan:
   - Wake order number
   - Nama character
   - Siapa pemain yang punya character itu (jika ada)
2. Klik nama character untuk lihat **detailed instructions**

**Contoh:**
```
1️⃣ Poisoner (Alice)
   Klik → Show instructions:
   "The Poisoner chooses a player to poison..."
```

### 3. Information Panel (Sidebar)

**Fungsi:**
- Kirim pesan private ke player tertentu
- Real-time delivery

**Cara Pakai:**
1. **Pilih Pemain**: Dropdown "Pilih Pemain"
2. **Pilih Tipe**:
   - 💬 Informasi (biru) - info umum
   - ⚠️ Peringatan (kuning) - warning
   - ✨ Kemampuan (ungu) - ability info
   - 💀 Kematian (merah) - death info
3. **Tulis Pesan**: Di textarea
4. **Lihat Preview**: Preview muncul otomatis
5. **Kirim**: Klik "📤 Kirim Informasi"
6. **Success**: "✅ Informasi berhasil dikirim!"

**Template Cepat:**
Tombol dibawah form untuk pesan umum:
- 👁️ Lihat Demon
- ✅ Info Positif
- 🧪 Diracuni
- ❌ Tidak Ada Info

**Tips:**
- Be specific tapi jangan terlalu jelas (biar player think)
- Gunakan template untuk percepat
- Bisa kirim multiple info ke 1 player

### 4. Voting Controls (Main Area, Day Only)

**Fungsi:**
- Manage voting session
- Lihat real-time votes
- Tutup dan hitung hasil

**Cara Pakai:**
Sudah dijelaskan di [Step-by-Step Day Phase](#step-by-step-day-phase)

**Fitur Tambahan:**
- Vote list show semua votes dengan icon:
  - ✓ = Yes
  - ✗ = No
  - ○ = Pass
  - 👻 = Ghost vote
  - 🔒 = Locked

### 5. Player List (Sidebar)

**Fungsi:**
- Lihat semua player dengan role
- Toggle alive/dead status
- Track ghost votes

**Info Ditampilkan:**
- Seat number (#1, #2, dst)
- Nama player
- Character name (warna sesuai team)
- Status: ❤️ Hidup atau 💀 Mati
- Ghost vote indicator (👻 jika sudah pakai)

**Toggle Alive/Dead:**
1. Klik toggle switch di sebelah nama
2. Status langsung update
3. **Real-time** update di semua dashboard player
4. Logged di game history

**Kapan Pakai:**
- Night: Demon membunuh → toggle jadi mati
- Day: Execution berhasil → otomatis jadi mati (tidak perlu manual)

### 6. Grimoire Tracker (📖 Button)

**Fungsi:**
- Visual grimoire seperti versi physical
- Track semua player dan status
- Tambah reminders
- Catat notes

**Cara Buka:**
1. Klik **floating button 📖** di kanan bawah
2. Fullscreen modal terbuka

**Layout:**
- **Center**: Circular display semua player tokens
- **Sidebar**: Player details, reminders, notes

**Fitur Circular Display:**
- Semua player tersusun melingkar
- Color-coded border (townsfolk=biru, minion=orange, dll)
- Dead players: grayscale + 💀
- Ghost vote used: 👻 badge

**Cara Pakai:**
1. **Select Player**: Klik token player
   - Token dapat ring merah (selected)
   - Sidebar tampil info player
2. **Add Reminder**:
   - Ketik reminder (misal: "Poisoned", "Drunk", "Protected")
   - Klik **+** atau Enter
   - Reminder muncul sebagai badge kuning di token
3. **Remove Reminder**:
   - Klik ✕ di reminder
4. **GM Notes**:
   - Scroll ke "📝 Catatan GM"
   - Tulis apapun (rencana, observasi, dll)
   - Klik **"💾 Simpan Catatan"**
5. **Close**: Klik "✕ Tutup"

**Tips:**
- Gunakan reminders untuk track status (poisoned, drunk, protected, dll)
- Update notes setiap hari untuk track progress
- Grimoire state tersimpan (persistent)

### 7. Game History (📜 Button)

**Fungsi:**
- Log semua events yang terjadi
- Filter by event type
- Review game flow

**Cara Buka:**
1. Klik **floating button 📜** di kanan bawah (dibawah 📖)
2. Fullscreen modal terbuka

**Event Types:**
- 🔄 Phase Changes
- 💀 Player Deaths
- ⚖️ Player Executions
- 🗳️ Voting Sessions
- 📨 Information Sent
- 📖 Grimoire Updates
- 🎮 Game Created
- 👋 Player Joined
- 🎭 Character Assigned

**Cara Pakai:**
1. **View All Events**: Default tampil semua
2. **Filter**: Klik filter button (misal "Phase Changes")
3. **View Details**: Klik "Show details" di event untuk lihat metadata
4. **Stats**: Lihat footer untuk quick stats

**Kapan Berguna:**
- Review apa yang terjadi di game
- Dispute resolution (cek kapan vote terjadi, dll)
- Learning (review strategi setelah game)

---

## Fitur-Fitur Player

### 1. Role Card (Eye Button)

**Fungsi:**
- Lihat character dan ability Anda
- Privacy protection (default hidden)

**Cara Pakai:**
1. Klik **"👁️‍🗨️ Lihat Peran"**
2. Card besar muncul dengan:
   - Icon character
   - Nama (color-coded)
   - Team
   - **Ability lengkap**
   - Dead warning (jika mati)
3. Klik **"👁️ Sembunyikan"** untuk hide

**Tips:**
- Baca ability baik-baik
- Jangan screen share saat lihat role
- Tutup role saat tidak perlu

### 2. Information Feed

**Fungsi:**
- Terima pesan dari GM
- Real-time notification

**Tampilan:**
- Card per pesan
- Color-coded by type (info=biru, ability=ungu, dll)
- Badge fase (🌙/☀️)
- Timestamp
- Counter: "Total X informasi diterima"

**Tips:**
- Baca semua info dengan teliti
- Info bisa jadi clue penting
- Catat atau ingat info untuk diskusi

### 3. Voting Panel (Day Only)

**Fungsi:**
- Vote saat ada nominasi
- Lock vote
- Track ghost vote

Sudah dijelaskan lengkap di [Perspektif Players - Siang Hari](#perspektif-players-siang-hari)

### 4. Player Count

**Fungsi:**
- Track berapa pemain hidup vs mati
- Penting untuk strategi

**Tampilan:**
- 2 cards:
  - ❤️ Pemain Hidup (hijau)
  - 💀 Pemain Mati (merah)
- Update real-time

**Strategi:**
- Townsfolk: Hitung kemungkinan Demon
- Demon: Tahu berapa yang harus dibunuh untuk menang

### 5. Tips Section

**Fungsi:**
- Reminder aturan game
- Phase-specific tips

**Dynamic Tips:**
- Saat Night: "Tutup mata sampai Storyteller memanggilmu"
- Saat Day: Tips umum voting dan diskusi

---

## Tips & Best Practices

### Untuk Game Master

#### Persiapan
- ✅ Baca panduan sebelum mulai
- ✅ Siapkan catan fisik (jika perlu) untuk track role
- ✅ Pastikan internet stabil
- ✅ Test dulu dengan teman (dry run)

#### Selama Game
- ✅ Ikuti step-by-step guide dengan teliti
- ✅ Jangan skip steps kecuali tidak relevan
- ✅ Gunakan Information Panel untuk semua komunikasi ke players
- ✅ Gunakan Grimoire untuk track status (poisoned, drunk, dll)
- ✅ Update player alive/dead status segera setelah event
- ✅ Beri waktu cukup untuk diskusi di siang hari
- ✅ Jangan bias atau beri hint
- ✅ Maintain poker face

#### Best Practices
- 📌 Catat assignment di Grimoire notes
- 📌 Beri informasi yang tricky tapi fair
- 📌 Gunakan template cepat untuk speed
- 📌 Review Game History setelah game untuk learning

### Untuk Players

#### Selama Night
- ✅ **TUTUP MATA dan TUTUP LAYAR** saat diminta
- ✅ Jangan intip layar/mata pemain lain
- ✅ Buka layar hanya untuk baca info dari GM
- ✅ Tutup role setelah baca info

#### Selama Day
- ✅ Diskusi aktif dengan pemain lain
- ✅ Share info yang diterima (atau bluff jika evil)
- ✅ Dengarkan claims pemain lain
- ✅ Vote sesuai strategi tim
- ✅ Lock vote jika sudah yakin
- ✅ Jika mati, simpan ghost vote untuk timing penting

#### Best Practices
- 📌 Catat info yang diterima
- 📌 Track siapa claim apa
- 📌 Analyze voting patterns
- 📌 Good players: kolaborasi
- 📌 Evil players: koordinasi secret

### Untuk Semua

#### Etika Bermain
- 🤝 Jangan meta-gaming (pakai info di luar game)
- 🤝 Jangan toxic atau personal attack
- 🤝 Accept hasil game dengan sportif
- 🤝 Jangan private chat (kecuali night ability allows)
- 🤝 Fokus dan jangan distracted
- 🤝 Respect GM decisions

#### Technical
- 💡 Jangan refresh page selama game
- 💡 Charge device sebelum game
- 💡 Pastikan notifikasi aktif
- 💡 Gunakan headset jika voice chat
- 💡 Install PWA untuk better experience
- 💡 Bookmark URL jika sering main

---

## Troubleshooting

### Player Tidak Bisa Join

**Problem**: "Game tidak ditemukan" atau error saat join

**Solusi:**
1. ✅ Cek Room Code (case-insensitive, harus 6 karakter)
2. ✅ Pastikan game belum dimulai (status masih "lobby")
3. ✅ Refresh halaman dan coba lagi
4. ✅ Cek koneksi internet
5. ✅ Minta GM cek game masih aktif

### Real-Time Tidak Update

**Problem**: Perubahan tidak muncul otomatis (harus refresh)

**Solusi:**
1. ✅ Cek koneksi internet stabil
2. ✅ Buka browser console (F12) → cek error
3. ✅ Cek Supabase real-time enabled (jika self-host)
4. ✅ Refresh halaman
5. ✅ Gunakan browser modern (Chrome/Safari terbaru)

### Vote Tidak Bisa Diubah

**Problem**: Tombol vote disabled

**Solusi:**
1. ✅ Cek apakah vote sudah di-lock (🔒)
2. ✅ Unlock dulu sebelum ubah
3. ✅ Cek voting session masih open (belum ditutup GM)
4. ✅ Jika dead dan sudah ghost vote, tidak bisa vote lagi (expected)

### Informasi Tidak Diterima

**Problem**: Player tidak terima pesan dari GM

**Solusi:**
1. ✅ GM: Cek pemain yang dipilih benar
2. ✅ GM: Cek success message muncul
3. ✅ Player: Scroll ke Information Feed section
4. ✅ Player: Refresh halaman
5. ✅ Cek browser console untuk error

### Character Tidak Muncul

**Problem**: Setelah assignment, role tidak ada

**Solusi:**
1. ✅ GM: Pastikan sudah klik "Mulai Game" setelah assign
2. ✅ Player: Klik "👁️‍🗨️ Lihat Peran"
3. ✅ Refresh halaman
4. ✅ Cek database (Prisma Studio) jika self-host

### Phase Tidak Bisa Advance

**Problem**: Tombol "Lanjut ke Fase Berikutnya" tidak ada/disabled

**Solusi:**
1. ✅ Selesaikan semua steps di current phase dulu
2. ✅ Atau paksa advance (tanya developer untuk override)
3. ✅ Cek game status di database

### PWA Tidak Bisa Install

**Problem**: Tidak ada prompt install

**Solusi:**
1. ✅ Gunakan HTTPS (production)
2. ✅ Cek manifest.json accessible (`/manifest.json`)
3. ✅ Cek service worker registered (console: "ServiceWorker registration successful")
4. ✅ Desktop: Cek address bar untuk icon install
5. ✅ Mobile: Gunakan manual "Add to Home Screen"

### Database Connection Error

**Problem**: Error saat create/join game

**Solusi:**
1. ✅ Cek DATABASE_URL di .env.local
2. ✅ Pastikan special characters di password di-encode:
   - `$` → `%24`
   - `?` → `%3F`
   - `@` → `%40`
3. ✅ Test koneksi: `npx prisma studio`
4. ✅ Re-run migration: `npx prisma migrate deploy`

### Game Crash / Bug

**Problem**: Error tidak expected

**Solusi:**
1. ✅ Screenshot error message
2. ✅ Cek browser console (F12)
3. ✅ Report ke developer dengan:
   - Error message
   - Steps to reproduce
   - Browser & device info
4. ✅ Restart game sebagai temporary fix

---

## Appendix: Trouble Brewing Character Reference

### Townsfolk (Good Team)

**Washerwoman** (1️⃣)
- Ability: Kamu mulai mengetahui bahwa 1 dari 2 pemain adalah Townsfolk tertentu

**Librarian** (2️⃣)
- Ability: Kamu mulai mengetahui bahwa 1 dari 2 pemain adalah Outsider tertentu (atau tidak ada Outsider)

**Investigator** (3️⃣)
- Ability: Kamu mulai mengetahui bahwa 1 dari 2 pemain adalah Minion tertentu

**Chef** (4️⃣)
- Ability: Kamu mulai mengetahui berapa pasang evil players yang duduk bersebelahan

**Empath** (5️⃣)
- Ability: Setiap malam, kamu tahu berapa dari 2 tetangga hidup kamu yang evil

**Fortune Teller** (6️⃣)
- Ability: Setiap malam, pilih 2 pemain: kamu tahu jika salah satu adalah Demon (1 Red Herring)

**Undertaker** (🌙 Other)
- Ability: Setiap malam kecuali malam pertama, kamu tahu character yang mati di siang hari

**Monk** (🌙 Other)
- Ability: Setiap malam kecuali malam pertama, pilih pemain (bukan kamu): pemain itu safe dari Demon

**Ravenkeeper** (🌙 Death)
- Ability: Jika kamu mati di malam, kamu pilih 1 pemain: kamu tahu character mereka

**Virgin**
- Ability: Pertama kali kamu dinominasi, jika nominator adalah Townsfolk, mereka dieksekusi langsung

**Slayer**
- Ability: Sekali per game di siang hari, publicly pilih pemain: jika mereka Demon, mereka mati

**Soldier**
- Ability: Kamu safe dari Demon

**Mayor**
- Ability: Jika hanya 3 pemain hidup dan tidak ada eksekusi, tim kamu menang

### Outsiders (Good Team, Disadvantage)

**Butler**
- Ability: Setiap malam, pilih pemain (bukan kamu): besok, kamu hanya bisa vote jika mereka vote

**Drunk**
- Ability: Kamu tidak tahu bahwa kamu Drunk. Kamu pikir kamu Townsfolk, tapi ability kamu tidak bekerja

**Recluse**
- Ability: Kamu mungkin register sebagai evil & sebagai Minion atau Demon, bahkan jika mati

**Saint**
- Ability: Jika kamu mati karena eksekusi, tim kamu kalah

### Minions (Evil Team)

**Poisoner** (🌙 Other)
- Ability: Setiap malam, pilih pemain: mereka poisoned malam ini dan besok (ability mereka tidak bekerja)

**Spy** (🌙 Other)
- Ability: Setiap malam, kamu lihat Grimoire. Kamu bisa register sebagai good/Townsfolk/Outsider

**Scarlet Woman**
- Ability: Jika ada 5+ pemain dan Demon mati, kamu jadi Demon

**Baron**
- Ability: Ada 2 Outsider tambahan dalam game

### Demons (Evil Team)

**Imp** (🌙 Every)
- Ability: Setiap malam kecuali pertama, pilih pemain: mereka mati. Jika kamu self-kill, Minion jadi Imp

---

## Quick Reference: Keyboard Shortcuts

Saat ini belum ada keyboard shortcuts. Feature request untuk future update!

---

## Contact & Support

Jika mengalami masalah atau ada pertanyaan:

1. **Baca troubleshooting section** di atas
2. **Cek browser console** (F12) untuk error
3. **Contact developer** dengan info:
   - Error message
   - Steps to reproduce
   - Browser & device
   - Screenshots

---

## Changelog

**Version 1.0.0** (Current)
- ✅ Complete Trouble Brewing implementation
- ✅ Real-time synchronization
- ✅ GM step-by-step guidance
- ✅ Voting system with ghost votes
- ✅ Grimoire tracker
- ✅ Game history
- ✅ PWA support
- ✅ Mobile optimization

**Future Updates:**
- More scripts (Sects & Violets, Bad Moon Rising)
- Ability automation
- In-app chat
- Game replay
- Statistics

---

**📖 End of Panduan Penggunaan**

**Selamat Bermain Blood on the Clocktower! 🎮**

---

*Dibuat dengan ❤️ untuk komunitas Blood on the Clocktower Indonesia*
