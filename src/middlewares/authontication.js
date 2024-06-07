import jwt from "jsonwebtoken"
import { User } from "../../database/models/auth.js";
import { Token } from "../../database/models/token.js";



export let isAuthenticated = async (req , res , next)=>{

    let {token} = req.headers

    //check if token exists
    if(!token) return next(new Error("token is missing",{cause:404}))

    //check token
    let tokenDB = await Token.findOne({token , isValid:true})
    if(!tokenDB) return next(new Error("token is expired" , {cause:401}))

    //check user
    let payload = jwt.verify(token , process.env.TOKEN_SECRET)
    
    let user = await User.findById(payload.id).select("-password -isActivated -__v").populate({path:"posts" , populate:{path:"reactions"}})

    if(!user) next(new Error("user is not exists!" , {cause:404}))

    //add user to request
    req.user = user

    return next()

}