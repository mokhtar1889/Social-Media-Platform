import { Post } from "../../../database/models/post.js"
import { Comment } from "../../../database/models/comment.js"
import { asyncHandler } from "../../utile/asyncHandler.js"



//add comment to post
export const addComment = asyncHandler(async(req , res , next)=>{
    let user = req.user
    let {comment} = req.body
    let {postId} = req.params

    //check post 
    let post = await Post.findById(postId)
    if(!post) return next(new Error("post is not exists!" , {cause:404}))

    //check if user comment on this post befor
    let commentDB = await Comment.findOne({user:user._id , post:postId})
    if(commentDB) return next(new Error("you already comment on this post" , {cause:401}))   

    //create comment
    let response = await Comment.create({
        post:postId ,
        user:user._id,
        comment , 
    })

    // add post to post document
    post.comments.push(response._id)
    await post.save()
    
    //response
    return res.json({success:true , message:"comment added successfully"})
        

})

//remove comment from post
export const removeComment = asyncHandler(async(req , res , next)=>{
    let user = req.user 
    let { postId , commentId} = req.params

    //check post
    let post = await Post.findOne({_id:postId})
    if(!post) return next(new Error("post is not exists!" , {cause:404}))

    //check commet
    let comment = await Comment.findOne({_id:commentId , user:user._id})
    if(!comment) return next(new Error("comment is not exists!" , {cause:404} ))

    //remove comment from post document
    post.comments.forEach((comment , index , array)=>{
        if(comment.toString() === commentId.toString()) array.splice(index , 1)
    })
    await post.save()

    //remove comment from collection
    await Comment.deleteOne({_id:commentId})

    //response
    return res.json({success:true , message:"comment deleted successfully"})
        
})