import { response } from 'express';
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
      console.log(intentId);
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
