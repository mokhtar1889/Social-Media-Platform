import { Schema, Types, model } from "mongoose";


const commentSchema = new Schema({
    post:{type:Types.ObjectId , ref:"Post" , required:true},
    user:{type:Types.ObjectId , ref:"User" , required:true},
    comment:{type:String , required:true},
    reactions:[{type:Types.ObjectId  , ref:"Reaction"}]
},

{timestamps:true}

)


export const Comment = model( "Comment" , commentSchema)