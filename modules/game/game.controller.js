const GameService = require('./game.service');

class GameController {
  static async getAllGames(req, res, next) {
    try {
      res.json(await GameService.getAllGames());
    } catch (err) {
      next(err);
    }
  }

  static async getLastGames(req, res, next) {
    try {
      res.json(await GameService.getLastGames());
    } catch (err) {
      next(err);
    }
  }

  static async getGamesCount(req, res, next) {
    try {
      res.json(await GameService.getGamesCount());
    } catch (err) {
      next(err);
    }
  }

  static async getGenres(req, res, next) {
    try {
      res.json(await GameService.getGenres());
    } catch (err) {
      next(err);
    }
  }

  static async getRandomGameByGenre(req, res, next) {
    try {
      const { genre } = req.params;
      res.json(await GameService.getRandomGameByGenre(genre));
    } catch (err) {
      next(err);
    }
  }

  static async getTimeline(req, res, next) {
    try {
      res.json(await GameService.getTimeline());
    } catch (err) {
      next(err);
    }
  }

  static async getWishlistGames(req, res, next) {
    try {
      res.json(await GameService.getWishlistGames());
    } catch (err) {
      next(err);
    }
  }

  static async getCompleteGamesCount(req, res, next) {
    try {
      res.json(await GameService.getCompleteGamesCount());
    } catch (err) {
      next(err);
    }
  }

  static async getGameBySlug(req, res, next) {
    try {
      res.json(await GameService.getGameBySlug(req.params.slug));
    } catch (err) {
      next(err);
    }
  }

  static async getGamesByYear(req, res, next) {
    try {
      res.json(await GameService.getGamesByYear(req.params.year));
    } catch (err) {
      next(err);
    }
  }

  static async addGame(req, res, next) {
    try {
      res.status(201).json(await GameService.addGame(req.body));
    } catch (err) {
      next(err);
    }
  }

  static async updateGame(req, res, next) {
    try {
      res.json(await GameService.updateGame(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  }

  static async deleteGame(req, res, next) {
    try {
      res.json(await GameService.deleteGameBySlug(req.params.slug));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = GameController;
