const https = require('https');
const http = require('http');

const data = JSON.stringify({
  courseId: "68a4e4c2bcd3f1679db08c46",
  rating: 5,
  review: "Excellent Nature course! Very comprehensive and well-structured."
});

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/v1/course/createRating',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN3YXJvb29wMjMyNkBnbWFpbC5jb20iLCJpZCI6IjY4YTRkMGU4ZjQ0OWE0YzljYTVkZmE3ZSIsImFjY291bnRUeXBlIjoiU3R1ZGVudCIsImlhdCI6MTc1NTY3MTQ4OSwiZXhwIjoxNzU1NzU3ODg5fQ.Z5asfRKN4Ikc_7BkWyWTYw7u6AvT4W__Gx1_HlutgxA',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('Response body:', body);
    try {
      const result = JSON.parse(body);
      if (result.success) {
        console.log('✅ Review created successfully!');
      } else {
        console.log('❌ Review creation failed:', result.message);
      }
    } catch (e) {
      console.log('Response (raw):', body);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
