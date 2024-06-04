import path from "path"
import express from "express"
import dotenv from "dotenv"
import connectMongoDB from "./db/connect_mongo.js"
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import authRoutes from "./routers/auth_router.js"
import userRoutes from "./routers/user_router.js";
import postRoutes from "./routers/post_router.js";
import notificationRoutes from "./routers/notify_router.js";
import cors from "cors"

dotenv.config()

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const __dirname = path.resolve();



const app = express()
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "5mb" })); // to parse req.body
// limit shouldn't be too high to prevent DOS
app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
    connectMongoDB()
})