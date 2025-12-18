export function calculateTotalPages(total: number, limit: number) {
  return Math.floor(total / limit);
}



export const getTimeAgo = (date: string|Date): string => {
  const currentDate = new Date().getTime();
  const targetDate = new Date(date).getTime();
  const difference = currentDate - targetDate; // Time difference in milliseconds

  const minutes = 60 * 1000;
  const hours = 60 * minutes;
  const days = 24 * hours;

  if (difference >= days) {
    return `${Math.floor(difference / days)} days ago`;
  }
  if (difference >= hours) {
    return `${Math.floor(difference / hours)} hours ago`;
  }
  if (difference >= minutes) {
    return `${Math.floor(difference / minutes)} minutes ago`;
  }

  return `just now`;
};
