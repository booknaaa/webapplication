const Router = require ('express');
const userController = require ('../controllers/user.controller');
const memberController = require ('../controllers/member.controller');
const pageController = require ('../controllers/page.controller');
const postController = require ('../controllers/post.controlloer');
const auth = require('../middleware/auth');
const instruments = require('../controllers/instruments.controller.js');
const serialport = require('../controllers/serialport.controller.js');
const adminController = require('../controllers/admin.controller.js');
const realtimeController = require('../controllers/realtime.controller');

const swaggerSpec = require('../../swagger');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const routes = new Router();

routes.post('/user', userController.createUser);
routes.get('/users', userController.findAllUsers);
routes.get('/users/:id', userController.findUserById);
routes.put('/users/:id', userController.updateUser);
routes.delete('/users/:id', userController.deleteUser);

routes.post('/user/register', memberController.register);
routes.post('/user/login', memberController.login);
routes.post('/user/edit/:id', memberController.edit);
routes.post('/user/delete/:id',memberController.delete);
routes.get('/user/me', memberController.me);
routes.post('/user/logout', memberController.logout)

routes.get('/',auth.redirectIfAuth,pageController.index);
routes.get('/login', auth.redirectIfAuth,memberController.loginpage);
routes.get('/register', auth.redirectIfAuth,memberController.registerpage);
routes.get('/home',auth.isAuthenticated,pageController.home);
//Intru create detelete update
routes.get('/home/:id',auth.isAuthenticated,pageController.editget);
routes.post('/home/edit/:id',pageController.editpost);
routes.post('/home/edit/connec/:id',pageController.editcon);
routes.post('/home/delete/:id',pageController.deletepost);
routes.post('/home/post',postController.postpost);
//profile
routes.get('/profile',auth.isAuthenticated,pageController.profile);
routes.get('/profile/:id',auth.isAuthenticated,pageController.profileid);
//routes.get('/profile/admin',pageController.profileadmin);
//routes.get('/profile/admin/edit/:id', pageController.editadmin);
//admin
routes.get('/admin' ,auth.isAuthenticated, adminController.admin);
//routes.get('/home/dashboard/:id',pageController.dashboardget);
//routes.get('/home/dashboard/data/:id',pageController.dashboarddata);
routes.get('/admin/instruments' ,auth.isAuthenticated, adminController.admininstru);
routes.post('/admin/instruments/delete/:id' , adminController.admindelete);
routes.post('/admin/instruments/post' , adminController.adminpost);
routes.post('/admin/instruments/func/delete/:id' , adminController.admindeletefuc);
routes.post('/admin/instruments/func/post' , adminController.adminpostfuc);
routes.get('/admin/users' ,auth.isAuthenticated, adminController.adminuser);
routes.post('/admin/users/delete/:id' , adminController.admindeleteuser );
routes.post('/admin/users/post' , adminController.adminpostuser );
routes.post('/admin/users/edit/:id' , adminController.adminedit );
routes.get('/admin/dashboard',auth.isAuthenticated, adminController.admindashboard);
routes.post('/admin/post/:id' , adminController.serialportadmin);
routes.post('/admin/delete/:id' , adminController.admindeletevalue);
routes.get('/admin/admin' ,auth.isAuthenticated, adminController.adminadmin);
routes.get('/admin/charts',auth.isAuthenticated, adminController.chartdashboard);
//routes.get('/admin/instru/edit/:id', pageController.editadmin);
//function
routes.post('/home/:id/function/post',instruments.functionpost);
routes.post('/home/:id/function/edit',instruments.functionedit);
routes.post('/home/:id/function/delete',instruments.functiondelete);
routes.post('/home/:id/function/countdash',instruments.functioncountdash);
routes.post('/home/:id/function/countdata',instruments.functioncountdata);
//dashboard
routes.get('/home/dashboard/:id',auth.isAuthenticated,serialport.pagedashboard);
routes.get('/home/dashboard/charts/:id',auth.isAuthenticated,serialport.chartdashboard);
//routes.get('/home/dashboard/:id/refresh',serialport.serialport);
routes.post('/home/dashboard/data/function/:id',serialport.serialportpost);
routes.post('/home/dashboard/function/:id',serialport.serialportdash);
//routes.get('/home/dashboard/data/:id',auth.isAuthenticated,serialport.datadashboard);
routes.get('/home/dashboard/data/:id',auth.isAuthenticated,serialport.datadashboard);
routes.post('/home/dashboard/delete/data/:id',serialport.deletevalue);
routes.post('/home/dashboard/delete/:id',serialport.deletevaluedata);
routes.post('/home/dashboard/stop/:id',serialport.serialportstop);
routes.post('/home/dashboard/start/:id',serialport.savevalue);
routes.get('/download/:id',serialport.export);
//routes.post('/home/dashboard/value',serialport.postvalue);
//routes.get('/charts',instruments.chart2);

module.exports = routes;