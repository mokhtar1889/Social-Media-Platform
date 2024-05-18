import { Schema, Types, model } from "mongoose";

const reactionSchema = new Schema({
    user:{type:Types.ObjectId , ref:"User" , required:true} ,
    post:{type:Types.ObjectId , ref:"Post"},
    reaction:{type:String , enum:['like' , 'love' , 'care' , 'haha', 'wow' , 'sad' , 'angery'] , required:true},
    comment:{type:Types.ObjectId , ref:"Comment"}


},{timestamps:true})

export const Reaction = model("Reaction" , reactionSchema)