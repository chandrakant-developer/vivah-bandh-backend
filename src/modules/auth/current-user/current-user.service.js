import User from '../../../models/user.model.js';

import { CURRENT_USER_ERRORS } from './current-user.error.js';

export const currentUserService = async (userId) => {
  const user = await User.findOne({ userId }).select('userId email mobile role -_id').lean();

  if (!user) {
    throw new Error(CURRENT_USER_ERRORS.USER_NOT_FOUND);
  }

  return user;
};
