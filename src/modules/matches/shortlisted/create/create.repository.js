import Shortlist from '../../../../models/shortlist.model.js';

export const createShortlist = async ({ userId, shortlistedUserId }) => {
  const shortlist = await Shortlist.create({
    userId,
    shortlistedUserId,
  });

  return {
    userId: shortlist.userId,
    shortlistedUserId: shortlist.shortlistedUserId,
  };
};
