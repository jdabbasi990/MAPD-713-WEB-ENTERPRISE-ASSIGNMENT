let SERVER_NAME = 'product-api';
let PORT = 3000;
let HOST = '127.0.0.1';

let errors = require('restify-errors');
let restify = require('restify');

// Point 1: Request counters for GET and POST requests
let getRequestCount = 0;
let postRequestCount = 0;

// Point 2: In-memory storage for JSON payloads from POST requests
let productData = [];

// Create the restify server
let server = restify.createServer({ name: SERVER_NAME });

server.listen(PORT, HOST, function () {
  console.log('Server %s listening at http %s', server.name, server.url);
  console.log('');
  console.log('**** Resources: ****');
  console.log('');
  console.log('********************');
  console.log('');
  console.log('ENDPOINTS STRUCTURE');
  console.log('http://127.0.0.1:3000/products ');
  console.log('http://IP/Port/products  method: GET, POST');
  console.log('http://IP/Port/products/id  method: PUT, DELETE');
});

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

// Point 1: Log request counters for GET and POST
server.use(function (req, res, next) {
  if (req.method === 'GET') {
    getRequestCount++;
  } else if (req.method === 'POST') {
    postRequestCount++;
  }
  console.log(`Processed Request Count--> Get:${getRequestCount}, Post:${postRequestCount}`);
  next();
});

// Point 3: Handle HTTP POST requests with JSON payload
server.post('/products', function (req, res, next) {
  console.log('POST /products params=>' + JSON.stringify(req.params));
  console.log('POST /products body=>' + JSON.stringify(req.body));

  console.log('Request Body:', req.body);
  console.log("\n");
  console.log('productId:', req.body.productId);
  console.log('name:', req.body.name);
  console.log('price:', req.body.price);
  console.log('quantity:', req.body.quantity);

  // Validation of mandatory fields
  if (
    req.body.productId === undefined ||
    req.body.name === undefined ||
    req.body.price === undefined ||
    req.body.quantity === undefined
  ) {
    console.log(`request id ${req.body.productId} request name ${req.body.name}  request price ${req.body.price} req quantity  ${req.body.quantity}`);
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('productId, name, price, and quantity must be supplied'));
  }

  // Store the JSON payload in memory
  productData.push(req.body);

  // Send a 201 Created response
  res.send(201, req.body);
});

// Point 4: Handle HTTP GET requests for all products
console.log("\n");
server.get('/products', function (req, res, next) {
  console.log('GET /products params=>' + JSON.stringify(req.params));

  // Return the list of all products stored in memory
  res.send(productData);
});


// Point 5: Handle HTTP DELETE requests to delete all records
server.del('/products', function (req, res, next) {
  console.log('DELETE /products params=>' + JSON.stringify(req.params));

  // Clear the in-memory product data
  productData = [];

  // Send a 204 No Content response
  res.send(204);
});
