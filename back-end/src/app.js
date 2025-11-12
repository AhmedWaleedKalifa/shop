const express=require("express")
require('dotenv').config();
// const cors = require('cors');
// import userRoutes from './modules/user/user.routes';
// import productRoutes from './modules/product/product.routes';
// import categoryRoutes from './modules/category/category.routes';
// import { errorHandler } from './middlewares/errorHandler';
const app =express();
// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    res.send("Hello!")
})
// app.use('/api/users', userRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/categories', categoryRoutes);

// app.use(errorHandler);

module.exports = app;
