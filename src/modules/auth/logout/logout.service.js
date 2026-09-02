import Session from '../../../models/session.model.js';

import { hashRefreshToken } from '../../../utils/token.utils.js';

export const logoutService = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  const refreshTokenHash = hashRefreshToken(refreshToken);

  await Session.updateOne(
    {
      refreshTokenHash,
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    }
  );
};
