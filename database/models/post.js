
import { Schema, Types, model } from "mongoose";

const postSchema = new Schema({
    user:{type:Types.ObjectId , ref:"User" , required:true} ,
    attachments:[{secure_url:String , public_id:String}],
    reactions:[{type:Types.ObjectId , ref:"Reaction"}],
    comments:[{type:Types.ObjectId , ref:"Comment"}],
    text:{type:String , unique:true},
},{
    timestamps:true
})


export const Post = model("Post" , postSchema)