import Profile from '../../../models/profile.model.js';
import { getDateOfBirthRange } from '../matches.utils.js';

export const findProfileByUserId = async (userId) => {
  return Profile.findOne({
    userId,
  }).lean();
};

export const findNewCandidates = async ({
  currentUserId,
  preferredGender,
  createdAfter,
  filters,
  search,
}) => {
  const {
    minAge,
    maxAge,
    religion,
    location,
    community,
    education,
    minHeight,
    maxHeight,
    occupation,
    maritalStatus,
    familyType,
    hobbies,
    annualIncome,
    lifestyle,
  } = filters;

  const profileMatch = {
    userId: {
      $ne: currentUserId,
    },

    gender: preferredGender,

    status: 'active',

    profileCompleted: true,

    createdAt: {
      $gte: createdAfter,
    },
  };

  const { minDob, maxDob } = getDateOfBirthRange(minAge, maxAge);

  if (minDob || maxDob) {
    profileMatch.dob = {
      ...(minDob && {
        $gte: minDob,
      }),
      ...(maxDob && {
        $lte: maxDob,
      }),
    };
  }

  if (religion?.length) {
    profileMatch.religion = {
      $in: religion,
    };
  }

  if (location?.length) {
    profileMatch['location.city'] = {
      $in: location,
    };
  }

  if (community?.length) {
    profileMatch.community = {
      $in: community,
    };
  }

  if (education?.length) {
    profileMatch.education = {
      $in: education,
    };
  }

  if (minHeight != null || maxHeight != null) {
    profileMatch.height = {
      ...(minHeight != null && {
        $gte: Number(minHeight),
      }),
      ...(maxHeight != null && {
        $lte: Number(maxHeight),
      }),
    };
  }

  if (occupation) {
    profileMatch.occupation = occupation;
  }

  if (maritalStatus) {
    profileMatch.maritalStatus = maritalStatus;
  }

  if (familyType) {
    profileMatch.familyType = familyType;
  }

  if (hobbies) {
    profileMatch.hobbies = hobbies;
  }

  if (annualIncome) {
    profileMatch.annualIncome = annualIncome;
  }

  if (lifestyle) {
    profileMatch.lifestyle = lifestyle;
  }

  if (search?.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');

    profileMatch.$or = [
      { name: searchRegex },
      { 'location.city': searchRegex },
      { occupation: searchRegex },
    ];
  }

  return Profile.aggregate([
    {
      $match: profileMatch,
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: 'userId',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $match: {
        'user.status': 'active',
      },
    },
    {
      $project: {
        user: 0,
      },
    },
  ]);
};
