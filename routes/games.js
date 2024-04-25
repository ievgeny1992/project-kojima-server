const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');

const Game = mongoose.model('Game');

//Get all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.aggregate([
      { $project: { name: 1, slug: 1, userRating: 1, coverCrop: 1 } },
      { $sort: { name: 1, releasedDate: 1 } },
    ]);
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get 12 last games
router.get('/last', async (req, res) => {
  try {
    const games = await Game.find().sort({ addedDate: -1 }).limit(12);
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

//Get all genres v2
router.get('/genres', async (req, res) => {
  try {
    const genres = await Game.aggregate([
      {
        $project: {
          genres: 1,
        },
      },
      {
        $unwind: '$genres',
      },
      {
        $group: {
          _id: null,
          genresCount: { $sum: 1 },
          genres: {
            $push: '$genres',
          },
        },
      },
      {
        $unwind: '$genres',
      },
      {
        $group: {
          _id: '$genres.name',
          total: { $first: '$genresCount' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 1,
          percent: {
            $multiply: [{ $divide: ['$count', '$total'] }, 100],
          },
        },
      },
      { $sort: { percent: -1 } },
    ]);
    res.status(200).json(genres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get items for timeline
router.get('/timeline', async (req, res) => {
  try {
    const timeline = await Game.aggregate([
      {
        $project: { name: 1, slug: 1, coverCrop: 1, addedDate: 1 },
      },
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
      {
        $sort: { _id: -1 },
      },
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
    res.status(200).json(timeline);
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

//Get game
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
