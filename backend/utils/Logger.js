// backend/utils/Logger.js
const fs = require('fs');
const path = require('path');

function log(level, ...args) {
  const ts = new Date().toISOString();
  const msg = `[${ts}] [${level}] ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')}`;
  console.log(msg);
  // Optionally append to file:
  // fs.appendFileSync(path.join(__dirname, '..', 'logs', 'app.log'), msg + '\n');
}

module.exports = {
  info: (...args) => log('INFO', ...args),
  warn: (...args) => log('WARN', ...args),
  error: (...args) => log('ERROR', ...args),
};
