import HttpStatus from 'http-status-codes';
import * as AdminService from '../services/admin.service'


export const addCourse = async (req, res, next) => {
  try {
    await AdminService.addCourse(req.body);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: [],
      message: 'Courses Added successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
    try {
      await AdminService.deleteCourse(req.params.id);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: [],
        message: 'Courses Deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  export const getAllCourses=async(req,res,next)=>{
    try {
     var data= await AdminService.getAllCourses(req.params.id);
     console.log("data sent",data)
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'Courses Fetched successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  export const addQuiz=async(req,res,next)=>{
    try {
      var data= await AdminService.addQuiz(req);
      console.log("data sent",data)
       res.status(HttpStatus.OK).json({
         code: HttpStatus.OK,
         data: data,
         message: 'Courses Fetched successfully'
       });
     } catch (error) {
       next(error);
     }
  }

  export const getCertificateRequests=async(req,res,next)=>{
    try {
      var data= await AdminService.getCertificateRequests(req.params.id);
      console.log("data sent",data)
       res.status(HttpStatus.OK).json({
         code: HttpStatus.OK,
         data: data,
         message: 'Courses Fetched successfully'
       });
     } catch (error) {
       next(error);
     }
  }
