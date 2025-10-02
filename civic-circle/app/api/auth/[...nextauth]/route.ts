import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import mysql from "mysql2/promise";

// Superadmin email
const SUPERADMIN_EMAIL = "impic.tech@gmail.com";

// Extend the default Session type to include `id` and `role`
declare module "next-auth" {
  interface Session {
    user: {
      id?: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "user" | "superadmin";
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

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      // Check if user exists
      const [rows] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [user.email]
      );

      // Determine role based on email
      const role = user.email === SUPERADMIN_EMAIL ? "superadmin" : "user";

      // Insert new user if not exists
      if ((rows as any[]).length === 0) {
        await pool.query(
          "INSERT INTO users (name, email, image, role) VALUES (?, ?, ?, ?)",
          [user.name, user.email, user.image, role]
        );
      } else {
        // Update role if user exists but role changed (e.g., promoting to superadmin)
        await pool.query(
          "UPDATE users SET role = ? WHERE email = ?",
          [role, user.email]
        );
      }
      return true;
    },
    async session({ session }) {
      const [rows] = await pool.query(
        "SELECT id, role FROM users WHERE email = ?",
        [session.user.email]
      );
      if ((rows as any[]).length > 0) {
        session.user.id = (rows as any[])[0].id;
        session.user.role = (rows as any[])[0].role;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
