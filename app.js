require('dotenv').config();
const express = require('express');
const cors = require('cors');

require('./modules/game/game.model');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const gameRouter = require('./modules/game/game.routes');
app.use('/games', gameRouter);

module.exports = app;
