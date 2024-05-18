import mongoose from "mongoose";
import 'dotenv/config'

export let connectDB = async ()=>{
   await mongoose.connect(process.env.DATABASE).then(()=>{
        console.log('database connected')
    }).catch(()=>{
        console.log('error in database connection')
    })
}