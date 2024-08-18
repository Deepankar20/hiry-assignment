import { Request, Response } from "express";
import { db } from "../db/db";
import { eq, or, desc, like } from "drizzle-orm";
import { chats, users } from "../db/schema";

export async function getUsersToChat(req: Request, res: Response) {
  try {
    const { userId } = req.body;
    // const result = await db
    // .select(users.id)
    // .from(users)
    // .innerJoin(chats, chats.receiverId.eq(users.id))
    // .where(chats.senderId.eq(userId))
    // .where(users.id.ne(userId)) // Exclude the user themselves
    // .groupBy(users.id, users.username)
    // .orderBy(chats.createdAt, 'desc');

    // res.status(200).json(result); // Send the result back to the client
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send("Internal Server Error"); // Send an error response
  }
}

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { searchTerm } = req.query;

    if (!searchTerm || typeof searchTerm !== "string") {
      return res.status(400).json({ error: "Invalid search term" });
    }

    // Query the users table for matching usernames or emails
    const matchedUsers = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(
        or(
          like(users.username, `%${searchTerm}%`),
          like(users.email, `%${searchTerm}%`)
        )
      );

    return res.status(200).json(matchedUsers);
  } catch (error) {
    console.error("Error searching users:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
