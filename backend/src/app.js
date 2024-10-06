// Importing installed packages
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Importing routes
const { bookmarkRouter } = require('./routes/bookmark.routes.js');
const { mediaRouter } = require('./routes/media.routes.js');
const { userRouter } = require('./routes/user.routes.js');

// App instances
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL, // Ensure this is correct
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allows cookies and authorization headers
}));

// Pre-flight requests
app.options('*', cors()); // Enable pre-flight for all routes

// Routes
app.use("/api", bookmarkRouter);
app.use("/api", mediaRouter);
app.use("/api", userRouter);

// Home route
app.get('/', (req, res) => {
    res.json({
        message: "Welcome to home route"
    });
});

// Exporting
module.exports = { app };

