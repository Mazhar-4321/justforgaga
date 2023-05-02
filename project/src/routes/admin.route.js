import express from 'express';
import * as AdminController from '../controllers/admin.controller'


const router = express.Router();

router.post('/addCourse', AdminController.addCourse);



router.get('/courses/:id', AdminController.getAllCourses);


router.delete('/courses/:id', AdminController.deleteCourse);
router.post('/deleteNoteById', AdminController.deleteNoteById);
router.post('/addQuiz/:id',AdminController.addQuiz);

router.get('/certificateRequests/:id',AdminController.getCertificateRequests)

router.get('/courseById/:id',AdminController.getCourseById);

router.post('/checkFiles',AdminController.updateCourse);


router.put('/updateCourse', AdminController.updateCourse);
 router.get('/dashboard/:id',AdminController.getDashBoardDetails)



export default router;
