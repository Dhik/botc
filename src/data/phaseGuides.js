// Step-by-step guides for Game Master

export const nightPhaseGuide = {
  'night-1': {
    title: 'Night Pertama',
    description: 'Malam pertama - setup informasi awal untuk semua pemain',
    steps: [
      {
        step: 1,
        instruction: '🌙 Umumkan bahwa malam telah tiba. Minta semua pemain menutup mata.',
        details: 'Katakan: "Malam telah tiba. Semua pemain, tutup mata kalian."',
        action: null
      },
      {
        step: 2,
        instruction: '😈 Bangunkan semua MINION. Tunjukkan siapa DEMON-nya.',
        details: 'Katakan: "Minions, buka mata. Ini adalah Demon kalian." (tunjuk Demon). Minions saling mengenal satu sama lain.',
        action: 'wake-minions',
        charactersInvolved: ['minion']
      },
      {
        step: 3,
        instruction: '😴 Tidurkan kembali semua MINION.',
        details: 'Katakan: "Minions, tutup mata kalian."',
        action: null
      },
      {
        step: 4,
        instruction: '👹 Bangunkan DEMON. Tunjukkan siapa MINION-nya.',
        details: 'Katakan: "Demon, buka mata. Ini adalah Minion kalian." (tunjuk semua Minion)',
        action: 'wake-demon',
        charactersInvolved: ['demon']
      },
      {
        step: 5,
        instruction: '😴 Tidurkan kembali DEMON.',
        details: 'Katakan: "Demon, tutup mata."',
        action: null
      },
      {
        step: 6,
        instruction: '👥 Ikuti urutan wake order untuk karakter TOWNSFOLK dan OUTSIDER.',
        details: 'Bangunkan karakter sesuai firstNight order number. Berikan informasi sesuai ability mereka.',
        action: 'wake-order',
        useWakeOrder: true
      },
      {
        step: 7,
        instruction: '🌅 Umumkan bahwa fajar telah tiba. Semua pemain boleh membuka mata.',
        details: 'Katakan: "Fajar telah tiba. Semua pemain, buka mata kalian. Hari pertama dimulai."',
        action: 'end-night'
      }
    ]
  },
  'night-other': {
    title: 'Malam Lainnya',
    description: 'Malam ke-2 dan seterusnya',
    steps: [
      {
        step: 1,
        instruction: '🌙 Umumkan bahwa malam telah tiba. Minta semua pemain menutup mata.',
        details: 'Katakan: "Malam telah tiba. Semua pemain, tutup mata kalian."',
        action: null
      },
      {
        step: 2,
        instruction: '👥 Ikuti urutan wake order untuk semua karakter.',
        details: 'Bangunkan karakter sesuai otherNights order number. Berikan informasi atau minta aksi sesuai ability mereka.',
        action: 'wake-order',
        useWakeOrder: true
      },
      {
        step: 3,
        instruction: '🌅 Umumkan bahwa fajar telah tiba. Semua pemain boleh membuka mata.',
        details: 'Katakan: "Fajar telah tiba. Semua pemain, buka mata kalian."',
        action: 'end-night'
      }
    ]
  }
}

export const dayPhaseGuide = {
  title: 'Fase Siang',
  description: 'Diskusi, nominasi, dan voting',
  steps: [
    {
      step: 1,
      instruction: '☀️ Mulai fase diskusi. Pemain bebas berdiskusi.',
      details: 'Tidak ada batasan waktu. Pemain dapat berbagi informasi, berdiskusi strategi, atau berbohong.',
      action: null
    },
    {
      step: 2,
      instruction: '🗳️ Buka nominasi. Pemain dapat menominasikan pemain lain.',
      details: 'Setiap pemain boleh menominasikan 1 pemain per hari. Pemain yang dinominasikan boleh memberikan defense speech.',
      action: 'nominations'
    },
    {
      step: 3,
      instruction: '✋ Untuk setiap nominasi, lakukan voting.',
      details: 'Pemain vote dengan tunjuk tangan (YES) atau tidak (NO). Dead players dapat gunakan ghost vote (1x per game).',
      action: 'voting'
    },
    {
      step: 4,
      instruction: '📊 Hitung vote. Jika mayoritas YES, pemain di-eksekusi.',
      details: 'Butuh lebih dari setengah pemain hidup untuk eksekusi. Hanya 1 eksekusi per hari.',
      action: 'count-votes'
    },
    {
      step: 5,
      instruction: '🔚 Akhiri hari. Lanjut ke malam atau cek kondisi kemenangan.',
      details: 'Cek apakah ada team yang menang. Jika belum, lanjut ke malam berikutnya.',
      action: 'end-day'
    }
  ]
}

// Character-specific wake instructions
export const characterWakeInstructions = {
  'washerwoman': {
    instruction: 'Tunjukkan 2 pemain. Salah satunya adalah Townsfolk tertentu, satunya lagi bukan.',
    question: 'Siapa 2 pemain yang ditunjukkan? Townsfolk mana yang benar?'
  },
  'librarian': {
    instruction: 'Tunjukkan 2 pemain. Salah satunya adalah Outsider tertentu (atau 0 Outsider in play).',
    question: 'Siapa 2 pemain yang ditunjukkan? Outsider mana yang benar?'
  },
  'investigator': {
    instruction: 'Tunjukkan 2 pemain. Salah satunya adalah Minion tertentu.',
    question: 'Siapa 2 pemain yang ditunjukkan? Minion mana yang benar?'
  },
  'chef': {
    instruction: 'Tunjukkan jumlah pasangan evil players yang bersebelahan.',
    question: 'Berapa jumlah pasangan evil yang bersebelahan? (0, 1, 2, dll)'
  },
  'empath': {
    instruction: 'Tunjukkan berapa banyak tetangga hidup yang evil (0, 1, atau 2).',
    question: 'Berapa tetangga evil yang hidup?'
  },
  'fortune-teller': {
    instruction: 'Pemain pilih 2 pemain. Tunjukkan apakah salah satunya adalah Demon.',
    question: 'Siapa 2 pemain yang dipilih? Apakah ada yang Demon?'
  },
  'undertaker': {
    instruction: 'Tunjukkan karakter yang mati karena eksekusi hari ini.',
    question: 'Siapa yang mati hari ini?'
  },
  'monk': {
    instruction: 'Pemain pilih 1 pemain (bukan diri sendiri). Pemain tersebut aman dari Demon malam ini.',
    question: 'Siapa yang dilindungi?'
  },
  'ravenkeeper': {
    instruction: 'Jika mati malam ini, bangunkan dan pilih 1 pemain untuk tahu karakternya.',
    question: 'Siapa yang dipilih?'
  },
  'butler': {
    instruction: 'Pemain pilih master. Besok hanya boleh vote jika master vote.',
    question: 'Siapa yang jadi master?'
  },
  'poisoner': {
    instruction: 'Pemain pilih 1 pemain untuk di-poison (ability tidak berfungsi).',
    question: 'Siapa yang di-poison?'
  },
  'spy': {
    instruction: 'Tunjukkan Grimoire kepada Spy.',
    question: 'Tunjukkan semua informasi di Grimoire.'
  },
  'scarlet-woman': {
    instruction: 'Jika Demon mati dan ≥5 pemain hidup, Scarlet Woman jadi Demon.',
    question: 'Apakah Demon mati?'
  },
  'imp': {
    instruction: 'Pemain pilih 1 pemain untuk dibunuh. Boleh pilih diri sendiri (Minion jadi Imp).',
    question: 'Siapa yang dibunuh?'
  }
}

// Helper function to get guide based on phase
export function getPhaseGuide(phase) {
  if (!phase) return null

  if (phase === 'night-1') {
    return nightPhaseGuide['night-1']
  } else if (phase.startsWith('night')) {
    return nightPhaseGuide['night-other']
  } else if (phase.startsWith('day')) {
    return dayPhaseGuide
  }

  return null
}

// Helper to get character wake instruction
export function getCharacterInstruction(characterId) {
  return characterWakeInstructions[characterId] || {
    instruction: 'Bangunkan karakter ini dan berikan informasi sesuai ability.',
    question: 'Apa informasi yang diberikan?'
  }
}
