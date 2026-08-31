import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';

if (!ACCESS_TOKEN_SECRET) {
  throw new Error('JWT_ACCESS_SECRET is not configured');
}

export const generateAccessToken = ({ userId }) => {
  return jwt.sign(
    {
      sub: userId.toString(),
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    }
  );
};

export const hashRefreshToken = (refreshToken) => {
  return crypto.createHash('sha256').update(refreshToken).digest('hex');
};
