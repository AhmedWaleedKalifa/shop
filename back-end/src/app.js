const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRoutes");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes.js");
const productRoutes = require("./routes/productRoutes.js");

const app = express();

// Dynamic CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow your main domain and all Netlify deploy previews
    const allowedOrigins = [
      process.env.FRONT_END_URL, // Your main frontend URL
      "https://werzu.netlify.app", // Your main Netlify URL
      /\.werzu\.netlify\.app$/, // All Netlify subdomains (deploy previews)
      /^https:\/\/[a-zA-Z0-9-]+--werzu\.netlify\.app$/, // All Netlify deploy previews
    ];
    
    // Check if the origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      // Optionally, you can log unauthorized origins
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
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

module.exports = app;