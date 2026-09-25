const http = require('http');
http.get('http://localhost:6001/api/v1/roles?scope=TENANT&showOnFrontend=true&panel=ADMIN', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', data));
}).on('error', console.error);
