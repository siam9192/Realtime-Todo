export function calculateTotalPages(total: number, limit: number) {
  return Math.floor(total / limit);
}
