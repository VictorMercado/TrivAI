
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

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '';
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // // reference for render.com
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }

  // assume localhost
  return `http://127.0.0.1:${process.env.PORT ?? 3000}`;
};

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
      const AI_URL = process.env.AI_API_URL;

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
      try {
        const userName = generateUniquePokemonUsername();
        await updateUserName(id as string, userName as string);
      }
      catch (err) {
        console.log(err);
        const userName = generateUniquePokemonUsername();
        await updateUserName(id as string, userName as string);
      }
      let userPreInitializedCategories = categories.filter((category)=> Math.random() < 0.3).map((category) => {
        return {
          name: category,
          userId: id,
        };
      });
      let randomCategory = categories[Math.floor(Math.random() * categories.length)];

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
      const createdCategory = await prisma.category.create({
        data: {
          name: randomCategory,
          userId: "0000000000",
        },
      });
      const quizCategory = await prisma.quizCategory.create({
        data: {
          basePrompt: "",
          userId: "0000000000",
          categoryId: createdCategory.id,
          themeId: null,
        },
      });
      const quiz = await prisma.quiz.create({
        data: {
          scoreAmt: 5,
          quizCategoryId: quizCategory.id,
          ownerId: "0000000000",
        },
      });
      const assignedQuiz = await prisma.userAssignedQuiz.create({
        data: {
          userId: "0000000000",
          assigneeId: id,
          quizId: quiz.id,
        },
      });
      const systemMessage = "ONLY GIVE ME JSON!! An array of question objects where the text property has the question text, answer1 has an answer, answer2 has an answer, answer3 has an answer, answer4 has an answer and correctAnswer property has the correct answer where the value is one of the properties of answer1, answer2, answer3, answer4.";
      let prompt = systemMessage + " " + `Give me a ${10} question quiz about ${createdCategory.name}`;
      const body = {
        prompt: prompt,
        webhook: getBaseUrl() + "/api/quizzes/generate/" + quiz.id,
        quizId: quiz.id,
        category: createdCategory.name,
        theme: undefined,
      };
      const stringifiedBody = JSON.stringify(body);

      if (AI_URL) {
        let res = await fetch(AI_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: stringifiedBody,
        });
      }
    }
  }
};