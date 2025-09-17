import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import mysql from "mysql2/promise";

// Extend the default Session type to include `id`
declare module "next-auth" {
  interface Session {
    user: {
      id?: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Check if user exists
      const [rows] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [user.email]
      );

      // Insert new user if not exists
      if ((rows as any[]).length === 0) {
        await pool.query(
          "INSERT INTO users (name, email, image) VALUES (?, ?, ?)",
          [user.name, user.email, user.image]
        );
      }
      return true;
    },
    async session({ session }) {
      const [rows] = await pool.query(
        "SELECT id FROM users WHERE email = ?",
        [session.user.email]
      );
      if ((rows as any[]).length > 0) session.user.id = (rows as any[])[0].id;
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
