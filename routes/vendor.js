const express = require('express');

const router = express.Router();
const controllers = require('../controllers');

/* GET users listing. */
router.get('/products', controllers.vendor.listProducts);
router.get('/terminalToken', controllers.vendor.connectWithTerminal);
router.get('/createIntent', controllers.vendor.createPaymentIntent);

module.exports = router;
