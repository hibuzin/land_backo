require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('./config/cloudinary'); // just to init config

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/lands', require('./routes/land'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/chat', require('./routes/chat'));



app.get('/', (req, res) => {
  res.send('Land API running');
});

// DB
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('mongoDB Connected'))
  .catch(err => console.error('mongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
