import {asyncHandler} from "./../../utile/asyncHandler.js"
import cloudinary from "../../utile/cloudinary.js"
import { Post } from "../../../database/models/post.js"



// create post 
export const createPost = asyncHandler(async(req , res , next)=>{
    
    let {text} = req.body
    let user = req.user
    let attachments = req.files

    //check if post exists
    let post = await Post.findOne({text})
    if(post) return next(new Error("this post is already exists!!", {cause:400}))

    
    post = await Post.create({
        user:user._id,
        text 
    })

    //save attachments in the database if exists    
    if(req.files){
        let response ;
        attachments.forEach(async (attachment) => {
             response = await cloudinary.uploader.upload(attachment.path , {
                folder:`social_platform/${user._id}/posts/${post._id}`
            })
            post.attachments.push({
                public_id:response.public_id,
                secure_url:response.secure_url
            })
            await post.save()
        });
    }

    //add post to user document
    user.posts.push(post._id)
    await user.save()

    return res.json({success:true , message:'post created successfully'})


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
                if(post.attachments){

                    //delete all attachments in the cloudinary 
                    let result = await cloudinary.api.delete_resources_by_prefix(
                        `social_platform/${user._id}/posts/${post._id}`);


                    //delete empty folder of the post cloudinary
                    let deleteFolderResponse =  await cloudinary.api.delete_folder(`social_platform/${user._id}/posts/${post._id}`)
                   
                }  

                // delete post from user document
                user.posts.forEach(async (element , index , array)=>{
                    if(element.toString() == post._id.toString()){
                        array.splice(index , 1)
                        await user.save()
                    } 
                })  

                //delete post from database 
                await post.deleteOne() 
        }else {
            // delete post from user document
            user.posts.forEach(async (element , index , array)=>{
                if(element.toString() == post._id.toString()){
                    array.splice(index , 1)
                    await user.save()
                } 
            })  
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

        if(element.toString() === postId.toString()) array.splice(index , 1)    

    })
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

        // add post to user  posts lists
        user.posts.push(post._id)
        await user.save()

        //response
        return res.json({success:true , message:"post shared"})

})
