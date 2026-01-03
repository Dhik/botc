# Blood on the Clocktower - Web Application

A complete digital companion for playing Blood on the Clocktower online with real-time synchronization and step-by-step GM guidance.

## 🎮 Features

### For Game Master (Storyteller)
- ✅ **Step-by-Step Guidance** - Complete instructions for every night and day phase
- ✅ **Character Selection & Assignment** - Easy interface for distributing roles
- ✅ **Wake Order Display** - Automatic ordering based on character abilities
- ✅ **Information Panel** - Send targeted messages to specific players
- ✅ **Voting System** - Manage nominations and voting with automatic tallying
- ✅ **Grimoire Tracker** - Visual circular grimoire with reminders and notes
- ✅ **Game History** - Complete event log for review
- ✅ **Player Management** - Toggle alive/dead status, track ghost votes

### For Players
- ✅ **Role Display** - View your character with eye button privacy
- ✅ **Information Feed** - Receive real-time messages from Storyteller
- ✅ **Voting Interface** - Vote YES/NO/PASS with lock mechanism
- ✅ **Ghost Vote Tracking** - Automatic detection and limiting
- ✅ **Phase Indicators** - Know when it's night or day
- ✅ **Player Count** - See how many alive/dead

### Technical Features
- ✅ **Real-time Sync** - Supabase real-time subscriptions
- ✅ **PWA Support** - Installable on mobile devices
- ✅ **Room Code System** - Easy joining via 6-character codes
- ✅ **Mobile Optimized** - Touch-friendly UI
- ✅ **Dark Theme** - Eye-friendly blood red accents

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, JavaScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Real-time**: Supabase Subscriptions
- **Styling**: Tailwind CSS
- **PWA**: Service Worker + Manifest

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Supabase account)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd BOCT
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create `.env.local` file:
```env
DATABASE_URL="postgresql://user:password@host:port/database"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

**Important**: URL-encode special characters in password:
- `$` → `%24`
- `?` → `%3F`
- `@` → `%40`

4. **Setup database**
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed characters
npm run prisma:seed
```

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 How to Play

### As Game Master

1. **Create Game**
   - Click "Buat Game Baru"
   - Enter your name
   - Share the Room Code with players

2. **Wait for Players**
   - Minimum 5 players required
   - Maximum 15 players

3. **Setup Characters**
   - Click "Mulai Setup Game"
   - Select characters (auto-calculates required distribution)
   - Click "Lanjut ke Assignment"

4. **Assign Roles**
   - Assign each character to a player
   - Click "Mulai Game"

5. **Run the Game**
   - Follow step-by-step phase guidance
   - Use "Next Step" / "Prev Step" to navigate
   - Send information to players as needed
   - Manage voting during day phases
   - Use Grimoire (📖 button) for tracking
   - View History (📜 button) for events

### As Player

1. **Join Game**
   - Click "Gabung Game"
   - Enter Room Code
   - Enter your name

2. **Wait in Lobby**
   - Wait for GM to assign roles

3. **During Game**
   - Click "👁️‍🗨️ Lihat Peran" to see your role
   - Read information from Storyteller
   - Vote during day phase
   - Follow phase indicators

## 📖 Game Script: Trouble Brewing

This app includes the complete **Trouble Brewing** script with 22 characters:

### Townsfolk (13)
Washerwoman, Librarian, Investigator, Chef, Empath, Fortune Teller, Undertaker, Monk, Ravenkeeper, Virgin, Slayer, Soldier, Mayor

### Outsiders (4)
Butler, Drunk, Recluse, Saint

### Minions (4)
Poisoner, Spy, Scarlet Woman, Baron

### Demons (1)
Imp

## 🔧 Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Prisma
npm run prisma:generate   # Generate Prisma Client
npm run prisma:migrate    # Run migrations
npm run prisma:seed       # Seed database
npx prisma studio         # Open Prisma Studio
```

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Open the app
2. Click install icon in address bar
3. Click "Install"

### Mobile (iOS Safari)
1. Open the app
2. Tap Share button
3. Tap "Add to Home Screen"

### Mobile (Android Chrome)
1. Open the app
2. Tap menu (3 dots)
3. Tap "Add to Home Screen"

## 🗂️ Project Structure

```
BOCT/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js            # Character seeding
├── public/
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service worker
├── src/
│   ├── app/               # Next.js pages & API routes
│   │   ├── api/           # Backend APIs
│   │   ├── gm/            # GM routes
│   │   └── player/        # Player routes
│   ├── components/        # React components
│   │   ├── gm/            # GM components
│   │   ├── player/        # Player components
│   │   └── shared/        # Shared components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities & configs
│   └── data/              # Static data
└── README.md
```

## 🐛 Troubleshooting

### Database Connection Failed
- Check DATABASE_URL encoding
- Ensure special characters are URL-encoded
- Verify database is running

### Real-time Not Working
- Check NEXT_PUBLIC_SUPABASE_URL
- Verify NEXT_PUBLIC_SUPABASE_ANON_KEY
- Enable Real-time in Supabase dashboard

### PWA Not Installing
- Use HTTPS in production
- Check manifest.json is accessible
- Verify service worker is registered

## 📝 License

This project is for educational purposes. Blood on the Clocktower is a trademark of The Pandemonium Institute.

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 🙏 Credits

- **Game Design**: The Pandemonium Institute
- **Development**: [Your Name]
- **Tech Stack**: Next.js, Supabase, Prisma, Tailwind CSS

---

**Made with ❤️ for the Blood on the Clocktower community**
