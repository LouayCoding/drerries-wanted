# Setup Instructions for Discord Wanted

## Quick Start Guide

### Step 1: Install Dependencies

Open a terminal/command prompt in the `discord-wanted` folder and run:

```bash
npm install
```

This will install all required dependencies including:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- And other necessary packages

### Step 2: Start Development Server

After installation completes, run:

```bash
npm run dev
```

The website will be available at: **http://localhost:3000**

### Alternative: Using Batch Files (Windows)

1. Double-click `install.bat` to install dependencies
2. Double-click `start.bat` to start the development server

## What You'll See

### Home Page (http://localhost:3000)
- Hero section with statistics dashboard
- Filter bar to search and filter wanted persons
- Grid of wanted person cards
- Responsive design that works on all devices

### Detail Pages (http://localhost:3000/wanted/[id])
- Full profile of wanted person
- Complete list of charges
- Evidence section
- Known aliases
- Warning banner
- Report sighting button

## Project Features

✅ **6 Sample Wanted Persons** with different threat levels
✅ **Advanced Filtering** by status, severity, and search
✅ **Beautiful UI** with gradients, animations, and hover effects
✅ **Fully Responsive** design
✅ **TypeScript** for type safety
✅ **Tailwind CSS** for styling
✅ **Inter Font** from Google Fonts

## Customization

### Adding New Wanted Persons

Edit `data/wantedPersons.ts` and add new entries to the array.

### Changing Colors

Modify `tailwind.config.ts` and component files to change the color scheme.

### Updating Content

- **Header**: Edit `components/Header.tsx`
- **Cards**: Edit `components/WantedCard.tsx`
- **Filters**: Edit `components/FilterBar.tsx`

## Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, Next.js will automatically use the next available port (3001, 3002, etc.)

### Dependencies Not Installing
Make sure you have Node.js 18 or higher installed. Check with:
```bash
node --version
```

### TypeScript Errors
Run the type checker:
```bash
npm run build
```

## Need Help?

Check the main README.md file for more detailed information about the project structure and features.

---

Enjoy your Discord Wanted roleplay database! 🎭
