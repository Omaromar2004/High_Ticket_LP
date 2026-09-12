const https = require('https');

const postData = JSON.stringify({
  from: { address: 'team@fiqr.in', name: 'FIQRTAALIM' },
  to: [
    {
      email_address: {
        address: 'assistance.fiqrtaalim@gmail.com',
        name: 'Mohammed Omar'
      }
    }
  ],
  subject: 'Test Agreement via ZeptoMail REST API',
  htmlbody: '<p>Testing ZeptoMail REST API from Hostinger setup.</p>'
});

const options = {
  hostname: 'api.zeptomail.in',
  port: 443,
  path: '/v1.1/email',
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'PHtE6r1YRu7r3mAm8BAJtKe6QMKtPI4n+OpufVZOsYpBC6QBTU1d/d4okGSwrRcvB/BCEPHKy4Jo4r+f5erXcT65NmcfXGqyqK3sx/VYSPOZsbq6x00etVsdfk3eUI/scdRq3CDfv9nbNA=='
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => console.log('Zepto REST Response:', res.statusCode, body));
});

req.on('error', (e) => console.error('Error:', e));
req.write(postData);
req.end();
