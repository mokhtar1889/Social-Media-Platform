import { Router } from "express";
import * as authControllers from './authControllers.js'
import * as authValidationSchemas from "./authValidationSchemas.js"
import { validation } from "../../middlewares/validation.js";
import { isAuthenticated } from "../../middlewares/authontication.js";
import { uploadFile , fileValidation } from "../../utile/multer.js";

let router = Router()

//signup
router.post('/signup' , validation(authValidationSchemas.signup) ,authControllers.signup)

//signin 
router.post('/signin' , validation(authValidationSchemas.signin) , authControllers.signin)

//add profile picture
router.post("/addProfilePicture" , isAuthenticated ,uploadFile(fileValidation.profilePicture).single("profilePicture") , authControllers.addProfilePicture)

//update user
router.patch("/updateUser" , isAuthenticated , validation(authValidationSchemas.update), authControllers.update)

//forgetPassword
router.post("/forgetPassword" , validation(authValidationSchemas.forgetPassword),authControllers.forgetPassword)

//reset password
router.patch("/resetPassword" , validation(authValidationSchemas.resetPassword) , authControllers.resetPassword)

//activate account
router.get("/activateAccount/:token", authControllers.acticateAccount )

//delete user
router.delete("/deleteUser" , isAuthenticated , authControllers.deleteUser)

//get user profile
router.get("/myProfile" , isAuthenticated , authControllers.myProfile)

//logout
router.get("/logout" , isAuthenticated , authControllers.logout )

export default router