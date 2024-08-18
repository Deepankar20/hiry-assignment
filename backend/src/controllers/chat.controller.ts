import { Request, Response } from "express";
import { db } from "../db/db"; // Assuming db is your initialized Drizzle connection
import { chats, images } from "../db/schema"; // Assuming this is your schema definition
import { and, eq } from "drizzle-orm";

export const addChat = async (req: Request, res: Response) => {
  try {
    const { from, to, content } = req.body;

    if (!from || !to || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newChat = await db
      .insert(chats)
      .values({
        senderId: from.id,
        receiverId: to.id,
        message: content,
        createdAt: new Date(),
      })
      .returning();

    return res.status(201).json(newChat);
  } catch (error) {
    console.error("Error adding chat:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getChats = async (req: Request, res: Response) => {
  try {
    const { user1, user2 } = req.body;

    console.log(user1, user2);

    // Validate input
    if (!user1 || !user2) {
      return res
        .status(400)
        .json({ error: "Both user1 and user2 are required." });
    }

    // Fetch chats between user1 and user2
    const getChats1 = await db
      .select()
      .from(chats)
      .where(and(eq(chats.senderId, user1.id), eq(chats.receiverId, user2.id)));

    const getChats2 = await db
      .select()
      .from(chats)
      .where(and(eq(chats.senderId, user2.id), eq(chats.receiverId, user1.id)));

    const getImages1 = await db
      .select()
      .from(images)
      .where(
        and(eq(images.senderId, user2.id), eq(images.receiverId, user1.id))
      );

    const getImages2 = await db
      .select()
      .from(images)
      .where(
        and(eq(images.senderId, user1.id), eq(images.receiverId, user2.id))
      );

    const results = [...getChats1, ...getChats2, ...getImages1, ...getImages2];

    results.sort(
      (a, b) =>
        //@ts-ignore
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Send the results
    return res.status(200).json({ chats: results });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendImage = async (req: Request, res: Response) => {
  try {
    const { from, to, imageURL } = req.body;

    if (!from || !to || !imageURL) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newChat = await db
      .insert(images)
      .values({
        senderId: from.id,
        receiverId: to.id,
        imageURL: imageURL,
        createdAt: new Date(),
      })
      .returning();

    return res.status(201).json(newChat);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
