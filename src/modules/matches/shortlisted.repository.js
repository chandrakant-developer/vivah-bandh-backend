import Shortlist from '../../models/shortlist.model.js';

export const getShortlistedUserIds = async (userId) => {
  const shortlists = await Shortlist.find({ userId }, { _id: 0, shortlistedUserId: 1 }).lean();

  return shortlists.map((shortlist) => shortlist.shortlistedUserId);
};
