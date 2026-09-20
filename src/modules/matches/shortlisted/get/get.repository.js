import Shortlist from '../../../../models/shortlist.model.js';

export const getShortlist = async ({ userId }) => {
  return Shortlist.aggregate([
    {
      $match: {
        userId,
      },
    },

    {
      $sort: {
        createdAt: -1,
      },
    },

    {
      $lookup: {
        from: 'profiles',
        localField: 'shortlistedUserId',
        foreignField: 'userId',
        as: 'candidate',
      },
    },

    {
      $unwind: '$candidate',
    },
  ]);
};
