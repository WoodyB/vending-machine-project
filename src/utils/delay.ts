export async function delay(time_ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, time_ms);
  });
}