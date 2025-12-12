// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import accountRoutes from "./routes/accountRoutes.js";

dotenv.config();

const app = express();

// connect to MongoDB
connectDB();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/accounts", accountRoutes);

app.get("/", (req, res) => {
  res.send("MiniBank API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
