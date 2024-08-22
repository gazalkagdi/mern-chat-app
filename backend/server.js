
import express from "express";
import cookieParser from "cookie-parser";


const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json()); 
app.use(cookieParser());


app.listen(PORT, () => {
	
	console.log(`Server Running on port ${PORT}`);
});