const express = require('express');

const router = express.Router();
const controllers = require('../controllers');

/* GET users listing. */
router.get('/products', controllers.vendor.listProducts);
router.get('/terminalToken', controllers.vendor.connectWithTerminal);
router.get('/createIntent', controllers.vendor.createPaymentIntent);
router.post('/captureIntent', controllers.vendor.capturePaymentIntent);
router.get('/stores', controllers.vendor.listStores);
router.get('/listInventory', controllers.vendor.listInventory);
router.get('/sellProduct', controllers.vendor.sellProduct);

module.exports = router;
