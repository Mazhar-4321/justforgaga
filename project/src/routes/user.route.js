import express from 'express';
import * as userController from '../controllers/user.controller';
import { newUserValidator } from '../validators/user.validator';
import { userAuth } from '../middlewares/auth.middleware';

const router = express.Router();

//route to get all users
router.get('', userController.getAllUsers);

//route to create a new user
router.post('', newUserValidator, userController.newUser);

//route to get a single user by their user id
router.post('/login',  userController.getUser);

router.post('/validateEmail',userController.validateEmail);

router.post('/forgetPassword',userController.forgetPassword);

router.post('/reset',userController.resetPassword)



export default router;
