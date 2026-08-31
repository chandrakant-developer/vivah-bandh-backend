export const usernameIdentifier = (value) => {
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

  const mobileRegex = /^(?:\+91|91)?[\s-]*[6-9]\d{4}[\s-]?\d{5}$/;

  if (mobileRegex.test(identifier)) {
    const mobile = identifier.replace(/[\s-]/g, '');

    const normalizedMobile = mobile.startsWith('+91')
      ? mobile.slice(3)
      : mobile.startsWith('91') && mobile.length === 12
        ? mobile.slice(2)
        : mobile;

    return {
      type: 'mobile',
      value: normalizedMobile,
    };
  }

  return null;
};
