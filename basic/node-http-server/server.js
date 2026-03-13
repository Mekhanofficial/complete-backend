// server.js
// A simple HTTP server using Node.js 'http' module 
// const http = require('http');

// const PORT = 5000;

// Create an HTTP server that responds with "Hello, World!" to any request
// const server = http.createServer((request, response) => {
//     response.writeHead(200, { 'Content-Type': 'text/plain' });
//     response.end('Hello, World!');
// })

// server.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });


// HTTP server using Express framework
const express = require('express');
const QrCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const ejs = require('ejs');
const {  registerUser, readLog, getAllUsers, createUser } = require('./controllers/controller');
const connectDB = require('./database/dbconnection');
// const { registeredUser, findOneUser } = require('./user.controller');
const userRouter = require('./routes/user.router');
const orderRouter = require('./routes/order.router');
const itemrouter = require('./src/modules/items/item.router');
const trackRouter = require('./src/modules/tracking/track.router');
const restaurantRouter = require('./routes/restaurant.router');
const EXPRESSPORT = 5000;
const swaggerDocument = yaml.load(
    fs.readFileSync(path.join(__dirname, 'apidoc.yaml'), 'utf8')
);

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);
app.use(express.json());
app.use(cors({origin: 'http://localhost:3000',method: ['GET', 'POST']}));
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'src', 'modules'));
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//image retrieval endpoint
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Declare a route for the root URL that responds with "Hello, World!"
app.get('/', (req, res) => {
    res.send('Hello, My World !');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.send('Server is healthy!');
});
// Endpoint to create a log entry
app.post('/create',createUser);
// Endpoint to register a user ---Controller
app.post('/register', registerUser);
// Endpoint to read log entries
app.get('/read', readLog);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/item", itemrouter);
app.use("/api/v1/restaurant", restaurantRouter);
app.get('/userProfile', getAllUsers);
app.use("/api/v1/tracking", trackRouter );

connectDB();



// Start the Express server
app.listen(EXPRESSPORT, () => {
    console.log(`Server is running on http://localhost:${EXPRESSPORT}`);
});

