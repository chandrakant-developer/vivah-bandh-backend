import bcrypt from 'bcrypt';
import User from '../user.model.js';
import { LOGIN_ERROS } from './login.errors.js';
import { getUsernameIdentifier } from './login.utils.js';
import { generateAccessToken, generateRefreshToken } from '../../../utils/token.utils.js';

export const loginService = async ({ username, password }) => {
  const usernameIdentifier = getUsernameIdentifier(username);

  if (!usernameIdentifier) {
    throw new Error(LOGIN_ERROS.INVALID_CREDENTIALS);
  }

  const query =
    usernameIdentifier.type === 'email'
      ? { email: usernameIdentifier.value }
      : { mobile: usernameIdentifier.value };

  const user = await User.findOne(query);

  if (!user) {
    throw new Error(LOGIN_ERROS.INVALID_CREDENTIALS);
  }

  const isPasswordVaild = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordVaild) {
    throw new Error(LOGIN_ERROS.INVALID_CREDENTIALS);
  }

  const accessToken = generateAccessToken({ userId: user.userId });

  const refreshToken = generateRefreshToken({ userId: user.userId });

  return {
    accessToken,
    refreshToken,
    user: {
      userId: user.userId,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    },
  };
};
