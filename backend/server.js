require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const compression = require("compression");

const connectDB = require("./config/db");

const app = express();
const router=require('./routes/authroute');
const userauth=require('./routes/userroute')
const productRoute=require('./routes/productRoute');
const path = require("path");

// Connect Database
connectDB();

// ======================
// Middlewares
// ======================

app.use(cors());

app.use(helmet());

app.use(compression());

app.use(morgan("dev"));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// ======================
// Routes
// ======================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server Running Successfully 🚀",
  });
});

app.use("/api/auth", router);

app.use("/api/user", userauth);
app.use("/api/product", productRoute);
app.use("/uploads", express.static("uploads"));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));






const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});