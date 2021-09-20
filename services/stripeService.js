const config = require('../config');
// eslint-disable-next-line import/order
const stripe = require('stripe')(config.stripeKEy);

module.exports = {
  getConnectionToke: async () => {
    const connectionToken = await stripe.terminal.connectionTokens.create();
    return { secret: connectionToken.secret };
  },
  createPaymentIntent: async () => {
    const intent = await stripe.paymentIntents.create({
      amount: 500,
      currency: 'usd',
      payment_method_types: ['card_present'],
      capture_method: 'manual',
    });
    return intent;
  },
  paymentIntent: async (intentId) => {
    const intent = await stripe.createPaymentIntent(intentId);
    return intent;
  },

};
