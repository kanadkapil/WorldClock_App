export function getSeason(date: Date, lat: number): string {
  const month = date.getMonth(); // 0 = Jan, 11 = Dec
  const isNorthern = lat >= 0;

  if (month >= 2 && month <= 4) {
    return isNorthern ? 'Spring' : 'Autumn';
  } else if (month >= 5 && month <= 7) {
    return isNorthern ? 'Summer' : 'Winter';
  } else if (month >= 8 && month <= 10) {
    return isNorthern ? 'Autumn' : 'Spring';
  } else {
    return isNorthern ? 'Winter' : 'Summer';
  }
}
