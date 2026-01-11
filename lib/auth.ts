import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { supabase } from "@/lib/supabase";

// Check if environment variables are set
if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET) {
  console.error('Missing Discord OAuth credentials. Please check your .env.local file.');
  console.error('DISCORD_CLIENT_ID:', process.env.DISCORD_CLIENT_ID ? 'SET' : 'MISSING');
  console.error('DISCORD_CLIENT_SECRET:', process.env.DISCORD_CLIENT_SECRET ? 'SET' : 'MISSING');
  console.error('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING');
}

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Check if user is whitelisted
      const { data: whitelisted, error } = await supabase
        .from('whitelisted_users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error || !whitelisted) {
        console.log(`Access denied for user: ${user.id} (${user.name})`);
        return false; // Deny access
      }

      console.log(`Access granted for whitelisted user: ${user.name}`);
      return true; // Allow access
    },
    async jwt({ token, user, account }) {
      // Add Discord user ID to token
      if (account && user) {
        token.discordId = user.id;
        token.username = user.name || '';
      }
      return token;
    },
    async session({ session, token }) {
      // Add Discord ID to session
      if (session.user) {
        session.user.id = token.discordId as string;
        session.user.name = (token.username as string) || '';
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

