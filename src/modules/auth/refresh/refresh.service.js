import Sessions from '../../../models/session.model.js';
import User from '../../../models/user.model.js';

import { generateAccessToken, hashRefreshToken } from '../../../utils/token.utils.js';

import { REFRESH_ERRORS } from './refresh.errors.js';

export const refreshService = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error(REFRESH_ERRORS.INVALID_REFRESH_TOKEN);
  }

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const session = await Sessions.findOne({
    refreshTokenHash,
  });

  if (!session) {
    throw new Error(REFRESH_ERRORS.INVALID_REFRESH_TOKEN);
  }

  if (session.revokedAt) {
    throw new Error(REFRESH_ERRORS.REFRESH_TOKEN_REVOKED);
  }

  if (session.expiresAt <= new Date()) {
    throw new Error(REFRESH_ERRORS.REFRESH_TOKEN_EXPIRED);
  }

  const user = await User.findOne({
    userId: session.userId,
  }).select('userId email mobile role -_id');

  if (!user) {
    throw new Error(REFRESH_ERRORS.USER_NOT_FOUND);
  }

  session.lastUsedAt = new Date();

  await session.save();

  const accessToken = generateAccessToken({
    userId: session.userId,
  });

  return {
    accessToken,
    user,
  };
};
