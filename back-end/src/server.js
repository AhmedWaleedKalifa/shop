const app =require("./app")
const port=process.env.PORT;

app.listen(port,(error)=>{
    if(error){
        throw error;
    }
    console.log(`server running at http://localhost:${port}`)
})