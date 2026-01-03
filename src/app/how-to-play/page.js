'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function HowToPlayPage() {
  const [expandedSection, setExpandedSection] = useState(null)

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🏰</div>
          <h1 className="text-5xl font-bold text-blood mb-4">
            Cara Bermain
          </h1>
          <p className="text-xl text-gray-400">
            Panduan lengkap Blood on the Clocktower
          </p>
        </div>

        {/* Overview */}
        <div className="card mb-6 bg-gradient-to-br from-purple-900/20 to-red-900/20 border-purple-700">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">📖 Apa itu Blood on the Clocktower?</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Blood on the Clocktower adalah permainan deduksi sosial untuk 5-20 pemain.
            Setiap pemain mendapat karakter rahasia dengan kemampuan unik.
            Tim Good mencoba menemukan dan mengeksekusi Demon, sementara tim Evil berusaha menyembunyikan identitas mereka.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <div className="text-3xl mb-2">😇</div>
              <h3 className="font-bold text-blue-400 mb-2">Tim Good</h3>
              <p className="text-sm text-gray-400">
                Townsfolk & Outsiders mencari Evil dengan kemampuan mereka
              </p>
            </div>
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <div className="text-3xl mb-2">😈</div>
              <h3 className="font-bold text-red-400 mb-2">Tim Evil</h3>
              <p className="text-sm text-gray-400">
                Demon & Minions berbohong dan membunuh untuk menang
              </p>
            </div>
          </div>
        </div>

        {/* How to Play Sections */}
        <div className="space-y-4">
          {/* Section 1: Setup */}
          <div className="card border-yellow-700/50">
            <button
              onClick={() => toggleSection('setup')}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-xl font-bold flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                <span>1. Setup Game</span>
              </h3>
              <span className="text-2xl">{expandedSection === 'setup' ? '▼' : '▶'}</span>
            </button>
            {expandedSection === 'setup' && (
              <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
                <div>
                  <h4 className="font-bold text-lg mb-2">Untuk Storyteller (GM):</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
                    <li>Klik "Buat Game Baru" di menu utama</li>
                    <li>Masukkan nama Storyteller dan jumlah pemain</li>
                    <li>Bagikan kode room kepada semua pemain</li>
                    <li>Assign karakter untuk setiap pemain (manual atau random)</li>
                    <li>Mulai game saat semua pemain siap</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Untuk Pemain:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
                    <li>Klik "Gabung Game" di menu utama</li>
                    <li>Masukkan kode room yang dibagikan Storyteller</li>
                    <li>Masukkan nama dan nomor kursi kamu</li>
                    <li>Tunggu Storyteller assign karakter</li>
                  </ol>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Night Phase */}
          <div className="card border-purple-700/50">
            <button
              onClick={() => toggleSection('night')}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-xl font-bold flex items-center gap-3">
                <span className="text-3xl">🌙</span>
                <span>2. Fase Malam (Night)</span>
              </h3>
              <span className="text-2xl">{expandedSection === 'night' ? '▼' : '▶'}</span>
            </button>
            {expandedSection === 'night' && (
              <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
                <p className="text-gray-300">
                  Pada malam pertama, Storyteller membangunkan setiap karakter sesuai wake order:
                </p>
                <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4">
                  <h4 className="font-bold mb-2">🌙 Malam Pertama:</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• <strong>Minion & Demon:</strong> Saling mengenal siapa Evil</li>
                    <li>• <strong>Washerwoman/Librarian/Investigator:</strong> Dapat info 2 pemain</li>
                    <li>• <strong>Chef:</strong> Tahu berapa pasang Evil yang bersebelahan</li>
                    <li>• <strong>Empath:</strong> Tahu jumlah Evil di kiri/kanan</li>
                    <li>• <strong>Fortune Teller:</strong> Pilih 2 pemain, cek apakah ada Demon</li>
                  </ul>
                </div>
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <h4 className="font-bold mb-2">🌙 Malam Berikutnya:</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• <strong>Demon:</strong> Pilih pemain untuk dibunuh</li>
                    <li>• <strong>Poisoner:</strong> Pilih pemain untuk diracuni (info salah)</li>
                    <li>• <strong>Monk:</strong> Pilih pemain untuk dilindungi dari Demon</li>
                    <li>• <strong>Fortune Teller/Empath:</strong> Dapat info lagi</li>
                    <li>• <strong>Undertaker:</strong> Tahu karakter pemain yang mati kemarin</li>
                  </ul>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 text-sm">
                  <p className="text-yellow-300">
                    💡 <strong>Tip:</strong> Storyteller gunakan Wake Order untuk membangunkan pemain sesuai urutan.
                    Pemain akan dapat notifikasi saat giliran mereka.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Day Phase */}
          <div className="card border-orange-700/50">
            <button
              onClick={() => toggleSection('day')}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-xl font-bold flex items-center gap-3">
                <span className="text-3xl">☀️</span>
                <span>3. Fase Siang (Day)</span>
              </h3>
              <span className="text-2xl">{expandedSection === 'day' ? '▼' : '▶'}</span>
            </button>
            {expandedSection === 'day' && (
              <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
                <p className="text-gray-300">
                  Pada siang hari, semua pemain berdiskusi dan voting untuk eliminasi:
                </p>
                <div className="space-y-3">
                  <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                    <h4 className="font-bold mb-2">💬 Diskusi</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      <li>• Pemain sharing informasi yang mereka dapat</li>
                      <li>• Diskusikan siapa yang mencurigakan</li>
                      <li>• Evil akan berbohong untuk survive</li>
                      <li>• Good harus menemukan inkonsistensi dalam cerita</li>
                    </ul>
                  </div>
                  <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                    <h4 className="font-bold mb-2">🗳️ Voting</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      <li>• Storyteller memulai sesi voting</li>
                      <li>• Setiap pemain pilih 1 orang untuk dieliminasi</li>
                      <li>• Bisa lock vote agar tidak bisa diubah</li>
                      <li>• Pemain mati punya 1x ghost vote</li>
                      <li>• Pemain dengan vote terbanyak dieksekusi</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 text-sm">
                    <p className="text-yellow-300">
                      💡 <strong>Tip:</strong> Perhatikan siapa yang terlalu cepat menuduh,
                      siapa yang terlalu diam, dan siapa yang ceritanya tidak konsisten!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Characters */}
          <div className="card border-green-700/50">
            <button
              onClick={() => toggleSection('characters')}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-xl font-bold flex items-center gap-3">
                <span className="text-3xl">🎭</span>
                <span>4. Karakter Penting</span>
              </h3>
              <span className="text-2xl">{expandedSection === 'characters' ? '▼' : '▶'}</span>
            </button>
            {expandedSection === 'characters' && (
              <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Townsfolk */}
                  <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                    <h4 className="font-bold text-blue-400 mb-3">👥 Townsfolk (Good)</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="font-semibold">Chef</p>
                        <p className="text-gray-400 text-xs">Tahu jumlah pasang Evil bersebelahan</p>
                      </div>
                      <div>
                        <p className="font-semibold">Empath</p>
                        <p className="text-gray-400 text-xs">Tahu jumlah Evil di kiri/kanan</p>
                      </div>
                      <div>
                        <p className="font-semibold">Fortune Teller</p>
                        <p className="text-gray-400 text-xs">Cek 2 pemain, apakah ada Demon</p>
                      </div>
                      <div>
                        <p className="font-semibold">Monk</p>
                        <p className="text-gray-400 text-xs">Lindungi 1 pemain dari Demon</p>
                      </div>
                      <div>
                        <p className="font-semibold">Ravenkeeper</p>
                        <p className="text-gray-400 text-xs">Saat mati, cek karakter 1 pemain</p>
                      </div>
                    </div>
                  </div>

                  {/* Evil */}
                  <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                    <h4 className="font-bold text-red-400 mb-3">😈 Evil Team</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="font-semibold">Imp (Demon)</p>
                        <p className="text-gray-400 text-xs">Bunuh 1 pemain setiap malam</p>
                      </div>
                      <div>
                        <p className="font-semibold">Poisoner (Minion)</p>
                        <p className="text-gray-400 text-xs">Racuni 1 pemain (info salah)</p>
                      </div>
                      <div>
                        <p className="font-semibold">Spy (Minion)</p>
                        <p className="text-gray-400 text-xs">Lihat Grimoire, terlihat sebagai Good</p>
                      </div>
                      <div>
                        <p className="font-semibold">Scarlet Woman (Minion)</p>
                        <p className="text-gray-400 text-xs">Jadi Demon jika Demon mati</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Win Conditions */}
          <div className="card border-pink-700/50">
            <button
              onClick={() => toggleSection('win')}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-xl font-bold flex items-center gap-3">
                <span className="text-3xl">🏆</span>
                <span>5. Cara Menang</span>
              </h3>
              <span className="text-2xl">{expandedSection === 'win' ? '▼' : '▶'}</span>
            </button>
            {expandedSection === 'win' && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                    <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                      <span className="text-2xl">😇</span>
                      Good Menang Jika:
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>✓ Demon berhasil dieksekusi (voting siang hari)</li>
                    </ul>
                  </div>
                  <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                    <h4 className="font-bold text-red-400 mb-2 flex items-center gap-2">
                      <span className="text-2xl">😈</span>
                      Evil Menang Jika:
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>✓ Hanya tersisa 2 pemain hidup (1 Demon + 1 Good)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 6: Tips */}
          <div className="card border-cyan-700/50">
            <button
              onClick={() => toggleSection('tips')}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-xl font-bold flex items-center gap-3">
                <span className="text-3xl">💡</span>
                <span>6. Tips & Strategi</span>
              </h3>
              <span className="text-2xl">{expandedSection === 'tips' ? '▼' : '▶'}</span>
            </button>
            {expandedSection === 'tips' && (
              <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                  <h4 className="font-bold text-green-400 mb-2">Untuk Good Team:</h4>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Share informasi dengan jujur untuk membangun trust</li>
                    <li>• Cross-check informasi antar pemain untuk temukan kebohongan</li>
                    <li>• Perhatikan siapa yang mengalihkan perhatian dari diri mereka</li>
                    <li>• Jangan terlalu percaya pada 1 pemain saja</li>
                    <li>• Gunakan ghost vote dengan bijak setelah mati</li>
                  </ul>
                </div>
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <h4 className="font-bold text-red-400 mb-2">Untuk Evil Team:</h4>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Buat cerita yang konsisten dengan informasi yang mungkin</li>
                    <li>• Jangan terlalu agresif menuduh orang lain</li>
                    <li>• Pretend menjadi karakter Good dengan informasi palsu</li>
                    <li>• Koordinasi dengan tim Evil untuk menguatkan alibi</li>
                    <li>• Manfaatkan Poisoner untuk membuat Good dapat info salah</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mt-12">
          <Link
            href="/"
            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 font-semibold transition-colors"
          >
            ← Kembali ke Menu
          </Link>
          <Link
            href="/gm/create"
            className="px-8 py-4 bg-blood hover:bg-red-700 rounded-lg font-semibold transition-colors"
          >
            Mulai Bermain 🎮
          </Link>
        </div>
      </div>
    </div>
  )
}
