require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const mongoose = require('mongoose');

require('./models/Game');

//Connected to DB

// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('🔗Connected to DB!'));

app.use(express.json());
app.use(cors());

const router = require('./routes/games');
app.use('/games', router);

//Server started
app.listen(3000, () => console.log('🚀Server started!'));
