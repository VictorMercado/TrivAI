import { Elysia } from "elysia";
// import { prisma } from "@trivai/prisma";
import { cors } from '@elysiajs/cors';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z, ZodError } from "zod";
import { decrypt } from "@trivai/auth/lib/decrypt";
import OpenAI from "openai";
import { Storage } from "@google-cloud/storage";
import { Buffer } from "buffer";

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  credentials: {
    type: "service_account",
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    // @ts-ignore
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  }
});

async function uploadFromMemory(bucketName: string = (process.env.BUCKET_NAME as string), contents: Buffer, destFileName: string, contentType = "image/png") {
  await storage.bucket(bucketName).file(destFileName).save(contents, {
    contentType,
  });
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
  organization: process.env.ORGANIZATION as string,
})

const apiKey: string = process.env.GOOGLE_API_KEY as string;
export const googleAI = new GoogleGenerativeAI(apiKey);
const googleModelName = "gemini-pro";



// uploadFromMemory().catch(console.error);


const backticksRegex = /```([\s\S]+?)```/;

const ZBody = z.object({
  prompt: z.string(),
  webhook: z.string(),
  quizId: z.number(),
  category: z.string(),
  theme: z.string().optional(),
});
type TBody = z.infer<typeof ZBody>;

const ZCookie = z.object({
  userToken: z.object({
    value: z.string(),
  }),
});

const ZQuestions = z.array(z.object({
  text: z.string(),
  answer1: z.string(),
  answer2: z.string(),
  answer3: z.string(),
  answer4: z.string(),
  correctAnswer: z.string(),
}));

const ZQuestionWithQustionText = z.array(z.object({
  question: z.string(),
  answer1: z.string(),
  answer2: z.string(),
  answer3: z.string(),
  answer4: z.string(),
  correctAnswer: z.string(),
}));

const ZQuestionsEither = z.lazy(() => z.union([ZQuestions, ZQuestionWithQustionText]));

type TCookie = z.infer<typeof ZCookie>;


let requestNumber = 1;

export const stringExtractor = (stringToModify: string | undefined, substring: string) => {
  if (!stringToModify) return "";
  const index = stringToModify.indexOf(substring);
  if (index === -1) return stringToModify;
  return stringToModify.slice(0, index) + stringToModify.slice(index + substring.length);
};



async function run(prompt: string = "Give me a 5 question quiz about anything.") {
  // For text-only input, use the gemini-pro model
  console.log("run is running");

  const model = googleAI.getGenerativeModel({ model: googleModelName });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}

async function hitWebhook(body: string) {
  console.log("hitWebhook is running");
  let parsedBody: TBody;
  try {
    parsedBody = ZBody.parse(body);
    // parsedBody = ZBody.parse(body);
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

  let match;
  let response = "";
  let questions;
  try {
    response = await run(parsedBody.prompt);
    match = backticksRegex.exec(response);
    if (match === null) {
      throw new Error("No response");
    }
    response = match[1];
    response = stringExtractor(response, "JSON");
    response = stringExtractor(response, "json");
    console.log(response);
  }
  catch (e) {
    try {
      response = await run(parsedBody.prompt);
      match = backticksRegex.exec(response);
      if (match === null) {
        throw new Error("No response");
      }
      response = match[1];
      response = stringExtractor(response, "JSON");
      response = stringExtractor(response, "json");
    } catch (e) {
      await fetch(parsedBody.webhook, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ message: e, error: true }),
      });
      return new Response(JSON.stringify({ message: e, error: true }), { status: 400 });
    }
  } 
  // let response = `Dude heres your token ${token} and heres your user id ${userId} and heres your prompt: ${body}`;

  try {
    questions = ZQuestionsEither.parse(JSON.parse(response));
  } catch (e) {
    console.log("zod error");
    console.log("rerunning");
    response = await run(parsedBody.prompt);
    match = backticksRegex.exec(response);
    if (match === null) {
      await fetch(parsedBody.webhook, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ message: e, error: true }),
      });
      return;
    }
    response = match[1];
    response = stringExtractor(response, "JSON");
    response = stringExtractor(response, "json");
    console.log(response);
  }

  let image;
  try {
    image = await openai.images.generate({ model: "dall-e-2", prompt: `generate a beautiful colorful HD image about ${parsedBody.category} ${parsedBody.theme ? "with a focus on " + parsedBody.theme : ""}`, size: "512x512", response_format: "b64_json" });
  } catch (e) {
    console.log("OpenAI image generation error");
    await fetch(parsedBody.webhook, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ quizImageURL: null, questions: questions }),
    });
    return;
  }
  
  const todaysDate = new Date().toISOString().slice(0, 10);
  const destination = `${todaysDate}/quiz-${parsedBody.quizId}/img.png`;
  const googleImageURL = `https://storage.googleapis.com/trivai-images/${destination}`;
  let imageBuffer;
  
  if (image.data.length > 0 && image.data[0].b64_json) {
    try {
      imageBuffer = Buffer.from(image.data[0].b64_json, "base64");
    } catch (e) {
      console.log("OpenAI image buffer error");
      await fetch(parsedBody.webhook, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ quizImageURL: null, questions: questions }),
      });
      return;
    }
    try {
      await uploadFromMemory((process.env.BUCKET_NAME as string), imageBuffer, destination, "image/png");
      console.log("UPLOAD DONESKIES");
    } catch (e) {
      console.log("Google Cloud Storage image upload error");
      await fetch(parsedBody.webhook, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ quizImageURL: null, questions: questions }),
      });
      return;
    }
  } else {
    console.log("No image data");
  }
  
  response = JSON.stringify({ quizImageURL: googleImageURL, questions: questions});

  let webhookResponse;
  // todo check response against a zod schema, if it fails run again then return error
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
    // response = await response.json();
    // return new Response(JSON.stringify(response));
    return response;
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
    try {
      hitWebhook(body);
    }
    catch (e) {
      console.log(e);
      return new Response(JSON.stringify({ message: e, error: true }), { status: 400 });
    }

    // return new Response(JSON.stringify({ message: `request number: ${requestNumber} \n ${response}` }));
    return new Response(JSON.stringify({ message: "Processing started", type: "Success" }), { status: 200 });
  })
  .get("/ai/img/gen", async ({ body }) => {
    console.log("/ai/img/gen hit");
    
    // const image = await openai.images.generate({ model: "dall-e-2", prompt: "place holder image for quiz preview", size: "256x256", response_format: "b64_json"});
    // if (image.data.length > 0 && image.data[0].b64_json) {
    //   try {
    //     const imageBuffer = Buffer.from(image.data[0].b64_json, "base64");
    //     const todaysDate = new Date().toISOString().slice(0, 10);
    //     const result = await uploadFromMemory("trivai-images", imageBuffer, `${todaysDate}/quiz-11/img1.png`, "image/png");
    //     console.log("UPLOAD DONESKIES");
    //     console.log(result);
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }
    return new Response(JSON.stringify({ message: "Processing started", type: "Success" }), { status: 200 });
  })
  .listen(process.env.PORT || 3000);

console.log("process.env.PORT: ", process.env.PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);