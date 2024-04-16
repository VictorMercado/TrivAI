import { Elysia } from "elysia";
// import { prisma } from "@trivai/prisma";
import { cors } from '@elysiajs/cors';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z, ZodError } from "zod";
import { decrypt } from "@trivai/auth/lib/decrypt";

const backticksRegex = /```([\s\S]+?)```/;

export const stringExtractor = (stringToModify: string | undefined, substring: string) => {
  if (!stringToModify) return "";
  const index = stringToModify.indexOf(substring);
  if (index === -1) return stringToModify;
  return stringToModify.slice(0, index) + stringToModify.slice(index + substring.length);
};

const apiKey: string = process.env.GOOGLE_API_KEY as string;
export const googleAI = new GoogleGenerativeAI(apiKey);
const googleModelName = "gemini-pro";

async function run(prompt: string = "Give me a 5 question quiz about anything.") {
  // For text-only input, use the gemini-pro model
  console.log("run is running");

  const model = googleAI.getGenerativeModel({ model: googleModelName });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}


const ZBody = z.object({
  prompt: z.string(),
  webhook: z.string(),
  quizId: z.string(),
});
type TBody = z.infer<typeof ZBody>;

const ZCookie =  z.object({ 
  userToken: z.object({
    value: z.string(),
  }),
});

type TCookie = z.infer<typeof ZCookie>;


let requestNumber = 1;

const app = new Elysia()
  .use(cors())
  .get("/", () => {
    console.log("/GET hit");
    
    return new Response("Hello World");
  })
  .get("/pokemon", async () => {
    console.log("/pokemon hit");
    let response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
    if (!response.ok) {
      return new Response(JSON.stringify({ message: "No response", error: true }), { status: 400 });
    }
    response = await response.json();
    return new Response(JSON.stringify(response));
  })
  // .get("/", async ({ cookie: { userToken }, request }) => {
  //   const allToken: string = userToken.value;
  //   if (!allToken) {
  //     return new Response(JSON.stringify({ message: "No token", error: true }), { status: 400 });
  //   }
  //   let allTokenDecrypted;
  //   try {
  //     allTokenDecrypted = decrypt(allToken, process.env.TOKEN_SECRET as string);
  //   } catch (e) {
  //     return new Response(JSON.stringify({ message: e, error: true }), { status: 400 });
  //   }
  //   const userId = allTokenDecrypted.split("-")[0];
  //   const token = allTokenDecrypted.split("-")[1];
  //   const session = await prisma.session.findFirst({
  //     where: {
  //       userId: userId,
  //       sessionToken: token,
  //     },
  //   });
  //   if (!session) {
  //     return new Response(JSON.stringify({ message: "No session or bad token", error: true }), { status: 400 });
  //   }
  //   console.log(userId, " ", token);
  //   return new Response("good token: " + token + " and user id: " + userId);
  // })

  // .post("/ai/quiz/gen", async ({ body, cookie: { userToken } } : {body: string; cookie: TCookie}) => {
  .post("/ai/quiz/gen", async ({ body}: { body: string;}) => {
    console.log("/ai/quiz/gen hit");
    requestNumber++;
    async function hitWebhook(body: string) {
      console.log("hitWebhook is running");
      let parsedBody: TBody;
      try {
        console.log("body is being parsed");
        parsedBody = ZBody.parse(body);
        console.log(parsedBody);
      }
      catch (e) {
        if (e instanceof ZodError) {
          console.log("zod error");
          
          return new Response(JSON.stringify({ message: e.errors, error: true }), { status: 400 });
        }
        console.log("json error");
        return new Response(JSON.stringify({ message: e, error: true }), { status: 400 });
      }
      console.log("body is parsed");
      
      let response = "";
      try {
        response = await run(parsedBody.prompt);
      }
      catch (e) {
        console.log("error in run");
        console.log(e);
      }
      // let response = `Dude heres your token ${token} and heres your user id ${userId} and heres your prompt: ${body}`;

      const match = backticksRegex.exec(response);
      if (match === null) {
        return { message: "No response", error: true };
      }
      response = match[1];
      response = stringExtractor(response, "JSON");
      response = stringExtractor(response, "json");
      console.log(response);

      let webhookResponse;
      try {
        webhookResponse = await fetch(parsedBody.webhook, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: response,
        });
      } catch (e) {
        console.log(e);
      }

      const webhookResponseJson = await webhookResponse?.json();
      console.log(webhookResponseJson.status);
    }
    // const allToken: string = userToken.value;

    // if (!allToken) {
    //   return new Response(JSON.stringify({ message: "No token", error: true }), { status: 400 });
    // }
    // let allTokenDecrypted; 
    // try {
    //   allTokenDecrypted = decrypt(allToken, process.env.TOKEN_SECRET as string);
    // } catch (e) {
    //   return new Response(JSON.stringify({ message: e, error: true }), { status: 400 });
    // }
    // const userId = allTokenDecrypted.split("-")[0];
    // const token = allTokenDecrypted.split("-")[1];
    // console.log("request in: " + requestNumber);

    // if (!userId) {
    //   return new Response(JSON.stringify({ message: "No user id", error: true }), { status: 400 });
    // }
    // const session = await prisma.session.findFirst({
    //   where: {
    //     userId: userId,
    //     sessionToken: token,
    //   },
    // });
    // if (!session) {
    //   return new Response(JSON.stringify({ message: "No session or bad token", error: true }), { status: 400 });
    // }
    console.log("about to run hitWebhook");
    try {
      await hitWebhook(body);
    }
    catch (e) {
      console.log(e);
      return new Response(JSON.stringify({ message: e, error: true }), { status: 400 });
    }

    console.log("hitWebhook ran");
    
    // console.log("request out: " + newReq);
    // console.log(response);

    // return new Response(JSON.stringify({ message: `request number: ${requestNumber} \n ${response}` }));
    return new Response(JSON.stringify({ message: "Processing started", type: "Success" }));
  })
  .listen(process.env.PORT || 3000);

console.log("process.env.PORT: ", process.env.PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
