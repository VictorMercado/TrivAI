import NextAuth, { DefaultSession } from "next-auth"

type UserRole = string

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      accessToken: string,
      role: string;
      id: string,
      userName: string,
      userImage: string,
      credits: number,
    } & DefaultSession["user"]
  }
}