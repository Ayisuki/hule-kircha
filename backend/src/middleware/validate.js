export const validatePhone = (phone) => {
  const phoneRegex = /^\+251[0-9]{9}$/;
  return phoneRegex.test(phone);
};

export const validatePIN = (pin) => {
  return typeof pin === "string" && pin.length >= 4 && /^\d+$/.test(pin);
};

export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim().replace(/[<>]/g, "");
};
