import express from 'express'
import 'dotenv/config'
import { bootstrap } from './bootstrap.js'


let app = express()
let port = process.env.PORT

bootstrap(app)

app.listen(port , ()=>{
    console.log("app is running at port:" , port)
})