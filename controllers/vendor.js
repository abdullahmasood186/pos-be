import stripeService from '../services/stripeService';

const airTableBase = require('../services/airtable');

const table = airTableBase('Products');
const Vendors = airTableBase('Vendorss');
const vendor = {

  listProducts: (req, res) => {
    const Products = table.select({ filterByFormula: '' });
    const productList = [];
    Products.eachPage(async (records, next) => {
      const data = await records.map((m) => m.fields.Name);
      productList.push(...data);

      await next();
    },
    (err) => {
      if (err) {
        res.json({ status: false, message: err.message });
      }
      return res.json({ status: true, productList });
    });
  },
  listVendors: (req, res) => {
    try {
      const vendorList = Vendors.select({ pageSize: 1 });
      vendorList.firstPage().then((result) => {
        const data = result.map((m) => m.fields);
        res.json({ status: true, products: data });
      });
    } catch (err) {
      res.send({ status: false, message: err.message });
    }
  },
  listInventory: async (req, res) => {
    const inventory = airTableBase('Inventory');

    const Products = inventory.select({ filterByFormula: 'Vendors="South Bay Gems"' });
    const productList = [];
    Products.eachPage(async (records, next) => {
      const data = await records.map((m) => m.fields);
      productList.push(...data);

      await next();
    },
    (err) => {
      if (err) {
        res.json({ status: false, message: err.message });
      } else {
        res.json({ status: true, productList });
      }
    });
  },
  connectWithTerminal: async (req, res) => {
    try {
      const token = await stripeService.getConnectionToke();
      return res.json({ status: true, token });
    } catch (e) {
      return res.json({ status: false, message: e.message });
    }
  },
  createPaymentIntent: async (req, res) => {
    try {
      const intent = await stripeService.createPaymentIntent();
      res.json({ status: true, client_secret: intent.client_secret });
    } catch (e) {
      res.json({ status: false, message: e.message });
    }
  },
  capturePaymentIntent: async (req, res) => {
    try {
      const { intentId } = req.body;
      if (!intentId) {
        return res.json({
          status: false,
          message: 'IntentId is missing!!',
        });
      }

      const intent = await stripeService.paymentIntent(intentId);
      return res.json({ status: true, intent });
    } catch (e) {
      return res.json({ status: false, message: e.message });
    }
  },
};
module.exports = vendor;
