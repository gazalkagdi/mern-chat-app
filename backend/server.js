import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import userRoutes from "./routes/user.js";
import cors from "cors";

import connectToMongoDB from "./db/connection.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const __dirname = path.resolve();

const PORT = 5000;

app.get("/", (req, res) => res.send("Hello world"));

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "https://mern-chat-app-peach-kappa.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "/chat-app/dist")));
connectToMongoDB();

server.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
