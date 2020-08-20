const router = require('express').Router();
const concoxController = require('./../controllers/conconxController');
const authMiddleware = require('./../middlewares/jwtAuthToken');

router.route('/alldevices').get(authMiddleware.authCheck ,concoxController.getAllDevices);

module.exports = router;