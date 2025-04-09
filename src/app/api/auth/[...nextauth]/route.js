import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { dbConnect } from "@/lib/dbConnect";
import Public from "@/Models/Public";
import jwt from "jsonwebtoken";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        // On initial sign in with Google
        await dbConnect();

        let existingUser = await Public.findOne({ email: user.email });
        console.log("existing_user:", existingUser);

        if (!existingUser) {
          existingUser = await Public.create({
            username: user.name,
            email: user.email,
            profilePic: user.image,
            authProvider: "google",
            role: "public",
          });
          console.log(existingUser);
        }

        const payload = {
          id: existingUser._id.toString(),
          email: existingUser.email,
          username: existingUser.username,
          role: existingUser.role || "public",
        };

        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "2d",
        });

        token.jwt = jwtToken;
        token.id = payload.id;
        token.email = payload.email;
        token.username = payload.username;
        token.role = payload.role;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.username = token.username;
      session.user.role = token.role;
      session.user.jwt = token.jwt;
      return session;
    },
  },

  pages: {
    signIn: "/login", // Optional: redirect to your login page
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
