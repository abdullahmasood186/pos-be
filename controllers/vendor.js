import stripeService from '../services/stripeService';

const airTableBase = require('../services/airtable');

const table = airTableBase('Products');

const vendor = {

  listProducts: (req, res) => {
    const Products = table.select({ pageSize: 20 });
    Products.firstPage().then((result) => {
      const data = result.map((m) => m.fields);
      return res.json(data);
    });
  },
  connectWithTerminal: async (req, res) => {
    try {
      const token = await stripeService.getConnectionToke();
      res.json(token);
    } catch (e) {
      res.json({ message: e.message });
    }
  },
  createPaymentIntent: async (req, res) => {
    try {
      const intent = await stripeService.createPaymentIntent();
      res.json({ client_secret: intent.client_secret });
    } catch (e) {
      res.json({ message: e.message });
    }
  },
  capturePaymentIntent: async (req, res) => {
    try {
      const { intentId } = req.body;
      const intent = await stripeService.paymentIntent(intentId);
      res.send(intent);
    } catch (e) {
      res.json({ message: e.message });
    }
  },
};
module.exports = vendor;
