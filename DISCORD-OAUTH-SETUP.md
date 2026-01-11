# Discord OAuth Setup Instructions

## Stappen om Discord OAuth Application te maken:

1. **Ga naar Discord Developer Portal:**
   https://discord.com/developers/applications

2. **Create New Application:**
   - Klik op "New Application"
   - Naam: "Drerries Wanted Reports" (of een andere naam)
   - Accept de Terms of Service
   - Klik "Create"

3. **OAuth2 Configuratie:**
   - Ga naar "OAuth2" in het linker menu
   - Scroll naar "Redirects"
   - Klik "Add Redirect"
   - Voeg toe: `http://localhost:3000/api/auth/callback/discord`
   - Klik "Save Changes"

4. **Copy Client Credentials:**
   - Blijf in OAuth2 sectie
   - Copy de "CLIENT ID"
   - Onder "CLIENT SECRET", klik "Reset Secret" (of copy bestaande)
   - **BELANGRIJK:** Copy deze secret direct, je kunt hem maar 1x zien!

5. **Vul .env.local bestand:**
   - Maak een `.env.local` bestand in de `discord-wanted` folder
   - Voeg de volgende inhoud toe (vervang met jouw credentials):

```env
# Discord OAuth
DISCORD_CLIENT_ID=jouw_client_id_hier
DISCORD_CLIENT_SECRET=jouw_client_secret_hier

# NextAuth (generate een random string)
NEXTAUTH_SECRET=genereer_met_openssl_of_random_string
NEXTAUTH_URL=http://localhost:3000

# Supabase (bestaande variabelen)
NEXT_PUBLIC_SUPABASE_URL=https://qmeizhiiznmhlzvmetkt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtZWl6aGlpem5taGx6dm1ldGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwODk5NjMsImV4cCI6MjA4MzY2NTk2M30.ktzmqQmfJZ4YJoP4k462rQ73MldLINO9yX9DB2L6W80
```

6. **Generate NEXTAUTH_SECRET:**
   
   **Optie A - Met OpenSSL (als je het hebt):**
   ```bash
   openssl rand -base64 32
   ```

   **Optie B - Online generator:**
   Ga naar: https://generate-secret.vercel.app/32
   
   **Optie C - Simpele random string:**
   Gebruik een lange random string (min 32 characters)

7. **Voeg je eigen Discord ID toe aan whitelist:**
   - Ga naar Supabase dashboard
   - Open `whitelisted_users` tabel
   - Klik "Insert row"
   - Vul in:
     - user_id: JE_DISCORD_USER_ID (hoe vind je deze? zie hieronder)
     - username: Je Discord username
     - added_by: "system"
     - notes: "Initial admin user"
   - Klik "Save"

## Hoe vind je je Discord User ID?

1. Open Discord
2. Ga naar Settings → Advanced
3. Enable "Developer Mode"
4. Klik op je profiel
5. Click rechts op je naam → "Copy User ID"

## Bestand locaties:

- `.env.local` moet in: `c:\Users\Louay\Documents\Nieuwe map\discord-wanted\.env.local`
- **BELANGRIJK:** Voeg `.env.local` toe aan `.gitignore` (zit er al in)
- Commit NOOIT je secrets naar Git!

## Na setup:

Zodra je de `.env.local` hebt aangemaakt en je Discord ID hebt toegevoegd aan de whitelist,
kan ik verder met de implementatie van NextAuth en de rest van het systeem.

Let me know when you're done! 🚀

