const express=require("express")
require('dotenv').config();

const app =express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port=process.env.PORT;

app.get("/",(req,res)=>{
    res.send("Hello!")
})

app.listen(port,(error)=>{
    if(error){
        throw error;
    }
    console.log(`server running at http://localhost:${port}`)
})