import {asyncHandler} from "./../../utile/asyncHandler.js"
import cloudinary from "../../utile/cloudinary.js"
import { Post } from "../../../database/models/post.js"
import { Comment } from "../../../database/models/comment.js"

// create post 
export const createPost = asyncHandler(async(req , res , next)=>{
    
    let {text} = req.body
    let user = req.user
    let attachments = req.files

    
    let post = await Post.create({
        user:user._id,
        text 
    })

    //save attachments in the database if exists    
    if(attachments){
        let response ;
        attachments.forEach(async(attach)=>{
            response = await cloudinary.uploader.upload(attach.path, {
                folder:`social_platform/${user._id}/posts/${post._id}`
            })
            post.attachments.push({
                public_id:response.public_id,
                secure_url:response.secure_url
            })
            await post.save()
        })
    }

    //add post to user document
    user.posts.push(post._id)
    await user.save()

    return res.json({success:true , message:'post created successfully' , post})
})

//delete post 
export const deletePost = asyncHandler(async(req , res , next)=>{
    let {id} = req.params
    let user = req.user

    //check post 
    let post = await Post.findById(id)
    if(!post) return next(new Error("this post is not exists!" , {cause:404}))

        if(post.user.toString() == user._id.toString()){
            
            //delete any attachments of the post from database
            if(post.attachments.length !== 0){
                console.log(post)
                //delete all attachments in the cloudinary 
                let result = await cloudinary.api.delete_resources_by_prefix(
                    `social_platform/${user._id}/posts/${post._id}`);
                //delete empty folder of the post cloudinary
                let deleteFolderResponse =  await cloudinary.api.delete_folder(`social_platform/${user._id}/posts/${post._id}`)
                // delete post from user document
                user.posts.forEach(async (element , index , array)=>{
                    if(element._id.toString() == post._id.toString()){
                    array.splice(index , 1)
                    await user.save()
                    } 
                })  
                //delete post from database 
                await post.deleteOne() 
               
            } 

            if(post.attachments.length == 0){
                console.log(user.posts)
                // delete post from user document
                user.posts.forEach(async (element , index , array)=>{
                    console.log(element._id.toString())
                    console.log(post._id.toString())
                    if(element._id.toString() == post._id.toString()){
                        array.splice(index , 1)
                        await user.save()
                    } 
                })
                //delete post from database 
                await post.deleteOne() 
            }  
        }

    //response
    return res.json({success:true , message:"posts deleted successfully"})

})

//edit post
export const editPost = asyncHandler(async(req , res , next)=>{
    let {id} = req.params
    let {text} = req.body 
    let user = req.user

    //check if post is exists
    let post = await Post.findById(id)
    if(!post) return next(new Error("post is not exists!" , {cause:404}))

    // check ownershipe of the post     
    if(post.user.toString() !== user._id.toString()) return next(new Error("only owner of the post can edite it" , {cause:403}))    
    
    //edit post
    post.text = text ? text : post.text
    await post.save()

    //response
    return res.json({success:true , message:"post edited successfully"})
})

//delete post attachment
export const deleteAttachment = asyncHandler(async(req , res , next)=>{

    let {postId} = req.params 
    let {public_id} = req.query
    let user = req.user

    //check post owner
    let post = await Post.findOne({_id:postId ,user:user._id})
    if(!post) return next(new Error("only owner of the post can edit it", {cause:403}))

    //delete attachment from database    
    post.attachments.forEach(async(attach , index , array)=>{

        if(attach.public_id == public_id) array.splice(index , 1)   
    })    
        await post.save()
    


    //delete attachment form cloudinary
    let response = await cloudinary.uploader.destroy(public_id)
    console.log(response)

    //response
    return res.json({success:true , message:"attachment deleted successfully"})

})

//add attachment
export const addAttachment = asyncHandler(async(req , res , next)=>{
    let user = req.user
    let {id} = req.params
    let files = req.files

    //check post ownership
    let post = await Post.findOne({user:user._id , _id:id})
    if(!post) return next(new Error("only the owner of the post can add attachment" , {cause:403}))

    //add files to cloudinary 
    files.forEach(async(file)=>{
        let response = await cloudinary.uploader.upload(file.path , {
            folder:`social_platform/${user._id}/posts/${post._id}`
        })
        post.attachments.push({
            secure_url:response.secure_url ,
            public_id:response.public_id
        })
        await post.save()
    })
        
    
    return res.json({success:true , message:"attachments added successfully"})

})

//save post
export const savePost = asyncHandler(async(req , res , next)=>{
    let user = req.user
    let {postId} = req.params

    //check post
    let post = await Post.findById(postId)
    if(!post) return next(new Error("post is not exists!" , {cause:404}))

        //add post to user document
        user.savedPosts.push(post._id)
        await user.save()

        //response
        return res.json({success:true , message:"post saved"})      
})

//remove post from saved list
export const removePost = asyncHandler(async(req , res , next)=>{
   let user = req.user
   let {postId} = req.params 

   //check post 
   let post = await Post.findById(postId)
   if(!post) return next(new Error("post is not exists!" , {cause:404}))

    //remove post from saving list
    user.savedPosts.forEach((element , index , array)=>{

        if(element._id.toString() === postId.toString()) array.splice(index , 1)    

    })

    console.log(user.savedPosts)

    await user.save()

    return res.json({success:true , message:"post removed from saveing list"})

})

//share post 
export const sharePost = asyncHandler(async(req , res , next)=>{

    let user = req.user
    let {postId} = req.params

    //check post
    let post = await Post.findById(postId)

    if(!post) return next(new Error("post is not exists!" , {cause:404}))

    // create new post
    let newPost = await Post.create({
        user:req.user._id ,
        text:post.text,
        attachments:post.attachments
    })    

    console.log(newPost)

        // add post to user  posts lists
        user.posts.push(newPost._id)
        await user.save()

        //response
        return res.json({success:true , message:"post shared"})

})

//user posts
export const userPosts = asyncHandler(async(req , res , next)=>{
    let user = req.user
    let posts = await Post.find({user:user._id})

    return res.json({
        success:true ,
        numberOfPosts:posts.length ,
        posts
    })

})

//get post
export const getPost = asyncHandler(async(req , res , next)=>{

    let {postId} = req.params

    //check post
    let post = await Post.findById(postId).populate({path:"comments" , populate:{path:"user"}})
    if(!post) return next(new Error("post is not found",{cause:404}))

    return res.json({
        success:true,
        post
    })    

})

//get post comments
export const getPostComments = asyncHandler(async(req , res , next)=>{
    let {postId} = req.params

    //check post 
    let post = await Post.findById(postId)
    if(!post) return next(new Error("post is not exists!" , {cause:404}))
    
    // find post comments
    let comments = await Comment.find({post:postId}).populate("user")
    
    //response
    return res.json({success:true , numberOfComments:comments.length , comments})
        
})