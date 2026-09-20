import Shortlist from '../../../../models/shortlist.model.js';

export const removeShortlist = async ({ userId, shortlistedUserId }) => {
  return Shortlist.findOneAndDelete({
    userId,
    shortlistedUserId,
  }).lean();
};
