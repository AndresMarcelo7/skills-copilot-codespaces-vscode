//Create web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const comments = require('./comments');
const querystring = require('querystring');
const mime = require('mime');
const server = http.createServer();

server.on('request', (req, res) => {
  const urlObj = url.parse(req.url, true);
  const pathname = urlObj.pathname;
  const query = urlObj.query;
  const method = req.method;

  if (pathname === '/') {
    fs.readFile(path.resolve(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
        return;
      }
      res.setHeader('Content-Type', 'text/html');
      res.end(data);
    });
  } else if (pathname === '/comments' && method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(comments));
  } else if (pathname === '/comments' && method === 'POST') {
    let str = '';
    req.on('data', (data) => {
      str += data;
    });
    req.on('end', () => {
      const comment = querystring.parse(str);
      comment.time = new Date();
      comments.unshift(comment);
      res.end(JSON.stringify(comment));
    });
  } else {
    fs.readFile(path.resolve(__dirname, pathname), (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('Not Found');
        return;
      }
      res.setHeader('Content-Type', mime.getType(pathname));
      res.end(data);
    });
  }
});

server.listen(3000, () => {
  console.log('Server is running at http://')
});