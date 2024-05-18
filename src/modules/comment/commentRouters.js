import { Router } from "express";
import { isAuthenticated } from "../../middlewares/authontication.js";
import { validation } from "../../middlewares/validation.js";
import * as commentValidation from "./commentValidation.js"
import * as commentControllers from "./commentControllers.js"

const router = Router({mergeParams:true})

//add commment to post
router.post("/addComment" , isAuthenticated , validation(commentValidation.addComment) , commentControllers.addComment)

//remove comment from post
router.delete("/removeComment/:commentId" , isAuthenticated , validation(commentValidation.removeComment) , commentControllers.removeComment)


export default router 