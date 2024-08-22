import express from "express";
import cookieParser from "cookie-parser";
import connectToMongoDB from "./db/connection.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";


const PORT = process.env.PORT || 5000;
const app = express();
dotenv.config();

app.use(express.json()); 
app.use(cookieParser());

app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server Running on port ${PORT}`);
});