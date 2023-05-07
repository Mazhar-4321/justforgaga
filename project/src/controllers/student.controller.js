import HttpStatus from 'http-status-codes';
import * as UserService from '../services/user.service';
import * as StudentService from '../services/student.service';

/**
 * Controller to get all users available
 * @param  {object} req - request object
 * @param {object} res - response object
 * @param {Function} next
 */
export const availableCourses = async (req, res, next) => {
  try {
    const data = await StudentService.availableCourses(req.params.email);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'All courses fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getImageById = async (req, res, next) => {
  try {
    const data = await StudentService.getImageById(req.params.id);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'All courses fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const myCourses = async (req, res, next) => {
    try {
      const data = await StudentService.myCourses(req.params.email);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'All courses fetched successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  export const enrollInCourse = async (req, res, next) => {
    try {
      const data = await StudentService.enrollInCourse(req.body);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'Course Enrollment Successful'
      });
    } catch (error) {
      next(error);
    }
  };
  export const getQuiz = async (req, res, next) => {
    try {
      const data = await StudentService.getQuiz(req.params.courseId);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'Course Enrollment Successful'
      });
    } catch (error) {
      next(error);
    }
  };

  export const submitQuiz = async (req, res, next) => {
    try {
      const data = await StudentService.submitQuiz(req);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'Course Enrollment Successful'
      });
    } catch (error) {
      next(error);
    }
  };

  export const getHighestMarks = async (req, res, next) => {
    try {
      const data = await StudentService.getHighestMarks(req);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'Course Enrollment Successful'
      });
    } catch (error) {
      next(error);
    }
  };

  export const cancelCourse = async (req, res, next) => {
    try {
      const data = await StudentService.cancelCourse(req);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'Course Enrollment Successful'
      });
    } catch (error) {
      next(error);
    }
  };

