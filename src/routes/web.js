import express  from "express";
import restaurantController from '../controllers/restaurantController';
import careerController from '../controllers/careerController';
import userController from '../controllers/userController';
import authController from '../controllers/authController';
import {protect,authorize}     from     '../middleware/auth';

const router = express.Router();

let initWebRoutes = (app) => {
    
    router.post('/auth/register', authController.register);
    router.post('/auth/login', authController.login);
    router.get('/auth/me',protect,authController.userProfile);
    router.post('/auth/forgotPassword', authController.forgotPassword);
    router.post('/auth/resetPassword/:resetToken', authController.resetAuth);
    router.get('/auth/logout',protect,authController.logout);
    
    
    router.get('/restaurants', restaurantController.getAllRestaurants);
    router.get('/restaurants/:id', restaurantController.getSingleRestaurant);
    router.post('/restaurants/add',protect,authorize("publisher","admin"),restaurantController.postRestaurant);
    router.put('/restaurants/edit/:id',protect,authorize("publisher","admin"),restaurantController.putRestaurant);
    router.delete('/restaurants/delete/:id',protect,authorize("publisher","admin"), restaurantController.deleteRestaurant);


    router.get('/careers', careerController.getAllCareers);
    router.get('/careers/:id', careerController.getSingleCareer);
    router.post('/careers/add',protect,authorize("publisher","admin"),careerController.postCareer);
    router.put('/careers/edit/:id',protect,authorize("publisher","admin"),careerController.putCareer);
    router.delete('/careers/delete/:id',protect,authorize("publisher","admin"),careerController.deleteCareer);
    router.put('/event/:type/:id', careerController.putCareerEvent);


    router.get('/users',protect,authorize("admin"),userController.getAllUsers);
    router.get('/users/:id',protect,authorize("admin"),userController.getSingleUser);
    router.post('/users/add',protect,authorize("admin"),userController.postUser);
    router.put('/users/edit/:id',protect,authorize("admin"),userController.putUser);
    router.delete('/users/delete/:id',protect,authorize("admin"), userController.deleteUser);


    return app.use('/api/v1',router);
           
}
module.exports = initWebRoutes;