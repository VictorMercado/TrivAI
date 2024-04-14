import { getServerSession } from "next-auth/next";
import { authOptions } from "./next-auth-options";

export async function getSession() {
  return await getServerSession(authOptions);
}