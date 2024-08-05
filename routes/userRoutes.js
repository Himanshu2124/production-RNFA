const express =require ('express')
const { registerController, loginController, updateUserController, requireSingIn } = require('../controllers/userController')
//router obj
const router =express.Router()

// routes
//REGISTER ||POST
router.post('/register' , registerController)

//LOGIN || POST
router.post('/login', loginController)

//UPDATE || PUT
router.put('/update-user', updateUserController, requireSingIn)

//export 
module.exports =router;