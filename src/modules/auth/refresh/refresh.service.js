import { generateAccessToken, verifyRefreshToken } from '../../../utils/token.utils.js';
import { REFRESH_ERRORS } from './refresh.errors.js';

export const refreshService = (refreshToken) => {
  try {
    const payload = verifyRefreshToken(refreshToken);

    const accessToken = generateAccessToken({
      userId: payload.sub,
    });

    return {
      accessToken,
    };
  } catch {
    throw new Error(REFRESH_ERRORS.INVALID_REFRESH_TOKEN);
  }
};
