import { Router } from "express"
import { isAuthenticated } from "../../middlewares/authontication.js"
import { fileValidation, uploadFile } from "../../utile/multer.js"
import * as postControllers from "./postsControllers.js"
import * as postValidation from "./postsValidation.js"
import { validation } from "../../middlewares/validation.js"
import commentRouter from "../comment/commentRouters.js"
import reactionRouter from "../reaction/reactionRouter.js"


const router = Router()

router.use("/:postId/comment" , commentRouter)

router.use("/:postId/reaction" , reactionRouter )

router.use("/:postId/:commentId/reaction" , reactionRouter )

// add post
router.post("/createPost" , isAuthenticated , uploadFile(fileValidation.postAttachments).array("postAttachments"), validation(postValidation.createPost) ,postControllers.createPost)

//delete post
router.delete('/deletePost/:id' , isAuthenticated , validation(postValidation.deletePost) ,postControllers.deletePost)

//edit post
router.patch("/editPost/:id" , isAuthenticated , validation(postValidation.editPost) , postControllers.editPost )

//delete post attachments
router.patch("/deletePostAttachment/:postId", isAuthenticated , validation(postValidation.deletePostAttachment) , postControllers.deleteAttachment )

//add attachment to post
router.post("/addAttachment/:id" , isAuthenticated , uploadFile(fileValidation.postAttachments).array("attachments"),validation(postValidation.addAttachments),postControllers.addAttachment)

//save post
router.patch("/savePost/:postId" , isAuthenticated , validation(postValidation.savePost) , postControllers.savePost )

//remove post from saved list
router.patch("/removePost/:postId" , isAuthenticated , validation(postValidation.removePost) , postControllers.removePost)

//share post
router.patch("/sharePost/:postId" , isAuthenticated , validation(postValidation.sharePost) , postControllers.sharePost )

export default router 




