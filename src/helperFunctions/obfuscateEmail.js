export const obfuscateEmail = (email) => {
  const [localPart, domain] = email.split("@");

  const obfuscatedLocal =
    localPart.length > 2
      ? localPart[0] +
        "*".repeat(localPart.length - 2) +
        localPart[localPart.length - 1]
      : localPart;

  return `${obfuscatedLocal}@${domain}`;
};
