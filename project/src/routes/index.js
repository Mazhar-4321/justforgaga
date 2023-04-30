import express from 'express';
const router = express.Router();

import userRoute from './user.route';
import studentRoute from './student.route'
import adminRoute from './admin.route'
/**
 * Function contains Application routes
 *
 * @returns router
 */
const routes = () => {
  router.get('/', (req, res) => {
    res.json('Welcome');
  });
  router.use('/users', userRoute);
  router.use('/students', studentRoute);
  router.use('/admins', adminRoute);
  return router;
};

export default routes;
