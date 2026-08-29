export const getUsernameIdentifier = (value) => {
  if (typeof value !== 'string') return null;

  const identifier = value.trim();

  if (!identifier) return null;

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

  if (emailRegex.test(identifier)) {
    return {
      type: 'email',
      value: identifier.toLowerCase(),
    };
  }

  const mobile = identifier.replace(/[\s-]/g, '');

  const normalizedMobile = mobile.startsWith('+91')
    ? mobile.slice(3)
    : mobile.startsWith('91') && mobile.length === 12
      ? mobile.slice(2)
      : mobile;

  if (/^[6-9]\d{9}$/.test(normalizedMobile)) {
    return {
      type: 'mobile',
      value: normalizedMobile,
    };
  }

  return null;
};
