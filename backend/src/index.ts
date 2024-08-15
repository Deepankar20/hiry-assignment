import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.ts";
import userRouter from "./routes/user.route.ts";
import chatRouter from "./routes/chat.route.ts";
import groupRouter from "./routes/group.route.ts";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);
app.use("/api/groups", groupRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
