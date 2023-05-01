import express from 'express';
import * as AdminController from '../controllers/admin.controller'


const router = express.Router();

router.post('/addCourse', AdminController.addCourse);

router.get('/courses/:id', AdminController.getAllCourses);


router.delete('/courses/:id', AdminController.deleteCourse);

router.post('/addQuiz/:id',AdminController.addQuiz);

router.get('/certificateRequests/:id',AdminController.getCertificateRequests)





export default router;
