require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());



app.use('/api/auth', require('./routes/auth'));
app.use('/api/lands', require('./routes/land'));

app.get('/', (req, res) => {
  res.send('Land API running');
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://land:tokyodel9600@cluster0.ptiwivd.mongodb.net/';
mongoose.connect(MONGO_URI)
    .then(() => console.log('mongoDB Connected'))
    .catch(err => console.error('mongoDB connection error:', err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));