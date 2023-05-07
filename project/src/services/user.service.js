import sequelize from '../config/database';
import { sendEmail } from '../utils/user.util';
import Jwt from 'jsonwebtoken';
const bcrypt = require('bcrypt');




export const newUser = async (body) => {
  try {
    const { QueryTypes } = require('sequelize');
    const expiry = Date.now();
    var otpResponse = await sequelize.query('select * from otp where otp=? and email=? and expiry>=?'
      , {
        replacements: [body.otp, body.email, expiry],
        type: QueryTypes.SELECT
      })
    console.log("otpResponse", otpResponse)
    if (otpResponse.length > 0) {
      body.password = bcrypt.hashSync(body.password, 10);
      var childTable = await sequelize.query(
        `insert into role(email,role_name)
  values(?,?)`,
        {
          replacements: [body.email, body.role],
          type: QueryTypes.INSERT
        }
      );
      var response = await sequelize.query(
        `insert into users(firstName,lastName,email,password)
  values(?,?,?,?)`,
        {
          replacements: [body.firstName, body.lastName, body.email, body.password],
          type: QueryTypes.INSERT
        }
      );
      if (body.role === 'admin') {
        var priviligeResponse = await sequelize.query(
          `insert into privilige(admin_email,status)
  values(?,0)`,
          {
            replacements: [body.email],
            type: QueryTypes.INSERT
          }
        );
      }
      return response;
    } else {

      throw new Error('Invalid OTP')
    }
  } catch (err) {
    console.log(err)
    throw new Error(err)
  }
};

export const getUser = async (body) => {
  const { QueryTypes } = require('sequelize');

  var response = await sequelize.query(
    `select * from(select U.firstName,P.status,lastName,U.email,U.password,R.role_name from users U
      inner join
      role R
      on U.email=R.email
      left join
      privilige P 
      on P.admin_email=U.email
      union
      select U.firstName,P.status,lastName,U.email,U.password,R.role_name from users U
      right join
      role R
      on U.email=R.email
      right join
      privilige P 
      on P.admin_email=U.email)s1
      where s1.email=?`,
    {
      replacements: [body.email],
      type: QueryTypes.SELECT
    }
  );
console.log(response);
if(response[0].status==='0'){
  return "null" + "," + "null" + "," + "null"
}
  if (response.length > 0) {
    const verified = bcrypt.compareSync(body.password, response[0].password)
    if (!verified) {
      throw new Error('Invalid  Password')
    } else {

      var token = await Jwt.sign({ email: body.email }, process.env.SECRET_KEY);
      console.log("token", token)
      if (response[0].role_name === 'student')
        return response[0].role_name + "," + response[0].firstName + "," + response[0].lastName + "," + response[0].email + "," + token
      else
        return response[0].role_name + "," + response[0].email + "," + token
    }
  } else {
    throw new Error("Invalid Password or Email")
  }

};

export const validateEmail = async (body) => {
  console.log("reached validation", body)
  const { QueryTypes } = require('sequelize');//ODM , ORM
  let otp = Math.floor(1000 + Math.random() * 9000);//4 digit otp
  let expiration = Date.now() + 1000 * 60 * 10 + otp;// expiration
  try {
    var response = await sequelize.query(
      ` insert into otp(otp,email,expiry)
    values(?,?,?);`,
      {
        replacements: [otp, body.email, expiration],
        type: QueryTypes.INSERT
      }
    );
    // insert into otp(otp,email,expiry) values(1456,'himnana',123242627)
    console.log("after insert", response)
    if (response) {
      await sendEmail(body.email, `4 digit Otp Expires in 10 mins :${otp}`, 'Email Validation for Registration Process')


      // return response;
    }
  } catch (err) {
    console.log("my error", err.name, body.email)
    if (err.name === 'SequelizeUniqueConstraintError') {
      await sendEmail(body.email, `4 digit Otp Expires in 10 mins :${otp}`, 'Email Validation for Registration Process')

      var response = await sequelize.query(
        ` update otp set otp=? , expiry=? where email=?`,
        {
          replacements: [otp, expiration, body.email],
          type: QueryTypes.UPDATE
        }
      );
    }
  }
}

export const forgetPassword = async (body) => {
  try {
    console.log("forget password", body)
    var emailResponse = validateEmail(body);
    return emailResponse;
  } catch (err) {
    throw new Error(err)
  }
}

export const reset = async (body) => {
  const { QueryTypes } = require('sequelize');
  try {
    const expiry = Date.now();
    var otpResponse = await sequelize.query('select * from otp where otp=? and email=? and expiry>=?'
      , {
        replacements: [body.otp, body.email, expiry],
        type: QueryTypes.SELECT
      })
    if (otpResponse.length > 0) {
      var response = await sequelize.query(
        ` update users set password=? where email=?;`,
        {
          replacements: [bcrypt.hashSync(body.password, 10), body.email],
          type: QueryTypes.UPDATE
        }
      );
    } else {
      throw new Error('Reset Failed')
    }
  } catch (err) {
    throw new Error('Reset Failed')
  }

}
