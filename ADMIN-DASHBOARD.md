# Admin Dashboard - Complete Implementatie

## Overzicht
Volledige CRUD (Create, Read, Update, Delete) functionaliteit is toegevoegd aan de Drerries Wanted applicatie. Admins kunnen nu via een webinterface wanted persons beheren, terwijl de publieke detailpagina read-only blijft.

---

## Nieuwe Features

### 1. Database Schema Updates
- **Media Velden**: `media_urls` en `media_types` toegevoegd aan `wanted_persons` tabel
- **Storage Bucket**: `wanted-media` bucket aangemaakt voor afbeeldingen en video's
- **Indices**: GIN index op `media_urls` voor snelle queries

### 2. API Routes

#### `/api/wanted`
- **GET**: Fetch alle persons of een specifieke persoon (via `?id=`)
- **POST**: Maak nieuwe wanted person aan (admin only)
- **PUT**: Update bestaande person (admin only)
- **DELETE**: Verwijder person (admin only)

#### `/api/wanted/upload-media`
- **POST**: Upload media bestanden (images/videos, max 50MB)
- **DELETE**: Verwijder media bestand uit storage (admin only)
- **Validatie**: Type checking, grootte validatie, format validatie

### 3. Admin Components

#### `AdminControls.tsx`
- Wrapper component die content alleen toont voor ingelogde admins
- Session check voor authenticatie

#### `CardDropdownMenu.tsx`
- 3-dot menu op wanted cards
- Edit en Delete opties
- Buiten-klik detectie om menu te sluiten

#### `DeleteConfirmModal.tsx`
- Bevestigingsmodal met person preview
- Statistieken tonen (aantal aanklachten, bewijs items)
- Waarschuwingsbericht voor onomkeerbare actie

#### `MediaUploader.tsx`
- Drag & drop interface voor media uploads
- Ondersteuning voor meerdere bestanden tegelijk
- Live preview van geselecteerde media
- Upload progress indicator
- Type badges (image/video)

#### `MediaLightbox.tsx`
- Volledig scherm media viewer
- Keyboard navigatie (← → Escape)
- Thumbnail strip voor snelle navigatie
- Download functionaliteit
- Video autoplay support

### 4. Admin Pagina's

#### `/admin/add`
- Formulier voor nieuwe wanted person
- Real-time validatie
- Dynamische velden voor charges, evidence, aliases
- Avatar URL preview
- Media upload integratie
- Character count voor beschrijving (500 max)

#### `/admin/edit/[id]`
- Pre-filled formulier met bestaande gegevens
- Dezelfde functionaliteit als add page
- Bestaande media behouden en nieuwe toevoegen

### 5. Updates aan Bestaande Components

#### `WantedCard.tsx`
- Admin dropdown menu toegevoegd (top-right)
- Delete confirmation flow
- Router refresh na delete

#### `Header.tsx`
- "Toevoegen" button voor admins
- Dynamische navigatie op basis van auth status

#### `app/page.tsx`
- Floating Action Button (FAB) voor quick add
- Real-time updates via Supabase subscriptions
- Admin controls wrapping

#### `app/wanted/[id]/page.tsx`
- Media gallery sectie
- Grid layout voor media items
- Lightbox integratie
- Type badges voor media
- Hover effects met zoom icon

### 6. Type Definities

#### Updated `WantedPerson` interface
```typescript
export interface WantedPerson {
  // ... bestaande velden ...
  mediaUrls?: string[];
  mediaTypes?: ('image' | 'video')[];
}
```

---

## UX Hierarchy (Detail Page)

De detail pagina volgt een duidelijke visuele hiërarchie:

1. **Hero Sectie** (Avatar + Basis Info)
   - Grote avatar (links)
   - Naam, tag, status
   - Dreiging indicator

2. **Primaire Informatie**
   - Beschrijving
   - Laatste locatie
   - Beloning
   - Datum uitgegeven

3. **Aanklachten**
   - Duidelijke lijst met iconen
   - Rode accent kleur

4. **Aliassen** (indien aanwezig)
   - Badge display
   - Discord tag styling

5. **Bewijs Tekst** (indien aanwezig)
   - Check icons
   - Lijst format

6. **Media Gallery** ⭐ NIEUW
   - Grid layout (2-4 kolommen responsive)
   - Type badges (Foto/Video)
   - Hover zoom effect
   - Click to view full screen
   - Lightbox met navigatie

7. **Waarschuwing Banner**
   - Rode accent
   - Community veiligheidsinformatie

---

## Security

### Authentication
- NextAuth.js met Discord OAuth
- JWT session strategy
- Whitelist systeem (environment variable)

### API Protection
- Alle mutatie endpoints checken `getServerSession()`
- 401 Unauthorized voor niet-geauthenticeerde verzoeken
- Middleware beschermt `/admin/*` routes

### Middleware Configuration
```typescript
export const config = {
  matcher: [
    "/reports/:path*",
    "/admin/:path*",
  ],
};
```

---

## File Structure

```
discord-wanted/
├── app/
│   ├── admin/
│   │   ├── add/
│   │   │   └── page.tsx          # Nieuwe person toevoegen
│   │   └── edit/
│   │       └── [id]/
│   │           └── page.tsx       # Bestaande person bewerken
│   ├── api/
│   │   └── wanted/
│   │       ├── route.ts           # CRUD API
│   │       └── upload-media/
│   │           └── route.ts       # Media upload API
│   ├── wanted/
│   │   └── [id]/
│   │       └── page.tsx           # Detail page met media gallery
│   └── page.tsx                   # Home met FAB
├── components/
│   ├── AdminControls.tsx          # Auth wrapper
│   ├── CardDropdownMenu.tsx       # Card options menu
│   ├── DeleteConfirmModal.tsx     # Delete confirmation
│   ├── MediaUploader.tsx          # Upload interface
│   ├── MediaLightbox.tsx          # Full screen viewer
│   ├── Header.tsx                 # Updated met admin button
│   └── WantedCard.tsx             # Updated met dropdown
└── types/
    └── wanted.ts                  # Updated interfaces
```

---

## Deployment Checklist

### Environment Variables
Zorg dat deze aanwezig zijn in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `WHITELIST_USER_IDS`

### Supabase Setup
1. ✅ Database migratie uitgevoerd (media fields)
2. ✅ Storage bucket `wanted-media` aangemaakt
3. ✅ Bucket is publiek (voor read access)
4. ✅ RLS policies geconfigureerd (indien nodig)

### Build & Deploy
```bash
# Lokaal testen
npm run build

# Deploy naar Vercel
vercel --prod --yes
```

---

## Gebruikshandleiding (Admin)

### Nieuwe Person Toevoegen
1. Klik op "Toevoegen" in header OF op FAB (floating button rechtsonder)
2. Vul verplichte velden in: Username, Discord Tag, Aanklachten
3. Upload optioneel media bestanden (drag & drop)
4. Klik "Persoon Toevoegen"

### Person Bewerken
1. Ga naar home page
2. Klik op 3-dot menu op wanted card
3. Selecteer "Bewerken"
4. Pas velden aan
5. Klik "Wijzigingen Opslaan"

### Person Verwijderen
1. Klik op 3-dot menu op wanted card
2. Selecteer "Verwijderen"
3. Bevestig in modal
4. Person wordt permanent verwijderd

### Media Bekijken (Publiek)
1. Open detail pagina van wanted person
2. Scroll naar "Bewijs Materiaal" sectie
3. Klik op een foto of video
4. Gebruik ← → toetsen om te navigeren
5. Druk Escape om te sluiten

---

## Technical Details

### Media Upload Flow
1. User selecteert bestanden via drag & drop of file picker
2. Client-side validatie (type, grootte, format)
3. Preview wordt getoond met "Te uploaden" badge
4. Bij form submit: bestanden worden naar `/api/wanted/upload-media` gestuurd
5. Server valideert nogmaals en upload naar Supabase Storage
6. Public URLs worden teruggegeven
7. URLs + types worden opgeslagen in `wanted_persons` tabel

### Real-time Updates
- Supabase Realtime subscriptions op `wanted_persons` tabel
- Automatische re-fetch bij INSERT, UPDATE, DELETE events
- `router.refresh()` na delete voor instant UI update

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Grid layouts passen aan: 2 → 3 → 4 → 5 kolommen
- Lightbox thumbnails scrollen horizontaal op mobile

---

## Performance Optimizations

1. **Lazy Loading**: Media items laden alleen wanneer zichtbaar
2. **Video Preload**: `preload="metadata"` voor snellere thumbnails
3. **Image Optimization**: Next.js Image component waar mogelijk
4. **Supabase Indices**: GIN index op `media_urls` array
5. **Client Caching**: Supabase client reused via singleton pattern

---

## Accessibility

- Keyboard navigatie in lightbox (← → Escape)
- ARIA labels op interactive elements
- Focus states op alle buttons
- Screen reader vriendelijke alt texts
- Contrast ratio voldoet aan WCAG 2.1 AA

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

---

## Known Limitations

1. Video formats beperkt tot MP4, WEBM, MOV
2. Max file size: 50MB per bestand
3. Geen batch delete (alleen 1 tegelijk)
4. Mobile lightbox geen pinch-to-zoom (gebruik native zoom)

---

## Future Enhancements

- [ ] Bulk operations (multi-select delete)
- [ ] Image cropping/editing in uploader
- [ ] Video thumbnail generator
- [ ] Activity log (wie heeft wat aangepast)
- [ ] Advanced search filters
- [ ] Export to PDF functie
- [ ] Drag & drop reordering van media
- [ ] Progressive image loading (blur-up)

---

## Changelog

### Version 2.0.0 (2026-01-11)
- ✅ Admin Dashboard volledig geïmplementeerd
- ✅ CRUD operaties voor wanted persons
- ✅ Media upload & gallery systeem
- ✅ Lightbox voor full screen viewing
- ✅ Delete confirmation modal
- ✅ Responsive admin forms
- ✅ Real-time updates
- ✅ Security via NextAuth middleware

---

**Status**: ✅ Production Ready
**Laatste Update**: 11 Januari 2026
**Auteur**: AI Assistant via Cursor IDE



