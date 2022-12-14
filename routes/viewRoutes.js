// const express = require('express');
// const viewController = require('../controllers/viewsController');
// const authController = require('../controllers/authController')
// const router = express.Router();

// router.use(authController.isLoggedIn)

// router.get('/', authController.isLoggedIn, viewController.getOverview);
// router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour); 
// router.get('/login', authController.isLoggedIn, viewController.getLoginForm)
// router.get('/me', authController.protect, viewController.getAccount)
 
// module.exports = router


const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewsController.alerts);

router.get('/', authController.isLoggedIn, viewsController.getOverview);

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);

module.exports = router;