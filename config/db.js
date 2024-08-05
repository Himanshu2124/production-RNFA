const { error } = require('console')
const mongoose =require ('mongoose')

const connectDB =async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connect to DATABASE ${mongoose.connection.host}`)
    }catch (error){
        console.log(`error in connection DB ${error}`)
    }
}
module.exports= connectDB;