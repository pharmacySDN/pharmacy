const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const app = express();
const connectDB = require('./config/db'); 
const cookieParser = require('cookie-parser'); 
// Connect to MongoDB
connectDB();
// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser()); 
// Import API routes
const apiRoutes = require('./routes/api');

app.use(express.static(path.join(__dirname, '/public')));

app.use((req, res, next) => {
  res.locals.username = req.cookies.username; // Pass cookie to all views
  next();
});

// Use API routes
app.use('/api', apiRoutes);


app.get('/', (req, res) => {
  res.redirect('/api/login/login');  // Redirect to login page when accessing root
});

// Error handling
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});