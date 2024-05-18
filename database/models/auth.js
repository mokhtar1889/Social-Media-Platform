import { Schema, Types, model} from "mongoose";

let authSchema = new Schema({
    firstName:{type:String , required:true},
    lastName:{type:String , required:true},
    username:{type:String , required:true},
    email:{type:String , required:true , unique:true},
    password:{type:String , required:true},
    gender:{type:String , enum:['male','female']},
    isActivated:{type:Boolean, default:false},
    dateOfBirth:{type:Date , required:true},
    mobile:{type:String , required:true , unique:true},
    resetPasswordCode:{type:String},
    profilePicture:{secure_url:String , public_id:String},
    isLoged:{type:Boolean , default:false},
    savedPosts:[{type:Types.ObjectId , ref:"Post"}],
    posts:[{type:Types.ObjectId , ref:"Post"}]
},{
    timestamps:true
})

export const User = model("User" , authSchema)