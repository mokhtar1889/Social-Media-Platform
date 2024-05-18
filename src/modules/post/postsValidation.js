import joi from "joi";
import { Types } from "mongoose";


//custom id validation
let objectId = (value , helper)=>{
    if(Types.ObjectId.isValid(value)) return true
     return helper.message("id is not valid")
}

// create post
export const createPost = joi.object({
    text:joi.string().required(),
}).required()

//delete post 
export const deletePost = joi.object({
    id:joi.custom(objectId).required()
}).required()

//edit post 
export const editPost = joi.object({
    id:joi.custom(objectId).required(),
    text:joi.string()   
}).required()

//delete post attachment
export const deletePostAttachment = joi.object({
   postId:joi.custom(objectId).required(),
   public_id:joi.string().required()
}).required()

//add attachments
export const addAttachments = joi.object({
    id:joi.custom(objectId).required()
}).required()

//save post
export const savePost = joi.object({
    postId:joi.custom(objectId).required()
}).required()


//remove post from save list
export const removePost = joi.object({
    postId:joi.custom(objectId).required()
}).required()

//remove post from save list
export const sharePost = joi.object({
    postId:joi.custom(objectId).required()
}).required()