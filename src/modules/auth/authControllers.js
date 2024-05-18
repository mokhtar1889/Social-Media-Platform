import { User } from "../../../database/models/auth.js";
import { Token } from "../../../database/models/token.js";
import { asyncHandler } from "../../utile/asyncHandler.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"
import randomstring from "randomstring";
import { sendEmail } from "../../utile/sendEmail.js";
import cloudinary from "./../../utile/cloudinary.js"

//signup
export let signup = asyncHandler(async(req , res , next)=>{
    //date from body
    let {firstName , lastName , email , password , gender , dateOfBirth , mobile} = req.body
    console.log(req.body)

    // check if email is exists
    let user = await User.findOne({email})
    
    if(user) return next(new Error("user is already exists!" , {cause:400}))

    //hash password
    let hashPassword = bcryptjs.hashSync(password , parseInt(process.env.SALT_ROUND))
    
    //create user
    user = await User.create({
        firstName,
        lastName,
        username:`${firstName} ${lastName}`,
        email,
        password:hashPassword,
        gender,
        mobile ,
        dateOfBirth,
        profilePicture: {secure_url:process.env.PROFILE_PICTURE , public_id:process.env.PUBLIC_ID}
    })
    

    //generate token 
    let token = jwt.sign({email} , process.env.TOKEN_SECRET)

    //send activation code to email
    let ActivationLink = `http://localhost:${process.env.PORT}/auth/activateAccount/${token}`
    let html = `<a href ="${ActivationLink}" target="_blank">Activate Account</a>`
    sendEmail({to:email , subject:"activate Account" , html})

    //create empty folder in cloudinary
    let response = await cloudinary.api.create_folder(`social_platform/${user._id}`);


    return res.json({message:"user is created successfully" , user})
})

//activate Account
export let acticateAccount = asyncHandler(async(req , res , next)=>{
    let {token} = req.params

    let {email} = jwt.verify(token , process.env.TOKEN_SECRET)
    
    // get user from database
    let user = await User.findOneAndUpdate({email} , {isActivated:true})
    if(!user) return next(new Error("user is not exists!" , {cause:404}))

    return res.json({message:"account activated successfully"})
})

//add profile picture
export let addProfilePicture = asyncHandler(async(req , res , next)=>{

    let user = req.user ;
    let file = req.file.path
    
    let response = await cloudinary.uploader.upload(file,{
        folder:`social_platform/profilePictures/${user._id}`,
        
    })

    user.profilePicture = {
        secure_url: response.secure_url,
        public_id :response.public_id
    }
    await user.save()

    return res.json({success:true , message:"profile picture uploaded successfully"})

})

//signin
export let signin = asyncHandler(async(req , res , next)=>{

    let {emailOrMobile , password} = req.body

    //check if user exists
    let user = await User.findOne({$or:[{email:emailOrMobile} , {mobile:emailOrMobile}]})

    if(!user) return next(new Error("user is not exists!" , {cause:400}))

    //check password
    let isMatch = bcryptjs.compareSync(password , user.password)

    if(!isMatch) return next(new Error("password is not correct!" , {cause:400}))

    //check if account is activated
    if(user.isActivated !== true) return next(new Error("account must be activated!" , {cause:401}))

    //generate token
    let token = jwt.sign({email:user.email , id:user._id , username:user.username} , process.env.TOKEN_SECRET)

    //update login state
    user.isLoged = true 
    await user.save()

    //add token to database
    await Token.create({
        token,
        user:user._id,
        userAgent:req.headers['user-agent']
    })

    res.json({success:true , message:`welcome ${user.username}` , token })
})

//update user
export let update = asyncHandler(async(req , res , next)=>{
    let user = req.user

    let {firstName , lastName , email , mobile , dateOfBirth} = req.body

    if(email){
        let user = await User.findOne({email})
        if(user) return next(new Error("this email is already exists!" , {cause:401}))
    }

    if(mobile){
        let user = await User.findOne({mobile})
        if(user) return next(new Error("this mobile is already exists!" , {cause:401}))
    }

    user.firstName = firstName ? firstName : user.firstName 
    user.lastName = lastName ? lastName : user.lastName 
    user.username = `${user.firstName} ${user.lastName}`
    user.email = email ? email : user.email 
    user.mobile = mobile ? mobile : user.mobile 
    user.dateOfBirth = dateOfBirth ? dateOfBirth : user.dateOfBirth 
    await user.save()

    return res.json({success:true , message:"user updated successfully" , user})
})

//forget password
export let forgetPassword = asyncHandler(async(req , res , next)=>{
    let {email} = req.body

    //check email
    let user = await User.findOne({email})

    if(!user) return next(new Error("this email is not exists!" , {cause:404}))

    //generate reset password code
    let resetcode = randomstring.generate({
        length:5,
        charset:"numeric"
    })

    //add resetCode to database
    user.resetPasswordCode = resetcode ,
    await user.save()

    let html = `<h3>reset code</h3>
        <h4>${resetcode}</h4>
    `

    //send reset code to mail
    let emailSent = sendEmail({to:user.email , subject:"reset password code" , html})

    return res.json({success:true , message:"reset code sent successfully"})
})

//reset password
export let resetPassword = asyncHandler(async(req , res , next)=>{

    let {email , resetCode , newPassword} = req.body

    //check email
    let user = await User.findOne({email})
    if(!user) return next(new Error("user is not exists!" , {cause:404}))

    //check reset code
    if(resetCode !== user.resetPasswordCode) return next(new Error("invalid reset code" , {cause:400}))

    //hash new password
    let hashPassword = bcryptjs.hashSync(newPassword , parseInt(process.env.SALT_ROUND))

    //save new password to database
    user.password = hashPassword ,
    user.resetPasswordCode = undefined ,
    await user.save()

    //invalid all tokens 
    let tokens = await Token.find({user:user._id})
    tokens.forEach(async (token)=>{
        token.isValid = false
        await token.save()
    })

    return res.json({success:true , message:"password reseted suucessfully"})
})

//delete user
export let deleteUser = asyncHandler(async(req , res , next)=>{
    let user = req.user

    //deleteUser
    let response = await User.findByIdAndDelete(user._id);
    
    //delete all tokens
    let tokens = await Token.find({user:user._id})
    console.log(tokens)

    //delete all tokens
    await Token.deleteMany({user:user._id})

    //response
    return res.json({success:true , message:"user deleted successfully"})

})

//get user profile
export let myProfile = asyncHandler(async(req , res , next)=>{
    
    return res.json({user:req.user})

})

//logout
export let logout = asyncHandler(async(req , res , next)=>{
    let user = req.user 
    // change logging state
    user.isLoged = false
    await user.save()

    //invalidate tokens
    await Token.deleteMany({user:user._id})

    //response
    return res.json({success:true , message:`bye bye ${user.username}`})
})