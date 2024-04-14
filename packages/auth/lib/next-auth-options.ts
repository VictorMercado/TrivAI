
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@trivai/prisma";
import { getUserWithProperties, updateUserName, getUserRole } from "@trivai/lib/server/queries/user";

function generateUniquePokemonUsername() {
  const pokemonNames = [
    "Pikachu",
    "Charizard",
    "Bulbasaur",
    "Squirtle",
    "Jigglypuff",
    "Snorlax",
    // Add more Pokemon names as needed
  ];

  const randomPokemonName = pokemonNames[Math.floor(Math.random() * pokemonNames.length)];
  const randomNumber = Math.floor(Date.now() % 1000);

  const uniqueUsername = `${randomPokemonName}${randomNumber}`;

  return uniqueUsername;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, trigger, session, user }) {
      // Persist the OAuth access_token from account to the JWT right after signin
      // account is only passed once after a new user signs in
      const { sub } = token; // sub is the user id in the database
      token.email = "";
      if (account) {
        console.log("hello form account");
        // token.accessToken = account.access_token
        // getting role so only admins can hit admin API endpoints
        let userRole;
        let user;
        try {
          user = await getUserWithProperties({ userId: sub as string, properties: ["userName", "image", "credits"] });
          userRole = await getUserRole(sub as string);
          token.role = userRole;
          token.userName = user?.userName;
          token.id = sub;
          token.picture = user?.image;
          token.credits = user?.credits;
        } catch (e) {
          console.error(e);
          token.role = "USER";
          token.userName = "N/A";
          token.id = "N/A";
          token.picture = "N/A";
          token.credits = "N/A";
        }
      }
      else if (trigger === "update" && session?.userName) { // if the user updates their profile
        token.userName = session?.userName; // update the username in the token
        const user = await getUserWithProperties({ userId: sub as string, properties: ["userName", "image"] });
        token.picture = user?.image;
      }

      return token;
    },
    async session({ session, token }) {
      // Send properties to the client via cookies, like an access_token and user id from a provider.

      session.user.id = token.id as string;
      session.user.role = token.role as string;
      // session.user.accessToken = token.accessToken as string;
      session.user.userName = token.userName as string;
      session.user.userImage = token.picture as string;
      session.user.credits = token.credits as number;
      return session;
    }
  },
  events: {
    async createUser(message) {
      // Do something here
      const categories = [
        "CARS",
        "POKEMON",
        "GENERAL",
        "SPORTS",
        "HISTORY",
        "GEOGRAPHY",
        "ENTERTAINMENT",
        "SCIENCE",
        "ART",
        "MUSIC",
        "FILMS",
        "LITERATURE",
        "MATHS",
        "TECHNOLOGY",
        "ANIMALS",
        "VEHICLES",
        "FOOD",
        "NATURE",
        "TRAVEL",
        "POLITICS",
        "CELEBRITIES",
        "COMICS",
        "GAMES",
        "ANIME",
        "CARTOONS"
      ];
      const { id } = message.user;
      let userPreInitializedCategories = categories.filter((category)=> Math.random() < 0.3).map((category) => {
        return {
          name: category,
          userId: id,
        };
      });

      const createdCategories = await prisma.category.createMany({
        data: userPreInitializedCategories,
        skipDuplicates: true,
      });
      const createdFriend = await prisma.userFriend.create({
        data: {
          userId: id,
          friendId: id,
          status: "ACCEPTED",
        },
      });
      try {
        const userName = generateUniquePokemonUsername();
        await updateUserName(id as string, userName as string);
      }
      catch (err) {
        console.log(err);
        const userName = generateUniquePokemonUsername();
        await updateUserName(id as string, userName as string);
      }
    }
  }
};