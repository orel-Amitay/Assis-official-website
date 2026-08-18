import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { databaseUrl } from "@/lib/clarity/db";
import { findUserByUsername, normalizeUsername, verifyPassword } from "@/lib/clarity/accounts";
import { canonicalClarityUserId } from "@/lib/clarity/identity";

const googleId = process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "";
const googleSecret = process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "";

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
      const profileEmail =
        profile && "email" in profile && typeof profile.email === "string" ? profile.email : "";
      const profileSub = profile && "sub" in profile && profile.sub ? String(profile.sub) : "";

      if (user?.name) token.name = user.name;
      if (user?.email || profileEmail) token.email = String(user?.email || profileEmail);
      if (user && "image" in user && user.image) token.picture = String(user.image);

      if (account?.provider === "google") {
        const sub = String(account.providerAccountId || profileSub || "");
        if (sub) token.googleId = sub.replace(/^google:/, "");
        token.userId =
          canonicalClarityUserId({ email: String(token.email || "") }) || (sub ? `google:${sub}` : "");
        return token;
      }

      if (user?.id && String(user.id).startsWith("pass:")) {
        token.userId = String(user.id);
        return token;
      }

      const email = String(token.email || "").trim().toLowerCase();
      const currentId = String(token.userId || user?.id || token.sub || "");
      if (email && !currentId.startsWith("pass:")) {
        token.userId = canonicalClarityUserId({ email });
      } else if (user?.id && !isEphemeralAuthId(String(user.id))) {
        token.userId = String(user.id);
      } else if (!token.userId && user?.id) {
        token.userId = String(user.id);
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        const email = String(token.email || session.user.email || "")
          .trim()
          .toLowerCase();
        const tokenId = String(token.userId || "");
        session.user.id = canonicalClarityUserId({
          id: tokenId.startsWith("pass:") ? tokenId : email ? "" : tokenId || String(token.sub || ""),
          email,
        });
        if (token.name) session.user.name = String(token.name);
        if (email) session.user.email = email;
        else if (token.email) session.user.email = String(token.email);
        if (token.picture) session.user.image = String(token.picture);
      }
      const googleSub = String(token.googleId || "").replace(/^google:/, "");
      if (googleSub) session.googleSub = googleSub;
      return session;
    },
  },
});
