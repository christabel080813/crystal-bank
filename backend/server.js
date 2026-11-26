import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
 


const PORT = process.env.PORT || 5000;

connectDB();

app.get("/", (req, res) => {
  res.send("Crystal Bank API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});