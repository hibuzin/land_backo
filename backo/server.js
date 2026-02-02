require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');


const app = express();

app.use(cors());
app.use(express.json());


const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}



const landRoutes = require('./routes/land');
app.use('/api/auth', require('./routes/auth'));
app.use('/api/lands', landRoutes);



app.get('/', (req, res) => {
  res.send('Land API running');
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://land:tokyodel9600@cluster0.ptiwivd.mongodb.net/';
mongoose.connect(MONGO_URI)
  .then(() => console.log('mongoDB Connected'))
  .catch(err => console.error('mongoDB connection error:', err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));