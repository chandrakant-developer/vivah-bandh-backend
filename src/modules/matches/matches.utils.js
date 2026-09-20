export const getPreferredGender = (gender) => {
  if (gender === 'male') {
    return 'female';
  }

  if (gender === 'female') {
    return 'male';
  }

  return null;
};

export const parseArrayFilter = (value) => {
  if (!value) return [];

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

export const calculateAge = (dob) => {
  if (!dob) {
    return null;
  }

  const today = new Date();
  const birthDate = new Date(dob);

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference = today.getMonth() - birthDate.getMonth();

  const dayDifference = today.getDate() - birthDate.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  return age;
};

export const sortMatches = (matches, sortBy) => {
  switch (sortBy) {
    case 'recentlyJoined':
      matches.sort(
        (first, second) =>
          new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
      );
      break;

    case 'profileUpdated':
      matches.sort(
        (first, second) =>
          new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime()
      );
      break;

    case 'bestMatch':
    default:
      matches.sort((first, second) => second.matchPercentage - first.matchPercentage);
      break;
  }
};

export const calculatePercentage = (score, maxScore) => {
  if (maxScore === 0) {
    return 0;
  }

  return Math.round((score / maxScore) * 100);
};

export const isAgeMatched = (age, minAge, maxAge) => {
  if (age === null || age === undefined) {
    return false;
  }

  const hasMinAge = minAge !== null && minAge !== undefined;

  const hasMaxAge = maxAge !== null && maxAge !== undefined;

  if (!hasMinAge && !hasMaxAge) {
    return null;
  }

  if (hasMinAge && age < minAge) {
    return false;
  }

  if (hasMaxAge && age > maxAge) {
    return false;
  }

  return true;
};

export const isPreferenceMatched = (preferences = [], value) => {
  if (!Array.isArray(preferences) || preferences.length === 0) {
    return null;
  }

  if (!value) {
    return false;
  }

  const normalizedValue = value.trim().toLowerCase();

  return preferences.some((preference) => {
    return preference && preference.trim().toLowerCase() === normalizedValue;
  });
};

export const getDateOfBirthRange = (minAge, maxAge) => {
  const today = new Date();

  let minDob;
  let maxDob;

  /*
   * Minimum age determines the youngest allowed DOB.
   *
   * Example:
   * Today: 09 Sep 2026
   * minAge: 26
   *
   * Latest DOB allowed:
   * 09 Sep 2000
   */
  if (minAge !== undefined && minAge !== null) {
    maxDob = new Date(today);

    maxDob.setFullYear(today.getFullYear() - minAge);
  }

  /*
   * Maximum age determines the oldest allowed person.
   *
   * Example:
   * Today: 09 Sep 2026
   * maxAge: 30
   *
   * A person aged 30 can have DOB between:
   * 10 Sep 1995 and 09 Sep 1996
   *
   * Therefore the lower DOB boundary is:
   * today - (maxAge + 1 years) + 1 day
   */
  if (maxAge !== undefined && maxAge !== null) {
    minDob = new Date(today);

    minDob.setFullYear(today.getFullYear() - maxAge - 1);

    minDob.setDate(minDob.getDate() + 1);
  }

  return {
    minDob,
    maxDob,
  };
};
