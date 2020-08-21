const router = require('express').Router();
const concoxController = require('./../controllers/conconxController');
const authMiddleware = require('./../middlewares/jwtAuthToken');

router.route('/devices').get(authMiddleware.authCheck ,concoxController.getAllDevices);
router.route('/locations/:deviceId').get(authMiddleware.authCheck ,concoxController.getDeviceLocationById);
router.route('/calculatehalts/:deviceId').get(authMiddleware.authCheck ,concoxController.calculateHalts);

module.exports = router;