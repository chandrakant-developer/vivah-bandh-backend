import { PROFILE_ERRORS } from './profile.errors.js';
import Profile from '../profile/profile.model.js';

export const profileService = async (userId) => {
  if (typeof userId !== 'string' || !userId.trim()) {
    throw new Error(PROFILE_ERRORS.INVALID_USER_ID);
  }

  const profile = await Profile.findOne({
    userId: userId.trim(),
  }).lean();

  if (!profile) {
    throw new Error(PROFILE_ERRORS.PROFILE_NOT_FOUND);
  }

  return {
    userId: profile.userId,
    profileFor: profile.profileFor,
    gender: profile.gender,
    name: profile.name,
    dob: profile.dob,
    religion: profile.religion,
    community: profile.community,
    height: profile.height,
    color: profile.color,
    maritalStatus: profile.maritalStatus,
    motherTongue: profile.motherTongue,
    education: profile.education,
    occupation: profile.occupation,
    annualIncome: profile.annualIncome,
    familyType: profile.familyType,
    familyStatus: profile.familyStatus,
    location: profile.location,
    partnerPreference: profile.partnerPreference,
    profilePhoto: profile.profilePhoto,
    aboutMe: profile.aboutMe,
    profileCompleted: profile.profileCompleted,
    status: profile.status,
  };
};
