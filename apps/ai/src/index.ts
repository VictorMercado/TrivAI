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
  const model = googleAI.getGenerativeModel({ model: googleModelName });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}
// process.env.WEBHOOK_URL
const ZBody = z.object({
  prompt: z.string(),
  webhook: z.string(),
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

  .post("/ai/quiz/gen", async ({ body, cookie: { userToken } } : {body: string; cookie: TCookie}) => {
    requestNumber++;
    
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
    let parsedBody : TBody;
    try {
      parsedBody = ZBody.parse(JSON.parse(body));
    }
    catch (e) {
      if (e instanceof ZodError) {
        return new Response(JSON.stringify({ message: e.errors, error: true }), { status: 400 });
      }
      return new Response(JSON.stringify({ message: e, error: true }), { status: 400 });
    }

    let response = await run(parsedBody.prompt);
    // let response = `Dude heres your token ${token} and heres your user id ${userId} and heres your prompt: ${body}`;
    
    const match = backticksRegex.exec(response);
    if (match === null) {
      return { message: "No response", error: true };
    }
    response = match[1];
    response = stringExtractor(response, "JSON");
    response = stringExtractor(response, "json");
    console.log(response);

    const webhookResponse = await fetch(parsedBody.webhook, {
      method: "POST",
      body: response,
    });
    const webhookResponseJson = await webhookResponse.json();
    console.log(webhookResponseJson.status);
    

    // console.log("request out: " + newReq);
    // console.log(response);

    // return new Response(JSON.stringify({ message: `request number: ${requestNumber} \n ${response}` }));
    return new Response(JSON.stringify(response));
  })
  .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
