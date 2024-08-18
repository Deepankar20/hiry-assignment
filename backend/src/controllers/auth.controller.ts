import { db } from "../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await db.insert(users).values({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ email }, "secr3t", {
      expiresIn: "1h",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600000),
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Internal server error" });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();
    if (user.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ email: user[0].email, id: user[0].id }, "secr3t", {
      expiresIn: "1h",
    });
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 3600000),
    });

    res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
