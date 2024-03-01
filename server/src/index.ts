import express from "express";

const PORT = 3001;
const app = express();
app.get("/",(req:any, res:any)=>{
    res.status(200).json("OK!");
})
app.listen(PORT, ()=>{
    console.log("Server start!");
})