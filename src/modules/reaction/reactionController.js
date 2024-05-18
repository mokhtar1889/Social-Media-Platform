import { Reaction } from "../../../database/models/reaction.js"
import { Post } from "../../../database/models/post.js"
import { Comment } from "../../../database/models/comment.js"
import { asyncHandler } from "../../utile/asyncHandler.js"



//add reaction to post
export const addReaction = asyncHandler(async(req , res , next)=>{
    let {postId} = req.params 
    let user = req.user

    //check post
    let post = await Post.findById(postId)
    if(!post) return next(new Error("post is not exists!" , {cause:404}))

    //check reaction 
    let reaction = await Reaction.findOne({user:user._id , post:post._id})
    if(reaction) return next(new Error("you already reacted to this post" , {cause:400}))    
    
    //add reaction 
    let reactionDB = await Reaction.create({
        user:user._id ,
        reaction:req.body.reaction,
        post:post._id
    })

    // add reaction to post document
    post.reactions.push(reactionDB._id);
    await post.save()

    //response
    return res.json({success:true , message:"Reaction added to post" , reaction:reactionDB.reaction})
})

//remove reaction from post 
export const removeReaction = asyncHandler(async(req , res , next)=>{
    let {postId , reactionId} = req.params 
    let user = req.user 

    //check post
    let post = await Post.findById(postId)
    if(!post) return next(new Error("post is not exists!" , {cause:404}))
    
    // check if user have already react to this post 
    let reaction = await Reaction.findOne({_id:reactionId , user:user._id})
    if(!reaction) return next(new Error("there is no reaction on this post to remove" , {cause:404})) 
    console.log(reaction)    
    
    //remove reaction from post document
    post.reactions.forEach((reaction , index , array)=>{
        if(reaction.toString() == reactionId.toString()) array.splice(index , 1)
    })    
    await post.save()

    //remove reaction from reaction collection
    await Reaction.deleteOne({_id:reaction._id})

    //response
    return res.json({success:true , message:"reaction deleted successfully"})


})

//add reaction to comment
export const addReactionToComment = asyncHandler(async(req, res , next) => {
    let user = req.user
    let {reaction} = req.body
    let {postId , commentId} = req.params

    //check post
    let post = await Post.findById(postId)
    if(!post) return next(new Error("post is not exists!" , {cuase:404}))
     
    //check comment
    let comment = await Comment.findById(commentId)
    if(!comment) return next(new Error("comment is not exists!" , {cause:404}))
        
    // check if user react to this comment before
    let reactionDB = await Reaction.findOne({user:user._id , comment:commentId})
    if(reactionDB) return next(new Error("you already reacted to this post before" , {cause:401}))

    //craete reaction
    let response = await Reaction.create({
        user:user._id ,
        comment:commentId,
        reaction
    })

    //add reaction to comment document in database
    comment.reactions.push(response._id)
    await comment.save()
    
    //response
    return res.json({success:true , message:"reaction added to comment successfully"})
})

//remove reaction from comment
export const removeReactionFromComment = asyncHandler(async(req , res , next) => { 
    let user = req.user 
    let {reactionId , commentId , postId} = req.params

    //check comment
    let comment = await Comment.findById(commentId)
    if(!comment) return next(new Error("this comment is not exists!" , {cause:404}))
    
    //check the reaction 
    let reaction = await Reaction.findById(reactionId)
    if(!reaction) return next(new Error("there is no reaction to remove" , {cause:404}))    

    //check the owner of the reaction
    if(reaction.user.toString() !== user._id.toString()) return next(new Error("only the owner of the reaction can remove it" , {cause:403}))

    // remove reaction from comment document
    comment.reactions.forEach((reaction,index , array)=>{
        if(reaction.toString() === reactionId.toString()) array.splice(index , 1)
    })
    await comment.save()

    //remove reaction from reaction collection
    await Reaction.findByIdAndDelete(reactionId)

    //response
    return res.json({success:true , message:"reaction removed successfully"})

})