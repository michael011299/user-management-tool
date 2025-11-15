export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateAccountId = (id: string): boolean => {
  return /^\d+$/.test(id);
};

export const validateForm = (data: any): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!validateRequired(data.clientName)) {
    errors.clientName = "Client name is required";
  }

  if (data.moveType === "migration") {
    if (!validateRequired(data.newEmail)) {
      errors.newEmail = "New email is required for migration";
    } else if (!validateEmail(data.newEmail)) {
      errors.newEmail = "Invalid email format";
    }
  }

  if (data.moveType === "offboard") {
    if (!validateRequired(data.offboardEmail)) {
      errors.offboardEmail = "Offboard email is required";
    } else if (!validateEmail(data.offboardEmail)) {
      errors.offboardEmail = "Invalid email format";
    }
  }

  if (!data.gaAccountId && !data.gtmAccountId) {
    errors.gaAccountId = "At least one account ID is required";
    errors.gtmAccountId = "At least one account ID is required";
  }

  if (data.gaAccountId && !validateAccountId(data.gaAccountId)) {
    errors.gaAccountId = "Account ID must be numeric";
  }

  if (data.gtmAccountId && !validateAccountId(data.gtmAccountId)) {
    errors.gtmAccountId = "Account ID must be numeric";
  }

  return errors;
};
