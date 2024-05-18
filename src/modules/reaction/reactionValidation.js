import joi from "joi"
import { Types } from "mongoose"

//custom id validation
let objectId = (value , helper)=>{
    if(Types.ObjectId.isValid(value)) return true
     return helper.message("id is not valid")
}

//add reaction to post 
export const addReation = joi.object({
    postId:joi.custom(objectId).required(),
    reaction:joi.string().valid('like' , 'love' , 'care' , 'haha', 'wow' , 'sad' , 'angery').required()
}).required()

//remove reaction form post 
export const removeReaction = joi.object({
    postId:joi.custom(objectId).required(),
    reactionId:joi.custom(objectId).required(),

}).required()

//add reaction to comment
export const addReactionToComment = joi.object({
    postId:joi.custom(objectId).required(),
    commentId:joi.custom(objectId).required(),
    reaction:joi.string().valid('like' , 'love' , 'care' , 'haha', 'wow' , 'sad' , 'angery').required()
}).required()

//remove reaction from comment
export const removeReactionFromComment = joi.object({
    postId:joi.custom(objectId).required(),
    commentId:joi.custom(objectId).required(),
    reactionId:joi.custom(objectId).required()
}).required()
