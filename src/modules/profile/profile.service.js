import Profile from '../../models/profile.model.js';

import { PROFILE_ERRORS } from './profile.errors.js';

export const profileService = async (userId) => {
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
