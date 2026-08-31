import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import logger from '../../../logger/logger.js';

import User from '../../../models/user.model.js';
import Profile from '../../../models/profile.model.js';

import { REGISTER_ERRORS } from './register.errors.js';
import { AUTH_CONFIG } from '../../../config/auth.config.js';

import { getNextUserSequence } from '../../../utils/counter.utils.js';

export const registerUserService = async ({
  profileFor,
  gender,
  name,
  dob,
  religion,
  community,
  email,
  mobile,
  password,
}) => {
  const session = await mongoose.startSession();

  try {
    email = email.trim().toLowerCase();
    mobile = mobile.trim();

    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        logger.warn(
          { email },
          'Registration rejected: email already exists'
        );

        throw new Error(REGISTER_ERRORS.EMAIL_EXISTS);
      }

      if (existingUser.mobile === mobile) {
        logger.warn(
          { mobile },
          'Registration rejected: mobile already exists'
        );

        throw new Error(REGISTER_ERRORS.MOBILE_EXISTS);
      }
    }

    const passwordHash = await bcrypt.hash(password, AUTH_CONFIG.BCRYPT_SALT_ROUNDS);

    const result = await session.withTransaction(async () => {
      const sequence = await getNextUserSequence(session);

      const userId = `U${String(sequence).padStart(2, '0')}`;

      const user = new User({
        userId,
        email,
        mobile,
        passwordHash,
      });

      await user.save({ session });

      const profile = new Profile({
        userId,
        profileFor,
        gender,
        name,
        dob,
        religion,
        community,
      });

      await profile.save({ session });

      return {
        user,
        profile,
      };
    });

    logger.info(
      {
        userId: result.user.userId,
      },
      'User registration successful'
    );

    return {
      userId: result.user.userId,
      email: result.user.email,
      mobile: result.user.mobile,
      role: result.user.role,
    };
  } catch (error) {
    if (error?.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];

      if (field === 'email') {
        logger.warn(
          { email },
          'Registration rejected: email already exists'
        );

        throw new Error(REGISTER_ERRORS.EMAIL_EXISTS, { cause: error });
      }

      if (field === 'mobile') {
        logger.warn(
          { mobile },
          'Registration rejected: mobile already exists'
        );

        throw new Error(REGISTER_ERRORS.MOBILE_EXISTS, { cause: error });
      }
    }

    throw error;
  } finally {
    await session.endSession();
  }
};
