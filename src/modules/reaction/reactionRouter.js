import { Router } from "express";
import { isAuthenticated } from "../../middlewares/authontication.js";
import { validation } from "../../middlewares/validation.js";
import * as reactionValidation from "./reactionValidation.js"
import * as reactionControllers from "./reactionController.js"

const router = Router({mergeParams:true})

//add reaction to post
router.post("/addReaction" , isAuthenticated , validation(reactionValidation.addReation), reactionControllers.addReaction )

//remove reaction from post
router.delete("/removeReaction/:reactionId" , isAuthenticated , validation(reactionValidation.removeReaction), reactionControllers.removeReaction)

//add reaction to comment
router.post("/addReactionToComment" , isAuthenticated , validation(reactionValidation.addReactionToComment), reactionControllers.addReactionToComment)

//remove reaction from comment
router.delete("/removeReactionFromComment/:reactionId",isAuthenticated , validation(reactionValidation.removeReactionFromComment),reactionControllers.removeReactionFromComment)





export default router 
