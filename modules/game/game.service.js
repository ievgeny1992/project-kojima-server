const Game = require('./game.model');

const NOT_WISHLIST = { status: { $ne: 'wishlist' } };

class GameService {
  static async getAllGames() {
    return Game.aggregate([
      { $match: NOT_WISHLIST },
      {
        $project: {
          name: 1,
          slug: 1,
          userRating: 1,
          coverCrop: 1,
          status: 1,
          releasedDate: 1,
        },
      },
      { $sort: { name: 1, releasedDate: 1 } },
    ]);
  }

  static async getLastGames(limit = 12) {
    return Game.find()
      .select('name slug coverCrop addedDate status')
      .sort({ addedDate: -1 })
      .limit(limit)
      .lean();
  }

  static async getGamesCount() {
    return Game.countDocuments(NOT_WISHLIST);
  }

  static async getGenres() {
    return Game.aggregate([
      { $match: NOT_WISHLIST },
      { $unwind: '$genres' },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          genres: { $push: '$genres.name' },
        },
      },
      { $unwind: '$genres' },
      {
        $group: {
          _id: '$genres',
          count: { $sum: 1 },
          total: { $first: '$total' },
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
  }

  static async getRandomGameByGenre(genre) {
    return Game.aggregate([
      {
        $match: {
          ...NOT_WISHLIST,
          'genres.name': genre,
        },
      },
      { $sample: { size: 1 } },
      {
        $project: {
          genres: 1,
          coverCrop: 1,
        },
      },
    ]);
  }

  static async getTimeline() {
    return Game.aggregate([
      { $match: NOT_WISHLIST },
      {
        $project: {
          name: 1,
          slug: 1,
          coverCrop: 1,
          addedDate: 1,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$addedDate' },
            month: { $month: '$addedDate' },
            day: { $dayOfMonth: '$addedDate' },
          },
          games: { $push: '$$ROOT' },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
      {
        $group: {
          _id: '$_id.year',
          items: { $push: '$$ROOT' },
        },
      },
      { $sort: { _id: -1 } },
    ]);
  }

  static async getWishlistGames() {
    return Game.find({ status: 'wishlist' })
      .select('name slug coverCrop genres releasedDate')
      .sort({ addedDate: -1 })
      .lean();
  }

  static async getCompleteGamesCount() {
    return Game.countDocuments({ status: 'completed' });
  }

  static async getGameBySlug(slug) {
    const game = await Game.findOne({ slug }).lean();

    if (!game) {
      const error = new Error('Game not found');
      error.status = 404;
      throw error;
    }

    return game;
  }

  static async getGamesByYear(year) {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(Number(year) + 1, 0, 1);

    return Game.find({
      addedDate: {
        $gte: startOfYear,
        $lt: endOfYear,
      },
      status: { $ne: 'wishlist' },
    })
      .select('name slug coverCrop addedDate')
      .lean();
  }

  static async addGame(data) {
    const exists = await Game.findOne({ slug: data.slug });

    if (exists) {
      const error = new Error('Game already exists');
      error.status = 400;
      throw error;
    }

    return Game.create(data);
  }

  static async updateGame(id, updates) {
    const updatedGame = await Game.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedGame) {
      const error = new Error('Game not found');
      error.status = 404;
      throw error;
    }

    return updatedGame;
  }

  static async deleteGameBySlug(slug) {
    const result = await Game.deleteOne({ slug });

    if (result.deletedCount === 0) {
      const error = new Error('Game not found');
      error.status = 404;
      throw error;
    }

    return result;
  }
}

module.exports = GameService;
