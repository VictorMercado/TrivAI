import { authOptions } from "@/src/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { db } from "@/src/db";

function filterUndefinedValues(obj : any) {
  var filteredObj = {} as any;
  for (var key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
      filteredObj[key] = obj[key];
    }
  }
  return filteredObj;
}

// this route is only accessible by admin users
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session : Session | null = await getServerSession(req, res, authOptions);
    
    if (session) {
        if (session.user.role === "ADMIN") {
            try {
                if (req.method === "POST") {
                    let {id, correctAnswer, category, isUsed, answer1,answer2, answer3, dateDue, image} = req.body;
                    let newObj = filterUndefinedValues({id, correctAnswer, category, isUsed, answer1,answer2, answer3, dateDue, image});
                    const response = await db.question.findFirst({
                        where: {
                            id: id
                        }
                    });
                    if (response) {
                        await db.question.update({
                            where: {
                                id: id
                            },
                            data: newObj
                        });
                    } else {
                        try {
                            await db.question.create({
                                data: {
                                    id: id,
                                    correctAnswer: correctAnswer,
                                    category: category,
                                    isUsed: isUsed,
                                    answer1: answer1,
                                    answer2: answer2,
                                    answer3: answer3,
                                    dateDue: dateDue,
                                    image: image
                                }
                            });
                        }
                        catch (e) {
                            console.log(e);
                            res.status(400).json({message: "Bad Request"});
                            return;
                        }
                    }
                    res.status(200).json({message: "Success"});
                    return;
                }
                if (req.method === "DELETE") {
                    let id = req.query.id as string;                
                    let response = await db.question.findFirst({
                        where: {
                            id: id
                        }
                    });
                    if (response) {
                        await db.question.delete({
                            where: {
                                id: id
                            }
                        });
                    } else {
                        res.status(404).json({message: "Not Found"});
                        return;
                    }
                    res.status(200).json({message: "Success"});
                    return;
                }
                res.status(405).json({message: "Method Not Allowed"});
                return;
            } catch (e) {
                res.status(400).json({message: "Bad Request"});
                return;
            }
        } else {                
            res.status(401).json({message: "Unauthorized"});
            return;
        }

    }
    res.status(403).json({message: "Forbidden"});
}