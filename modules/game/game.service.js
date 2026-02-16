const Game = require('./game.model');

class GameService {
  static async getAllGames() {
    return Game.aggregate([
      { $match: { status: { $ne: 'wishlist' } } },
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
    return Game.find().sort({ addedDate: -1 }).limit(limit);
  }

  static async getGamesCount() {
    return Game.countDocuments({ status: { $ne: 'wishlist' } });
  }

  static async getGenres() {
    return Game.aggregate([
      { $match: { status: { $ne: 'wishlist' } } },
      { $project: { genres: 1 } },
      { $unwind: '$genres' },
      {
        $group: {
          _id: null,
          genresCount: { $sum: 1 },
          genres: { $push: '$genres' },
        },
      },
      { $unwind: '$genres' },
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
          percent: { $multiply: [{ $divide: ['$count', '$total'] }, 100] },
        },
      },
      { $sort: { percent: -1 } },
    ]);
  }

  static async getRandomGameByGenre(genre) {
    return Game.aggregate([
      { $match: { status: { $ne: 'wishlist' } } },
      { $project: { genres: 1, coverCrop: 1 } },
      { $match: { 'genres.name': genre } },
    ]).sample(1);
  }

  static async getTimeline() {
    return Game.aggregate([
      { $match: { status: { $ne: 'wishlist' } } },
      { $project: { name: 1, slug: 1, coverCrop: 1, addedDate: 1 } },
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
      { $sort: { _id: -1 } },
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
    return Game.find({ status: 'wishlist' }).sort({ addedDate: -1 });
  }

  static async getCompleteGamesCount() {
    return Game.countDocuments({ status: 'completed' });
  }

  static async getGameBySlug(slug) {
    return Game.findOne({ slug });
  }

  static async getGamesByYear(year) {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31);
    return Game.find({ addedDate: { $gte: startOfYear, $lte: endOfYear } });
  }

  static async addGame(data) {
    const game = new Game(data);
    return game.save();
  }

  static async updateGame(id, updates) {
    return Game.findByIdAndUpdate(id, updates, { new: true });
  }

  static async deleteGameBySlug(slug) {
    return Game.deleteOne({ slug });
  }
}

module.exports = GameService;
