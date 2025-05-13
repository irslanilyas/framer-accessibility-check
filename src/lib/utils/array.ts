/**
 * Groups an array of objects by a specified key
 * @param array The array to group
 * @param key The key to group by
 * @returns An object with keys corresponding to the grouped values
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((result, item) => {
      const groupKey = String(item[key]);
      result[groupKey] = result[groupKey] || [];
      result[groupKey].push(item);
      return result;
    }, {} as Record<string, T[]>);
  }
  
  /**
   * Counts occurrences of values for a specified key in an array of objects
   * @param array The array to count values in
   * @param key The key to count values for
   * @returns An object with keys corresponding to the values and values corresponding to the counts
   */
  export function countBy<T>(array: T[], key: keyof T): Record<string, number> {
    return array.reduce((result, item) => {
      const groupKey = String(item[key]);
      result[groupKey] = (result[groupKey] || 0) + 1;
      return result;
    }, {} as Record<string, number>);
  }