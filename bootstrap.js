import express from "express"
import { connectDB } from "./database/connectDB.js"
import authRouter from './src/modules/auth/authRouters.js'
import postRouter from './src/modules/post/postsRouters.js'
import { globalErrorHandler } from "./src/utile/globalErrorHandler.js"
import cors from "cors";


export let bootstrap = (app)=>{
    connectDB()
    app.use(express.json())
    app.use(cors())
    app.use('/auth' , authRouter)
    app.use('/post' , postRouter)
    app.use(globalErrorHandler)

}