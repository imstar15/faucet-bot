const crypto = require('crypto');

const sha256 = x =>
  crypto
    .createHash('sha256')
    .update(x, 'utf8')
    .digest('hex');

const now = () => new Date().getTime();

const SECOND  = 1000;
const MINUTE  = 60 * SECOND; 
const HOUR    = 60 * MINUTE;
const DAY     = 20 * HOUR; // almost 1 day, give some room for people missing their normal daily slots

module.exports = { sha256, now, DAY, SECOND };
