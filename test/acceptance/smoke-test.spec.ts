import { fork } from 'child_process';

describe('Smoke Test Vending Machine', () => {
    it('Should display "DISPLAY: Vending Machine Powering Down"', async () => {
      const result = await runVendingMachine('./bin/index.js', 'x'); 
      expect(result).toBe('DISPLAY: Vending Machine Powering Down\n');
    });
});


async function runVendingMachine(scriptPath: string, input: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    let stdoutData = '';

    const child = fork(scriptPath, [], {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']});
      
      child.stdin!.write(input);
      child.stdout!.on('data', (data) => {
        stdoutData = `${data}`;
      });
      child.on('exit', () => resolve(`${stdoutData}`));
      child.on('error', err => reject(`${err}`));
      child.stderr!.on('data', function(data) {
        reject(`${data}`);
      });
  });
}      



