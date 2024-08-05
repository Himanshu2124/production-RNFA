const express = require ('express')
const {requireSingIn} = require ("../controllers/userController");
const {createPostController, getAllPostsContoller, getUserPostsController, deletePostController, UpdatePostController} =require ("../controllers/postController")

// router object

const router = express.Router()

//Create Post || Post 
router.post("/create-post", requireSingIn , createPostController) ;

//GET  ALL POST || POST
router.get('/get-all-post', getAllPostsContoller)

//GET  USER POST || POST
router.get('/get-user-post', requireSingIn, getUserPostsController);

// DELETE  POST || POST
router.delete('/delete-post/:id',deletePostController);

//UPDATE POST || POST
router.put('/update-post/:id', UpdatePostController);

//export
module.exports = router;