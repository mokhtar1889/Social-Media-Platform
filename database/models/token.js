import mongoose, { Schema, Types, model } from "mongoose";


let tokenSchema = new Schema({
    token:{type:String , required:true},
    user:{type:Types.ObjectId , ref:"User" , require: true},
    isValid:{type:Boolean , default: true},
    userAgent:{type:String}
},{
    timestamps:true
})


export let Token = model("Token" , tokenSchema)