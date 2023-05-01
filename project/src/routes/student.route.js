import express from 'express';
import * as userController from '../controllers/user.controller';
import * as StudentController from '../controllers/student.controller';
import { newUserValidator, } from '../validators/user.validator';
import { studentAuth, userAuth } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/availableCourses/:email', studentAuth, StudentController.availableCourses);

router.get('/myCourses/:email', studentAuth, StudentController.myCourses);

router.post('/enroll', studentAuth, StudentController.enrollInCourse);

router.get('/quiz/:courseId', studentAuth, StudentController.getQuiz);

router.post('/quiz/:courseId', studentAuth, StudentController.submitQuiz);

router.get('/marks/:courseId',  StudentController.getHighestMarks);

router.post('/cancelCourse',  StudentController.cancelCourse);




export default router;
