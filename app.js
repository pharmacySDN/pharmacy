const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const app = express();
const connectDB = require('./config/db'); 
const cookieParser = require('cookie-parser'); 
const session = require('express-session');
const { setUserInView } = require('./middleware/setUserInView');
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


app.use(setUserInView);
app.use(session({
  secret: 'your-secret-key', // Use a strong, unique secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Use API routes
app.use('/api', apiRoutes);


app.get('/', (req, res) => {
  res.redirect('/api/login/login');  // Redirect to login page when accessing root
});
app.use(express.static(path.join(__dirname, '/public')));

// Error handling
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});