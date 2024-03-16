import { delay } from '../../src/utils/delay';

describe('Test delay', () => {
    it('Should delay at least 100ms parameter time_ms is 100', async () => {
        const startTime = startTimer();
        await delay(100);
        const elapsedMs = stopTimer(startTime);
        expect(elapsedMs).toBeGreaterThanOrEqual(100);
    });
    
    it('Should delay at least 600ms parameter time_ms is 600', async () => {
        const startTime = startTimer();
        await delay(600);
        const elapsedMs = stopTimer(startTime);
        expect(elapsedMs).toBeGreaterThanOrEqual(600);
    });
});

function startTimer(): Date {
  return new Date();
}

function stopTimer(startTime: Date): number {
    const endTime = new Date();
    return endTime.getTime() - startTime.getTime();
  }