const router = require('express').Router();
const concoxController = require('./../controllers/conconxController');
const authMiddleware = require('./../middlewares/jwtAuthToken');

router.route('/devices').get(authMiddleware.authCheck ,concoxController.getAllDevices);
router.route('/locations/:deviceId').get(authMiddleware.authCheck ,concoxController.getDeviceLocationById);

module.exports = router;