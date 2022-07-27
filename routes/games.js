const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');

const Game = mongoose.model('Game');

//Get all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find().sort({ name: 1, releasedDate: 1 });
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get 12 last games
router.get('/last', async (req, res) => {
  try {
    const games = await Game.find().sort({ _id: -1 }).limit(12);
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get all games count
router.get('/count', async (req, res) => {
  try {
    const games = await Game.find().countDocuments();
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get all genres
router.get('/genres', async (req, res) => {
  try {
    const genres = await Game.distinct('genres.name');
    res.status(200).json(genres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get all years
router.get('/timeline', async (req, res) => {
  try {
    const years = await Game.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$addedDate' },
            month: { $month: '$addedDate' },
            day: { $dayOfMonth: '$addedDate' },
          },
          games: {
            $push: '$$ROOT',
          },
        },
      },
      { $sort: { _id: -1 } },
      {
        $group: {
          _id: '$_id.year',
          items: {
            $push: '$$ROOT',
          },
        },
      },
      { $sort: { _id: -1 } },
    ]);
    res.status(200).json(years);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get genres count
router.get('/genres-count', async (req, res) => {
  let genresCount = 0;
  try {
    const genres = await Game.aggregate([
      { $project: { genres: 1 } },
      { $unwind: '$genres' },
    ]);
    res.status(200).json(genres.length);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get games count to genre
router.get('/genres-count/:genre', async (req, res) => {
  const genre = req.params.genre;
  try {
    const count = await Game.find({ 'genres.name': genre }).countDocuments();
    res.status(200).json(count);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get all complete games count
router.get('/complete-games', async (req, res) => {
  try {
    const completeGamesCount = await Game.find({
      completeFlag: true,
    }).countDocuments();
    res.status(200).json(completeGamesCount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/game/:slug', async (req, res) => {
  const slug = req.params.slug;
  try {
    const game = await Game.findOne({ slug: slug });
    res.status(200).json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Add game to DB
router.post('/', async (req, res) => {
  const game = new Game(req.body);
  try {
    const newGame = await game.save();
    res.status(201).json(newGame);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Delete game
router.delete('/game/:id', async (req, res) => {
  const id = req.params.id;
  try {
    res.status(200).json(await Game.deleteOne({ _id: id }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
