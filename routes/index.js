const vendor = require('./vendor');
/* GET home page. */
module.exports = (app) => {
  app.use('/api/vendor', vendor);
};
