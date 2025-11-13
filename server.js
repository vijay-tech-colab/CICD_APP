import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

// Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to our page!",
  });
});

app.get("/users", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 15, 1);
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();
    const users = await User.find().skip(skip).limit(limit);

    res.json({
      success: true,
      message: "Data fetched successfully",
      pagination: {
        page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://mongo:27017", {
      dbName: process.env.DB_NAME,
    });

    console.log("MongoDB connected");
    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    console.error("Database connection failed:", err);
  }
});
