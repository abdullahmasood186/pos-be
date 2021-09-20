const airtable = require('airtable');
const config = require('../config');

airtable.configure({ apiKey: config.airtableApiKey });

const base = airtable.base(config.airTableBaseKey);
module.exports = base;
