import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { AUTHOR_BY_GOOGLE_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GOOGLE_ID_QUERY, {
          id: user.id,
        });

      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          bio: user.bio || "",
        });
      }

      return true;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GOOGLE_ID_QUERY, {
            id: token.sub
          });
      }

      return token;
    },
    async session({ session, token }) {
      Object.assign(session, { id: token.sub });
      return session;
    },
  },
  // async signIn({ user, profile, account }) {
  //   console.log(user, profile, account);
  // }
});
