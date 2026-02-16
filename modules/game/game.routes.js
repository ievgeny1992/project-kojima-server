const express = require('express');
const router = express.Router();
const GameController = require('./game.controller');

router.get('/', GameController.getAllGames);
router.get('/last', GameController.getLastGames);
router.get('/count', GameController.getGamesCount);
router.get('/genres', GameController.getGenres);
router.get('/genre/:genre', GameController.getRandomGameByGenre);
router.get('/timeline', GameController.getTimeline);
router.get('/wishlist', GameController.getWishlistGames);
router.get('/complete-games', GameController.getCompleteGamesCount);
router.get('/game/:slug', GameController.getGameBySlug);
router.get('/year/:year', GameController.getGamesByYear);

router.post('/', GameController.addGame);

router.patch('/game/:id', GameController.updateGame);

router.delete('/game/:slug', GameController.deleteGame);

module.exports = router;
