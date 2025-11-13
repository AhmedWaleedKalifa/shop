const express=require("express")
require('dotenv').config();
const authRouter=require("./routes/authRoutes")
// const cors = require('cors');
const  userRoutes =require("./routes/userRoutes") ;
// const  productRoutes =require("./routes/productRoutes.js");
// const categoryRoutes =require("./routes/categoryRoutes.js");
// import { errorHandler } from './middlewares/errorHandler';
const app =express();
// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    res.send("Hello!")
})
app.use("/api/auth",authRouter)
app.use('/api/users', userRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/categories', categoryRoutes);

// app.use(errorHandler);

module.exports = app;
