# Discord Wanted - Nederlandse Handleiding

## 🚀 Snel Starten

### Stap 1: Installeer Dependencies

Open een terminal in de `discord-wanted` map en voer uit:

```bash
npm install
```

Of dubbelklik op `install.bat` (Windows)

### Stap 2: Start de Development Server

```bash
npm run dev
```

Of dubbelklik op `start.bat` (Windows)

De website is beschikbaar op: **http://localhost:3000**

## 📋 Wat Heb Je Gemaakt?

Een professionele Next.js website vergelijkbaar met Interpol's gezochte personen pagina, maar dan voor Discord roleplay communities!

### Hoofdpagina
- **Hero sectie** met statistieken dashboard
- **Filter balk** om te zoeken en filteren
- **Grid met kaarten** van gezochte personen
- **Volledig responsive** design

### Detail Pagina's
- Volledig profiel van gezochte persoon
- Lijst met aanklachten
- Bewijs sectie
- Bekende aliassen
- Waarschuwingsbanner
- Rapporteer knop

## 🎨 Design Kenmerken

- **Moderne Dark Theme** - Professioneel en strak
- **Gradient Effecten** - Paars naar blauw
- **Smooth Animaties** - Hover effecten en transities
- **Google Font Inter** - Schoon en leesbaar
- **Tailwind CSS** - Voor alle styling
- **TypeScript** - Voor type veiligheid

## 📊 Voorbeeld Data

Het project bevat 6 voorbeeld "gezochte personen":

1. **ShadowReaper** - Kritiek (Server raids, phishing)
2. **ToxicTroll** - Hoog (Harassment, ban evasion)
3. **ScammerPro** - Hoog (Scamming, fake giveaways)
4. **RuleBreaker** - Gemiddeld, Gevangen (NSFW content)
5. **MetaGamer** - Gemiddeld (Metagaming)
6. **BotSpammer** - Laag (Bot spam)

## ✏️ Aanpassen

### Nieuwe Personen Toevoegen

Bewerk `data/wantedPersons.ts` en voeg nieuwe entries toe:

```typescript
{
  id: '7',
  discordTag: 'Gebruiker#1234',
  username: 'Gebruiker',
  avatar: 'https://...',
  status: 'ACTIVE',
  severity: 'HIGH',
  charges: ['Aanklacht 1', 'Aanklacht 2'],
  description: 'Beschrijving...',
  lastSeen: 'Locatie - Tijd',
  reward: '10,000 Credits',
  dateIssued: '2025-01-09',
  evidence: ['Bewijs 1', 'Bewijs 2'],
  aliases: ['Alias1', 'Alias2']
}
```

### Kleuren Aanpassen

Bewerk `tailwind.config.ts` en component bestanden.

### Header Aanpassen

Bewerk `components/Header.tsx` voor logo en navigatie.

## 🎯 Kleurcodering

### Status
- **ACTIVE** (Actief) - Rood thema
- **CAPTURED** (Gevangen) - Groen thema
- **CLEARED** (Vrijgesproken) - Grijs thema

### Dreigingsniveau
- **LOW** (Laag) - Blauw
- **MEDIUM** (Gemiddeld) - Geel
- **HIGH** (Hoog) - Oranje
- **CRITICAL** (Kritiek) - Rood

## 📱 Responsive

- **Desktop**: 3 kolommen grid
- **Tablet**: 2 kolommen grid
- **Mobiel**: 1 kolom

## 🔧 Technische Details

- **Framework**: Next.js 14 (App Router)
- **Taal**: TypeScript
- **Styling**: Tailwind CSS
- **Font**: Inter (Google Fonts)

## 📦 Productie Build

```bash
npm run build
npm start
```

## 🌐 Deployment

Deploy naar:
- **Vercel** (aanbevolen)
- **Netlify**
- **Railway**

### Vercel Deployment

1. Push code naar GitHub
2. Importeer project in Vercel
3. Deploy met één klik

## 💡 Tips

- Gebruik de filter balk om snel te zoeken
- Klik op een kaart voor volledige details
- Pas de sample data aan naar jouw roleplay community
- Voeg eigen afbeeldingen toe voor avatars
- Wijzig de kleuren naar jouw voorkeur

## 🎭 Voor Roleplay

Deze website is perfect voor:
- Discord roleplay servers
- Gaming communities
- Fictieve "wanted" databases
- Community management
- Roleplay events

## ❓ Problemen?

### Node.js Versie
Zorg dat je Node.js 18+ hebt:
```bash
node --version
```

### Port Bezet
Next.js gebruikt automatisch de volgende beschikbare port als 3000 bezet is.

### TypeScript Errors
Run de type checker:
```bash
npm run build
```

## 📚 Meer Info

Bekijk ook:
- `README.md` - Volledige documentatie (Engels)
- `SETUP.md` - Setup instructies (Engels)
- `FEATURES.md` - Feature overzicht (Engels)

---

Veel plezier met je Discord Wanted roleplay database! 🎮✨
