import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import chatRouter from "./routes/chat.route";
import groupRouter from "./routes/group.route";
import awsRouter from "./routes/aws.route";

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
app.use("/api/aws/", awsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
