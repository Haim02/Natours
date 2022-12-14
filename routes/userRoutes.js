// const express = require('express');
// const router = express.Router();
// const userControlle = require('../controllers/userController');
// const authControlle = require('./../controllers/authController');
// const reviewController = require('../controllers/reviewController');


const express = require('express');
const userController = require('../controllers/userController');
const authControlle = require('../controllers/authController');

const router = express.Router();


router.post('/signup', authControlle.signup);
router.post('/login', authControlle.login);
router.post('/logout', authControlle.logout);

router.post('/forgotPassword', authControlle.forgotPassword);
router.patch('/resetPassword/:token', authControlle.resetPassword);

// Protect all routes after this middleware
router.use(authControlle.protect);

router.patch('/updateMyPassword', authControlle.protect, authControlle.updatePassword);
router.get('/me', authControlle.protect, userController.getMe, userController.getUser);

router.patch('/updateMe', userController.uploadUserPhoto, userController.updateMe)
router.delete('/deleteMe', userController.deleteMe)

router.use(authControlle.restrictTo('admin'));

router.route('/')
   .get(userController.getAllUsers)
   .post(userController.createUser);

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;