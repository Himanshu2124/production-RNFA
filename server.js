const express = require('express')
const cors = require('cors')
const dotenv =require ('dotenv')
// const colors = require ("colors")
const morgan =require ('morgan');
const { connect } = require('http2');
const connectDB = require('./config/db');

//DONTENV
dotenv.config();

//MONGODB 
connectDB();

//REST OBJECT
const app =express();

//middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// //ROUTS Default

// app.get("" , (req, res)=>{
//     res.status(200).json({
//         success:true,
//         message:"welcome to full stack app ",
//     });
// });
 
//ROUTS
app.use ("/api/v1/auth", require("./routes/userRoutes"));
app.use ("/api/v1/post", require ("./routes/postRoutes"))

//Home
app.get("/",(req, res)=>{
  res.status(200).send({
            "success": true,
            "msg": 'Node Server Running',
        });
})

//PORT
const PORT = process.env.PORT || 8080;

//listen 
 app.listen(PORT,() => {
    console.log(`Server Running ${PORT}`)
 })
