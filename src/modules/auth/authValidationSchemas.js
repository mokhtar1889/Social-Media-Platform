import joi from 'joi'


//signup
export let signup = joi.object({
    firstName:joi.string().required(),
    lastName:joi.string().required(),
    email:joi.string().required().email(),
    password:joi.string().required(),
    confirmPassword:joi.string().required().valid(joi.ref("password")),
    gender:joi.string().required().valid("male" , "female"),
    dateOfBirth:joi.date().required(),
    mobile:joi.string().required()

}).required()

//signin
export let signin = joi.object({
    emailOrMobile:joi.string().required(),
    password:joi.string().required()
}).required()

//update
export let update = joi.object({
    firstName:joi.string(),
    lastName:joi.string(),
    email:joi.string().email(),
    dateOfBirth:joi.date(),
    mobile:joi.string()

}).required()

//forget password
export let forgetPassword = joi.object({
    email:joi.string().required().email(),
}).required()

//rest password
export let resetPassword = joi.object({
    email:joi.string().required().email(),
    resetCode:joi.string().required().length(5),
    newPassword:joi.string().required(),
    confirmPassword:joi.string().valid(joi.ref("newPassword")).required()
}).required()