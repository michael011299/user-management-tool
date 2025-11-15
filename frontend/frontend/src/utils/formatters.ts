import { format, formatDistanceToNow, parseISO } from "date-fns";

export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, "dd/MM/yyyy HH:mm");
  } catch (error) {
    return "Invalid date";
  }
};

export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return "Unknown";
  }
};

export const formatPercentage = (value: number, decimals: number = 0): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("en-US").format(value);
};

export const truncateEmail = (email: string, maxLength: number = 30): string => {
  if (email.length <= maxLength) return email;
  const [local, domain] = email.split("@");
  if (local.length + domain.length + 1 <= maxLength) return email;
  const truncatedLocal = local.slice(0, maxLength - domain.length - 4) + "...";
  return `${truncatedLocal}@${domain}`;
};
