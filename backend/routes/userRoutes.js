const express= require('express');
const router = express.Router();
 
const {registerUser,authUser,allUsers,Gotp} = require('../controlers/userControler');
const protect = require('../middleware/authMiddleware');
 
router.route('/').post(registerUser)
router.route('/').get(protect, allUsers);
router.route('/login').post(authUser);
router.route('/otp').post(Gotp);

 
 


module.exports = router;


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MjI5MDBjNDVjNTMzYjI2YTQ4OTBiYSIsImlhdCI6MTY5NjkyODIzMywiZXhwIjoxNjk3MDE0NjMzfQ.OZHlIbJtQvMHcb3bFc00I_oGtOQzdus-uGOwS88UBMs