# Discord Wanted - Features Overview

## 🎨 Design Philosophy

The website features a modern, dark theme inspired by Interpol's wanted persons database, but tailored for Discord roleplay communities. The design emphasizes:

- **Soft, Professional UI** - Clean gradients and smooth transitions
- **High Contrast** - Easy to read with dark backgrounds and bright accents
- **Visual Hierarchy** - Important information stands out
- **Responsive Layout** - Perfect on desktop, tablet, and mobile

## 🏠 Home Page Features

### Hero Section
- **Large Title** with gradient text effect (purple to blue)
- **Alert Badge** showing "Community Alert System"
- **Description** explaining the purpose
- **Statistics Dashboard** with 4 key metrics:
  - Total Cases
  - Active Cases
  - Captured Cases
  - Critical Threat Level Cases

### Filter Bar
- **Search Input** - Search by username or Discord tag
- **Status Filter** - Filter by Active, Captured, or Cleared
- **Threat Level Filter** - Filter by Low, Medium, High, or Critical

### Wanted Person Cards
Each card displays:
- **Avatar Placeholder** - Circular gradient with first letter
- **Status Badge** - Color-coded (Red=Active, Green=Captured, Gray=Cleared)
- **Username & Discord Tag**
- **Threat Level Badge** - Color-coded severity indicator
- **Top 3 Charges** - With "+X more" if applicable
- **Description Preview** - First 2 lines
- **Reward Amount** - In green text
- **Issue Date**
- **View Details Button** - Gradient purple to blue

### Card Hover Effects
- Slight lift animation (-translate-y)
- Border color change
- Purple glow shadow
- Button shadow enhancement

## 📄 Detail Page Features

### Left Column - Profile Card (Sticky)
- **Large Avatar** - 160px circular gradient
- **Status Badge** - Top right corner
- **Username** - Large, bold text
- **Discord Tag** - Monospace font
- **Threat Level Badge** - Centered, prominent
- **Key Information**:
  - Reward (green text)
  - Date Issued
  - Last Seen Location
- **Report Sighting Button** - Red gradient with warning emoji

### Right Column - Detailed Information

#### Charges Section
- Grid layout (2 columns on desktop)
- Each charge in a red-bordered box
- Red dot indicator
- Warning icon in header

#### Description Section
- Full detailed description
- Document icon in header
- Easy-to-read paragraph format

#### Known Aliases Section (if applicable)
- Purple-themed boxes
- Monospace font for usernames
- User icon in header

#### Evidence Section (if applicable)
- Bulleted list with checkmark icons
- Yellow theme
- Document icon in header

#### Warning Banner
- Red/orange gradient background
- Warning icon
- Important safety information
- Prominent placement at bottom

## 🎯 Color Coding System

### Status Colors
- **Active**: Red theme (danger, urgent)
- **Captured**: Green theme (success, resolved)
- **Cleared**: Gray theme (neutral, inactive)

### Severity/Threat Levels
- **Low**: Blue theme (calm, minor)
- **Medium**: Yellow theme (caution, moderate)
- **High**: Orange theme (warning, serious)
- **Critical**: Red theme (danger, severe)

## 📱 Responsive Design

### Desktop (1024px+)
- 3-column grid for cards
- Side-by-side layout for detail page
- Full navigation visible

### Tablet (768px - 1023px)
- 2-column grid for cards
- Stacked layout for detail page
- Full navigation visible

### Mobile (< 768px)
- Single column for cards
- Stacked layout for detail page
- Hamburger menu for navigation

## ✨ Interactive Elements

### Animations
- Smooth hover transitions (300ms)
- Card lift on hover
- Button color transitions
- Shadow effects on hover

### Navigation
- Sticky header with backdrop blur
- Smooth scrolling
- Active state indicators

### Filtering
- Real-time search results
- Instant filter updates
- Result count display
- "No results" state with icon

## 🔧 Technical Features

### Performance
- Server-side rendering with Next.js
- Optimized images
- Minimal JavaScript bundle
- Fast page loads

### SEO
- Proper meta tags
- Semantic HTML
- Descriptive titles
- Open Graph support

### Accessibility
- Proper heading hierarchy
- Alt text for icons
- Keyboard navigation support
- High contrast ratios

## 📊 Sample Data Included

The project includes 6 sample wanted persons:

1. **ShadowReaper** - Critical threat (Server raiding, phishing)
2. **ToxicTroll** - High threat (Harassment, ban evasion)
3. **ScammerPro** - High threat (Scamming, fake giveaways)
4. **RuleBreaker** - Medium threat, Captured (NSFW content)
5. **MetaGamer** - Medium threat (Metagaming, powergaming)
6. **BotSpammer** - Low threat (Bot command spam)

Each has complete information including charges, descriptions, evidence, and aliases.

## 🚀 Future Enhancement Ideas

- User authentication for reporting
- Admin panel for managing entries
- Image upload for avatars
- Export to PDF functionality
- Email notifications
- Discord bot integration
- Vote/rating system
- Comments section
- Search history
- Bookmark favorites

---

This website provides everything needed for a professional Discord roleplay wanted persons database!
