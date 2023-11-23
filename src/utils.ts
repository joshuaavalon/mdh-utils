export async function retry<T>(
  func: () => Promise<T>,
  retryCount: number
): Promise<T> {
  try {
    return await func();
  } catch (error) {
    if (retryCount <= 0) {
      throw error;
    }
    return await retry(func, retryCount - 1);
  }
}
