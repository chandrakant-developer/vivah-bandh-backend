import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import User from '../user.model.js';
import Profile from '../../profile/profile.model.js';

import { REGISTER_ERRORS } from './register.errors.js';
import { SALT_ROUNDS } from '../../../config/auth.config.js';
import { getNextUserSequence } from '../../../utils/counter.utils.js';
import logger from '../../../logger/logger.js';

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
    }).session(session);

    if (existingUser) {
      if (existingUser.email === email) {
        logger.warn('Registration rejected: email already exists');

        throw new Error(REGISTER_ERRORS.EMAIL_EXISTS);
      }

      if (existingUser.mobile === mobile) {
        logger.warn('Registration rejected: mobile already exists');

        throw new Error(REGISTER_ERRORS.MOBILE_EXISTS);
      }
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

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

    if (!result) {
      throw new Error(REGISTER_ERRORS.REGISTRATION_FAILED);
    }

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
  } finally {
    await session.endSession();
  }
};
