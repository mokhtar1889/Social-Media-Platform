import joi from "joi";
import { Types } from "mongoose";

//custom id validation
let objectId = (value , helper)=>{
    if(Types.ObjectId.isValid(value)) return true
     return helper.message("id is not valid")
}

//add comment to post
export const addComment = joi.object({
    postId:joi.custom(objectId).required(),
    comment:joi.string().required()
}).required()

//remove comment from post
export const removeComment = joi.object({
    postId:joi.custom(objectId).required(),
    commentId:joi.custom(objectId).required()
}).required()