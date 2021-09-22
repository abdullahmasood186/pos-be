import stripeService from '../services/stripeService';

const airTableBase = require('../services/airtable');

const Products = airTableBase('Products');
const Stores = airTableBase('Neyborly Next Stores');
const vendor = {

  listProducts: (req, res) => {
    const Product = Products.select({ filterByFormula: '' });
    const productList = [];
    Product.eachPage(async (records, next) => {
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
  listStores: (req, res) => {
    try {
      const vendorList = Stores.select({ });
      vendorList.firstPage().then((result) => {
        const data = result.map((m) => ({ id: m.id, ...m.fields }));
        res.json({ status: true, products: data });
      });
    } catch (err) {
      res.send({ status: false, message: err.message });
    }
  },

  listInventory: async (req, res) => {
    const inventory = airTableBase('Inventory');
    const Inventory = inventory.select({ filterByFormula: 'FIND("2315 Telegraph Avenue, Berkeley, California 94704", {Neyborly Next Stores})' });
    const productList = [];

    Inventory.eachPage(async (records, next) => {
      console.log(records);
      const data = await records.map((m) => ({ id: m.id, ...m.fields }));
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
  sellProduct: async (req, res) => {
    // const { productId } = req.body;

    try {
      const product = await Products.find('recQA6woiaUUDYFBx');
      const quantity = product.fields.Quantity + 2;
      console.log(product);
      Products.update('recQA6woiaUUDYFBx', {
        Quantity: quantity,
      });
    } catch (e) {
      return res.json({ status: false, message: e.message });
    }
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
