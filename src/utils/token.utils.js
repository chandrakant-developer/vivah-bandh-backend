import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';

const REFRESH_TOKEN_SRCRET = process.env.JWT_REFRESH_SCREET;
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

if (!ACCESS_TOKEN_SECRET) {
  throw new Error('JWT_ACCESS_SECRET is not configured');
}

if (!REFRESH_TOKEN_SRCRET) {
  throw new Error('REFRESH_TOKEN_SECRET is not configured');
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

export const generateRefreshToken = ({ userId }) => {
  return jwt.sign(
    {
      sub: userId.toString(),
    },
    REFRESH_TOKEN_SRCRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_TOKEN_SRCRET);
};
