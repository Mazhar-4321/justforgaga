import sequelize, { DataTypes } from '../config/database';


export const availableCourses = async (body) => {
    const { QueryTypes } = require('sequelize');
    var response = await sequelize.query(`select c.name,ci.instructor,c.lastDate,c.duration,c.seatsLeft,c.course_description 
  from course c
  inner join courses_enrolled ce
  on c.c_id=ce.c_id
  inner join course_instructor ci
  on c.c_id=ci.c_id
  where ce.student_id=?
  and c.seatsLeft>0
  `
        , {
            replacements: [body.email],
            type: QueryTypes.SELECT
        })

    return response;

}

export const myCourses = async (body) => {
    const { QueryTypes } = require('sequelize');
    var response = await sequelize.query(`select c.name,cn.notes,ci.instructor,c.lastDate,c.duration,c.course_description 
    from course c
    inner join courses_enrolled ce
    on c.c_id=ce.c_id
    inner join course_instructor ci
    on c.c_id=ci.c_id
    inner join course_notes cn
    on cn.c_id=c.c_id
    where ce.student_id=?
    and c.seatsLeft>0
    
  `
        , {
            replacements: [body.email],
            type: QueryTypes.SELECT
        })

    return response;

}

export const myProfile = async (body) => {
    const { QueryTypes } = require('sequelize');
    var response = await sequelize.query(`select firstName,lastName,email from users where 
    email=?`
        , {
            replacements: [body.email],
            type: QueryTypes.SELECT
        })

    return response;

}

export const updateProfile = async (body) => {
    const { QueryTypes } = require('sequelize');
    var response = await sequelize.query(`update users set firstName=?,lastName=? where 
    email=?`
        , {
            replacements: [body.firstName, body.lastName, body.email],
            type: QueryTypes.SELECT
        })

    return response;

}

export const enrollInCourse = async (body) => {
    const { QueryTypes } = require('sequelize');
    var response = await sequelize.query(`insert into courses_enrolled(c_id,student_id,status)
    values(?,?,0)`
        , {
            replacements: [body.course_id, body.student_id],
            type: QueryTypes.INSERT
        })
    if(response){
      return await  sequelize.query(`update course set seatsLeft=seatsLeft-1 where c_id=?`
        , {
            replacements: [body.course_id],
            type: QueryTypes.UPDATE
        })
    }
}
