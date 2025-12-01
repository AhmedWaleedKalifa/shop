const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRoutes");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
// import { errorHandler } from './middlewares/errorHandler';
const app = express();
// app.use(cors());
app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.use("/auth", authRouter);
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);

// app.use(errorHandler);

module.exports = app;
