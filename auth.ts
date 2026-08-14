import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { databaseUrl } from "@/lib/clarity/db";
import { findUserByUsername, normalizeUsername, verifyPassword } from "@/lib/clarity/accounts";

const googleId = process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "";
const googleSecret = process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "";

function stableGoogleUserId(email?: string | null, sub?: string | null) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (normalizedEmail) return `google:${normalizedEmail}`;
  const normalizedSub = String(sub || "").trim();
  return normalizedSub ? `google:${normalizedSub}` : "";
}

function isEphemeralAuthId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    ...(googleId && googleSecret
      ? [
          Google({
            clientId: googleId,
            clientSecret: googleSecret,
          }),
        ]
      : []),
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!databaseUrl()) return null;
        const username = normalizeUsername(String(credentials?.username || ""));
        const password = String(credentials?.password || "");
        if (!username || !password) return null;
        const user = await findUserByUsername(username);
        if (!user?.password_hash) return null;
        if (!(await verifyPassword(password, user.password_hash))) return null;
        return {
          id: user.id,
          name: user.name || username,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user, account, profile }) {
      if (user?.name) token.name = user.name;
      if (user?.email) token.email = user.email;
      if (user && "image" in user && user.image) token.picture = String(user.image);

      if (account?.provider === "google") {
        const profileEmail =
          profile && "email" in profile && typeof profile.email === "string" ? profile.email : "";
        const profileSub = profile && "sub" in profile && profile.sub ? String(profile.sub) : "";
        const id = stableGoogleUserId(
          user?.email || profileEmail || (typeof token.email === "string" ? token.email : ""),
          account.providerAccountId || profileSub,
        );
        if (id) token.userId = id;
        return token;
      }

      if (user?.id && !isEphemeralAuthId(String(user.id))) {
        token.userId = String(user.id);
      } else if (typeof token.email === "string" && isEphemeralAuthId(String(token.userId || token.sub || ""))) {
        token.userId = stableGoogleUserId(token.email);
      } else if (!token.userId && user?.id) {
        token.userId = String(user.id);
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        const email = String(token.email || session.user.email || "");
        let id = String(token.userId || token.sub || "");
        if (email && (isEphemeralAuthId(id) || !id)) id = stableGoogleUserId(email);
        session.user.id = id;
        if (token.name) session.user.name = String(token.name);
        if (token.email) session.user.email = String(token.email);
        if (token.picture) session.user.image = String(token.picture);
      }
      return session;
    },
  },
});
