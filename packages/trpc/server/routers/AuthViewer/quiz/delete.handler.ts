import { Context } from "@trivai/trpc/server/context";
import { TDeleteQuizInput } from "./delete.schema";
import { Storage } from "@google-cloud/storage";
import { TRPCError } from "@trivai/trpc/server";

// const base64EncodedServiceAccount = process.env.BASE64_ENCODED_SERVICE_ACCOUNT as string;
// const decodedServiceAccount = Buffer.from(base64EncodedServiceAccount, 'base64').toString('utf-8');
// const credentials = JSON.parse(decodedServiceAccount);


// const private_key = JSON.parse(
//   Buffer.from(process.env.PRIVATE_KEY as string, "base64").toString().replace(/\n/g, "")
// );

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

export const stringExtractor = (stringToModify: string | undefined, substring: string) => {
  if (!stringToModify) return "";
  const index = stringToModify.indexOf(substring);
  if (index === -1) return stringToModify;
  return stringToModify.slice(0, index) + stringToModify.slice(index + substring.length);
};

type GetQuizOptions = {
  ctx: Context;
  input: TDeleteQuizInput;
};

export const deleteQuiz = async ({ ctx, input }: GetQuizOptions) => {
  const { prisma, session } = ctx;
  const quiz = await prisma.quiz.findUnique({
    where: {
      id: input.id,
    },
  });
  if (!quiz) throw new TRPCError({
    code: "NOT_FOUND",
    message: "Quiz not found",
  });
  if (quiz.ownerId !== session?.user?.id) throw new TRPCError({
    code: "UNAUTHORIZED",
    message: "Unauthorized",
  });

  let res;
  
  try {
    res = await prisma.quiz.delete({
      where: {
        id: input.id,
      },
    });
  } catch (error) {
    console.log(error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    });
  }
  if (!quiz.image) {
    return res;
  }
  try {
    let imageURL = quiz.image;
    let image = imageURL.slice("https://storage.googleapis.com/trivai-images/".length);
    if (image) {
      const bucket = storage.bucket(process.env.BUCKET_NAME as string);
      await bucket.file(image).delete();
    }
  } catch (e) {
    console.log(e);
  }
  return res;
};
