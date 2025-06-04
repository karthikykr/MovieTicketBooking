console.log('Process CWD:', process.cwd());
console.log('__dirname:', __dirname);
console.log('__filename:', __filename);
console.log('Process argv:', process.argv);

const fs = require('fs');
console.log('Files in current directory:', fs.readdirSync('.'));
