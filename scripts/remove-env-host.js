const fs = require('fs');
const fp = './env/.env.dev';
const file = fs.readFileSync(fp).toString('utf-8');
const isRN = file.includes('\r\n');
const lines = file.split(isRN ? '\r\n' : '\n').reduce((val, line) => {
  if (!line.includes('J2_H_ID=') && !line.includes('J2_H_ID=')) {
    val.push(line);
  }
  return val;
}, []);

fs.writeFileSync(fp, lines.join(isRN ? '\r\n' : '\n'))