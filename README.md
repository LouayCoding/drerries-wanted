# Discord Wanted - Roleplay Database

A modern Next.js website inspired by Interpol's wanted persons page, designed for Discord roleplay communities. Features a clean, professional UI built with Tailwind CSS.

## Features

- 🎨 **Modern UI Design** - Clean, soft interface with gradient effects and smooth animations
- 🔍 **Advanced Filtering** - Filter by status, threat level, and search by username
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile devices
- ⚡ **Fast Performance** - Built with Next.js 14 and optimized for speed
- 🎭 **Roleplay Focused** - Designed specifically for Discord roleplay communities
- 📊 **Statistics Dashboard** - Real-time stats showing total cases, active, captured, and critical threats
- 🔗 **Deep Linking** - Direct links to individual wanted person profiles

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Font**: Inter (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd discord-wanted
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:3000
```

## Project Structure

```
discord-wanted/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page with wanted persons grid
│   ├── globals.css         # Global styles and Tailwind imports
│   └── wanted/
│       └── [id]/
│           └── page.tsx    # Individual wanted person detail page
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── WantedCard.tsx      # Card component for wanted persons
│   └── FilterBar.tsx       # Filter and search component
├── data/
│   └── wantedPersons.ts    # Sample data for wanted persons
├── types/
│   └── wanted.ts           # TypeScript interfaces
└── public/                 # Static assets
```

## Customization

### Adding New Wanted Persons

Edit `data/wantedPersons.ts` and add new entries following this structure:

```typescript
{
  id: 'unique-id',
  discordTag: 'Username#1234',
  username: 'Username',
  avatar: 'image-url',
  status: 'ACTIVE' | 'CAPTURED' | 'CLEARED',
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
  charges: ['Charge 1', 'Charge 2'],
  description: 'Detailed description...',
  lastSeen: 'Location - Time',
  reward: 'Reward amount',
  dateIssued: '2025-01-01',
  evidence: ['Evidence 1', 'Evidence 2'],
  aliases: ['Alias1', 'Alias2']
}
```

### Changing Colors

The color scheme can be modified in `tailwind.config.ts` and component files. The current theme uses:
- Purple/Blue gradients for primary elements
- Red for warnings and critical items
- Soft, muted backgrounds for better readability

### Modifying the Header

Edit `components/Header.tsx` to change the logo, navigation links, or add new features.

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This project can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- Any platform supporting Node.js

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy with one click

## Features Breakdown

### Home Page
- Hero section with statistics
- Filter bar for searching and filtering
- Grid layout of wanted person cards
- Responsive design

### Detail Page
- Full profile information
- List of charges
- Evidence section
- Known aliases
- Warning banner
- Report sighting button

### Components
- **Header**: Sticky navigation with logo and links
- **WantedCard**: Preview card with hover effects
- **FilterBar**: Search and filter controls

## License

This project is for educational and entertainment purposes. All content is fictional and designed for roleplay scenarios.

## Support

For issues or questions, please open an issue on the GitHub repository.

---

Built with ❤️ for the Discord roleplay community
