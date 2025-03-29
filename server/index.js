import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cloudinaryConnect from "./config/cloudinaryConnect.js";
import dbConnect from "./config/dbConnect.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://www.nexus25.com","https://nexus-client-phi.vercel.app"],
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
const port = process.env.PORT || 3000;

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import eventRoutes from "./routes/event.route.js";

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/event", eventRoutes);

app.listen(port, () => {
  cloudinaryConnect();
  dbConnect();
  console.log(`Server is running on port ${port}`);
});
