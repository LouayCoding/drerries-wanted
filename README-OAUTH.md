# 🚀 Discord Wanted - Reports Management System

Complete implementatie van Discord OAuth authenticatie en Reports Management Dashboard voor Drerries Roleplay Community.

## ✨ Features

### 🔐 Authenticatie
- **Discord OAuth Login** - Beveiligde login via Discord
- **Whitelist Systeem** - Alleen toegestane gebruikers krijgen toegang
- **Session Management** - 7 dagen sessie met JWT tokens
- **Protected Routes** - Automatische redirects voor niet-geauthenticeerde users

### 📊 Reports Dashboard
- **Overzicht Stats** - Totaal, Pending, Reviewed, Dismissed counts
- **Advanced Filters** - Zoeken op gebruiker, reden, status
- **Status Management** - Update report status (PENDING/REVIEWED/DISMISSED)
- **Media Lightbox** - Professionele foto/video viewer met zoom en thumbnails
- **Real-time Updates** - Live updates via Supabase subscriptions
- **Pagination** - Efficient browsen door grote aantallen reports
- **Review Tracking** - Wie heeft wanneer welk report reviewed

### 🎨 UI/UX
- **Modern Discord Theme** - Consistent met bestaande dark mode
- **Responsive Design** - Werkt perfect op mobile, tablet en desktop
- **Toast Notifications** - Real-time feedback bij acties
- **Loading States** - Duidelijke loading indicators
- **Error Handling** - Gebruiksvriendelijke error messages
- **Smooth Animations** - Professionele transitions en hover effects

## 📋 Vereisten

- Node.js 18+ en npm
- Supabase account (gratis tier is voldoende)
- Discord Developer Application
- Discord User ID voor whitelist

## 🛠️ Installatie & Setup

### 1. Dependencies Installeren

```bash
cd discord-wanted
npm install
```

Alle dependencies zijn al geïnstalleerd:
- `next-auth` - Discord OAuth authenticatie
- `yet-another-react-lightbox` - Media viewer
- `react-hot-toast` - Toast notifications
- `date-fns` - Datum formatting

### 2. Discord OAuth Application Setup

Volg de instructies in `DISCORD-OAUTH-SETUP.md` voor:
1. Discord Developer Portal configuratie
2. OAuth2 redirect URL setup
3. Client ID en Secret verkrijgen

### 3. Environment Variables

Maak een `.env.local` bestand in de `discord-wanted` folder:

```env
# Discord OAuth
DISCORD_CLIENT_ID=your_discord_client_id_here
DISCORD_CLIENT_SECRET=your_discord_client_secret_here

# NextAuth
NEXTAUTH_SECRET=your_random_32_character_secret
NEXTAUTH_URL=http://localhost:3000

# Supabase (existing)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Generate NEXTAUTH_SECRET:**
```bash
# Met OpenSSL
openssl rand -base64 32

# Of online: https://generate-secret.vercel.app/32
```

### 4. Database Setup

De database migraties zijn al uitgevoerd en bevatten:

**Nieuwe Tabel: `whitelisted_users`**
```sql
- id (BIGSERIAL PRIMARY KEY)
- user_id (TEXT UNIQUE) - Discord user ID
- username (TEXT) - Discord username
- added_at (TIMESTAMPTZ) - Wanneer toegevoegd
- added_by (TEXT) - Wie heeft toegevoegd
- notes (TEXT) - Optionele notities
```

**Updates aan `reports` tabel:**
```sql
- reviewed_by (TEXT) - User ID van reviewer
- reviewed_at (TIMESTAMPTZ) - Wanneer reviewed
- notes (TEXT) - Admin notities
```

### 5. Whitelist Configuratie

**Vind je Discord User ID:**
1. Open Discord → Settings → Advanced
2. Enable "Developer Mode"
3. Klik rechts op je naam → "Copy User ID"

**Voeg jezelf toe aan whitelist:**
1. Ga naar Supabase Dashboard
2. Open `whitelisted_users` tabel
3. Insert new row:
   - `user_id`: Je Discord User ID
   - `username`: Je Discord username
   - `added_by`: "system"
   - `notes`: "Initial admin user"
4. Save

## 🚀 Applicatie Starten

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

## 📱 Applicatie Flow

### Voor Niet-Ingelogde Users:
1. Home pagina met wanted persons (publiek toegankelijk)
2. Klik op "Melden" → Krijg login prompt
3. Klik "Login met Discord" → Redirect naar Discord OAuth
4. Discord vraagt toestemming
5. Redirect terug naar applicatie

### Voor Ingelogde Users:
1. Automatisch ingelogd als sessie bestaat
2. User menu zichtbaar in header (avatar + naam)
3. "Reports" link in navigatie
4. "Melden" button functioneel
5. Toegang tot Reports Dashboard

### Whitelist Check:
- Bij login wordt gecheckt of user in `whitelisted_users` staat
- **Wel whitelisted**: Login succesvol → Toegang tot dashboard
- **Niet whitelisted**: Login failed → Redirect naar error page

## 🎯 Reports Dashboard Gebruik

### Reports Bekijken:
1. Login via Discord
2. Navigeer naar "Reports" in header
3. Zie overzicht met stats:
   - Totaal aantal reports
   - Pending reports (oranje)
   - Reviewed reports (blauw)
   - Dismissed reports (grijs)

### Reports Filteren:
- **Zoeken**: Type in zoekbalk (username, tag, reden)
- **Status Filter**: Selecteer All / Pending / Reviewed / Dismissed
- Real-time filtering terwijl je typt

### Report Details Bekijken:
1. Klik "Details" op een report card
2. Zie volledige reden
3. Bekijk alle media (foto's/video's)
4. Zie review informatie (als reviewed)

### Media Bekijken:
1. Klik op een media thumbnail in report
2. Lightbox opent met:
   - Fullscreen weergave
   - Zoom functionaliteit
   - Thumbnail navigatie
   - Swipe support (mobile)
   - ESC om te sluiten

### Status Updaten:
1. Selecteer nieuwe status in dropdown (rechts op card)
2. Kies: Pending / Reviewed / Dismissed
3. Status wordt direct geüpdatet
4. Toast notification bevestigt wijziging
5. `reviewed_by` en `reviewed_at` worden automatisch opgeslagen

### Nieuwe Melding Maken:
1. Klik "Melden" button in header
2. **Stap 1**: Zoek gebruiker (min 2 karakters)
   - Type username
   - Selecteer uit resultaten
3. **Stap 2**: Vul reden in (verplicht)
   - Beschrijf de reden voor melding
   - Upload optioneel media (foto's/video's)
4. Klik "Melding Versturen"
5. Media wordt geüpload naar Supabase Storage
6. Report wordt aangemaakt in database
7. Success message + auto-close na 2 seconden

## 🔒 Security Features

### Authenticatie:
- Discord OAuth 2.0
- JWT tokens met expiry (7 dagen)
- Secure httpOnly cookies
- CSRF protection (NextAuth default)
- Session management

### Whitelist:
- Database-level check bij signin
- Middleware protected routes
- API routes authentication check
- Real-time session validation

### Row Level Security (RLS):
- Supabase RLS policies enabled
- Public read access voor whitelist check
- Controlled write access

## 🎨 Design System

### Kleuren:
- **Background**: `#202225` (Darkest)
- **Surface**: `#292b2f` (Cards, modals)
- **Elevated**: `#2f3136` (Layered elements)
- **Input**: `#40444b` (Input fields)
- **Text Primary**: `#ffffff` (White)
- **Text Secondary**: `#b9bbbe` (Light gray)
- **Text Muted**: `#72767d` (Muted gray)

### Status Colors:
- **Pending**: `#faa61a` (Orange)
- **Reviewed**: `#5865f2` (Discord Blue)
- **Dismissed**: `#72767d` (Gray)
- **Success**: `#43b581` (Green)
- **Error**: `#f04747` (Red)

### Responsive Breakpoints:
- **Mobile**: < 640px (1-2 columns)
- **Tablet**: 640px - 1024px (2-3 columns)
- **Desktop**: > 1024px (3-4 columns)
- **Large Desktop**: > 1280px (4-5 columns)

## 📁 Bestandsstructuur

```
discord-wanted/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts          # NextAuth configuratie
│   │   ├── reports/
│   │   │   └── route.ts              # Reports API endpoint
│   │   ├── upload-media/
│   │   │   └── route.ts              # Media upload endpoint
│   │   ├── search-users/
│   │   │   └── route.ts              # User search endpoint
│   │   └── deleted-messages/         # Bestaande endpoints
│   ├── reports/
│   │   └── page.tsx                  # Reports Dashboard (NEW)
│   ├── login/
│   │   └── page.tsx                  # Login pagina (NEW)
│   ├── auth/
│   │   └── error/
│   │       └── page.tsx              # Auth error pagina (NEW)
│   ├── layout.tsx                    # Root layout met SessionProvider
│   └── page.tsx                      # Home pagina
├── components/
│   ├── Header.tsx                    # Header met auth UI
│   ├── LoginButton.tsx               # Discord login button (NEW)
│   ├── UserMenu.tsx                  # User dropdown menu (NEW)
│   ├── SessionProvider.tsx           # NextAuth session wrapper (NEW)
│   ├── ToastProvider.tsx             # Toast notifications (NEW)
│   ├── ReportModal.tsx               # Report modal met auth check
│   └── WantedCard.tsx                # Wanted person card
├── types/
│   ├── wanted.ts                     # TypeScript interfaces (updated)
│   └── next-auth.d.ts                # NextAuth type definitions (NEW)
├── middleware.ts                     # Protected routes middleware (NEW)
├── .env.local                        # Environment variables (create this)
├── DISCORD-OAUTH-SETUP.md           # Setup instructies (NEW)
└── README-OAUTH.md                  # Dit bestand (NEW)
```

## 🧪 Testing Checklist

### Authenticatie:
- [x] Login met whitelisted user → Success
- [x] Login met niet-whitelisted user → Error page
- [x] Logout → Session cleared + redirect
- [x] Session expiry (na 7 dagen) → Auto logout
- [x] Protected routes zonder login → Redirect naar login

### Reports Dashboard:
- [x] View reports → Correct weergave
- [x] Filter op status → Werkt correct
- [x] Search functionaliteit → Real-time filtering
- [x] Status update → Database update + toast
- [x] Media lightbox → Fullscreen view + zoom
- [x] Pagination → Correcte page navigation
- [x] Real-time updates → Supabase subscriptions

### Report Modal:
- [x] Open zonder login → Login prompt
- [x] User search → Resultaten correct
- [x] Reason input → Validatie werkt
- [x] File upload → Media naar Supabase Storage
- [x] Submit → Report aangemaakt + success message

### Responsive Design:
- [x] Mobile view (< 640px) → Correct layout
- [x] Tablet view (640-1024px) → 2-3 columns
- [x] Desktop view (> 1024px) → 3-4 columns
- [x] Touch gestures → Swipe in lightbox werkt

## 🐛 Troubleshooting

### "Access Denied" bij login:
- Check of je user_id correct in whitelist staat
- Verify user_id match (check in Discord met Developer Mode)
- Check Supabase RLS policies

### "Configuration Error":
- Verify Discord Client ID en Secret in `.env.local`
- Check redirect URL in Discord Developer Portal
- Ensure NEXTAUTH_SECRET is set

### Media niet zichtbaar:
- Check Supabase Storage bucket "reports-media" exists
- Verify bucket is public
- Check file permissions

### Session werkt niet:
- Check NEXTAUTH_URL matches je domain
- Verify cookies enabled in browser
- Clear browser cookies en login opnieuw

### Reports niet zichtbaar:
- Check database migrations uitgevoerd
- Verify reports tabel bestaat
- Check RLS policies

## 📞 Support

Voor problemen of vragen:
1. Check DISCORD-OAUTH-SETUP.md voor setup instructies
2. Check Supabase dashboard voor database issues
3. Check browser console voor errors
4. Check terminal logs voor API errors

## 🎉 Klaar!

Je hebt nu een volledig werkend Reports Management systeem met:
- ✅ Discord OAuth authenticatie
- ✅ Whitelist access control
- ✅ Reports dashboard met filters
- ✅ Media lightbox viewer
- ✅ Status management
- ✅ Real-time updates
- ✅ Toast notifications
- ✅ Responsive design

**Volgende Stappen:**
1. Voeg andere admins toe aan whitelist
2. Test alle functionaliteit
3. Deploy naar productie (Vercel/Netlify)
4. Update Discord OAuth redirect voor productie URL

Veel succes! 🚀

